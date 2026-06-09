import { useDispatch } from "react-redux";
import { setOrderSummary } from "../Redux/checkoutSlice";

const OrderSummary = ({ cartItems, buttonText = "Proceed to Checkout", buttonAction }) => {
  const dispatch = useDispatch();
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shipping = subtotal > 1000 ? 0 : 99;
  const tax = Math.round(subtotal * 0.05);
  const total = subtotal + shipping + tax;

  const handleButtonClick = async () => {
    dispatch(setOrderSummary({ subtotal, shipping, tax, total }));
    await buttonAction();
  };

  const rows = [
    { label: "Subtotal", value: subtotal },
    { label: "Shipping", value: shipping },
    { label: "Tax (5%)", value: tax },
  ];

  return (
    <div className="card-dark p-6 sticky top-24">
      <h2 className="font-display text-2xl text-white tracking-wide mb-6">
        ORDER SUMMARY
      </h2>

      <div className="space-y-3">
        {rows.map((row) => (
          <div key={row.label} className="flex justify-between text-brand-muted">
            <span>{row.label}</span>
            <span className="text-white">₹{row.value}</span>
          </div>
        ))}
      </div>

      <div className="h-px bg-brand-border my-4" />

      <div className="flex justify-between mb-6">
        <span className="font-semibold text-white">Total</span>
        <span className="font-bold text-brand-red text-xl">₹{total}</span>
      </div>

      <button
        onClick={handleButtonClick}
        disabled={cartItems.length === 0}
        className="btn-primary w-full py-3 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:transform-none disabled:hover:shadow-none"
      >
        {buttonText}
      </button>
    </div>
  );
};

export default OrderSummary;
