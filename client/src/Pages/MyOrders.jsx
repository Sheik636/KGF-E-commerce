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
                <div className="text-center mt-20">
                    <h2 className="text-3xl mb-4">
                        📦
                    </h2>
                    <h2 className="text-xl font-semibold">
                        No Orders Yet
                    </h2>
                    <p className="text-gray-500 mt-2">
                        Start shopping to place your first order
                    </p>
                </div>
            ):(orders.map((order)=>(
                <div key={order._id} className="bg-white rounded-3xl p-6 mb-8 shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300">
                    <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
                        <div className="bg-gradient-to-r from-red-500 to-blue-500 text-white p-4 rounded-2xl mb-5">
                            <h2 className="text-xl font-bold">
                                 Order #{order._id.slice(-6)}
                            </h2>
                        </div>

                        <div>
                            <h2 className="font-bold text-gray-700">
                            Order Date
                            </h2>
                            <p>
                            {new Date(order.createdAt)
                                .toLocaleDateString()}
                            </p>
                        </div>

                        <div>
                            <h2 className="font-bold text-gray-700">
                            Total
                            </h2>
                            <p className="text-green-600 font-bold">
                            ₹{order.totalPrice}
                            </p>
                        </div>
                        </div>
                {order.orderItems.map((item) => (
                            <div
                                key={item._id}
                                className="flex gap-5 border rounded-xl p-4 mb-4 bg-white shadow-sm hover:shadow-md transition item-center"
                            >
                                <img
                                src={item.image}
                                alt={item.name}
                                className="w-28 h-28 rounded-xl object-cover shadow-md"
                                />
                                <div className="flex-1">
                                <h3 className="text-xl font-bold text-gray-800">
                                    {item.name}
                                </h3>
                                <p className="text-gray-500">
                                    Qty: {item.quantity}
                                </p>
                                {item.size && (
                                    <p className="text-gray-500">
                                    Size: {item.size}
                                    </p>
                                )}
                                <p className="font-bold text-green-600">
                                    ₹{item.price}
                                </p>
                                </div>
                            </div>
                            ))}
                <div className="mt-4 flex gap-4">
                    <span className={`px-3 py-1 rounded text-white ${order.isPaid ? "bg-green-500": "bg-red-500"}`}>{order.isPaid ? "Paid" : "Not Paid"}</span>
                    <span className={`px-3 py-1 rounded text-white
                  ${order.isDelivered ? "bg-green-500" : "bg-yellow-500"}`}>{order.isDelivered ? "Delivered" : "Pending"}</span>
                </div>
                {!order.isPaid && (
                            <button onClick={()=> payment(order)} className="mt-5 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:scale-105 transition">Pay now</button>
                )}
            </div>
            ))
            )}
        </div>
    )
    
}

export default MyOrders;