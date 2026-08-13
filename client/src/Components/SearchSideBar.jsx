import { useContext } from "react";
import { SearchContext } from "../context/SearchContext";
import { Filter, X, RotateCcw } from "lucide-react";

const SearchSideBar = ({ brands = [] }) => {
  const {
    isOpen,
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

  const CATEGORIES = [
    { label: "All Products", value: "" },
    { label: "T-Shirt", value: "T-Shirt" },
    { label: "Trackpant", value: "Trackpant" },
    { label: "Hoodies", value: "Hoodie" },
    { label: "Jackets", value: "Jacket" },
    { label: "Footwear / Shoes", value: "Shoes" },
  ];

  const activeFilterCount = [keyword, brand, category, sort].filter(Boolean).length;

  return (
    <>
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 animate-fade-in"
        />
      )}
      <div
        className={`fixed top-0 left-0 h-full w-80 bg-brand-dark border-r border-brand-border shadow-[4px_0_40px_rgba(0,0,0,0.5)] z-50 p-6 transition-transform duration-500 ease-out flex flex-col justify-between ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div>
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-2">
              <Filter size={20} className="text-brand-red" />
              <h2 className="font-display text-3xl text-white tracking-wide">
                FILTERS
              </h2>
              {activeFilterCount > 0 && (
                <span className="bg-brand-red text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </div>
            <button
              className="text-brand-muted hover:text-brand-red transition-colors w-8 h-8 flex items-center justify-center rounded-lg border border-brand-border hover:border-brand-red"
              onClick={() => setIsOpen(false)}
              aria-label="Close filters"
            >
              <X size={18} />
            </button>
          </div>

          <div className="space-y-6">
            <div className="animate-fade-in-up delay-100">
              <label className="block text-sm text-brand-muted uppercase tracking-widest mb-2 font-medium">
                Search Keyword
              </label>
              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="Search products, t-shirts..."
                className="input-dark"
              />
            </div>

            {/* Product Category Filter */}
            <div className="animate-fade-in-up delay-150">
              <label className="block text-sm text-brand-muted uppercase tracking-widest mb-2 font-medium">
                Product Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="input-dark"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="animate-fade-in-up delay-200">
              <label className="block text-sm text-brand-muted uppercase tracking-widest mb-2 font-medium">
                Brand
              </label>
              <select
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className="input-dark"
              >
                <option value="">All Brands</option>
                {brands.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>

            <div className="animate-fade-in-up delay-300">
              <label className="block text-sm text-brand-muted uppercase tracking-widest mb-2 font-medium">
                Sort By Price
              </label>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="input-dark"
              >
                <option value="">Default Order</option>
                <option value="lowToHigh">Price: Low to High</option>
                <option value="highToLow">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>

        {activeFilterCount > 0 && (
          <button
            onClick={() => {
              setKeyword("");
              setBrand("");
              setCategory("");
              setSort("");
            }}
            className="btn-outline w-full py-3 flex items-center justify-center gap-2 animate-fade-in"
          >
            <RotateCcw size={16} /> Reset Filters
          </button>
        )}
      </div>
    </>
  );
};

export default SearchSideBar;
