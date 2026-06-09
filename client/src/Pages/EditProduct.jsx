import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import API from "../Services/api";
import AdminLayout from "../Components/AdminLayout";
import ImageCropper from "../Components/ImageCropper";

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [brand, setBrand] = useState("");
  const [sizes, setSizes] = useState("");
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
        setSizes((data.sizes || []).join(", "));
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
    try {
      setLoading(true);
      await API.put(`/products/${id}`, {
        name,
        price: Number(price),
        brand,
        sizes: sizes.split(",").map((s) => s.trim()).filter(Boolean),
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
        <div className="flex justify-center py-20">
          <div className="w-10 h-10 border-2 border-brand-red border-t-transparent rounded-full animate-spin" />
        </div>
      </AdminLayout>
    );
  }

  const fields = [
    { label: "Product Name", value: name, setter: setName },
    { label: "Price (₹)", value: price, setter: setPrice, type: "number" },
    { label: "Brand", value: brand, setter: setBrand },
    { label: "Sizes (comma separated)", value: sizes, setter: setSizes },
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
