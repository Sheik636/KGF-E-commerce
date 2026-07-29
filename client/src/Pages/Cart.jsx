import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import {
  removeFromCart,
  increaseQuantity,
  decreaseQuantity,
} from "../Redux/cartSlice";
import OrderSummary from "../Components/OrderSummary";

const FREE_SHIPPING_THRESHOLD = 1000;

const Cart = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.cartItems);

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const amountLeftForFreeShipping = Math.max(
    0,
    FREE_SHIPPING_THRESHOLD - subtotal
  );
  const freeShippingProgress = Math.min(
    100,
    (subtotal / FREE_SHIPPING_THRESHOLD) * 100
  );

  const removeItem = (index) => dispatch(removeFromCart(index));
  const increaseQty = (index) => dispatch(increaseQuantity(index));
  const decreaseQty = (index) => dispatch(decreaseQuantity(index));

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <div className="animate-fade-in-up mb-8">
        <h1 className="font-display text-5xl text-white tracking-wide">
          YOUR CART
        </h1>
        <div className="w-16 h-0.5 bg-brand-red mt-2" />
      </div>

      {cartItems.length === 0 ? (
        <div className="text-center py-24 card-dark animate-fade-in">
          <div className="w-16 h-16 rounded-full bg-brand-red/10 text-brand-red flex items-center justify-center mx-auto mb-4 animate-float">
            <ShoppingBag size={32} />
          </div>
          <h2 className="font-display text-3xl text-brand-muted mb-2">
            YOUR CART IS EMPTY
          </h2>
          <p className="text-brand-muted mb-6">
            Looks like you haven't added anything to your cart yet.
          </p>
          <button
            onClick={() => navigate("/")}
            className="btn-primary px-8 py-3 flex items-center gap-2 mx-auto"
          >
            Explore Catalog <ArrowRight size={18} />
          </button>
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Free Shipping Progress Bar */}
            <div className="card-dark p-5 border-brand-red/30 bg-gradient-to-r from-brand-card to-brand-dark">
              <div className="flex justify-between items-center text-sm mb-2 font-medium">
                {amountLeftForFreeShipping > 0 ? (
                  <span className="text-brand-muted">
                    Add{" "}
                    <strong className="text-brand-red">
                      ₹{amountLeftForFreeShipping.toLocaleString()}
                    </strong>{" "}
                    more for <strong className="text-white">FREE Shipping</strong>
                  </span>
                ) : (
                  <span className="text-green-400 font-semibold flex items-center gap-1.5">
                    🎉 You unlocked <strong className="text-white">FREE Shipping!</strong>
                  </span>
                )}
                <span className="text-xs text-brand-muted font-mono">
                  {Math.round(freeShippingProgress)}%
                </span>
              </div>
              <div className="w-full h-2 bg-brand-black rounded-full overflow-hidden border border-brand-border">
                <div
                  className="h-full bg-gradient-to-r from-brand-red to-fire-orange rounded-full transition-all duration-500 shadow-[0_0_10px_rgba(229,9,20,0.5)]"
                  style={{ width: `${freeShippingProgress}%` }}
                />
              </div>
            </div>

            {/* Cart Items List */}
            <div className="space-y-4">
              {cartItems.map((item, index) => (
                <div
                  key={`${item._id}-${item.chooseSize}-${index}`}
                  className="card-dark p-4 flex flex-col sm:flex-row gap-4 items-center animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.06}s` }}
                >
                  <img
                    src={item?.images?.[0] || item?.image}
                    alt={item.name}
                    className="h-28 w-28 rounded-xl object-cover border border-brand-border shrink-0"
                  />
                  <div className="flex-1 text-center sm:text-left min-w-0">
                    <h3 className="font-semibold text-white text-lg truncate">
                      {item.name}
                    </h3>
                    <p className="text-brand-red font-bold text-lg mt-0.5">
                      ₹{item.price?.toLocaleString()}
                    </p>
                    <div className="flex items-center gap-2 mt-1.5 justify-center sm:justify-start">
                      {item.chooseSize && (
                        <span className="px-2.5 py-0.5 rounded-md bg-brand-dark border border-brand-border text-xs text-brand-muted font-medium">
                          Size: {item.chooseSize}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-3 bg-brand-dark px-3 py-1.5 rounded-lg border border-brand-border">
                    <button
                      onClick={() => decreaseQty(index)}
                      className="w-7 h-7 flex items-center justify-center text-brand-muted hover:text-white transition-colors text-lg font-semibold"
                      aria-label="Decrease quantity"
                    >
                      −
                    </button>
                    <span className="text-white font-semibold text-sm w-6 text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => increaseQty(index)}
                      className="w-7 h-7 flex items-center justify-center text-brand-muted hover:text-white transition-colors text-lg font-semibold"
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>

                  {/* Item Subtotal & Delete */}
                  <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-2">
                    <span className="font-bold text-white text-base">
                      ₹{(item.price * item.quantity).toLocaleString()}
                    </span>
                    <button
                      onClick={() => removeItem(index)}
                      className="p-2 text-brand-muted hover:text-brand-red transition-colors rounded-lg hover:bg-brand-red/10"
                      title="Remove item"
                      aria-label="Remove item"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="animate-slide-in-right">
            <OrderSummary
              cartItems={cartItems}
              buttonText="Proceed To Checkout"
              buttonAction={() => navigate("/checkout")}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
