const express = require("express");
const router = express.Router();
const { addToCart, getCart, removeFromCart, updateCartQuantity } = require("../controllers/cartController");

const {protect}= require("../middleware/authMiddleware")

router.post("/", protect, addToCart);
router.put("/update", protect, updateCartQuantity)
router.get("/", protect, getCart);
router.delete('/:id', protect, removeFromCart);

module.exports = router;