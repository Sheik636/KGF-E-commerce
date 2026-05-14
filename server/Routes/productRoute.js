const express = require("express");
const router = express.Router();
const {getProducts, createProduct,getProductById, updateProduct, deleteProduct} = require("../controllers/productController");
const upload = require("../middleware/uploadMiddleware");

router.post("/upload", upload.single("image"),(req, res)=>{
    console.log(req.file)
    res.json({
        image: req.file.path
    })
})
router.get('/', getProducts);
router.get('/:id', getProductById);
router.post('/', createProduct);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct)


module.exports = router;