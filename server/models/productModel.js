const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    name: {type: String, required: true},
    brand: String,
    price: {type: Number, required: true},
    description: String,
    images: [{type: String}],
    catogery: String,
    sizes: [String],
    colours: [String],
    stock: {type: Number, default: 0}
},{timestamps: true}
)

module.exports = mongoose.model("Product", productSchema)