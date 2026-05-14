const mongoose= require("mongoose")


const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    isAdmin: {type: Boolean, default: false},
    cart: [{
        product:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
        },
        name: String,
        price: Number,
        quantity: Number,
        image: String,
    }]
    
},
{timestamps: true})

module.exports = mongoose.model("User", userSchema);