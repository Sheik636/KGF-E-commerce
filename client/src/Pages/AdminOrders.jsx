import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import API from "../Services/api";
import AdminLayout from "../Components/AdminLayout";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const { data } = await API.get("/orders/all");
        setOrders(data);
      } catch (error) {
        toast.error("Failed to load orders");
        console.log(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const deliverHandler = async (id) => {
    try {
      await API.put(`/orders/${id}/deliver`, {});
      setOrders(
        orders.map((order) =>
          order._id === id ? { ...order, isDelivered: true } : order
        )
      );
      toast.success("Order marked as delivered");
    } catch {
      toast.error("Failed to update order");
    }
  };

  return (
    <AdminLayout title="ORDERS" subtitle="View and manage customer orders">
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-10 h-10 border-2 border-brand-red border-t-transparent rounded-full animate-spin" />
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-20 card-dark animate-fade-in">
          <div className="text-5xl mb-4 animate-float">📦</div>
          <p className="font-display text-3xl text-brand-muted">NO ORDERS YET</p>
        </div>
      ) : (
        orders.map((order, orderIndex) => (
          <div
            key={order._id}
            className="card-dark p-6 mb-6 animate-fade-in-up"
            style={{ animationDelay: `${orderIndex * 0.08}s`, opacity: 0 }}
          >
            <div className="flex flex-col md:flex-row justify-between gap-4 mb-6 pb-6 border-b border-brand-border">
              <div>
                <p className="text-brand-muted text-xs uppercase tracking-widest mb-1">
                  Order ID
                </p>
                <h2 className="font-display text-2xl text-brand-red">
                  #{order._id.slice(-6).toUpperCase()}
                </h2>
              </div>
              <div>
                <p className="text-brand-muted text-xs uppercase tracking-widest mb-1">
                  Customer
                </p>
                <p className="text-white font-medium">{order.user?.name}</p>
                <p className="text-brand-muted text-sm">{order.user?.email}</p>
              </div>
              <div>
                <p className="text-brand-muted text-xs uppercase tracking-widest mb-1">
                  Date
                </p>
                <p className="text-white">
                  {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-brand-muted text-xs uppercase tracking-widest mb-1">
                  Total
                </p>
                <p className="text-brand-red font-bold text-xl">₹{order.totalPrice}</p>
              </div>
            </div>

            <div className="mb-4 p-4 rounded-xl bg-brand-dark border border-brand-border">
              <p className="text-brand-muted text-xs uppercase tracking-widest mb-2">
                Shipping Address
              </p>
              <p className="text-white text-sm">
                {order.shippingAddress?.name}, {order.shippingAddress?.address},{" "}
                {order.shippingAddress?.city} {order.shippingAddress?.postalCode},{" "}
                {order.shippingAddress?.country}
              </p>
            </div>

            <div className="space-y-3 mb-4">
              {order.orderItems.map((item) => (
                <div
                  key={item._id}
                  className="flex gap-4 p-3 rounded-xl bg-brand-dark border border-brand-border"
                >
                  <img
                    src={item.image || item.images}
                    alt={item.name}
                    className="w-20 h-20 rounded-lg object-cover shrink-0"
                  />
                  <div>
                    <h3 className="font-semibold text-white">{item.name}</h3>
                    <p className="text-brand-muted text-sm">
                      Qty: {item.quantity}
                      {item.size && ` · Size: ${item.size}`}
                    </p>
                    <p className="text-brand-red font-bold">₹{item.price}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide ${
                  order.isPaid
                    ? "bg-green-500/15 text-green-400 border border-green-500/30"
                    : "bg-brand-red/15 text-brand-red border border-brand-red/30"
                }`}
              >
                {order.isPaid ? "Paid" : "Not Paid"}
              </span>
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide ${
                  order.isDelivered
                    ? "bg-green-500/15 text-green-400 border border-green-500/30"
                    : "bg-yellow-500/15 text-yellow-400 border border-yellow-500/30"
                }`}
              >
                {order.isDelivered ? "Delivered" : "Pending"}
              </span>
              {order.isPaid && !order.isDelivered && (
                <button
                  onClick={() => deliverHandler(order._id)}
                  className="btn-primary ml-auto px-6 py-2 text-sm"
                >
                  Mark Delivered
                </button>
              )}
            </div>
          </div>
        ))
      )}
    </AdminLayout>
  );
};

export default AdminOrders;
