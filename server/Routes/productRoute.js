const express = require("express");
const router = express.Router();
const {
  getProducts,
  createProduct,
  getProductById,
  updateProduct,
  deleteProduct,
  createProductReview,
  deleteProductReview,
} = require("../controllers/productController");
const upload = require("../middleware/uploadMiddleware");
const { adminProtect } = require("../middleware/adminMiddleware");
const { protect } = require("../middleware/authMiddleware");

router.get("/", getProducts);

router.post("/upload", adminProtect, upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No image uploaded" });
  }
  res.json({ images: req.file.path });
});

router.get("/:id", getProductById);
router.post("/:id/reviews", protect, createProductReview);
router.delete("/:id/reviews/:reviewId", protect, deleteProductReview);
router.post("/", adminProtect, createProduct);
router.put("/:id", adminProtect, updateProduct);
router.delete("/:id", adminProtect, deleteProduct);

module.exports = router;
