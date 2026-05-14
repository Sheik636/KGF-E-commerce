require("dotenv").config()
const Order= require("../models/orderModel");
const User = require("../models/userModel");
const razorpay = require("../config/razorpay");
const crypto = require("crypto");


const createOrder = async(req,res)=>{
    try {
        const user = await User.findById(req.user._id).populate("cart.product");
        if(!user.cart.length){
           return res.status(404).json({message: "The Cart is Empty"})
        }
        const {
            name,
          address,
          city,
          postalCode,
          country
        } = req.body.shippingAddress;

        if ( !name ||!address || !city || !postalCode || !country) {
          return res.status(400).json({
            message:
            "Shipping details required",
          });
        }
        const order = new Order({
            user: user._id,
            orderItems: user.cart.map((item) => ({
                product: item.product._id,
                name: item.product.name,
                image: item.product.image,
                price: item.product.price,
                quantity: item.quantity,
            })),
            shippingAddress: {
                name,
                address,
                city,
                postalCode,
                country
            },
            totalPrice: user.cart.reduce((acc, item)=> acc + item.quantity * item.product.price, 0),
        })
        console.log(order)
        const savedOrder = await order.save();

        user.cart=[];
        await user.save();

        res.status(201).json(savedOrder);

        

    } catch (error) {
        res.status(500).json({error: error.message})
    }
} 

const getMyOrders = async (req,res)=>{
    const orders = await Order.find({user: req.user._id}).populate({path:"orderItems.product", strictPopulate: false});
    res.json(orders);
    console.log("create for:", req.user._id)
}

const getAllOrders = async (req,res)=>{
    const orders = await Order.find().populate("user", "name email");
    res.json(orders)
};

const markDelivered = async (req,res)=>{
    try {
        const order = await Order.findById(req.params.id);
        if(!order){
            return res.status(404).json({message: "Order Not Found"})
        }
        order.isDelivered = true;
        order.deliveredAt = Date.now();
        const updatedOrder = await order.save();

        res.json(updatedOrder);
    } catch (error) {
        res.status(500).json({message: error.message,});
    }
}

const createPaymentOrder = async (req,res)=>{
    try {
        const order = await Order.findById(req.params.id);
        if(!order){
            return res.status(404).json({message: "Order Not Found"})
        }
        const options ={
            amount:order.totalPrice*100,
            currency: "INR",
            receipt:order._id.toString()
        }
        const paymentOrder=await razorpay.orders.create(options);
        res.json(paymentOrder);
    } catch (error) {
        res.status(500).json({message: error.message,});        
    }
}

const verifyPayment = async (req,res)=>{
    try {
        const {razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId} = req.body;
        const sign =crypto.createHmac("sheik636",process.env.RAZORPAY_KEY_SECRET).update(razorpay_order_id + "&" + razorpay_payment_id).digest("hex");

        if(sign===razorpay_signature){
            const order = await Order.findById(orderId);
            order.isPaid = true;
            order.paidAt = Date.now();
            await order.save()
            res.json({success: true})
        }else{
            res.status(400).json({success: false,});
        }
    } catch (error) {
        res.status(500).json({message: error.message,});        
    }
}

module.exports = {createOrder,getAllOrders, getMyOrders, markDelivered, createPaymentOrder, verifyPayment}