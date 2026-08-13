import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Heart, Minus, Plus, ShoppingCart, Zap, Package, Shield, Truck, ChevronLeft, ChevronRight } from "lucide-react";
import API from "../Services/api";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../Redux/cartSlice";
import { addToWishlist, removeFromWishlist } from "../Redux/wishlistSlice";
import FireLoader from "../Components/FireLoader";

const ProductDetails = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [selectedImage, setSelectedImage] = useState("");
  const [product, setProduct] = useState(null);
  const [chooseSize, setChooseSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [lightbox, setLightbox] = useState(false);

  const wishlistItems = useSelector((state) => state.wishlist.wishlistItems);
  const isWishlisted = product
    ? wishlistItems.some((item) => item._id === product._id)
    : false;

  const { id } = useParams();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await API.get(`/products/${id}`);
        setProduct(data);
        setSelectedImage(data.images?.[0]);
        document.title = `${data.name || "Product"} — KGF Store`;
      } catch {
        toast.error("Product not found");
      }
    };
    fetchProduct();
    // Reset state when product changes
    setChooseSize("");
    setQuantity(1);
    setImgLoaded(false);
  }, [id]);

  if (!product) {
    return <FireLoader fullScreen size="lg" text="Loading product..." />;
  }

  const inStock = product.stock > 0;

  const handleAddToCart = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.warning("Login Required");
      navigate("/login");
      return;
    }
    if (!chooseSize) {
      return toast.warning("Please select a size");
    }
    dispatch(addToCart({ ...product, chooseSize, quantity }));
    toast.success("Added to cart");
  };

  const buyNow = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.warning("Login Required");
      navigate("/login");
      return;
    }
    if (!chooseSize) {
      return toast.warning("Please select a size");
    }
    dispatch(addToCart({ ...product, chooseSize, quantity }));
    navigate("/checkout");
  };

  const handleWishlist = () => {
    if (isWishlisted) {
      dispatch(removeFromWishlist(product._id));
      toast.info("Removed from wishlist");
    } else {
      dispatch(addToWishlist(product));
      toast.success("Added to wishlist");
    }
  };

  const decreaseQty = () => {
    if (quantity > 1) setQuantity((q) => q - 1);
  };

  const increaseQty = () => {
    if (quantity < (product.stock || 10)) setQuantity((q) => q + 1);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <div className="grid md:grid-cols-2 gap-12">
        {/* ── Image Gallery ── */}
        <div className="animate-slide-in-left">
          <div className="card-dark overflow-hidden p-2 relative group">
            <button
              type="button"
              onClick={handleWishlist}
              className="absolute top-5 right-5 z-10 w-10 h-10 rounded-full bg-brand-black/70 backdrop-blur-sm flex items-center justify-center border border-brand-border hover:border-brand-red transition-all duration-300 hover:scale-110"
              aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
            >
              <Heart
                size={20}
                className={`transition-all duration-300 ${
                  isWishlisted ? "fill-brand-red text-brand-red" : "text-white"
                }`}
              />
            </button>

            {!imgLoaded && (
              <div className="absolute inset-0 animate-shimmer bg-brand-border/30 rounded-xl" />
            )}
            <img
              src={selectedImage}
              alt={product.name}
              onLoad={() => setImgLoaded(true)}
              onClick={() => setLightbox(true)}
              className={`w-full h-[500px] object-cover rounded-xl transition-all duration-700 cursor-zoom-in group-hover:scale-105 ${
                imgLoaded ? "opacity-100" : "opacity-0"
              }`}
            />
          </div>

          {product.images?.length > 1 && (
            <div className="flex gap-3 mt-4 flex-wrap">
              {product.images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setSelectedImage(img);
                    setImgLoaded(false);
                  }}
                  className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-300 hover:scale-105 ${
                    selectedImage === img
                      ? "border-brand-red shadow-[0_0_15px_rgba(229,9,20,0.4)]"
                      : "border-brand-border opacity-70 hover:opacity-100"
                  }`}
                >
                  <img src={img} alt={`${product.name} view ${index + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ── Product Info ── */}
        <div className="animate-slide-in-right flex flex-col">
          {/* Brand */}
          <p className="text-brand-red uppercase tracking-widest text-sm font-semibold mb-2">
            {product.brand}
          </p>

          {/* Name */}
          <h1 className="font-display text-5xl md:text-6xl text-white mb-4 leading-tight">
            {product.name}
          </h1>
          <div className="w-20 h-0.5 bg-brand-red mb-6" />

          {/* Price */}
          <h2 className="text-4xl font-bold text-brand-red mb-4">
            ₹ {product.price?.toLocaleString()}
            <span className="text-brand-muted text-lg font-normal"> /-</span>
          </h2>

          {/* Stock Badge */}
          <p
            className={`inline-flex items-center gap-2 text-sm font-semibold mb-6 px-3 py-1.5 rounded-full w-fit ${
              inStock
                ? "bg-green-500/10 text-green-400 border border-green-500/30"
                : "bg-red-500/10 text-red-400 border border-red-500/30"
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                inStock ? "bg-green-400 animate-pulse" : "bg-red-400"
              }`}
            />
            {inStock ? `In Stock (${product.stock} left)` : "Out Of Stock"}
          </p>

          {/* Description */}
          {product.description && (
            <div className="mb-6">
              <h3 className="text-sm text-brand-muted uppercase tracking-widest mb-2">Description</h3>
              <p className="text-[#ccc] leading-relaxed">{product.description}</p>
            </div>
          )}

          {/* ── Size Selector ── */}
          {product.sizes?.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm text-brand-muted uppercase tracking-widest mb-3">
                Select Size
              </h3>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setChooseSize(size)}
                    disabled={!inStock}
                    className={`w-12 h-12 rounded-lg border font-semibold text-sm transition-all duration-300 hover:scale-105 disabled:opacity-40 disabled:cursor-not-allowed ${
                      chooseSize === size
                        ? "bg-brand-red border-brand-red text-white shadow-[0_0_20px_rgba(229,9,20,0.4)]"
                        : "bg-brand-dark border-brand-border text-brand-muted hover:border-brand-red hover:text-white"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ── Quantity Selector ── */}
          <div className="mb-8">
            <h3 className="text-sm text-brand-muted uppercase tracking-widest mb-3">
              Quantity
            </h3>
            <div className="inline-flex items-center border border-brand-border rounded-lg overflow-hidden">
              <button
                onClick={decreaseQty}
                disabled={!inStock || quantity <= 1}
                className="w-11 h-11 flex items-center justify-center text-brand-muted hover:text-white hover:bg-brand-card transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                aria-label="Decrease quantity"
              >
                <Minus size={16} />
              </button>
              <span className="w-14 h-11 flex items-center justify-center text-white font-semibold text-base border-x border-brand-border bg-brand-dark">
                {quantity}
              </span>
              <button
                onClick={increaseQty}
                disabled={!inStock || quantity >= product.stock}
                className="w-11 h-11 flex items-center justify-center text-brand-muted hover:text-white hover:bg-brand-card transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                aria-label="Increase quantity"
              >
                <Plus size={16} />
              </button>
            </div>
          </div>

          {/* ── Action Buttons ── */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <button
              onClick={handleAddToCart}
              disabled={!inStock}
              className="btn-primary flex-1 py-3.5 text-base flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:transform-none disabled:hover:shadow-none"
            >
              <ShoppingCart size={18} />
              Add to Cart
            </button>
            <button
              onClick={buyNow}
              disabled={!inStock}
              className="btn-outline flex-1 py-3.5 text-base flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Zap size={18} />
              Buy Now
            </button>
          </div>

          {/* ── Trust Badges ── */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { icon: Truck, label: "Free Shipping" },
              { icon: Shield, label: "Secure Payment" },
              { icon: Package, label: "Easy Returns" },
            ].map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex flex-col items-center gap-2 py-3 rounded-lg bg-brand-dark border border-brand-border text-center"
              >
                <Icon size={18} className="text-brand-red" />
                <span className="text-brand-muted text-xs">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Customer Reviews & Ratings Section ── */}
      <div className="mt-16 pt-10 border-t border-brand-border animate-fade-in">
        <h2 className="font-display text-3xl text-white mb-6">
          CUSTOMER REVIEWS & RATINGS
        </h2>

        <div className="grid md:grid-cols-3 gap-8 mb-10">
          {/* Rating Summary Card */}
          <div className="card-dark p-6 flex flex-col items-center justify-center text-center">
            <h3 className="text-5xl font-extrabold text-white mb-2">
              {product.rating ? product.rating.toFixed(1) : "0.0"}
            </h3>
            <div className="flex gap-1 mb-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={20}
                  className={
                    star <= Math.round(product.rating || 0)
                      ? "fill-amber-400 text-amber-400"
                      : "text-brand-border"
                  }
                />
              ))}
            </div>
            <p className="text-brand-muted text-sm">
              Based on {product.numReviews || 0} customer review
              {product.numReviews !== 1 ? "s" : ""}
            </p>
          </div>

          {/* Review Submission Form */}
          <div className="md:col-span-2 card-dark p-6">
            <h3 className="text-xl font-bold text-white mb-4">
              Write a Product Review
            </h3>
            <ReviewForm productId={product._id} onReviewAdded={() => {
              API.get(`/products/${id}`).then(({ data }) => setProduct(data));
            }} />
          </div>
        </div>

        {/* Reviews List */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-white mb-4">
            Recent Feedback ({product.reviews?.length || 0})
          </h3>

          {product.reviews?.length === 0 ? (
            <div className="card-dark p-8 text-center text-brand-muted">
              No reviews yet. Be the first to share your experience!
            </div>
          ) : (
            product.reviews?.map((rev) => (
              <div key={rev._id || rev.createdAt} className="card-dark p-5">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-brand-red/20 border border-brand-red/40 text-brand-red flex items-center justify-center font-bold uppercase">
                      {rev.name?.charAt(0) || "U"}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-white font-semibold">{rev.name}</h4>
                        <span className="text-[10px] bg-green-500/20 text-green-400 px-2 py-0.5 rounded border border-green-500/30">
                          Verified Buyer
                        </span>
                      </div>
                      <span className="text-brand-muted text-xs">
                        {rev.createdAt
                          ? new Date(rev.createdAt).toLocaleDateString("en-IN", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })
                          : "Recently"}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        size={14}
                        className={
                          star <= rev.rating
                            ? "fill-amber-400 text-amber-400"
                            : "text-brand-border"
                        }
                      />
                    ))}
                  </div>
                </div>
                <p className="text-[#ccc] text-sm mt-3">{rev.comment}</p>
              </div>
            ))
          )}
        </div>
      </div>

      {/* ── Image Lightbox (portaled to body to escape stacking context) ── */}
      {lightbox && createPortal(
        <div
          className="fixed inset-0 flex items-center justify-center bg-black/90 backdrop-blur-sm animate-fade-in"
          style={{ zIndex: 9999 }}
          onClick={() => setLightbox(false)}
          onKeyDown={(e) => e.key === "Escape" && setLightbox(false)}
          role="dialog"
          aria-label="Image preview"
          tabIndex={0}
          ref={(el) => el?.focus()}
        >
          <button
            onClick={() => setLightbox(false)}
            className="absolute top-6 right-6 w-10 h-10 rounded-full bg-brand-card border border-brand-border flex items-center justify-center text-white hover:border-brand-red hover:text-brand-red transition-all duration-300 hover:scale-110 z-10"
            aria-label="Close preview"
          >
            ✕
          </button>

          {/* Prev / Next arrows for multiple images */}
          {product.images?.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  const idx = product.images.indexOf(selectedImage);
                  const prev = idx > 0 ? idx - 1 : product.images.length - 1;
                  setSelectedImage(product.images[prev]);
                }}
                className="absolute left-4 md:left-8 w-10 h-10 rounded-full bg-brand-card/80 border border-brand-border flex items-center justify-center text-white hover:border-brand-red transition-all hover:scale-110 z-10"
                aria-label="Previous image"
              >
                <ChevronLeft size={22} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  const idx = product.images.indexOf(selectedImage);
                  const next = idx < product.images.length - 1 ? idx + 1 : 0;
                  setSelectedImage(product.images[next]);
                }}
                className="absolute right-4 md:right-8 w-10 h-10 rounded-full bg-brand-card/80 border border-brand-border flex items-center justify-center text-white hover:border-brand-red transition-all hover:scale-110 z-10"
                aria-label="Next image"
              >
                <ChevronRight size={22} />
              </button>
            </>
          )}

          <img
            src={selectedImage}
            alt={product.name}
            onClick={(e) => e.stopPropagation()}
            className="max-w-[90vw] max-h-[90vh] object-contain rounded-xl animate-scale-in"
          />
        </div>,
        document.body
      )}
    </div>
  );
};

// Inline helper component for submitting reviews
const ReviewForm = ({ productId, onReviewAdded }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
      toast.warning("Login required to submit review");
      return navigate("/login");
    }
    if (!comment.trim()) {
      return toast.warning("Please write a comment");
    }
    try {
      setSubmitting(true);
      await API.post(`/products/${productId}/reviews`, { rating, comment });
      toast.success("Review submitted!");
      setComment("");
      setRating(5);
      if (onReviewAdded) onReviewAdded();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-brand-muted text-xs uppercase tracking-wider mb-2">
          Your Rating
        </label>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              type="button"
              key={star}
              onClick={() => setRating(star)}
              className="p-1 hover:scale-125 transition-transform"
            >
              <Star
                size={24}
                className={
                  star <= rating
                    ? "fill-amber-400 text-amber-400"
                    : "text-brand-border"
                }
              />
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-brand-muted text-xs uppercase tracking-wider mb-2">
          Your Review Comment
        </label>
        <textarea
          rows={3}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Share details of your experience with this item..."
          className="w-full bg-brand-dark border border-brand-border rounded-lg p-3 text-white focus:border-brand-red focus:outline-none transition-colors text-sm"
        />
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="btn-primary py-2.5 px-6 text-sm flex items-center gap-2"
      >
        {submitting ? "Submitting..." : "Submit Review"}
      </button>
    </form>
  );
};

export default ProductDetails;
