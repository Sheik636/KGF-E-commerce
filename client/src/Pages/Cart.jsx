import { useEffect, useState, useContext } from "react";
import API from "../Services/api";
import { useNavigate } from "react-router-dom";
import { useSelector,useDispatch } from 'react-redux';
import { removeFromCart,increaseQuantity,decreaseQuantity } from '../Redux/cartSlice';

const Cart = () => {

  const dispatch = useDispatch()

  const cartItems =useSelector((state)=>state.cart.cartItems)
  const removeItem=(index)=>{
       dispatch(removeFromCart(index))
  }

  const increaseQty =(index)=>{
    dispatch(
      increaseQuantity(index)
    )
  }
  const decreaseQty =(index)=>{
    dispatch(
      decreaseQuantity(index)
    )
  }
  

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Your Cart</h2>
      {cartItems.length===0 ? (<h2>Cart is Empty</h2>):
      (cartItems.map((item, index) => (
        <div key={index} className="border p-4 mb-2 flex justify-between rounded-lg items-center">
          <img src={item?.images?.[0]} alt={item.name} className="h-24 w-24 rounded-lg" />
          <h2 className="font-bold">{item.name}</h2>
          <p>₹{item.price}</p>
          <p>Size:{item.chooseSize}</p>
          <div className="flex gap-3">
            <button onClick={()=>decreaseQty(index)} className="bg-gray-200 px-3 py-1 rounded">-</button>
            <span>Qty:{item.quantity}</span>
            <button onClick={()=>increaseQty(index)} className="bg-gray-200 px-3 py-1 rounded">+</button>
          </div>
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