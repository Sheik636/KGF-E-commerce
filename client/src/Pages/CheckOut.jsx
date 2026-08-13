import { useState, useEffect } from "react";
import API from "../Services/api";
import { useNavigate } from "react-router-dom";
import OrderSummary from "../Components/OrderSummary";
import { toast } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import { clearCart } from "../Redux/cartSlice";
import { ShieldCheck, MapPin } from "lucide-react";

const Checkout = () => {
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState("India");

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.cartItems);

  useEffect(() => {
    document.title = "KGF Store — Checkout";
  }, []);

  if (cartItems.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-20 text-center">
        <h1 className="font-display text-4xl text-brand-muted mb-4">
          YOUR CART IS EMPTY
        </h1>
        <p className="text-brand-muted mb-6">
          Add items to your cart before proceeding to checkout.
        </p>
        <button onClick={() => navigate("/")} className="btn-primary px-8 py-3">
          Back to Store
        </button>
      </div>
    );
  }

  const placeOrder = async (discountAmount = 0, couponCode = "") => {
    if (!name.trim() || !address.trim() || !city.trim() || !postalCode.trim() || !country.trim()) {
      return toast.warning("Please fill all shipping details");
    }
    try {
      setLoading(true);
      const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
      const subtotalAfterDiscount = Math.max(0, subtotal - discountAmount);
      const shipping = subtotalAfterDiscount > 1000 ? 0 : 99;
      const tax = Math.round(subtotalAfterDiscount * 0.05);
      const total = subtotalAfterDiscount + shipping + tax;

      await API.post(
        "/orders",
        {
          orderItems: cartItems.map((item) => ({
            product: item._id,
            name: item.name,
            image: item.images?.[0] || item.image,
            price: item.price,
            quantity: item.quantity,
            size: item.chooseSize,
          })),
          shippingAddress: { name, address, city, postalCode, country },
          subtotal,
          discountAmount,
          couponCode,
          shipping,
          tax,
          total,
        },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );

      toast.success("Order Placed Successfully!");
      dispatch(clearCart());
      navigate("/myorders");
    } catch (error) {
      toast.error(error.response?.data?.message || "Error Placing Order");
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { label: "Full Name", value: name, setter: setName, placeholder: "John Doe" },
    { label: "Street Address", value: address, setter: setAddress, placeholder: "123 Main St, Apt 4B" },
    { label: "City", value: city, setter: setCity, placeholder: "Mumbai" },
    { label: "Postal / ZIP Code", value: postalCode, setter: setPostalCode, placeholder: "400001" },
    { label: "Country", value: country, setter: setCountry, placeholder: "India" },
  ];

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <div className="animate-fade-in-up mb-8">
        <h1 className="font-display text-5xl text-white tracking-wide">
          CHECKOUT
        </h1>
        <div className="w-16 h-0.5 bg-brand-red mt-2" />
        <p className="text-brand-muted mt-2">Enter your shipping details below</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <div className="card-dark p-6 space-y-4 animate-slide-in-left">
          <div className="flex items-center gap-2 mb-2 pb-3 border-b border-brand-border">
            <MapPin size={20} className="text-brand-red" />
            <h2 className="font-semibold text-white text-lg">Shipping Address</h2>
          </div>

          {fields.map((field, i) => (
            <div
              key={field.label}
              className="animate-fade-in-up"
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              <label className="block text-sm text-brand-muted mb-1.5 font-medium">
                {field.label}
              </label>
              <input
                type="text"
                placeholder={field.placeholder}
                value={field.value}
                onChange={(e) => field.setter(e.target.value)}
                className="input-dark"
                required
              />
            </div>
          ))}

          <div className="flex items-center gap-2 text-xs text-brand-muted pt-2 border-t border-brand-border/50">
            <ShieldCheck size={16} className="text-green-400 shrink-0" />
            <span>Your information is protected by 256-bit encryption</span>
          </div>
        </div>

        <div className="animate-slide-in-right">
          <OrderSummary
            cartItems={cartItems}
            buttonText={loading ? "Placing Order..." : "Place Order"}
            buttonAction={placeOrder}
          />
        </div>
      </div>
    </div>
  );
};

export default Checkout;
