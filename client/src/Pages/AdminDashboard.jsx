import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import API from "../Services/api";
import AdminLayout from "../Components/AdminLayout";
import FireLoader, { FireSkeleton } from "../Components/FireLoader";

const AdminDashboard = () => {
  const [products, setProducts] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [productsRes, statsRes] = await Promise.all([
        API.get("/products"),
        API.get("/admin/stats"),
      ]);
      setProducts(productsRes.data);
      setStats(statsRes.data);
    } catch {
      toast.error("Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const deleteHandler = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      await API.delete(`/products/${id}`);
      toast.success("Product deleted");
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Delete failed");
    }
  };

  const statCards = stats
    ? [
        { label: "Products", value: stats.productCount },
        { label: "Orders", value: stats.orderCount },
        { label: "Users", value: stats.userCount },
        { label: "Revenue", value: `₹${stats.revenue.toLocaleString()}` },
      ]
    : [];

  return (
    <AdminLayout title="DASHBOARD" subtitle="Manage your store inventory and overview">
      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {statCards.map((stat, i) => (
            <div
              key={stat.label}
              className="card-dark p-5 text-center animate-fade-in-up"
              style={{ animationDelay: `${i * 0.08}s`, opacity: 0 }}
            >
              <p className="text-brand-muted text-xs uppercase tracking-widest mb-1">
                {stat.label}
              </p>
              <p className="font-display text-3xl text-brand-red">{stat.value}</p>
            </div>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-2xl text-white tracking-wide">PRODUCTS</h2>
        <Link to="/admin/create" className="btn-primary px-5 py-2 text-sm">
          + Add Product
        </Link>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <FireSkeleton key={i} className="h-20" style={{ animationDelay: `${i * 0.1}s` }} />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-16 card-dark">
          <p className="font-display text-3xl text-brand-muted mb-2">NO PRODUCTS</p>
          <p className="text-brand-muted mb-4">Create your first product to get started.</p>
          <Link to="/admin/create" className="btn-primary px-6 py-2.5 inline-block text-sm">
            Create Product
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {products.map((item, index) => (
            <div
              key={item._id}
              className="card-dark p-4 flex flex-col sm:flex-row items-center gap-4 animate-fade-in-up"
              style={{ animationDelay: `${index * 0.05}s`, opacity: 0 }}
            >
              <img
                src={item.images?.[0]}
                alt={item.name}
                className="w-16 h-16 rounded-lg object-cover border border-brand-border shrink-0"
              />
              <div className="flex-1 text-center sm:text-left min-w-0">
                <h3 className="font-semibold text-white truncate">{item.name}</h3>
                <p className="text-brand-muted text-sm">
                  {item.brand} · ₹{item.price} · Stock: {item.stock ?? 0}
                </p>
              </div>
              <div className="flex gap-2 shrink-0">
                <Link
                  to={`/admin/edit/${item._id}`}
                  className="btn-outline px-4 py-2 text-sm"
                >
                  Edit
                </Link>
                <button
                  onClick={() => deleteHandler(item._id)}
                  className="px-4 py-2 text-sm rounded-lg border border-brand-red text-brand-red hover:bg-brand-red hover:text-white transition-all duration-300"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminDashboard;
