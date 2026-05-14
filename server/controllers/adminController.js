const Admin = require("../models/adminModel");
const bcrypt = require("bcryptjs");
const generateToken = require("../utils/generateToken");
require("dotenv").config()

const loginAdmin = async (req,res)=>{
    try {
        const {email,password}= req.body;
        
        const admin = await Admin.findOne({email});

        if(admin && (await bcrypt.compare(password, admin.password))){
            res.json({
                token: generateToken(admin._id)
            });

        }else{
            res.status(401).json({message: "Invalid email or password"});
        }

    } catch (error) {
        res.status(500).json({message: error.message})        
    }
}

module.exports = { loginAdmin};