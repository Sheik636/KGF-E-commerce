import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import API from "../Services/api";
import AdminLayout from "../Components/AdminLayout";
import FireLoader from "../Components/FireLoader";
import ImageCropper from "../Components/ImageCropper";
import { Tag } from "lucide-react";

const SIZE_OPTIONS = ["S", "M", "L", "XL", "2XL", "3XL", "4XL"];

const PRESET_CATEGORIES = [
  { name: "T-Shirt", icon: "👕" },
  { name: "Trackpant", icon: "👖" },
  { name: "Hoodies", icon: "🧥" },
  { name: "Jackets", icon: "🧥" },
  { name: "Shoes", icon: "👟" },
];

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [brand, setBrand] = useState("");
  const [catogery, setCatogery] = useState("T-Shirt");
  const [isCustomCategory, setIsCustomCategory] = useState(false);
  const [sizes, setSizes] = useState([]);
  const [stock, setStock] = useState("");
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await API.get(`/products/${id}`);
        setName(data.name);
        setPrice(data.price);
        setBrand(data.brand || "");
        const loadedCat = data.catogery || "T-Shirt";
        setCatogery(loadedCat);
        if (!PRESET_CATEGORIES.some((c) => c.name === loadedCat)) {
          setIsCustomCategory(true);
        }
        setSizes(data.sizes || []);
        setStock(data.stock ?? 0);
        setImages(data.images || []);
      } catch {
        toast.error("Product not found");
        navigate("/admin");
      } finally {
        setFetching(false);
      }
    };
    fetchProduct();
  }, [id, navigate]);

  const updateHandler = async (e) => {
    e.preventDefault();
    if (!catogery.trim()) {
      return toast.warning("Please select or enter a category");
    }
    try {
      setLoading(true);
      await API.put(`/products/${id}`, {
        name,
        price: Number(price),
        brand,
        catogery,
        sizes,
        stock: Number(stock),
        images,
      });
      toast.success("Product updated");
      navigate("/admin");
    } catch (error) {
      toast.error(error.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <AdminLayout title="EDIT PRODUCT">
        <FireLoader fullScreen size="lg" text="Loading product..." />
      </AdminLayout>
    );
  }

  const toggleSize = (size) => {
    setSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  const fields = [
    { label: "Product Name", value: name, setter: setName },
    { label: "Price (₹)", value: price, setter: setPrice, type: "number" },
    { label: "Brand", value: brand, setter: setBrand },
    { label: "Stock", value: stock, setter: setStock, type: "number" },
  ];

  return (
    <AdminLayout title="EDIT PRODUCT" subtitle={`Editing: ${name}`}>
      <form onSubmit={updateHandler} className="max-w-2xl space-y-5 animate-fade-in-up">
        {fields.map((field) => (
          <div key={field.label}>
            <label className="block text-sm text-brand-muted mb-1.5">{field.label}</label>
            <input
              type={field.type || "text"}
              value={field.value}
              className="input-dark"
              onChange={(e) => field.setter(e.target.value)}
              required
            />
          </div>
        ))}

        {/* ── Product Category Selection Chips ── */}
        <div>
          <label className="block text-sm text-brand-muted mb-2 font-medium">
            Product Category
          </label>
          <div className="flex flex-wrap gap-2.5 mb-2">
            {PRESET_CATEGORIES.map((cat) => {
              const isSelected = catogery === cat.name && !isCustomCategory;
              return (
                <button
                  key={cat.name}
                  type="button"
                  onClick={() => {
                    setCatogery(cat.name);
                    setIsCustomCategory(false);
                  }}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 border transition-all duration-300 ${
                    isSelected
                      ? "bg-brand-red border-brand-red text-white shadow-[0_0_15px_rgba(229,9,20,0.4)] scale-105"
                      : "bg-brand-dark border-brand-border text-brand-muted hover:border-brand-red/50 hover:text-white"
                  }`}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.name}</span>
                </button>
              );
            })}

            <button
              type="button"
              onClick={() => {
                setIsCustomCategory(true);
                if (PRESET_CATEGORIES.some((c) => c.name === catogery)) {
                  setCatogery("");
                }
              }}
              className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 border transition-all duration-300 ${
                isCustomCategory
                  ? "bg-brand-red border-brand-red text-white shadow-[0_0_15px_rgba(229,9,20,0.4)] scale-105"
                  : "bg-brand-dark border-brand-border text-brand-muted hover:border-brand-red/50 hover:text-white"
              }`}
            >
              <span>✏️</span>
              <span>Custom Category</span>
            </button>
          </div>

          {/* Custom Category Text Input */}
          {isCustomCategory && (
            <div className="relative animate-fade-in-up mt-3">
              <input
                type="text"
                placeholder="Enter custom category name (e.g. Shorts, Accessories)..."
                value={catogery}
                onChange={(e) => setCatogery(e.target.value)}
                className="input-dark pl-10"
                required
              />
              <Tag size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-red" />
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm text-brand-muted mb-2">Sizes</label>
          <div className="flex flex-wrap gap-2">
            {SIZE_OPTIONS.map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => toggleSize(size)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold border transition-all duration-300 ${
                  sizes.includes(size)
                    ? "bg-brand-red border-brand-red text-white shadow-[0_0_15px_rgba(229,9,20,0.3)]"
                    : "border-brand-border text-brand-muted hover:border-brand-red hover:text-white bg-brand-dark"
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm text-brand-muted mb-2">Product Images</label>
          {images.length > 0 && (
            <div className="flex gap-3 flex-wrap mb-4">
              {images.map((img, index) => (
                <div key={index} className="relative group">
                  <img
                    src={img}
                    alt="Preview"
                    className="w-24 h-24 object-cover rounded-lg border border-brand-border"
                  />
                  <button
                    type="button"
                    onClick={() => setImages(images.filter((_, i) => i !== index))}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-brand-red text-white rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
          <ImageCropper setImages={setImages} />
        </div>

        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={loading} className="btn-primary flex-1 py-3">
            {loading ? "Saving..." : "Save Changes"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/admin")}
            className="btn-outline px-6 py-3"
          >
            Cancel
          </button>
        </div>
      </form>
    </AdminLayout>
  );
};

export default EditProduct;
