const mongoose= require("mongoose")


const userSchema = new mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
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
    }],
    wishlist: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
    addresses: [
      {
        name: String,
        address: String,
        city: String,
        postalCode: String,
        country: String,
      },
    ]
},
{timestamps: true})

module.exports = mongoose.model("User", userSchema);