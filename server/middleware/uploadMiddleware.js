const multer = require("multer");
const cloudinaryStorage  = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

const storage = new cloudinaryStorage({
    cloudinary,
    params:{
        folder: "samples",
        allowed_formats: ["jpg", "png", "jpeg"]
    }
})

const upload = multer({storage})

module.exports = upload;