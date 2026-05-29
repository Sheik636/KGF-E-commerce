const express = require("express");
const router = express.Router();

const {createOrder, getMyOrders, getAllOrders, markDelivered, createPaymentOrder, verifyPayment}= require("../controllers/orderController");

const { protect }= require("../middleware/authMiddleware");
const { adminProtect }= require("../middleware/adminMiddleware");

router.post("/", protect, createOrder);
router.get("/myorders", protect, getMyOrders);
router.get("/all", adminProtect, getAllOrders);
router.put("/:id/deliver", adminProtect, markDelivered);
router.post("/:id/pay",protect, createPaymentOrder);
router.post("/payment-verify", protect, verifyPayment)

module.exports = router;