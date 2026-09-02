const User = require("../models/userModel");
const OTP = require("../models/otpModel");
const bcrypt = require("bcryptjs");
const generateToken = require("../utils/generateToken");
const sendEmail = require("../utils/sendEmail");
const { validationResult } = require("express-validator");

// Send OTP to user email before registration
const sendOTP = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }

    const { email } = req.body;
    const normalizedEmail = email.toLowerCase().trim();

    // Check if user already exists and is verified
    const userExists = await User.findOne({ email: normalizedEmail });
    if (userExists && userExists.isVerified !== false) {
      return res.status(400).json({ message: "User already registered with this email" });
    }

    // Generate 6-digit numeric OTP
    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();

    // Delete existing OTPs for this email
    await OTP.deleteMany({ email: normalizedEmail });

    // Save new OTP to database (expires in 10 minutes)
    await OTP.create({
      email: normalizedEmail,
      otp: generatedOtp,
    });

    // Send email with OTP
    await sendEmail({
      to: normalizedEmail,
      subject: "Verify Your Email — KGF Store",
      otp: generatedOtp,
    });

    res.status(200).json({
      message: "Verification code sent to your email",
      email: normalizedEmail,
    });
  } catch (error) {
    res.status(500).json({ message: error.message || "Failed to send OTP" });
  }
};

// Verify OTP and complete user registration
const verifyOTP = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }

    const { name, email, password, otp } = req.body;
    const normalizedEmail = email.toLowerCase().trim();

    // Find OTP record
    const otpRecord = await OTP.findOne({
      email: normalizedEmail,
      otp: otp.trim(),
    });

    if (!otpRecord) {
      return res.status(400).json({ message: "Invalid or expired OTP code" });
    }

    // Check if user already exists
    let user = await User.findOne({ email: normalizedEmail });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    if (user) {
      user.name = name;
      user.password = hashedPassword;
      user.isVerified = true;
      await user.save();
    } else {
      user = await User.create({
        name,
        email: normalizedEmail,
        password: hashedPassword,
        isVerified: true,
      });
    }

    // Delete OTP records after successful verification
    await OTP.deleteMany({ email: normalizedEmail });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      isVerified: true,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message || "Verification failed" });
  }
};

// Resend OTP to user email
const resendOTP = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Check if user exists and is already verified
    const user = await User.findOne({ email: normalizedEmail });
    if (user && user.isVerified !== false) {
      return res.status(400).json({ message: "User is already verified" });
    }

    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();

    await OTP.deleteMany({ email: normalizedEmail });
    await OTP.create({
      email: normalizedEmail,
      otp: generatedOtp,
    });

    await sendEmail({
      to: normalizedEmail,
      subject: "Resent Verification Code — KGF Store",
      otp: generatedOtp,
    });

    res.json({ message: "A new OTP code has been sent to your email" });
  } catch (error) {
    res.status(500).json({ message: error.message || "Failed to resend OTP" });
  }
};

// Original Register User (Fallback or Direct endpoint if needed)
const registerUser = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }

    const { name, email, password } = req.body;
    const normalizedEmail = email.toLowerCase().trim();

    const userExists = await User.findOne({ email: normalizedEmail });
    if (userExists && userExists.isVerified !== false) {
      return res.status(400).json({ message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const createUser = await User.create({
      name,
      email: normalizedEmail,
      password: hashedPassword,
      isVerified: false,
    });

    res.status(201).json({
      _id: createUser._id,
      name: createUser.name,
      email: createUser.email,
      isVerified: false,
      token: generateToken(createUser._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = (email || "").toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail });

    if (user && (await bcrypt.compare(password, user.password))) {
      if (user.isVerified === false) {
        return res.status(401).json({
          message: "Email is not verified. Please verify your email before signing in.",
          isVerified: false,
          email: user.email,
        });
      }

      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        isVerified: user.isVerified !== false,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("wishlist");
    res.json(user ? user.wishlist : []);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const addToWishlist = async (req, res) => {
  try {
    const { productId } = req.body;
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.wishlist.includes(productId)) {
      user.wishlist.push(productId);
      await user.save();
    }

    const updatedUser = await User.findById(req.user._id).populate("wishlist");
    res.json(updatedUser.wishlist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const removeFromWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.wishlist = user.wishlist.filter(
      (id) => id.toString() !== req.params.productId
    );
    await user.save();

    const updatedUser = await User.findById(req.user._id).populate("wishlist");
    res.json(updatedUser.wishlist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAddresses = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json(user ? user.addresses || [] : []);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const saveAddress = async (req, res) => {
  try {
    const { name, address, city, postalCode, country } = req.body;
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const exists = user.addresses?.some(
      (addr) =>
        addr.address?.toLowerCase() === address?.toLowerCase() &&
        addr.postalCode === postalCode
    );

    if (!exists) {
      user.addresses.push({ name, address, city, postalCode, country });
      await user.save();
    }

    res.json(user.addresses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get user profile details
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message || "Failed to fetch profile" });
  }
};

// Delete user account
const deleteUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Delete user from database
    await User.findByIdAndDelete(req.user._id);

    // Clean up any remaining OTP records for this email
    await OTP.deleteMany({ email: user.email });

    res.json({ message: "Account deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message || "Failed to delete account" });
  }
};

module.exports = {
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
};

