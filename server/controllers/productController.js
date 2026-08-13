const Product = require("../models/productModel");

const getProducts = async (req, res) => {
  try {
    const queryObj = {};

    if (req.query.keyword) {
      queryObj.$or = [
        { name: { $regex: req.query.keyword, $options: "i" } },
        { catogery: { $regex: req.query.keyword, $options: "i" } },
        { description: { $regex: req.query.keyword, $options: "i" } },
      ];
    }

    if (req.query.brand) {
      queryObj.brand = req.query.brand;
    }

    if (req.query.category) {
      const categoryRegex = new RegExp(req.query.category, "i");
      const categoryFilter = {
        $or: [{ catogery: categoryRegex }, { name: categoryRegex }],
      };

      if (queryObj.$or) {
        queryObj.$and = [{ $or: queryObj.$or }, categoryFilter];
        delete queryObj.$or;
      } else {
        queryObj.$or = categoryFilter.$or;
      }
    }

    let sortOption = {};
    if (req.query.sort === "lowToHigh") sortOption = { price: 1 };
    if (req.query.sort === "highToLow") sortOption = { price: -1 };

    const products = await Product.find(queryObj).sort(sortOption);
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

const createProductReview = async (req, res) => {
  try {
    const { rating, comment, images } = req.body;
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );

    const reviewImages = Array.isArray(images)
      ? images
      : images
      ? [images]
      : [];

    if (alreadyReviewed) {
      alreadyReviewed.rating = Number(rating);
      alreadyReviewed.comment = comment;
      if (reviewImages.length > 0) {
        alreadyReviewed.images = reviewImages;
      }
    } else {
      const review = {
        name: req.user.name,
        rating: Number(rating),
        comment,
        user: req.user._id,
        images: reviewImages,
      };
      product.reviews.push(review);
    }

    product.numReviews = product.reviews.length;
    product.rating =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length;

    await product.save();
    res.status(201).json({ message: "Review added / updated", product });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteProductReview = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    product.reviews = product.reviews.filter(
      (r) => r._id.toString() !== req.params.reviewId
    );

    product.numReviews = product.reviews.length;
    product.rating =
      product.reviews.length > 0
        ? product.reviews.reduce((acc, item) => item.rating + acc, 0) /
          product.reviews.length
        : 0;

    await product.save();
    res.json({ message: "Review deleted", product });
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
  createProductReview,
  deleteProductReview,
};
