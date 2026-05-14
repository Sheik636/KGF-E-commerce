require("dotenv").config();

const express = require("express");
const bcrypt = require("bcryptjs");
const cors = require("cors");
const rateLimit = require("express-rate-limit");

const connectDB = require("./config/db");

const productRoutes = require("./Routes/productRoute");
const userRoutes = require("./Routes/userRoute");
const adminRoutes = require("./Routes/adminRoute");
const cartRoute = require("./Routes/cartRoute");
const orderRoute = require("./Routes/orderRoute");

const Admin = require("./models/adminModel");


// connect database
connectDB();


// create express app
const app = express();


// middleware
app.use(cors());

app.use(express.json());

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: "Too many requests, try again later",
  })
);


// routes
app.use("/api/products", productRoutes);

app.use("/api/users", userRoutes);

app.use("/api/admin", adminRoutes);

app.use("/api/cart", cartRoute);

app.use("/api/orders", orderRoute);


// create admin if not exists
const existingAdmin = async () => {
  try {

    const existing = await Admin.findOne({
      email: process.env.ADMIN_EMAIL,
    });

    if (!existing) {

      const hashedPassword = await bcrypt.hash(
        process.env.ADMIN_PASSWORD,
        10
      );

      await Admin.create({
        email: process.env.ADMIN_EMAIL,
        password: hashedPassword,
      });

      console.log("✅ Admin Created");

    } else {

      console.log("✅ Admin Already Exists");
      //testing cloudinary
      console.log(process.env.CLOUDINARY_CLOUD_NAME)

    }

  } catch (error) {

    console.log(error.message);

  }
};


// run admin creator
existingAdmin();


// test route
app.get("/", (req, res) => {
  res.send("API Running");
});


// start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () =>
  console.log(`🚀 Server started on ${PORT}`)
);

