import { useState, useEffect } from "react";
import API from "../Services/api";
// import razorpay from "../../../server/config/razorpay";

const MyOrders =()=>{
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(()=>{
        const fetchOrders = async()=>{
            try {
                setLoading(true);
                const {data}= await API.get("/orders/myorders", {headers:{Authorization:`Bearer ${localStorage.getItem("token")}`}});
                setOrders(data);
                console.log(data);
            } catch (error) {
                console.log(error.message)
            }finally{
                setLoading(false);
            }
        }
        fetchOrders()
        
    },[]);

    const payment= async (order)=>{
        try {
            const {data}= await API.post(`/orders/${order._id}/pay`, {}, {headers: {Authorization: `Bearer ${localStorage.getItem("token")}`}})
            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID,
                amount: data.amount,
                currency: data.currency,
                name: "KGF",
                description: "Order Payment",
                order_id: data.id,
                handler: async function(response){
                    await API.post("/orders/payment-verify",{
                        razorpay_order_id: response.razorpay_order_id,
                        razorpay_payment_id: response.razorpay_payment_id,
                        razorpay_signature: response.razorpay_signature,
                        orderId: order._id
                    },{headers:{
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }}),
                    alert("Payment successfull..!")
                    setOrders(orders.map((ord)=>ord._id === order._id ? {...ord, isPaid : true}:ord))
                },
                theme:{
                color: "#000000"
            }
            }
            
            const razor = new window.Razorpay(options);
            razor.open();
        } catch (error) {
            console.log(error.message)
        }
    }
    return(
        <div className=" max-w-6xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6">My Orders</h1>
            {loading?(
                <h2>Loading...</h2>
            ):orders.length==0?(
                <h2>No Orders Found</h2>
            ):(orders.map((order)=>(
                <div key={order._id} className="border rounded-lg p-4 mb-6 shadow">
                    <div className="flex justify-between mb-4">
                        <div>
                            <h2 className="font-bold">Order ID:</h2>
                            <p>{order._id}</p>
                        </div>
                    <div>
                        <h2 className="font-bold">Total:</h2>
                        <p>₹{order.totalPrice}</p>
                    </div>
                </div>
                {order.orderItems.map((item)=>(
                    <div key={item._id} className="flex items-center gap-4 border-b py-3 ">
                        <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded" />
                        <div>
                            <h3 className="font-semibold">{item.name}</h3>
                            <p>Qty:{item.quantity}</p>
                            <p>₹{item.price}</p>
                        </div>
                    </div>
                ))}
                <div className="mt-4 flex gap-4">
                    <span className={`px-3 py-1 rounded text-white ${order.isPaid ? "bg-green-500": "bg-red-500"}`}>{order.isPaid ? "Paid" : "Not Paid"}</span>
                    <span className={`px-3 py-1 rounded text-white
                  ${order.isDelivered ? "bg-green-500" : "bg-yellow-500"}`}>{order.isDelivered ? "Delivered" : "Pending"}</span>
                </div>
                {!order.isPaid && (
                            <button onClick={()=> payment(order)} className="bg-green-500 text-white px-4 py-2 rounded mt-4">Pay now</button>
                )}
            </div>
            ))
            )}
        </div>
    )
    
}

export default MyOrders;