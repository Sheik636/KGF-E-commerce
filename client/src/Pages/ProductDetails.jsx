import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import API from "../Services/api";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../Redux/cartSlice";
import { addToWishlist, removeFromWishlist } from "../Redux/wishlistSlice";
import FireLoader from "../Components/FireLoader";
import SizeSelectorModal from "../Components/SizeSelectorModel";

const ProductDetails = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [selectedImage, setSelectedImage] = useState("");
  const [name, setName] = useState("");
  const [product, setProduct] = useState(null);
  const [chooseSize, setChooseSize] = useState("");
  const [showSizePopup, setShowSizePopup] = useState(false);

  const wishlistItems = useSelector((state) => state.wishlist.wishlistItems);
  const isWishlisted = product
    ? wishlistItems.some((item) => item._id === product._id)
    : false;

  const { id } = useParams();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await API.get(`/products/${id}`);
        setProduct(data);
        setSelectedImage(data.images?.[0]);
        setName(data.name);
      } catch {
        toast.error("Product not found");
      }
    };
    fetchProducts();
  }, [id]);

  if (!product) {
    return (
      <FireLoader fullScreen size="lg" text="Loading product..." />
    );
  }

  const handleAddToCart = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.warning("Login Required");
      navigate("/login");
      return;
    }
    if (!chooseSize) {
      return toast.warning("Please Select a Size");
    }
    dispatch(addToCart({ ...product, chooseSize, quantity: 1 }));
    toast.success("Added to cart");
    navigate("/cart");
  };

  const buyNow = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.warning("Login Required");
      navigate("/login");
      return;
    }
    setShowSizePopup(true);
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

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <div className="grid md:grid-cols-2 gap-12">
        <div className="animate-slide-in-left">
          <div className="card-dark overflow-hidden p-2 relative">
            <button
              type="button"
              onClick={handleWishlist}
              className="absolute top-5 right-5 z-10 w-10 h-10 rounded-full bg-brand-black/70 backdrop-blur-sm flex items-center justify-center border border-brand-border hover:border-brand-red transition-all hover:scale-110"
              aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
            >
              <Heart
                size={20}
                className={`transition-all duration-300 ${
                  isWishlisted ? "fill-brand-red text-brand-red" : "text-white"
                }`}
              />
            </button>
            <img
              src={selectedImage}
              alt={name}
              className="w-full h-[500px] object-cover rounded-xl transition-all duration-500"
            />
          </div>
          <div className="flex gap-3 mt-4 flex-wrap">
            {product?.images?.map((img, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(img)}
                className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-300 hover:scale-105 ${
                  selectedImage === img
                    ? "border-brand-red shadow-[0_0_15px_rgba(229,9,20,0.4)]"
                    : "border-brand-border opacity-70 hover:opacity-100"
                }`}
              >
                <img src={img} alt="thumbnail" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        <div className="animate-slide-in-right flex flex-col justify-center">
          <p className="text-brand-red uppercase tracking-widest text-sm font-semibold mb-2">
            {product.brand}
          </p>
          <h1 className="font-display text-5xl md:text-6xl text-white mb-4 leading-tight">
            {product?.name}
          </h1>
          <div className="w-20 h-0.5 bg-brand-red mb-6" />
          <h2 className="text-4xl font-bold text-brand-red mb-6">
            ₹ {product.price}
            <span className="text-brand-muted text-lg font-normal"> /-</span>
          </h2>

          <p
            className={`inline-flex items-center gap-2 text-sm font-semibold mb-8 px-3 py-1.5 rounded-full w-fit ${
              product.stock > 0
                ? "bg-green-500/10 text-green-400 border border-green-500/30"
                : "bg-red-500/10 text-red-400 border border-red-500/30"
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                product.stock > 0 ? "bg-green-400" : "bg-red-400"
              }`}
            />
            {product.stock > 0 ? "In Stock" : "Out Of Stock"}
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => setShowSizePopup(true)}
              className="btn-primary flex-1 py-3.5 text-base"
            >
              Add to Cart
            </button>
            <button onClick={buyNow} className="btn-outline flex-1 py-3.5 text-base">
              Buy Now
            </button>
          </div>

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
    </div>
  );
};

export default ProductDetails;
