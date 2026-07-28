const User = require("../models/userModel");

const addToCart = async (req,res)=>
    {
        try {
            const {productId, quantity}= req.body;
            const user =await User.findById(req.user._id);
            const existItem = user.cart.find((item)=> item.product.toString()=== productId);
            if(existItem){
                existItem.quantity += quantity;
            }else{
                user.cart.push({
                    product: productId,
                    quantity
                })
            }
            await user.save();
            res.json(user.cart);
        } catch (error) {
            res.status(500).json({message: error.message});
        }
    }

const getCart = async (req,res)=>{
    try {
        const user = await User.findById(req.user._id).populate("cart.product");
        res.json(user.cart);
    } catch (error) {
      res.status(500).json({message: error.message});   
    }
}
const removeFromCart =async (req,res)=>{
    try {
        const user = await User.findById(req.user._id);
        user.cart = user.cart.filter((item)=>item.product.toString() !== req.params.id);
        await user.save();
        res.json(user.cart);
    } catch (error) {
        res.status(500).json({message: error.message});   
    } 
};
const updateCartQuantity =async (req, res) => {
    try {
        const {productId,action} = req.body;
    const user = await User.findById(
      req.user._id
    );
    const item =user.cart.find((item)=> item.product.toString() === productId);
    if (!item) {
      return res.status(404).json({
        message:
        "Product not found in cart",
      });
    }
    if (action === "increase") {
     item.quantity += 1;
    }

    if (action === "decrease") {
      item.quantity -= 1;
      
    if (item.quantity <= 0) {
        user.cart = user.cart.filter(
          (item)=>
            item.product.toString() !== productId);
      }
    }

    await user.save();

    res.json(user.cart);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports ={
    addToCart,
    getCart,
    removeFromCart,
    updateCartQuantity
}