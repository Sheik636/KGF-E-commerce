const express = require("express");
const router = express.Router();
const {
  applyCoupon,
  createCoupon,
  getAllCoupons,
  deleteCoupon,
  toggleCouponStatus,
} = require("../controllers/couponController");
const { adminProtect } = require("../middleware/adminMiddleware");
const { protect } = require("../middleware/authMiddleware");

// User route to validate and apply coupon
router.post("/apply", protect, applyCoupon);

// Admin routes
router.get("/", adminProtect, getAllCoupons);
router.post("/", adminProtect, createCoupon);
router.delete("/:id", adminProtect, deleteCoupon);
router.put("/:id/toggle", adminProtect, toggleCouponStatus);

module.exports = router;
