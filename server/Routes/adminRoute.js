const exress = require("express");
const router= exress.Router();
const {body}= require("express-validator");

const { loginAdmin } = require("../controllers/adminController");


router.post("/login", loginAdmin);

module.exports = router;