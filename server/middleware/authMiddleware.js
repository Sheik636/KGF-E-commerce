const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

//protect routes
const protect = async (req,res, next)=>{
    let token;
    try {
        //check token in headers
        console.log(req.user)
        if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
            //get token
            token = req.headers.authorization.split(" ")[1];
            //verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET)

            // get user from DB without Password
            req.user = await User.findById(decoded.id).select("-password");
            next();
        }
        else{
            return res.status(401).json({message: "not authorized,no token"})
        }
    } catch (error) {
       return res.status(401).json({message: error.message})
    }
}



module.exports = {protect};