import { useState, useEffect, useContext, useMemo } from "react";
import { toast } from "react-toastify";
import API from "../Services/api";
import ProductCard from "../Components/ProductCard";
import SearchSideBar from "../Components/SearchSideBar";
import { FireSkeletonGrid } from "../Components/FireLoader";
import { SearchContext } from "../context/SearchContext";
import {
  ArrowDown,
  PackageSearch,
  ShieldCheck,
  Award,
  HeartHandshake,
  Truck,
  Sparkles,
  Star,
  CheckCircle2,
} from "lucide-react";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const {
    setIsOpen,
    keyword,
    setKeyword,
    brand,
    setBrand,
    category,
    setCategory,
    sort,
    setSort,
  } = useContext(SearchContext);

  const CATEGORY_TABS = [
    { label: "All Items", value: "" },
    { label: "👕 T-Shirts", value: "T-Shirt" },
    { label: "👖 Trackpants", value: "Trackpant" },
    { label: "🧥 Hoodies", value: "Hoodie" },
    { label: "🧥 Jackets", value: "Jacket" },
    { label: "👟 Footwear", value: "Shoes" },
  ];

  useEffect(() => {
    document.title = "KGF Store — Wear The Power";
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const { data } = await API.get(
          `/products?keyword=${keyword}&brand=${brand}&category=${category}&sort=${sort}`
        );
        setProducts(data);
      } catch {
        toast.error("Failed to load products");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [keyword, brand, category, sort]);

  // Extract unique brands for the filter sidebar
  const availableBrands = useMemo(() => {
    const brandsSet = new Set();
    products.forEach((p) => {
      if (p.brand) brandsSet.add(p.brand);
    });
    return Array.from(brandsSet);
  }, [products]);

  const scrollToProducts = () => {
    document.getElementById("products")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <SearchSideBar brands={availableBrands} />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-brand-black">
        <div className="fire-hero-glow" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(255,107,0,0.08),transparent_50%)]" />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-5 animate-spin-slow pointer-events-none"
          style={{
            background: "conic-gradient(from 0deg, #e50914, transparent, #e50914)",
          }}
        />

        <div className="relative max-w-7xl mx-auto px-6 py-20 md:py-28 text-center">
          <p className="text-brand-red uppercase tracking-[0.3em] text-sm font-semibold mb-4 animate-fade-in-up">
            Exclusive Collection
          </p>
          <h1 className="font-display text-6xl md:text-8xl text-white mb-4 animate-fade-in-up delay-100">
            WEAR THE <span className="fire-text">POWER</span>
          </h1>
          <p className="text-brand-muted text-lg max-w-xl mx-auto mb-8 animate-fade-in-up delay-200">
            Discover premium streetwear crafted for those who dare to stand out. Quality engineered, bold by design.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up delay-300">
            <button
              onClick={scrollToProducts}
              className="btn-primary px-8 py-3 text-base flex items-center gap-2"
            >
              Explore Collection <ArrowDown size={18} />
            </button>
          </div>
        </div>

        <div className="h-px bg-gradient-to-r from-transparent via-brand-red to-transparent opacity-50" />
      </section>

      {/* Products Section */}
      <section id="products" className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6 animate-fade-in-up">
          <div>
            <h2 className="font-display text-4xl text-white tracking-wide">
              CATALOG
            </h2>
            <div className="w-16 h-0.5 bg-brand-red mt-2" />
          </div>
          <span className="text-brand-muted text-sm font-medium">
            Showing {products.length} product{products.length !== 1 ? "s" : ""}
          </span>
        </div>

        {/* ── Category Filter Pills ── */}
        <div className="flex flex-wrap items-center gap-2.5 mb-10 pb-2 border-b border-brand-border/50 animate-fade-in-up">
          {CATEGORY_TABS.map((tab) => {
            const isActive = category === tab.value;
            return (
              <button
                key={tab.value}
                onClick={() => setCategory(tab.value)}
                className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-300 ${
                  isActive
                    ? "bg-brand-red text-white shadow-[0_0_15px_rgba(229,9,20,0.5)] scale-105"
                    : "bg-brand-dark border border-brand-border text-brand-muted hover:text-white hover:border-brand-red/50"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {loading ? (
          <FireSkeletonGrid count={8} className="h-96" />
        ) : products.length === 0 ? (
          <div className="text-center py-20 card-dark animate-fade-in max-w-md mx-auto">
            <div className="w-16 h-16 rounded-full bg-brand-red/10 text-brand-red flex items-center justify-center mx-auto mb-4 animate-float">
              <PackageSearch size={32} />
            </div>
            <p className="font-display text-3xl text-brand-muted mb-2">NO PRODUCTS FOUND</p>
            <p className="text-brand-muted text-sm mb-6">
              Try adjusting your search query or filter settings.
            </p>
            <button
              onClick={() => {
                setKeyword("");
                setBrand("");
                setCategory("");
                setSort("");
              }}
              className="btn-outline px-6 py-2.5 text-sm inline-block"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {products.map((item, index) => (
              <div
                key={item._id}
                className="animate-fade-in-up"
                style={{
                  animationDelay: `${Math.min(index * 0.08, 0.6)}s`,
                }}
              >
                <ProductCard product={item} />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ── ABOUT US SECTION ── */}
      <section id="about" className="relative py-20 bg-brand-dark/60 border-t border-brand-border overflow-hidden">
        <div className="fire-hero-glow" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in-up">
            <p className="text-brand-red uppercase tracking-[0.3em] text-xs font-bold mb-3 flex items-center justify-center gap-2">
              <Sparkles size={14} /> Our Legacy & Craft
            </p>
            <h2 className="font-display text-5xl md:text-6xl text-white tracking-wide">
              BUILT FOR <span className="fire-text">POWER</span>. ENGINEERED FOR QUALITY.
            </h2>
            <div className="w-20 h-1 bg-brand-red mx-auto mt-4 mb-6 rounded-full" />
            <p className="text-brand-muted text-base leading-relaxed">
              At KGF Store, we don't just sell apparel — we craft high-octane streetwear built to empower individuals who stand out with boldness. Every thread, seam, and detail reflects our passion for unyielding quality and authentic customer relationships.
            </p>
          </div>

          {/* 4 Quality & Value Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            <div className="card-dark p-6 border-brand-border hover:border-brand-red/50 transition-all duration-300 group hover:-translate-y-1">
              <div className="w-12 h-12 rounded-xl bg-brand-red/10 text-brand-red flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-brand-red group-hover:text-white transition-all">
                <Award size={24} />
              </div>
              <h3 className="font-display text-2xl text-white mb-2 tracking-wide">
                240+ GSM Fabric
              </h3>
              <p className="text-brand-muted text-xs leading-relaxed">
                Ultra-heavyweight 100% combed organic cotton engineered for superior comfort, durability, and pre-shrunk shape retention.
              </p>
            </div>

            <div className="card-dark p-6 border-brand-border hover:border-brand-red/50 transition-all duration-300 group hover:-translate-y-1">
              <div className="w-12 h-12 rounded-xl bg-brand-red/10 text-brand-red flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-brand-red group-hover:text-white transition-all">
                <ShieldCheck size={24} />
              </div>
              <h3 className="font-display text-2xl text-white mb-2 tracking-wide">
                Non-Fade Prints
              </h3>
              <p className="text-brand-muted text-xs leading-relaxed">
                High-density screen printing & puff embroidery designed to withstand 100+ washes without cracking or losing vibrancy.
              </p>
            </div>

            <div className="card-dark p-6 border-brand-border hover:border-brand-red/50 transition-all duration-300 group hover:-translate-y-1">
              <div className="w-12 h-12 rounded-xl bg-brand-red/10 text-brand-red flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-brand-red group-hover:text-white transition-all">
                <HeartHandshake size={24} />
              </div>
              <h3 className="font-display text-2xl text-white mb-2 tracking-wide">
                Customer First
              </h3>
              <p className="text-brand-muted text-xs leading-relaxed">
                Dedicated 24/7 customer support, instant replacement policies, and real-time order tracking at every stage of delivery.
              </p>
            </div>

            <div className="card-dark p-6 border-brand-border hover:border-brand-red/50 transition-all duration-300 group hover:-translate-y-1">
              <div className="w-12 h-12 rounded-xl bg-brand-red/10 text-brand-red flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-brand-red group-hover:text-white transition-all">
                <Truck size={24} />
              </div>
              <h3 className="font-display text-2xl text-white mb-2 tracking-wide">
                Express Dispatch
              </h3>
              <p className="text-brand-muted text-xs leading-relaxed">
                Orders packaged with tamper-proof security seals and dispatched within 24 hours with premium courier tracking.
              </p>
            </div>
          </div>

          {/* Trust & Guarantee Banner */}
          <div className="card-dark p-8 border-brand-red/30 bg-gradient-to-r from-brand-card via-brand-dark to-brand-card flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4 text-center md:text-left">
              <div className="w-14 h-14 rounded-full bg-brand-red/20 text-brand-red flex items-center justify-center shrink-0 mx-auto md:mx-0">
                <Star size={28} className="fill-brand-red" />
              </div>
              <div>
                <h4 className="font-display text-2xl text-white tracking-wide">
                  100% SATISFACTION GUARANTEED
                </h4>
                <p className="text-brand-muted text-xs mt-1">
                  Over 50,000+ satisfied customers nationwide with an average 4.9★ rating.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-6 text-xs text-brand-muted font-medium border-t md:border-t-0 md:border-l border-brand-border pt-4 md:pt-0 md:pl-6">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 size={16} className="text-green-400" /> Easy 7-Day Exchange
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 size={16} className="text-green-400" /> Secure Payments
              </span>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
