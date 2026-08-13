const express = require("express");
const router= express.Router();
const {body}= require("express-validator");

const {
  registerUser,
  loginUser,
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  getAddresses,
  saveAddress,
} = require("../controllers/userControllers");
const { protect } = require("../middleware/authMiddleware");

router.post(
  "/register",
  body("email").isEmail().withMessage("Invalid Email"),
  body("password").isLength({ min: 6 }).withMessage("Password must be 6+ characters"),
  body("name"),
  registerUser
);
router.post("/login", loginUser);

router.get("/wishlist", protect, getWishlist);
router.post("/wishlist/add", protect, addToWishlist);
router.delete("/wishlist/remove/:productId", protect, removeFromWishlist);

router.get("/addresses", protect, getAddresses);
router.post("/addresses", protect, saveAddress);

module.exports = router;