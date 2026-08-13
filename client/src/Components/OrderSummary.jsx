import { useState } from "react";
import { useDispatch } from "react-redux";
import { setOrderSummary } from "../Redux/checkoutSlice";
import { Tag, Check, X } from "lucide-react";
import API from "../Services/api";
import { toast } from "react-toastify";

const OrderSummary = ({ cartItems, buttonText = "Proceed to Checkout", buttonAction }) => {
  const dispatch = useDispatch();
  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [validatingCoupon, setValidatingCoupon] = useState(false);

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const discountAmount = appliedCoupon ? appliedCoupon.discountAmount : 0;
  const subtotalAfterDiscount = Math.max(0, subtotal - discountAmount);
  const shipping = subtotalAfterDiscount > 1000 ? 0 : 99;
  const tax = Math.round(subtotalAfterDiscount * 0.05);
  const total = subtotalAfterDiscount + shipping + tax;

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!couponInput.trim()) {
      return toast.warning("Enter a promo code");
    }
    try {
      setValidatingCoupon(true);
      const { data } = await API.post("/coupons/apply", {
        code: couponInput.trim(),
        cartTotal: subtotal,
      });
      setAppliedCoupon(data);
      toast.success(`Coupon '${data.couponCode}' applied! Saved ₹${data.discountAmount}`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid coupon code");
    } finally {
      setValidatingCoupon(false);
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponInput("");
    toast.info("Coupon removed");
  };

  const handleButtonClick = async () => {
    dispatch(
      setOrderSummary({
        subtotal,
        discountAmount,
        couponCode: appliedCoupon?.couponCode || "",
        shipping,
        tax,
        total,
      })
    );
    if (buttonAction) {
      await buttonAction(discountAmount, appliedCoupon?.couponCode || "");
    }
  };

  const rows = [
    { label: "Subtotal", value: `₹${subtotal}` },
    ...(appliedCoupon
      ? [
          {
            label: `Discount (${appliedCoupon.couponCode})`,
            value: `-₹${discountAmount}`,
            highlight: true,
          },
        ]
      : []),
    { label: "Shipping", value: shipping === 0 ? "FREE" : `₹${shipping}` },
    { label: "Tax (5%)", value: `₹${tax}` },
  ];

  return (
    <div className="card-dark p-6 sticky top-24">
      <h2 className="font-display text-2xl text-white tracking-wide mb-6">
        ORDER SUMMARY
      </h2>

      <div className="space-y-3">
        {rows.map((row) => (
          <div
            key={row.label}
            className={`flex justify-between ${
              row.highlight ? "text-green-400 font-semibold" : "text-brand-muted"
            }`}
          >
            <span>{row.label}</span>
            <span className={row.highlight ? "text-green-400 font-bold" : "text-white"}>
              {row.value}
            </span>
          </div>
        ))}
      </div>

      {/* Promo Code Input Box */}
      <div className="my-5 pt-4 border-t border-brand-border">
        <label className="block text-xs text-brand-muted font-medium mb-2 flex items-center gap-1.5">
          <Tag size={14} className="text-brand-red" />
          PROMO / COUPON CODE
        </label>
        {appliedCoupon ? (
          <div className="flex items-center justify-between p-2.5 rounded-lg bg-green-500/10 border border-green-500/30 text-green-400 text-sm">
            <span className="flex items-center gap-2 font-bold uppercase">
              <Check size={16} /> {appliedCoupon.couponCode} (-₹{discountAmount})
            </span>
            <button
              onClick={removeCoupon}
              className="text-brand-muted hover:text-white p-1"
              title="Remove coupon"
            >
              <X size={16} />
            </button>
          </div>
        ) : (
          <form onSubmit={handleApplyCoupon} className="flex gap-2">
            <input
              type="text"
              placeholder="e.g. WELCOME10"
              value={couponInput}
              onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
              className="input-dark flex-1 uppercase text-sm py-2 px-3"
            />
            <button
              type="submit"
              disabled={validatingCoupon}
              className="btn-outline py-2 px-4 text-xs font-semibold"
            >
              {validatingCoupon ? "..." : "Apply"}
            </button>
          </form>
        )}
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
