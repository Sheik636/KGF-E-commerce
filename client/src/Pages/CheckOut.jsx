import { useState, useEffect } from "react";
import API from "../Services/api";
import { useNavigate } from "react-router-dom";
import OrderSummary from "../Components/OrderSummary";
import { toast } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import { clearCart } from "../Redux/cartSlice";
import { ShieldCheck, MapPin, CheckCircle, Plus } from "lucide-react";

const Checkout = () => {
  const [loading, setLoading] = useState(false);
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddrId, setSelectedAddrId] = useState(null);

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
    const fetchSavedAddresses = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          const { data } = await API.get("/users/addresses");
          if (data && data.length > 0) {
            setSavedAddresses(data);
            // Pre-select most recent saved address
            const latest = data[data.length - 1];
            selectAddress(latest);
          }
        }
      } catch (err) {
        console.log("Could not load saved addresses:", err.message);
      }
    };
    fetchSavedAddresses();
  }, []);

  const selectAddress = (addr) => {
    setSelectedAddrId(addr._id || addr.address);
    setName(addr.name || "");
    setAddress(addr.address || "");
    setCity(addr.city || "");
    setPostalCode(addr.postalCode || "");
    setCountry(addr.country || "India");
    toast.info(`Selected saved address for ${addr.name}`);
  };

  const useNewAddress = () => {
    setSelectedAddrId("new");
    setName("");
    setAddress("");
    setCity("");
    setPostalCode("");
    setCountry("India");
  };

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
        <p className="text-brand-muted mt-2">Select a saved address or enter a new one</p>
      </div>

      {/* ── Saved Addresses Quick Selector ── */}
      {savedAddresses.length > 0 && (
        <div className="mb-8 card-dark p-6 animate-fade-in-up">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-xl text-white tracking-wide flex items-center gap-2">
              <MapPin size={20} className="text-brand-red" />
              CHOOSE SAVED ADDRESS ({savedAddresses.length})
            </h2>
            <button
              onClick={useNewAddress}
              className="btn-outline text-xs px-3 py-1.5 flex items-center gap-1"
            >
              <Plus size={14} /> Enter New Address
            </button>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {savedAddresses.map((addr, idx) => {
              const isSelected = selectedAddrId === (addr._id || addr.address);
              return (
                <div
                  key={addr._id || idx}
                  onClick={() => selectAddress(addr)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all duration-300 ${
                    isSelected
                      ? "bg-brand-dark border-brand-red shadow-[0_0_15px_rgba(229,9,20,0.3)] ring-1 ring-brand-red"
                      : "bg-brand-dark/50 border-brand-border hover:border-brand-red/50 hover:bg-brand-dark"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-white font-semibold text-sm">{addr.name}</p>
                      <p className="text-brand-muted text-xs mt-1 leading-relaxed">
                        {addr.address}, {addr.city} {addr.postalCode}, {addr.country}
                      </p>
                    </div>
                    {isSelected && (
                      <CheckCircle size={18} className="text-brand-red shrink-0 ml-2" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-8">
        <div className="card-dark p-6 space-y-4 animate-slide-in-left">
          <div className="flex items-center gap-2 mb-2 pb-3 border-b border-brand-border">
            <MapPin size={20} className="text-brand-red" />
            <h2 className="font-semibold text-white text-lg">
              {selectedAddrId && selectedAddrId !== "new"
                ? "Selected Shipping Address"
                : "Shipping Address Details"}
            </h2>
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
                onChange={(e) => {
                  setSelectedAddrId("new");
                  field.setter(e.target.value);
                }}
                className="input-dark"
                required
              />
            </div>
          ))}

          <div className="flex items-center gap-2 text-xs text-brand-muted pt-2 border-t border-brand-border/50">
            <ShieldCheck size={16} className="text-green-400 shrink-0" />
            <span>Your address will be automatically saved for your next order</span>
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
