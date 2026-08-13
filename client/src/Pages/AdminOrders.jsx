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

  const [trackingModal, setTrackingModal] = useState(null);
  const [carrier, setCarrier] = useState("");
  const [trackingNumber, setTrackingNumber] = useState("");

  const updateStatusHandler = async (id, status, carrierName = "", trackingNum = "") => {
    try {
      const { data } = await API.put(`/orders/${id}/status`, {
        status,
        carrier: carrierName,
        trackingNumber: trackingNum,
      });
      setOrders(orders.map((order) => (order._id === id ? data : order)));
      toast.success(`Order status updated to ${status}`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update order status");
    }
  };

  const deliverHandler = async (id) => {
    try {
      await updateStatusHandler(id, "Delivered");
    } catch {
      toast.error("Failed to update order");
    }
  };

  const saveTrackingInfo = async (e) => {
    e.preventDefault();
    if (!trackingModal) return;
    await updateStatusHandler(
      trackingModal._id,
      trackingModal.status || "Shipped",
      carrier,
      trackingNumber
    );
    setTrackingModal(null);
    setCarrier("");
    setTrackingNumber("");
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

            {/* Status & Actions */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-brand-border/50">
              <div className="flex items-center gap-3">
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide ${
                    order.isPaid
                      ? "bg-green-500/15 text-green-400 border border-green-500/30"
                      : "bg-brand-red/15 text-brand-red border border-brand-red/30"
                  }`}
                >
                  {order.isPaid ? <><CheckCircle2 size={14} /> Paid</> : <><Clock size={14} /> Not Paid</>}
                </span>

                {/* Status Dropdown */}
                <div className="flex items-center gap-2">
                  <span className="text-xs text-brand-muted font-medium">Status:</span>
                  <select
                    value={order.status || (order.isDelivered ? "Delivered" : "Placed")}
                    onChange={(e) => updateStatusHandler(order._id, e.target.value, order.carrier, order.trackingNumber)}
                    className="bg-brand-dark border border-brand-border text-white text-xs font-semibold rounded-lg px-2.5 py-1 focus:border-brand-red focus:outline-none"
                  >
                    <option value="Placed">Placed</option>
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setTrackingModal(order);
                    setCarrier(order.carrier || "BlueDart / FedEx");
                    setTrackingNumber(order.trackingNumber || "");
                  }}
                  className="btn-outline px-4 py-1.5 text-xs flex items-center gap-1.5"
                >
                  <Truck size={14} /> Add/Edit Tracking
                </button>

                {order.isPaid && !order.isDelivered && (
                  <button
                    onClick={() => deliverHandler(order._id)}
                    className="btn-primary px-4 py-1.5 text-xs flex items-center gap-1.5"
                  >
                    <CheckCircle2 size={14} /> Mark Delivered
                  </button>
                )}
              </div>
            </div>
          </div>
        ))
      )}

      {/* Tracking Modal */}
      {trackingModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="card-dark max-w-md w-full p-6 animate-scale-in">
            <h3 className="font-display text-2xl text-white mb-4">
              UPDATE TRACKING INFO
            </h3>
            <form onSubmit={saveTrackingInfo} className="space-y-4">
              <div>
                <label className="block text-xs text-brand-muted uppercase mb-1">
                  Courier Carrier
                </label>
                <input
                  type="text"
                  value={carrier}
                  onChange={(e) => setCarrier(e.target.value)}
                  placeholder="e.g. DHL, BlueDart, FedEx"
                  className="input-dark"
                />
              </div>
              <div>
                <label className="block text-xs text-brand-muted uppercase mb-1">
                  Tracking Number / AWB
                </label>
                <input
                  type="text"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  placeholder="e.g. AWB98410294"
                  className="input-dark"
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setTrackingModal(null)}
                  className="px-4 py-2 rounded-lg border border-brand-border text-brand-muted hover:text-white text-xs font-semibold"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary px-5 py-2 text-xs">
                  Save Details
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminOrders;
