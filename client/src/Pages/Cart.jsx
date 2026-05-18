import { useEffect, useState, useContext } from "react";
import API from "../Services/api";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";

const Cart = () => {

  const { cartItems, setCartItems } = useContext(CartContext);
  const removeItem=(index)=>{
       setCartItems(cartItems.filter((_,i)=>i!==index))
  }
  

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Your Cart</h2>
      {cartItems.length===0 ? (<h2>Cart is Empty</h2>):
      (cartItems.map((item, index) => (
        <div key={index} className="border p-4 mb-2 flex justify-between rounded-lg">
          <img src={item?.images?.[0]} alt={item.name} className="h-24 w-24 rounded-lg" />
          <h2 className="font-bold">{item.name}</h2>
          <p>₹{item.price}</p>
          <p>Size:{item.chooseSize}</p>
          <p>Qty: {item.quantity}</p>
          <button onClick={() => removeItem(index)} className="bg-red-500 text-white px-3 py-1 rounded-lg">
            Remove
        </button>           
        </div>
      )))}
      <button onClick={()=> navigate("/checkout") } disabled={cartItems.length===0} className="bg-green-500 text-white px-4 py-2 mt-3">Check Out</button>
    </div>
  );
};

export default Cart;