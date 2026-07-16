import { useState } from "react";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Heart } from "lucide-react";
import { addToCart } from "../Redux/cartSlice";
import { addToWishlist, removeFromWishlist } from "../Redux/wishlistSlice";
import SizeSelectorModal from "./SizeSelectorModel";

const ProductCard = ({ product }) => {
  const [showSizePopup, setShowSizePopup] = useState(false);
  const [chooseSize, setChooseSize] = useState("");
  const [imgLoaded, setImgLoaded] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const wishlistItems = useSelector((state) => state.wishlist.wishlistItems);
  const isWishlisted = wishlistItems.some((item) => item._id === product._id);

  const handleAddToCart = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.warning("Login Required..!");
      navigate("/login");
      return;
    }
    if (!chooseSize) {
      toast.warning("Please Select a Size");
      return;
    }
    dispatch(
      addToCart({
        ...product,
        chooseSize,
        quantity: 1,
      })
    );
    toast.success("Added to Cart");
    setShowSizePopup(false);
    setChooseSize("");
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isWishlisted) {
      dispatch(removeFromWishlist(product._id));
      toast.info("Removed from wishlist");
    } else {
      dispatch(addToWishlist(product));
      toast.success("Added to wishlist");
    }
  };

  return (
    <div className="card-dark overflow-hidden group">
      <Link to={`/product/${product._id}`} className="block relative">
        <div className="relative overflow-hidden bg-brand-dark">
          <button
            type="button"
            onClick={handleWishlist}
            className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-brand-black/60 backdrop-blur-sm flex items-center justify-center border border-brand-border hover:border-brand-red transition-all duration-300 hover:scale-110"
            aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          >
            <Heart
              size={18}
              className={`transition-all duration-300 ${
                isWishlisted ? "fill-brand-red text-brand-red" : "text-white"
              }`}
            />
          </button>

          {!imgLoaded && (
            <div className="absolute inset-0 animate-shimmer bg-brand-border/30" />
          )}
          <img
            src={product.images?.[0]}
            alt={product.name}
            onLoad={() => setImgLoaded(true)}
            className={`w-full h-72 object-cover transition-all duration-500 group-hover:scale-110 ${
              imgLoaded ? "opacity-100" : "opacity-0"
            }`}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <span className="text-white text-sm font-medium tracking-wide">
              View Details →
            </span>
          </div>
        </div>

        <div className="p-5">
          <h2 className="text-white text-lg font-semibold truncate group-hover:text-brand-red transition-colors duration-300">
            {product.name}
          </h2>
          <p className="text-brand-red font-bold text-xl mt-1">₹ {product.price}</p>
        </div>
      </Link>

      <div className="px-5 pb-5">
        <button
          onClick={(e) => {
            e.preventDefault();
            setShowSizePopup(true);
          }}
          className="btn-primary w-full py-2.5 text-sm"
        >
          Add to Cart
        </button>
        <SizeSelectorModal
          show={showSizePopup}
          onClose={() => setShowSizePopup(false)}
          sizes={product?.sizes}
          chooseSize={chooseSize}
          setChooseSize={setChooseSize}
          onConfirm={handleAddToCart}
        />
      </div>
    </div>
  );
};

export default ProductCard;
