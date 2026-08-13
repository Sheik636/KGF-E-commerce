const Admin = require("../models/adminModel");
const User = require("../models/userModel");
const Order = require("../models/orderModel");
const Product = require("../models/productModel");
const bcrypt = require("bcryptjs");
const generateToken = require("../utils/generateToken");
require("dotenv").config();

const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });

    if (admin && (await bcrypt.compare(password, admin.password))) {
      res.json({ token: generateToken(admin._id) });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getStats = async (req, res) => {
  try {
    const [productCount, orderCount, userCount, allOrders, recentOrders, products] =
      await Promise.all([
        Product.countDocuments(),
        Order.countDocuments(),
        User.countDocuments(),
        Order.find().select("totalPrice isPaid status catogery orderItems"),
        Order.find()
          .sort({ createdAt: -1 })
          .limit(6)
          .populate("user", "name email"),
        Product.find().select("catogery price stock"),
      ]);

    const revenue = allOrders
      .filter((o) => o.status !== "Cancelled")
      .reduce((sum, o) => sum + (o.totalPrice || 0), 0);

    const paidOrdersCount = allOrders.filter((o) => o.isPaid).length;
    const avgOrderValue =
      orderCount > 0 ? Math.round(revenue / (allOrders.length || 1)) : 0;

    const statusCounts = {
      Placed: 0,
      Processing: 0,
      Shipped: 0,
      Delivered: 0,
      Cancelled: 0,
    };

    allOrders.forEach((o) => {
      if (statusCounts[o.status] !== undefined) {
        statusCounts[o.status]++;
      }
    });

    const categoryMap = {};
    products.forEach((p) => {
      const cat = p.catogery || "Uncategorized";
      categoryMap[cat] = (categoryMap[cat] || 0) + 1;
    });

    const categoryBreakdown = Object.keys(categoryMap).map((cat) => ({
      category: cat,
      count: categoryMap[cat],
    }));

    res.json({
      productCount,
      orderCount,
      userCount,
      revenue,
      avgOrderValue,
      paidOrdersCount,
      statusCounts,
      categoryBreakdown,
      recentOrders,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { loginAdmin, getUsers, getStats };
