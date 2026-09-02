const express = require("express");
const router = express.Router();
const { body } = require("express-validator");

const {
  sendOTP,
  verifyOTP,
  resendOTP,
  registerUser,
  loginUser,
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  getAddresses,
  saveAddress,
  getUserProfile,
  deleteUserProfile,
} = require("../controllers/userControllers");
const { protect } = require("../middleware/authMiddleware");

// OTP Verification Routes
router.post(
  "/send-otp",
  body("email").isEmail().withMessage("Valid email is required"),
  sendOTP
);

router.post(
  "/verify-otp",
  body("email").isEmail().withMessage("Valid email is required"),
  body("otp").isLength({ min: 6, max: 6 }).withMessage("OTP must be 6 digits"),
  body("name").notEmpty().withMessage("Name is required"),
  body("password").isLength({ min: 6 }).withMessage("Password must be 6+ characters"),
  verifyOTP
);

router.post(
  "/resend-otp",
  body("email").isEmail().withMessage("Valid email is required"),
  resendOTP
);

// Standard Auth Routes
router.post(
  "/register",
  body("email").isEmail().withMessage("Invalid Email"),
  body("password").isLength({ min: 6 }).withMessage("Password must be 6+ characters"),
  body("name").notEmpty().withMessage("Name is required"),
  registerUser
);
router.post("/login", loginUser);

// User Protected Routes
router.get("/profile", protect, getUserProfile);
router.delete("/profile", protect, deleteUserProfile);

router.get("/wishlist", protect, getWishlist);
router.post("/wishlist/add", protect, addToWishlist);
router.delete("/wishlist/remove/:productId", protect, removeFromWishlist);

router.get("/addresses", protect, getAddresses);
router.post("/addresses", protect, saveAddress);

module.exports = router;