import { useState } from "react";
import API from "../Services/api";
import { useNavigate } from "react-router-dom";
import OrderSummary from "../Components/OrderSummary";
import { toast } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import { clearCart } from "../Redux/cartSlice";

const Checkout = () => {
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.cartItems);

  const placeOrder = async () => {
    if (!name || !address || !city || !postalCode || !country) {
      return toast.warning("Please fill all shipping details");
    }
    try {
      setLoading(true);
      await API.post(
        "/orders",
        {
          orderItems: cartItems.map((item) => ({
            product: item._id,
            name: item.name,
            image: item.images?.[0],
            price: item.price,
            quantity: item.quantity,
            size: item.chooseSize,
          })),
          shippingAddress: { name, address, city, postalCode, country },
          subtotal: cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0),
          shipping: cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0) > 1000 ? 0 : 99,
          tax: Math.round(cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0) * 0.05),
          total:
            cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0) +
            (cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0) > 1000 ? 0 : 99) +
            Math.round(cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0) * 0.05),
        },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );

      toast.success("Order Placed Successfully");
      dispatch(clearCart());
      setName("");
      setAddress("");
      setCity("");
      setPostalCode("");
      setCountry("");
      navigate("/myorders");
    } catch (error) {
      toast.error("Error Placing Order");
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { label: "Full Name", value: name, setter: setName, placeholder: "John Doe" },
    { label: "Address", value: address, setter: setAddress, placeholder: "123 Street, Area" },
    { label: "City", value: city, setter: setCity, placeholder: "Mumbai" },
    { label: "Postal Code", value: postalCode, setter: setPostalCode, placeholder: "400001" },
    { label: "Country", value: country, setter: setCountry, placeholder: "India" },
  ];

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <div className="animate-fade-in-up mb-8">
        <h1 className="font-display text-5xl text-white tracking-wide">CHECKOUT</h1>
        <div className="w-16 h-0.5 bg-brand-red mt-2" />
        <p className="text-brand-muted mt-2">Enter your shipping details below</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <div className="card-dark p-6 space-y-4 animate-slide-in-left">
          <h2 className="font-semibold text-white text-lg mb-2">Shipping Address</h2>
          {fields.map((field, i) => (
            <div
              key={field.label}
              className="animate-fade-in-up"
              style={{ animationDelay: `${i * 0.08}s`, opacity: 0 }}
            >
              <label className="block text-sm text-brand-muted mb-1.5">{field.label}</label>
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
        </div>

        <div className="animate-slide-in-right delay-200">
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
