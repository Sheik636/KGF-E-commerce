const Product = require("../models/productModel");

const getProducts = async (req, res) => {
  try {
    const keyword = req.query.keyword
      ? { name: { $regex: req.query.keyword, $options: "i" } }
      : {};
    const brand = req.query.brand ? { brand: req.query.brand } : {};
    let sortOption = {};
    if (req.query.sort === "lowToHigh") sortOption = { price: 1 };
    if (req.query.sort === "highToLow") sortOption = { price: -1 };
    const products = await Product.find({ ...keyword, ...brand }).sort(sortOption);
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createProduct = async (req, res) => {
  try {
    const product = new Product(req.body);
    const savedProduct = await product.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getProductById = async (req, res) => {
  try {
    const productById = await Product.findById(req.params.id);
    if (!productById) {
      return res.status(404).json({ message: "Product not Found" });
    }
    res.json(productById);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const productById = await Product.findById(req.params.id);
    if (!productById) {
      return res.status(404).json({ message: "Product not Found" });
    }

    const fields = [
      "name",
      "price",
      "brand",
      "catogery",
      "stock",
      "description",
      "sizes",
      "colours",
    ];
    fields.forEach((field) => {
      if (req.body[field] !== undefined) {
        productById[field] = req.body[field];
      }
    });

    if (req.body.images !== undefined) {
      productById.images = req.body.images;
    }

    const updatedProduct = await productById.save();
    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const productForDelete = await Product.findById(req.params.id);
    if (!productForDelete) {
      return res.status(404).json({ message: "Product not Found" });
    }
    await productForDelete.deleteOne();
    res.json({ message: "Product Removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getProducts,
  createProduct,
  getProductById,
  updateProduct,
  deleteProduct,
};
