import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { Heart, Trash2, ShoppingBag } from "lucide-react";
import {
  removeFromWishlist,
  fetchWishlist,
  syncRemoveFromWishlist,
} from "../Redux/wishlistSlice";
import { addToCart } from "../Redux/cartSlice";
import SizeSelectorModal from "../Components/SizeSelectorModel";

const Wishlist = () => {
  const wishlistItems = useSelector((state) => state.wishlist.wishlistItems);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "KGF Store — My Wishlist";
    const token = localStorage.getItem("token");
    if (token) {
      dispatch(fetchWishlist());
    }
  }, [dispatch]);

  const [showSizePopup, setShowSizePopup] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [chooseSize, setChooseSize] = useState("");

  const handleRemove = (id) => {
    dispatch(syncRemoveFromWishlist(id));
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
        <h1 className="font-display text-5xl text-white tracking-wide">
          WISHLIST
        </h1>
        <div className="w-16 h-0.5 bg-brand-red mt-2" />
        <p className="text-brand-muted mt-2">
          {wishlistItems.length} saved item{wishlistItems.length !== 1 ? "s" : ""}
        </p>
      </div>

      {wishlistItems.length === 0 ? (
        <div className="text-center py-24 card-dark animate-fade-in">
          <div className="w-16 h-16 rounded-full bg-brand-red/10 text-brand-red flex items-center justify-center mx-auto mb-4 animate-float">
            <Heart size={32} />
          </div>
          <h2 className="font-display text-3xl text-brand-muted mb-2">
            WISHLIST IS EMPTY
          </h2>
          <p className="text-brand-muted mb-6">
            Save items you love by tapping the heart icon on any product.
          </p>
          <Link to="/" className="btn-primary px-8 py-3 inline-block">
            Browse Catalog
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {wishlistItems.map((item, index) => (
            <div
              key={item._id}
              className="card-dark overflow-hidden group animate-fade-in-up flex flex-col justify-between"
              style={{ animationDelay: `${index * 0.06}s` }}
            >
              <div>
                <Link to={`/product/${item._id}`} className="block relative">
                  <img
                    src={item.images?.[0]}
                    alt={item.name}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="p-5">
                    <p className="text-brand-red text-xs uppercase font-semibold tracking-wider mb-1">
                      {item.brand}
                    </p>
                    <h2 className="text-white font-semibold truncate group-hover:text-brand-red transition-colors">
                      {item.name}
                    </h2>
                    <p className="text-brand-red font-bold text-xl mt-1">
                      ₹ {item.price?.toLocaleString()}
                    </p>
                  </div>
                </Link>
              </div>

              <div className="px-5 pb-5 flex gap-2">
                <button
                  onClick={() => openSizeModal(item)}
                  className="btn-primary flex-1 py-2.5 text-sm flex items-center justify-center gap-2"
                >
                  <ShoppingBag size={16} />
                  Add to Cart
                </button>
                <button
                  onClick={() => handleRemove(item._id)}
                  className="p-2.5 rounded-lg border border-brand-border text-brand-muted hover:border-brand-red hover:text-brand-red transition-all"
                  title="Remove from wishlist"
                  aria-label="Remove from wishlist"
                >
                  <Trash2 size={16} />
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
