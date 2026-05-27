import { useState } from "react";
import API from "../Services/api";
import { useNavigate } from "react-router-dom";
import OrderSummary from "../Components/OrderSummary";
import { toast } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import { clearCart } from "../Redux/cartSlice";


const Checkout = ()=>{
    const [loading, setLoading] = useState(false);
    const [name, setName] = useState("");
    const [address, setAddress] = useState("");
    const [city, setCity] = useState("");
    const [postalCode, setPostalCode] = useState("");
    const [country, setCountry] = useState("");

    const navigate =useNavigate();
    const dispatch= useDispatch()

    const {subtotal, shipping, tax, total}= useSelector((state)=>state.checkout)

   const cartItems= useSelector((state)=>state.cart.cartItems)
    const placeOrder = async()=>{
        if ( !name || !address || !city || !postalCode || !country ) {
            return toast.warning("Please fill all shipping details")
        }
    try {
        setLoading(true)
      await API.post("/orders", {orderItems:cartItems.map((item)=>({
        product:item._id,
        name:item.name,
        image:item.images?.[0],
        price:item.price,
        quantity:item.quantity,
        size:item.chooseSize
    })), shippingAddress:{
        name,address, city, postalCode, country
      }, subtotal,shipping,tax,total},{headers:{
        Authorization:`Bearer ${localStorage.getItem("token")}`
      }});

      toast.success("Order Placed Successfully");
      dispatch(clearCart());
      setName("");
      setAddress("");
      setCity("");
      setPostalCode("");
      setCountry("");
      navigate("/myorders")
    } catch (error) {
      toast.error("Error Placing Order");
      console.log(error.message)
    }finally{
        setLoading(false)
    }
  }
  return(
    <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-4xl font-bold mb-6">Check Out!</h1>
        <div className="space-y-4">
            <input type="text" placeholder="name" value={name} onChange={(e)=>setName(e.target.value)} className="border p-2 w-full rounded" required />
            <input type="text" placeholder="Enter Your Shipping Address" value={address} onChange={(e)=>setAddress(e.target.value)} className="border p-2 w-full rounded" />
            <input type="text" placeholder="City" value={city} onChange={(e)=>setCity(e.target.value)} className="border p-2 w-full rounded" />
            <input type="text" placeholder="Postal Code" value={postalCode} onChange={(e)=>setPostalCode(e.target.value)} className="border p-2 w-full rounded" />
            <input type="text" placeholder="Country" value={country} onChange={(e)=>setCountry(e.target.value)} className="border p-2 w-full rounded" />
        </div>
        <div className="mt-8">
            <OrderSummary cartItems={cartItems} buttonText="Place Order" buttonAction={placeOrder}/>
        </div>
    </div>
  )

}

export default Checkout;