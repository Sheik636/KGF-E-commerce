import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import API from "../Services/api";
import AdminLayout from "../Components/AdminLayout";
import ImageCropper from "../Components/ImageCropper";

const SIZE_OPTIONS = ["S", "M", "L", "XL", "2XL", "3XL", "4XL", "5XL"];

const CreateProduct = () => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [brand, setBrand] = useState("");
  const [sizes, setSizes] = useState([]);
  const [stock, setStock] = useState("");
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await API.post("/products", {
        name,
        price: Number(price),
        brand,
        sizes,
        stock: Number(stock) || 0,
        images,
      });
      toast.success("Product created");
      navigate("/admin");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create product");
    } finally {
      setLoading(false);
    }
  };

  const toggleSize = (size) => {
    setSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  const fields = [
    { label: "Product Name", value: name, setter: setName, placeholder: "Classic Polo Tee" },
    { label: "Price (₹)", value: price, setter: setPrice, placeholder: "999", type: "number" },
    { label: "Brand", value: brand, setter: setBrand, placeholder: "Polo" },
    { label: "Stock", value: stock, setter: setStock, placeholder: "50", type: "number" },
  ];

  return (
    <AdminLayout title="CREATE PRODUCT" subtitle="Add a new item to your catalog">
      <form onSubmit={submitHandler} className="max-w-2xl space-y-5 animate-fade-in-up">
        {fields.map((field, i) => (
          <div key={field.label} style={{ animationDelay: `${i * 0.06}s` }}>
            <label className="block text-sm text-brand-muted mb-1.5">{field.label}</label>
            <input
              type={field.type || "text"}
              placeholder={field.placeholder}
              value={field.value}
              className="input-dark"
              onChange={(e) => field.setter(e.target.value)}
              required={field.label !== "Stock"}
            />
          </div>
        ))}

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
            {loading ? "Creating..." : "Create Product"}
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

export default CreateProduct;
