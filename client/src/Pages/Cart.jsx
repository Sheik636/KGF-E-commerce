import { useEffect, useState } from "react";
import API from "../Services/api";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const [cart, setCart] = useState([]);

  const navigate =useNavigate();
  const fetchCart = async () => {
    const { data } = await API.get("/cart");
    setCart(data);
  };

  const removeItem = async (id) =>{
    await API.delete(`/cart/${id}`);
    fetchCart();
  }
  
  

  

  useEffect(() => {
    fetchCart();
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Your Cart</h2>

      {cart.map((item) => (
        <div key={item._id} className="border p-4 mb-2 flex justify-between">
          <h3>{item.product.name}</h3>
          <p>₹{item.product.price}</p>
          <p>Qty: {item.quantity}</p>
          <button onClick={() => removeItem(item.product._id)} className="bg-red-500 text-white px-3 py-1">
            Remove
        </button>           
        </div>
      ))}
      <button onClick={()=> navigate("/checkout") } disabled={cart.length===0} className="bg-green-500 text-white px-4 py-2 mt-3">Check Out</button>
    </div>
  );
};

export default Cart;