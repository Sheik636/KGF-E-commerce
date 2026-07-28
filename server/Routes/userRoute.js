const express = require("express");
const router= express.Router();
const {body}= require("express-validator");

const { registerUser, loginUser } = require("../controllers/userControllers");

router.post("/register", 
    body("email").isEmail().withMessage("Invalid Email"),
    body("password").isLength({min:6}).withMessage("Password must be 6+ characters"),body("name"),
    registerUser);
router.post("/login", loginUser);

module.exports = router;