import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  removeFromCart,
  increaseQuantity,
  decreaseQuantity,
} from "../Redux/cartSlice";
import OrderSummary from "../Components/OrderSummary";

const Cart = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.cartItems);

  const removeItem = (index) => dispatch(removeFromCart(index));
  const increaseQty = (index) => dispatch(increaseQuantity(index));
  const decreaseQty = (index) => dispatch(decreaseQuantity(index));

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <div className="animate-fade-in-up mb-8">
        <h2 className="font-display text-5xl text-white tracking-wide">YOUR CART</h2>
        <div className="w-16 h-0.5 bg-brand-red mt-2" />
      </div>

      {cartItems.length === 0 ? (
        <div className="text-center py-24 animate-fade-in">
          <div className="text-6xl mb-4 animate-float">🛒</div>
          <h3 className="font-display text-3xl text-brand-muted mb-2">CART IS EMPTY</h3>
          <p className="text-brand-muted mb-6">Add some products to get started.</p>
          <button onClick={() => navigate("/")} className="btn-primary px-8 py-3">
            Shop Now
          </button>
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item, index) => (
              <div
                key={index}
                className="card-dark p-4 flex flex-col sm:flex-row gap-4 items-center animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s`, opacity: 0 }}
              >
                <img
                  src={item?.images?.[0]}
                  alt={item.name}
                  className="h-28 w-28 rounded-xl object-cover border border-brand-border shrink-0"
                />
                <div className="flex-1 text-center sm:text-left">
                  <h3 className="font-semibold text-white text-lg">{item.name}</h3>
                  <p className="text-brand-red font-bold mt-1">₹{item.price}</p>
                  <p className="text-brand-muted text-sm">Size: {item.chooseSize}</p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => decreaseQty(index)}
                    className="w-8 h-8 rounded-lg border border-brand-border text-white hover:border-brand-red hover:text-brand-red transition-colors"
                  >
                    −
                  </button>
                  <span className="text-white font-medium w-8 text-center">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => increaseQty(index)}
                    className="w-8 h-8 rounded-lg border border-brand-border text-white hover:border-brand-red hover:text-brand-red transition-colors"
                  >
                    +
                  </button>
                </div>
                <button
                  onClick={() => removeItem(index)}
                  className="text-brand-muted hover:text-brand-red transition-colors text-sm font-medium px-3 py-1 border border-brand-border hover:border-brand-red rounded-lg"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
          <div className="animate-slide-in-right delay-200">
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
