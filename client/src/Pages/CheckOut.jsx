import { useState, useEffect } from "react";
import API from "../Services/api";
import { useNavigate } from "react-router-dom";


const Checkout = ()=>{
    const [cart, setCart] = useState([]);
    const [loading, setLoading] = useState(false);
    const [name, setName] = useState("");
    const [address, setAddress] = useState("");
    const [city, setCity] = useState("");
    const [postalCode, setPostalCode] = useState("");
    const [country, setCountry] = useState("");

    const navigate =useNavigate();

    useEffect(()=>{
        const fetchProducts = async()=>{
            try {
                // if (
                //     !address ||
                //     !city ||
                //     !postalCode ||
                //     !country
                //     ) {
                //     return alert(
                //         "Please fill all shipping details"
                //     );
                //     }
                const {data}= await API.get('/cart',{
                    headers:{
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                })
                setCart(data)
            } catch (error) {
                console.log(error.message)
            }
        }
        fetchProducts()
    },[])

    const totalPrice = cart.reduce((acc,item)=>acc+item.quantity*item.product.price,0)
    const placeOrder = async()=>{
        if ( !name || !address || !city || !postalCode || !country ) {
            return alert(
                "Please fill all shipping details"
            );
        }
    try {
        setLoading(true)
      await API.post("/orders", {shippingAddress:{
        name,address, city, postalCode, country
      }},{headers:{
        Authorization:`Bearer ${localStorage.getItem("token")}`
      }});

      alert("Order Placed Successfully");

      setCart([]);
      setName("");
      setAddress("");
      setCity("");
      setPostalCode("");
      setCountry("");
      navigate("/myorders")
    } catch (error) {
      alert("Error Placing Order");
      console.log(error.message)
    }finally{
        setLoading(false)
    }
  }
  return(
    <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Check Out!</h1>
        <div className="space-y-4">
            <input type="text" placeholder="name" value={name} onChange={(e)=>setName(e.target.value)} className="border p-2 w-full rounded" required />
            <input type="text" placeholder="Enter Your Shipping Address" value={address} onChange={(e)=>setAddress(e.target.value)} className="border p-2 w-full rounded" />
            <input type="text" placeholder="City" value={city} onChange={(e)=>setCity(e.target.value)} className="border p-2 w-full rounded" />
            <input type="text" placeholder="Postal Code" value={postalCode} onChange={(e)=>setPostalCode(e.target.value)} className="border p-2 w-full rounded" />
            <input type="text" placeholder="Country" value={country} onChange={(e)=>setCountry(e.target.value)} className="border p-2 w-full rounded" />
        </div>
        <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4">Order Summary</h2>
            {cart.map((item)=>(
                <div key={item.product._id} className="flex justify-between border-b py-3">
                    <div>
                        <h3 className="font-semibold">{item.product.name}</h3>
                        <p>Qty: {item.quantity}</p>
                    </div>
                    <p>₹{item.product.price*item.quantity}</p>
                </div>
            )
            )}
            <h2 className="text-xl flex justify-end font-bold mt-6">Total:₹{totalPrice}</h2>
            <button onClick={placeOrder} disabled={loading} className="bg-black text-white px-6 py-3 rounded mt-6 w-full">{loading? "Loading...":"Place Order"}</button>
        </div>
    </div>
  )

}

export default Checkout;