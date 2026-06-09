const jwt = require("jsonwebtoken");
const Admin = require("../models/adminModel");

const adminProtect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.admin = await Admin.findById(decoded.id).select("-password");

      if (!req.admin) {
        return res.status(401).json({ message: "Admin not found" });
      }

      return next();
    } catch {
      return res.status(401).json({ message: "Admin not authorized" });
    }
  }

  return res.status(401).json({ message: "No token" });
};

module.exports = { adminProtect };
