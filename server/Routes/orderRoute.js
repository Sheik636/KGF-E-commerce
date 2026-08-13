const express = require("express");
const router = express.Router();

const {
  createOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
  cancelOrder,
  markDelivered,
  createPaymentOrder,
  verifyPayment,
} = require("../controllers/orderController");

const { protect } = require("../middleware/authMiddleware");
const { adminProtect } = require("../middleware/adminMiddleware");

router.post("/", protect, createOrder);
router.get("/myorders", protect, getMyOrders);
router.get("/all", adminProtect, getAllOrders);
router.put("/:id/status", adminProtect, updateOrderStatus);
router.put("/:id/cancel", protect, cancelOrder);
router.put("/:id/deliver", adminProtect, markDelivered);
router.post("/:id/pay", protect, createPaymentOrder);
router.post("/payment-verify", protect, verifyPayment);

module.exports = router;