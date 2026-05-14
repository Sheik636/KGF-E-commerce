const exress = require("express");
const router= exress.Router();
const {body}= require("express-validator");

const { registerUser, loginUser } = require("../controllers/userControllers");

router.post("/register", 
    body("email").isEmail().withMessage("Invalid Email"),
    body("password").isLength({min:6}).withMessage("Password must be 6+ caracters"),
    registerUser);
router.post("/login", loginUser);

module.exports = router;