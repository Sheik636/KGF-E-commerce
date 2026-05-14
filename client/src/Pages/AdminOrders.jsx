import {useState, useEffect} from 'react';
import API from '../Services/api';
import AdminSlideBar from '../Components/AdminSlideBar';

const AdminOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    
    useEffect(()=>{
        const fetchOrders =async()=>{
            try {
                setLoading(true)
                const {data}= await API.get("/orders/all", {
                    headers:{
                        Authorization: `Bearer ${localStorage.getItem("Admintoken")}`
                    }
                })
                setOrders(data);
            } catch (error) {
                console.log(error.message);
            }finally{
                setLoading(false)
            }
        }
        fetchOrders()
    },[]);

    const deliverHandler = async (id)=>{
        try {
            await API.put(`/orders/${id}/deliver`, {}, {headers: {Authorization: `Bearer ${localStorage.getItem("Admintoken")}`}});
            setOrders(
                orders.map((order)=>order._id === id?{...order,isDelivered:true}: order)
            )
        } catch (error) {
            console.log(error.message)
        }
    }

  return (
    <div className='flex'>
        <AdminSlideBar/>
        <div className='flex-1 p-6'>
            <h1 className="text-3xl font-bold mb-6">
                All Order
            </h1>
            {loading ? (<h2>Loading...</h2>) : orders.length===0? (
                <h2>No Orders Found</h2>) :(orders.map((order)=>(
                    <div key={order._id} className="border rounded-lg p-4 mb-6 shadow">
                        <div className="flex justify-between mb-4">
                            <div>
                                <h2 className='font-bold'>Customer</h2>
                                <p>{order.user?.name}</p>
                                <p>{order.user?.email}</p>
                            </div>
                            <div>
                                <h2 className='font-bold'>Total:</h2>
                                <p>₹{order.totalPrice}</p>
                            </div>
                        </div>
                        <div className='mb-4'>
                            <h2 className='font-bold'>Shipping Address:</h2>
                            <p>{order.shippingAddress?.name}</p>
                            <p>{order.shippingAddress?.address}</p>
                            <p>{order.shippingAddress?.city}</p>
                            <p>{order.shippingAddress?.postalCode}</p>
                            <p>{order.shippingAddress?.country}</p>
                        </div>
                        <div>
                            <h2 className='font-bold mb-2'>Ordered Items</h2>
                            {order.orderItems.map((item)=>(
                                <div key={item._id} className="flex items-center gap-4 border-b py-3">
                                    <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded"/>
                                    <div>
                                        <h3 className='font-semibold'>{item.name}</h3>
                                        <p>Qty:{item.quantity}</p>
                                        <p>₹{item.price}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-4 flex gap-4">
                            <span className={`px-3 py-1 rounded text-white ${order.isPaid ? "bg-green-500" : "bg-red-500"}`}>{order.isPaid ? "Paid" : "Not Paid"}</span>
                            <span className={`px-3 py-1 rounded text-white ${order.isDelivered ? "bg-green-500" : "bg-yellow-500"}`}>{order.isDelivered ? "Delivered" : "Pending"}</span>
                        </div>
                        {order.isPaid && !order.isDelivered &&(
                            <button onClick={()=>deliverHandler(order._id)} className='bg-blue-500 text-white px-4 py-2 rounded mt-4'>Mark Delivered</button>
                        )}
                        
                    </div>
                ))) }
        </div>
    </div>
  )
}

export default AdminOrders