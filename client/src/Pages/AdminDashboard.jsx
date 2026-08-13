import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import API from "../Services/api";
import AdminLayout from "../Components/AdminLayout";
import FireLoader, { FireSkeleton } from "../Components/FireLoader";
import { Tag, Plus, Trash2, CheckCircle2, TrendingUp, DollarSign, ShoppingBag, Users, Layers, Award } from "lucide-react";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [products, setProducts] = useState([]);
  const [stats, setStats] = useState(null);
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);

  // New Coupon Form state
  const [couponCode, setCouponCode] = useState("");
  const [discountPercent, setDiscountPercent] = useState("");
  const [maxDiscount, setMaxDiscount] = useState("");
  const [minPurchase, setMinPurchase] = useState("");
  const [expDate, setExpDate] = useState("");
  const [creatingCoupon, setCreatingCoupon] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [productsRes, statsRes, couponsRes] = await Promise.allSettled([
        API.get("/products"),
        API.get("/admin/stats"),
        API.get("/coupons"),
      ]);
      if (productsRes.status === "fulfilled") setProducts(productsRes.value.data);
      if (statsRes.status === "fulfilled") setStats(statsRes.value.data);
      if (couponsRes.status === "fulfilled") setCoupons(couponsRes.value.data);
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

  const createCouponHandler = async (e) => {
    e.preventDefault();
    if (!couponCode.trim() || !discountPercent || !expDate) {
      return toast.warning("Code, Discount %, and Expiration Date are required");
    }
    try {
      setCreatingCoupon(true);
      const { data } = await API.post("/coupons", {
        code: couponCode.trim(),
        discountPercent: Number(discountPercent),
        maxDiscountAmount: Number(maxDiscount) || 0,
        minPurchase: Number(minPurchase) || 0,
        expirationDate: expDate,
      });
      toast.success(`Coupon '${data.code}' created!`);
      setCoupons([data, ...coupons]);
      setCouponCode("");
      setDiscountPercent("");
      setMaxDiscount("");
      setMinPurchase("");
      setExpDate("");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create coupon");
    } finally {
      setCreatingCoupon(false);
    }
  };

  const toggleCouponHandler = async (id) => {
    try {
      const { data } = await API.put(`/coupons/${id}/toggle`, {});
      setCoupons(coupons.map((c) => (c._id === id ? data : c)));
      toast.info(`Coupon ${data.isActive ? "activated" : "deactivated"}`);
    } catch {
      toast.error("Failed to update coupon");
    }
  };

  const deleteCouponHandler = async (id) => {
    if (!window.confirm("Delete this coupon code?")) return;
    try {
      await API.delete(`/coupons/${id}`);
      setCoupons(coupons.filter((c) => c._id !== id));
      toast.success("Coupon deleted");
    } catch {
      toast.error("Failed to delete coupon");
    }
  };

  const statCards = stats
    ? [
        { label: "Total Revenue", value: `₹${stats.revenue.toLocaleString()}`, icon: DollarSign, color: "text-green-400" },
        { label: "Total Orders", value: stats.orderCount, icon: ShoppingBag, color: "text-blue-400" },
        { label: "Total Products", value: stats.productCount, icon: Layers, color: "text-amber-400" },
        { label: "Total Users", value: stats.userCount, icon: Users, color: "text-purple-400" },
        { label: "Avg Order Value", value: `₹${(stats.avgOrderValue || 0).toLocaleString()}`, icon: TrendingUp, color: "text-brand-red" },
        { label: "Active Coupons", value: coupons.filter((c) => c.isActive).length, icon: Tag, color: "text-emerald-400" },
      ]
    : [];

  return (
    <AdminLayout title="ADMIN DASHBOARD" subtitle="Analytics, inventory control, and store promotions">
      {/* ── Navigation Tabs ── */}
      <div className="flex gap-3 mb-8 border-b border-brand-border pb-4 overflow-x-auto">
        <button
          onClick={() => setActiveTab("overview")}
          className={`px-5 py-2.5 rounded-lg text-sm font-bold tracking-wide transition-all ${
            activeTab === "overview"
              ? "bg-brand-red text-white shadow-[0_0_15px_rgba(229,9,20,0.4)]"
              : "card-dark text-brand-muted hover:text-white"
          }`}
        >
          Overview & Products
        </button>
        <button
          onClick={() => setActiveTab("analytics")}
          className={`px-5 py-2.5 rounded-lg text-sm font-bold tracking-wide transition-all ${
            activeTab === "analytics"
              ? "bg-brand-red text-white shadow-[0_0_15px_rgba(229,9,20,0.4)]"
              : "card-dark text-brand-muted hover:text-white"
          }`}
        >
          Analytics & Metrics
        </button>
        <button
          onClick={() => setActiveTab("coupons")}
          className={`px-5 py-2.5 rounded-lg text-sm font-bold tracking-wide transition-all flex items-center gap-2 ${
            activeTab === "coupons"
              ? "bg-brand-red text-white shadow-[0_0_15px_rgba(229,9,20,0.4)]"
              : "card-dark text-brand-muted hover:text-white"
          }`}
        >
          <Tag size={16} /> Promo Coupons ({coupons.length})
        </button>
      </div>

      {/* ── Metric Cards ── */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-10">
          {statCards.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="card-dark p-4 flex flex-col items-center justify-center text-center animate-fade-in-up"
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                <Icon size={20} className={`${stat.color} mb-1`} />
                <p className="text-brand-muted text-[11px] uppercase tracking-wider mb-1 font-medium">
                  {stat.label}
                </p>
                <p className={`font-display text-2xl text-white font-bold`}>{stat.value}</p>
              </div>
            );
          })}
        </div>
      )}

      {/* ── TAB 1: Products Overview ── */}
      {activeTab === "overview" && (
        <>
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-2xl text-white tracking-wide">PRODUCTS INVENTORY</h2>
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
                  style={{ animationDelay: `${index * 0.04}s` }}
                >
                  <img
                    src={item.images?.[0]}
                    alt={item.name}
                    className="w-16 h-16 rounded-lg object-cover border border-brand-border shrink-0"
                  />
                  <div className="flex-1 text-center sm:text-left min-w-0">
                    <h3 className="font-semibold text-white truncate">{item.name}</h3>
                    <p className="text-brand-muted text-sm">
                      {item.brand} · ₹{item.price} · Stock: {item.stock ?? 0} · ★ {item.rating?.toFixed(1) || "0.0"} ({item.numReviews || 0})
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
        </>
      )}

      {/* ── TAB 2: Analytics & Breakdown ── */}
      {activeTab === "analytics" && stats && (
        <div className="space-y-8 animate-fade-in">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Order Status Distribution */}
            <div className="card-dark p-6">
              <h3 className="font-display text-xl text-white mb-4">
                ORDER STATUS DISTRIBUTION
              </h3>
              <div className="space-y-3">
                {Object.entries(stats.statusCounts || {}).map(([st, count]) => (
                  <div key={st}>
                    <div className="flex justify-between text-xs text-brand-muted mb-1 font-medium">
                      <span className="text-white font-semibold">{st}</span>
                      <span>{count} orders</span>
                    </div>
                    <div className="w-full h-2 bg-brand-dark rounded-full overflow-hidden border border-brand-border">
                      <div
                        className="h-full bg-brand-red transition-all duration-500"
                        style={{
                          width: `${stats.orderCount > 0 ? (count / stats.orderCount) * 100 : 0}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Category Breakdown */}
            <div className="card-dark p-6">
              <h3 className="font-display text-xl text-white mb-4">
                PRODUCT CATEGORY DISTRIBUTION
              </h3>
              <div className="space-y-3">
                {(stats.categoryBreakdown || []).map((cat) => (
                  <div key={cat.category} className="flex items-center justify-between p-3 rounded-lg bg-brand-dark border border-brand-border">
                    <span className="text-white text-sm font-semibold uppercase">{cat.category}</span>
                    <span className="text-brand-red font-bold text-sm px-2.5 py-1 bg-brand-red/10 rounded-full border border-brand-red/30">
                      {cat.count} product{cat.count !== 1 ? "s" : ""}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Orders Stream */}
          <div className="card-dark p-6">
            <h3 className="font-display text-xl text-white mb-4">
              RECENT ORDERS STREAM
            </h3>
            <div className="space-y-3">
              {(stats.recentOrders || []).map((ord) => (
                <div key={ord._id} className="flex items-center justify-between p-3 rounded-lg bg-brand-dark border border-brand-border text-xs">
                  <div>
                    <p className="font-semibold text-white">#{ord._id.slice(-6).toUpperCase()} — {ord.user?.name || "Customer"}</p>
                    <p className="text-brand-muted">{new Date(ord.createdAt).toLocaleString("en-IN")}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-brand-red font-bold text-sm">₹{ord.totalPrice}</p>
                    <span className="text-[10px] text-green-400 font-semibold uppercase">{ord.status || "Placed"}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 3: Promo Coupons Manager ── */}
      {activeTab === "coupons" && (
        <div className="space-y-8 animate-fade-in">
          {/* Create Coupon Form */}
          <div className="card-dark p-6">
            <h3 className="font-display text-2xl text-white mb-4">
              CREATE NEW PROMO CODE
            </h3>
            <form onSubmit={createCouponHandler} className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs text-brand-muted uppercase mb-1">Coupon Code</label>
                <input
                  type="text"
                  placeholder="e.g. SAVE20"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  className="input-dark uppercase"
                  required
                />
              </div>
              <div>
                <label className="block text-xs text-brand-muted uppercase mb-1">Discount %</label>
                <input
                  type="number"
                  placeholder="e.g. 20"
                  min="1"
                  max="100"
                  value={discountPercent}
                  onChange={(e) => setDiscountPercent(e.target.value)}
                  className="input-dark"
                  required
                />
              </div>
              <div>
                <label className="block text-xs text-brand-muted uppercase mb-1">Max Discount Cap (₹)</label>
                <input
                  type="number"
                  placeholder="0 for unlimited"
                  value={maxDiscount}
                  onChange={(e) => setMaxDiscount(e.target.value)}
                  className="input-dark"
                />
              </div>
              <div>
                <label className="block text-xs text-brand-muted uppercase mb-1">Min Purchase (₹)</label>
                <input
                  type="number"
                  placeholder="0"
                  value={minPurchase}
                  onChange={(e) => setMinPurchase(e.target.value)}
                  className="input-dark"
                />
              </div>
              <div>
                <label className="block text-xs text-brand-muted uppercase mb-1">Expiration Date</label>
                <input
                  type="date"
                  value={expDate}
                  onChange={(e) => setExpDate(e.target.value)}
                  className="input-dark text-white"
                  required
                />
              </div>
              <div className="flex items-end">
                <button type="submit" disabled={creatingCoupon} className="btn-primary w-full py-3 text-sm flex items-center justify-center gap-2">
                  <Plus size={16} /> Create Promo Code
                </button>
              </div>
            </form>
          </div>

          {/* Active Coupons List */}
          <div className="card-dark p-6">
            <h3 className="font-display text-xl text-white mb-4">EXISTING PROMO CODES ({coupons.length})</h3>

            {coupons.length === 0 ? (
              <p className="text-brand-muted text-center py-8">No promo codes created yet.</p>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {coupons.map((coupon) => (
                  <div key={coupon._id} className="p-4 rounded-xl bg-brand-dark border border-brand-border flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-extrabold text-brand-red text-lg tracking-wider">{coupon.code}</span>
                        <span className={`text-[10px] px-2 py-0.5 rounded uppercase font-bold ${
                          coupon.isActive ? "bg-green-500/20 text-green-400 border border-green-500/30" : "bg-gray-500/20 text-gray-400"
                        }`}>
                          {coupon.isActive ? "Active" : "Inactive"}
                        </span>
                      </div>
                      <p className="text-white text-sm font-semibold mt-1">
                        {coupon.discountPercent}% OFF {coupon.maxDiscountAmount > 0 ? `(Max ₹${coupon.maxDiscountAmount})` : ""}
                      </p>
                      <p className="text-brand-muted text-xs">
                        Min spend: ₹{coupon.minPurchase} • Expires: {new Date(coupon.expirationDate).toLocaleDateString("en-IN")}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleCouponHandler(coupon._id)}
                        className="px-3 py-1.5 rounded-lg border border-brand-border text-xs text-brand-muted hover:text-white"
                      >
                        {coupon.isActive ? "Disable" : "Enable"}
                      </button>
                      <button
                        onClick={() => deleteCouponHandler(coupon._id)}
                        className="p-2 text-brand-muted hover:text-brand-red"
                        title="Delete coupon"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminDashboard;
