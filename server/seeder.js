// require("dotenv").config()
// const mongoose = require("mongoose");
// const bcrypt = require("bcryptjs");


// const Admin = require("./models/adminModel");



// // connect DB
// mongoose.connect(process.env.MONGO_URI);

// const createAdmin = async () => {
//   try {
    

//     const adminExists = await Admin.findOne({
//       email: "sheikmusthak006@gmail.com",
//     });

    

//     if (adminExists) {
//       console.log("Admin already exists");
//       process.exit();
//     }

//     const hashedPassword = await bcrypt.hash("sheik636", 10);

//     await Admin.create({
//       email: "sheikmusthak006@gmail.com",
//       password: hashedPassword,
//     });

//     console.log("✅ Admin Created");
//     process.exit();
//   } catch (error) {
//     console.log(error);
//     process.exit();
//   }
// };

// createAdmin();