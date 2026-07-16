import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { removeFromWishlist } from "../Redux/wishlistSlice";
import { addToCart } from "../Redux/cartSlice";
import SizeSelectorModal from "../Components/SizeSelectorModel";

const Wishlist = () => {
  const wishlistItems = useSelector((state) => state.wishlist.wishlistItems);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [showSizePopup, setShowSizePopup] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [chooseSize, setChooseSize] = useState("");

  const handleRemove = (id) => {
    dispatch(removeFromWishlist(id));
    toast.info("Removed from wishlist");
  };

  const openSizeModal = (product) => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.warning("Login required");
      navigate("/login");
      return;
    }
    setSelectedProduct(product);
    setChooseSize("");
    setShowSizePopup(true);
  };

  const handleAddToCart = () => {
    if (!chooseSize) {
      toast.warning("Please select a size");
      return;
    }
    dispatch(
      addToCart({
        ...selectedProduct,
        chooseSize,
        quantity: 1,
      })
    );
    toast.success("Added to cart");
    setShowSizePopup(false);
    setSelectedProduct(null);
    setChooseSize("");
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <div className="animate-fade-in-up mb-8">
        <h1 className="font-display text-5xl text-white tracking-wide">WISHLIST</h1>
        <div className="w-16 h-0.5 bg-brand-red mt-2" />
        <p className="text-brand-muted mt-2">
          {wishlistItems.length} saved item{wishlistItems.length !== 1 ? "s" : ""}
        </p>
      </div>

      {wishlistItems.length === 0 ? (
        <div className="text-center py-24 animate-fade-in">
          <div className="text-6xl mb-4 animate-float">♥</div>
          <h2 className="font-display text-3xl text-brand-muted mb-2">WISHLIST IS EMPTY</h2>
          <p className="text-brand-muted mb-6">Save products you love and find them here.</p>
          <Link to="/" className="btn-primary px-8 py-3 inline-block">
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {wishlistItems.map((item, index) => (
            <div
              key={item._id}
              className="card-dark overflow-hidden animate-fade-in-up"
              style={{ animationDelay: `${index * 0.08}s`, opacity: 0 }}
            >
              <Link to={`/product/${item._id}`} className="block relative">
                <img
                  src={item.images?.[0]}
                  alt={item.name}
                  className="w-full h-64 object-cover"
                />
                <div className="p-5">
                  <h2 className="text-white font-semibold truncate">{item.name}</h2>
                  <p className="text-brand-red font-bold text-xl mt-1">₹ {item.price}</p>
                </div>
              </Link>
              <div className="px-5 pb-5 flex gap-2">
                <button
                  onClick={() => openSizeModal(item)}
                  className="btn-primary flex-1 py-2 text-sm"
                >
                  Add to Cart
                </button>
                <button
                  onClick={() => handleRemove(item._id)}
                  className="px-3 py-2 rounded-lg border border-brand-red text-brand-red hover:bg-brand-red hover:text-white transition-all text-sm"
                  aria-label="Remove from wishlist"
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedProduct && (
        <SizeSelectorModal
          show={showSizePopup}
          onClose={() => {
            setShowSizePopup(false);
            setSelectedProduct(null);
          }}
          sizes={selectedProduct?.sizes}
          chooseSize={chooseSize}
          setChooseSize={setChooseSize}
          onConfirm={handleAddToCart}
        />
      )}
    </div>
  );
};

export default Wishlist;
