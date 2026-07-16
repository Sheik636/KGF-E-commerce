import { useState, useEffect, useContext } from "react";
import { toast } from "react-toastify";
import API from "../Services/api";
import ProductCard from "../Components/ProductCard";
import SearchSideBar from "../Components/SearchSideBar";
import { FireSkeletonGrid } from "../Components/FireLoader";
import { SearchContext } from "../context/SearchContext";
const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const { isOpen, setIsOpen, keyword, setKeyword, brand, setBrand, sort, setSort } =
    useContext(SearchContext);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const { data } = await API.get(
          `/products?keyword=${keyword}&brand=${brand}&sort=${sort}`
        );
        setProducts(data);
      } catch {
        toast.error("Failed to load products");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [keyword, brand, sort]);

  return (
    <>
      <SearchSideBar
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        keyword={keyword}
        setKeyword={setKeyword}
        brand={brand}
        setBrand={setBrand}
        sort={sort}
        setSort={setSort}
      />

      {/* Hero */}
      <section className="relative overflow-hidden bg-brand-black">
        <div className="fire-hero-glow" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(255,107,0,0.08),transparent_50%)]" />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-5 animate-spin-slow"
          style={{
            background: "conic-gradient(from 0deg, #e50914, transparent, #e50914)",
            animation: "spinSlow 20s linear infinite",
          }}
        />

        <div className="relative max-w-7xl mx-auto px-6 py-20 md:py-28 text-center">
          <p className="text-brand-red uppercase tracking-[0.3em] text-sm font-semibold mb-4 animate-fade-in-up">
            Premium Collection
          </p>
          <h1 className="font-display text-6xl md:text-8xl text-white mb-4 animate-fade-in-up delay-100">
            WEAR THE{" "}
            <span className="fire-text">POWER</span>
          </h1>
          <p className="text-brand-muted text-lg max-w-xl mx-auto mb-8 animate-fade-in-up delay-200">
            Discover exclusive streetwear crafted for those who dare to stand out.
          </p>
          <button
            onClick={() => setIsOpen(true)}
            className="btn-primary px-8 py-3 text-base animate-fade-in-up delay-300"
          >
            Explore Collection
          </button>
        </div>

        <div className="h-px bg-gradient-to-r from-transparent via-brand-red to-transparent opacity-50" />
      </section>

      {/* Products */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex items-end justify-between mb-10 animate-fade-in-up">
          <div>
            <h2 className="font-display text-4xl text-white tracking-wide">
              PRODUCTS
            </h2>
            <div className="w-16 h-0.5 bg-brand-red mt-2" />
          </div>
          <span className="text-brand-muted text-sm">
            {products.length} item{products.length !== 1 ? "s" : ""}
          </span>
        </div>

        {loading ? (
          <FireSkeletonGrid count={8} className="h-96" />
        ) : products.length === 0 ? (
          <div className="text-center py-20 animate-fade-in">
            <p className="font-display text-5xl text-brand-muted mb-4">NO RESULTS</p>
            <p className="text-brand-muted">Try adjusting your search filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {products.map((item, index) => (
              <div
                key={item._id}
                className="animate-fade-in-up"
                style={{
                  animationDelay: `${Math.min(index * 0.08, 0.6)}s`,
                  opacity: 0,
                }}
              >
                <ProductCard product={item} />
              </div>
            ))}
          </div>
        )}
      </section>
    </>
  );
};

export default Home;
