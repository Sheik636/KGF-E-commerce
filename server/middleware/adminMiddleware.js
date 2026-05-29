const jwt = require("jsonwebtoken");
const Admin = require("../models/adminModel");

const adminProtect =
async (req, res, next) => {
  console.log("ADMIN PROTECT HIT");
  console.log(req.headers.authorization);
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {

    try {

      token =req.headers.authorization.split(" ")[1];

      const decoded =jwt.verify(token, process.env.JWT_SECRET);

      console.log("Decoded:", decoded);

      req.admin =await Admin.findById(decoded.id).select("-password");

      console.log("Admin Found:", req.admin);

      if (!req.admin) {
        return res.status(401).json({
          message: "Admin not found",
        });
      }

      next();

    } catch (error) {

      return res.status(401).json({
        message:
        "Admin not authorized",
      });
    }
  }

  if (!token) {

    return res.status(401).json({
      message: "No token",
    });
  }
};

module.exports = {
  adminProtect,
};