import API from "../Services/api";
import { useState, useEffect } from "react";
import {toast} from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "../Redux/cartSlice";
import SizeSelectorModal from "./SizeSelectorModel";

const ProductCard = ({ product }) => {
  const [showSizePopup, setShowSizePopup] = useState(false);
  const [chooseSize, setChooseSize] = useState("");

  const navigate = useNavigate()
  const dispatch = useDispatch()

  const handleAddToCart=()=>{
    const token = localStorage.getItem("token");
    if(!token){
      toast.warning("Login Required..!")
      navigate("/login");
      return;
    }
    if(!chooseSize){
      toast.warning("Please Select a Size");
      return;
    }
    dispatch(
      addToCart({
        ...product,
        chooseSize:chooseSize,
        quantity:1
      })
    )
    toast.success("Added to Cart");
    setShowSizePopup(false);
    setChooseSize("")
  }

  return (
    <div className="bg-gray-300 rounded-2xl overflow-hidden shadow-md hover:shadow-2xl hover:-translate-y-1 transition-transform duration-300 will-change-transform">
    <Link to={`/product/${product._id}`}>

      {/* Product Image */}
      <img
        src={product.images?.[0]}
        alt={product.name}
        className="w-full h-72 p-2 rounded-xl object-cover"
      />

      {/* Product Details */}
      
        <h2 className="text-red-600 text-center text-lg font-semibold">
          {product.name}
        </h2>

        <p className="text-green-600 text-center font-bold mt-2">
          ₹ {product.price}
        </p>
        </Link>
        <div className="p-5 space-y-3">
        <button onClick={(e)=>{
            e.preventDefault()
            setShowSizePopup(true)
          }} className="bg-blue-500 text-white px-4 py-2 rounded-lg w-full mt-4">Cart</button>
       <SizeSelectorModal show={showSizePopup} onClose={()=> setShowSizePopup(false)} sizes={product?.sizes} chooseSize={chooseSize} setChooseSize={setChooseSize} onConfirm={handleAddToCart}/>
          
      </div>
    </div>
  );
};

export default ProductCard;