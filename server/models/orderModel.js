const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
    {
        user:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        orderItems:[{
            product:{
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
                required: true
            },
            name: String,
            image: String,
            price: Number,
            quantity: Number
        }],
        shippingAddress: {
            name: String,
            address: String,
            city: String,
            postalCode: String,
            country: String,
        },
        totalPrice:{
            type: Number,
            required: true
        },
        isPaid:{
            type: Boolean,
            default: false
        },
        paidAt: Date,
        isDelivered:{
            type: Boolean,
            default: false
        },
        deliveredAt: Date
    },
    {timestamps: true}
);

module.exports = mongoose.model("Order", orderSchema);