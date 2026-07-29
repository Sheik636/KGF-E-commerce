import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import API from "../Services/api";
import FireLoader from "../Components/FireLoader";
import { Link } from "react-router-dom";
import { Package, CreditCard, CheckCircle2, Clock } from "lucide-react";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const { data } = await API.get("/orders/myorders", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setOrders(data);
      } catch {
        toast.error("Failed to load orders");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const payment = async (order) => {
    try {
      const { data } = await API.post(
        `/orders/${order._id}/pay`,
        {},
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: data.amount,
        currency: data.currency,
        name: "KGF",
        description: "Order Payment",
        order_id: data.id,
        handler: async function (response) {
          await API.post(
            "/orders/payment-verify",
            {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              orderId: order._id,
            },
            { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
          );
          toast.success("Payment successful!");
          setOrders(
            orders.map((ord) =>
              ord._id === order._id ? { ...ord, isPaid: true } : ord
            )
          );
        },
        theme: { color: "#e50914" },
      };

      const razor = new window.Razorpay(options);
      razor.open();
    } catch {
      toast.error("Payment initialization failed");
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <div className="animate-fade-in-up mb-8">
        <h1 className="font-display text-5xl text-white tracking-wide">
          MY ORDERS
        </h1>
        <div className="w-16 h-0.5 bg-brand-red mt-2" />
        <p className="text-brand-muted mt-2">
          Track and manage your order history
        </p>
      </div>

      {loading ? (
        <FireLoader fullScreen size="lg" text="Loading orders..." />
      ) : orders.length === 0 ? (
        <div className="text-center py-24 card-dark animate-fade-in">
          <div className="w-16 h-16 rounded-full bg-brand-red/10 text-brand-red flex items-center justify-center mx-auto mb-4 animate-float">
            <Package size={32} />
          </div>
          <h2 className="font-display text-3xl text-brand-muted mb-2">
            NO ORDERS YET
          </h2>
          <p className="text-brand-muted mb-6">
            Start shopping to place your first order.
          </p>
          <Link to="/" className="btn-primary px-8 py-3 inline-block">
            Explore Store
          </Link>
        </div>
      ) : (
        orders.map((order, orderIndex) => (
          <div
            key={order._id}
            className="card-dark p-6 mb-6 animate-fade-in-up"
            style={{ animationDelay: `${orderIndex * 0.08}s` }}
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
                  Date
                </p>
                <p className="text-white font-medium">
                  {new Date(order.createdAt).toLocaleDateString("en-IN", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </p>
              </div>
              <div>
                <p className="text-brand-muted text-xs uppercase tracking-widest mb-1">
                  Total Amount
                </p>
                <p className="text-brand-red font-bold text-xl">
                  ₹{order.totalPrice?.toLocaleString()}
                </p>
              </div>
            </div>

            {/* Order Items */}
            <div className="space-y-3 mb-6">
              {order.orderItems?.map((item) => (
                <div
                  key={item._id || item.product}
                  className="flex gap-4 p-3.5 rounded-xl bg-brand-dark border border-brand-border hover:border-brand-red/30 transition-colors items-center"
                >
                  <img
                    src={item.image || item.images}
                    alt={item.name}
                    className="w-20 h-20 rounded-xl object-cover shrink-0 border border-brand-border"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-white truncate">
                      {item.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-1 text-xs text-brand-muted">
                      <span>Qty: {item.quantity}</span>
                      {item.size && <span>• Size: {item.size}</span>}
                    </div>
                    <p className="text-brand-red font-bold mt-1">
                      ₹{item.price?.toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Status & Actions */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <div className="flex items-center gap-3">
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide ${
                    order.isPaid
                      ? "bg-green-500/15 text-green-400 border border-green-500/30"
                      : "bg-brand-red/15 text-brand-red border border-brand-red/30"
                  }`}
                >
                  {order.isPaid ? (
                    <>
                      <CheckCircle2 size={14} /> Paid
                    </>
                  ) : (
                    <>
                      <Clock size={14} /> Payment Pending
                    </>
                  )}
                </span>

                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide ${
                    order.isDelivered
                      ? "bg-green-500/15 text-green-400 border border-green-500/30"
                      : "bg-yellow-500/15 text-yellow-400 border border-yellow-500/30"
                  }`}
                >
                  {order.isDelivered ? (
                    <>
                      <CheckCircle2 size={14} /> Delivered
                    </>
                  ) : (
                    <>
                      <Clock size={14} /> Delivery Pending
                    </>
                  )}
                </span>
              </div>

              {!order.isPaid && (
                <button
                  onClick={() => payment(order)}
                  className="btn-primary px-6 py-2 text-sm flex items-center gap-2"
                >
                  <CreditCard size={16} /> Pay Now
                </button>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default MyOrders;
