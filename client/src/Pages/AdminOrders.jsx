import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import API from "../Services/api";
import AdminLayout from "../Components/AdminLayout";
import FireLoader from "../Components/FireLoader";
import { Package, Truck, CheckCircle2, Clock, MapPin, User as UserIcon } from "lucide-react";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const { data } = await API.get("/orders/all");
        setOrders(data);
      } catch {
        toast.error("Failed to load orders");
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
    <AdminLayout title="ORDERS" subtitle={`View and manage customer orders (${orders.length})`}>
      {loading ? (
        <FireLoader fullScreen size="lg" text="Loading orders..." />
      ) : orders.length === 0 ? (
        <div className="text-center py-20 card-dark animate-fade-in">
          <div className="w-16 h-16 rounded-full bg-brand-red/10 text-brand-red flex items-center justify-center mx-auto mb-4 animate-float">
            <Package size={32} />
          </div>
          <p className="font-display text-3xl text-brand-muted">NO ORDERS YET</p>
        </div>
      ) : (
        orders.map((order, orderIndex) => (
          <div
            key={order._id}
            className="card-dark p-6 mb-6 animate-fade-in-up"
            style={{ animationDelay: `${orderIndex * 0.05}s` }}
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
                <p className="text-white font-medium flex items-center gap-1.5">
                  <UserIcon size={14} className="text-brand-red" />
                  {order.user?.name || "Guest"}
                </p>
                <p className="text-brand-muted text-sm">{order.user?.email}</p>
              </div>
              <div>
                <p className="text-brand-muted text-xs uppercase tracking-widest mb-1">
                  Date
                </p>
                <p className="text-white">
                  {new Date(order.createdAt).toLocaleDateString("en-IN", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </p>
              </div>
              <div>
                <p className="text-brand-muted text-xs uppercase tracking-widest mb-1">
                  Total
                </p>
                <p className="text-brand-red font-bold text-xl">
                  ₹{order.totalPrice?.toLocaleString()}
                </p>
              </div>
            </div>

            {/* Shipping Address */}
            {order.shippingAddress && (
              <div className="mb-4 p-4 rounded-xl bg-brand-dark border border-brand-border flex items-start gap-3">
                <MapPin size={18} className="text-brand-red shrink-0 mt-0.5" />
                <div>
                  <p className="text-brand-muted text-xs uppercase tracking-widest mb-1">
                    Shipping Address
                  </p>
                  <p className="text-white text-sm">
                    {order.shippingAddress?.name && <span className="font-semibold">{order.shippingAddress.name} — </span>}
                    {order.shippingAddress?.address}, {order.shippingAddress?.city} {order.shippingAddress?.postalCode},{" "}
                    {order.shippingAddress?.country}
                  </p>
                </div>
              </div>
            )}

            {/* Items List */}
            <div className="space-y-3 mb-4">
              {order.orderItems?.map((item) => (
                <div
                  key={item._id || item.product}
                  className="flex gap-4 p-3 rounded-xl bg-brand-dark border border-brand-border items-center"
                >
                  <img
                    src={item.image || item.images}
                    alt={item.name}
                    className="w-16 h-16 rounded-lg object-cover shrink-0 border border-brand-border"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-white truncate">{item.name}</h3>
                    <p className="text-brand-muted text-sm">
                      Qty: {item.quantity}
                      {item.size && ` • Size: ${item.size}`}
                    </p>
                    <p className="text-brand-red font-bold">₹{item.price?.toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Status & Deliver Action */}
            <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-brand-border/50">
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide ${
                  order.isPaid
                    ? "bg-green-500/15 text-green-400 border border-green-500/30"
                    : "bg-brand-red/15 text-brand-red border border-brand-red/30"
                }`}
              >
                {order.isPaid ? <><CheckCircle2 size={14} /> Paid</> : <><Clock size={14} /> Not Paid</>}
              </span>
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide ${
                  order.isDelivered
                    ? "bg-green-500/15 text-green-400 border border-green-500/30"
                    : "bg-yellow-500/15 text-yellow-400 border border-yellow-500/30"
                }`}
              >
                {order.isDelivered ? <><CheckCircle2 size={14} /> Delivered</> : <><Clock size={14} /> Pending Delivery</>}
              </span>
              {order.isPaid && !order.isDelivered && (
                <button
                  onClick={() => deliverHandler(order._id)}
                  className="btn-primary ml-auto px-6 py-2 text-sm flex items-center gap-2"
                >
                  <Truck size={16} /> Mark Delivered
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
