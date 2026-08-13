const Coupon = require("../models/couponModel");

// Apply promo coupon
const applyCoupon = async (req, res) => {
  try {
    const { code, cartTotal } = req.body;

    if (!code) {
      return res.status(400).json({ message: "Coupon code is required" });
    }

    const coupon = await Coupon.findOne({ code: code.toUpperCase() });

    if (!coupon) {
      return res.status(404).json({ message: "Invalid coupon code" });
    }

    if (!coupon.isActive) {
      return res.status(400).json({ message: "This coupon is no longer active" });
    }

    if (new Date(coupon.expirationDate) < new Date()) {
      return res.status(400).json({ message: "This coupon has expired" });
    }

    if (cartTotal < coupon.minPurchase) {
      return res.status(400).json({
        message: `Minimum purchase of ₹${coupon.minPurchase} required for this coupon`,
      });
    }

    let discount = (cartTotal * coupon.discountPercent) / 100;
    if (coupon.maxDiscountAmount > 0) {
      discount = Math.min(discount, coupon.maxDiscountAmount);
    }

    res.json({
      success: true,
      message: "Coupon applied successfully",
      couponCode: coupon.code,
      discountPercent: coupon.discountPercent,
      discountAmount: Math.round(discount),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin: Create new coupon
const createCoupon = async (req, res) => {
  try {
    const { code, discountPercent, maxDiscountAmount, minPurchase, expirationDate } = req.body;

    const existing = await Coupon.findOne({ code: code.toUpperCase() });
    if (existing) {
      return res.status(400).json({ message: "Coupon code already exists" });
    }

    const coupon = new Coupon({
      code: code.toUpperCase(),
      discountPercent,
      maxDiscountAmount: maxDiscountAmount || 0,
      minPurchase: minPurchase || 0,
      expirationDate,
    });

    const savedCoupon = await coupon.save();
    res.status(201).json(savedCoupon);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Admin: Get all coupons
const getAllCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    res.json(coupons);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin: Delete coupon
const deleteCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id);
    if (!coupon) {
      return res.status(404).json({ message: "Coupon not found" });
    }
    await coupon.deleteOne();
    res.json({ message: "Coupon deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin: Toggle coupon active status
const toggleCouponStatus = async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id);
    if (!coupon) {
      return res.status(404).json({ message: "Coupon not found" });
    }

    coupon.isActive = !coupon.isActive;
    await coupon.save();
    res.json(coupon);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  applyCoupon,
  createCoupon,
  getAllCoupons,
  deleteCoupon,
  toggleCouponStatus,
};
