import API from "../Services/api";
import { useState, useEffect, useContext } from "react";
import {toast} from "react-toastify";
import { CartContext } from "../context/CartContext";
import { Link } from "react-router-dom";

const ProductCard = ({ product }) => {
  const [cartItem, setCartItem] = useState(null);
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [showSelector, setShowSelector] = useState(false);

  const {cartCount, setCartCount}= useContext(CartContext);

  useEffect(()=>{
    const fetchCart = async()=>{
        try {
          const {data}= await API.get("/cart",{headers:{Authorization:`Bearer ${localStorage.getItem("token")}`}})
          const item =data.find((item)=>item.product._id === product._id)
          setCartItem(item)
        } catch (error) {
          console.log(error.message)
        }
    }
    fetchCart()
  },[product._id])

  const addToCart = async () => {

    try {
      

      await API.post("/cart", {
        productId: product._id,
        quantity: selectedQuantity,
      });

      setCartItem({product,quantity: selectedQuantity,});

      setCartCount(cartCount+selectedQuantity)
      toast.success("Added to cart");


    } catch (error) {

      toast.warning("Login required");

    }
  };

  const updateQuantity = async(action)=>{
      try {
        const {data}= await API.put("/cart/update",{productId: product._id, action},{headers:{Authorization:`Bearer ${localStorage.getItem("token")}`}})
        
        const updateItem = data.find((item)=>item.product.toString() === product._id);
        if(action == "increase"){setCartCount(cartCount+1)}
        if(action == "decrease"){setCartCount(Math.max(0,cartCount-1))}
        
        setCartItem(updateItem || null)
      } catch (error) {
        console.log(error.message)
      }
  }

  return (
    <Link to={`/product/${product._id}`}>
    <div className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">

      {/* Product Image */}
      <img
        src={product.images?.[0]}
        alt={product.name}
        className="w-full h-72x object-cover"
      />

      {/* Product Details */}
      <div className="p-5 space-y-3">
        <h2 className="text-red-600 text-lg font-semibold">
          {product.name}
        </h2>

        <p className="text-green-600 font-bold mt-2">
          ₹ {product.price}
        </p>
        {cartItem ?(<div className="flex items-center gap-4 m-5"><button onClick={()=>updateQuantity("decrease")} className="bg-red-500 text-white px-3 py-1 rounded">-</button><span className="font-bold">{cartItem.quantity}</span><button onClick={()=>updateQuantity("increase")} className="bg-green-500 text-white px-3 py-1 rounded">+</button> </div>):(!showSelector? <button onClick={()=>setShowSelector(true)} className="bg-blue-500 rounded-lg text-white mt-4 px-4 py-2 w-full">
        Cart
        </button> :<> <div className="flex items-center gap-4 m-5">
          <button onClick={()=> setSelectedQuantity(Math.max(1,selectedQuantity-1))}className="bg-red-500 text-white px-3 py-1 rounded">-</button> <span className="font-bold text-lg">{selectedQuantity}</span><button onClick={()=> setSelectedQuantity(selectedQuantity+1)} className="bg-green-500 text-white px-3 py-1 rounded">+</button> 
        </div><button onClick={addToCart} className="bg-blue-500 rounded-lg text-white mt-4 px-4 py-2 w-full">
          Add to Cart
        </button></>)}
          
      </div>
    </div>
    </Link>
  );
};

export default ProductCard;