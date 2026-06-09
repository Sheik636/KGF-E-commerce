const express = require("express");
const router = express.Router();
const { loginAdmin, getUsers, getStats } = require("../controllers/adminController");
const { adminProtect } = require("../middleware/adminMiddleware");

router.post("/login", loginAdmin);
router.get("/users", adminProtect, getUsers);
router.get("/stats", adminProtect, getStats);

module.exports = router;
