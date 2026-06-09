import { useContext } from "react";
import { SearchContext } from "../context/SearchContext";

const SearchSideBar = () => {
  const { isOpen, setIsOpen, keyword, setKeyword, brand, setBrand, sort, setSort } =
    useContext(SearchContext);

  return (
    <>
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 animate-fade-in"
        />
      )}
      <div
        className={`fixed top-0 left-0 h-full w-80 bg-brand-dark border-r border-brand-border shadow-[4px_0_40px_rgba(0,0,0,0.5)] z-50 p-6 transition-transform duration-500 ease-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center mb-8">
          <h2 className="font-display text-3xl text-white tracking-wide">
            FILTER
          </h2>
          <button
            className="text-brand-muted hover:text-brand-red transition-colors w-8 h-8 flex items-center justify-center rounded-lg border border-brand-border hover:border-brand-red"
            onClick={() => setIsOpen(false)}
          >
            ✕
          </button>
        </div>

        <div className="space-y-6">
          <div className="animate-fade-in-up delay-100">
            <label className="block text-sm text-brand-muted uppercase tracking-widest mb-2">
              Search
            </label>
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Search products..."
              className="input-dark"
            />
          </div>

          <div className="animate-fade-in-up delay-200">
            <label className="block text-sm text-brand-muted uppercase tracking-widest mb-2">
              Brand
            </label>
            <select
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              className="input-dark"
            >
              <option value="">All Brands</option>
              <option value="Polo">Polo T-Shirts</option>
              <option value="Trackpant">Track Pant</option>
            </select>
          </div>

          <div className="animate-fade-in-up delay-300">
            <label className="block text-sm text-brand-muted uppercase tracking-widest mb-2">
              Sort By
            </label>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="input-dark"
            >
              <option value="lowToHigh">Price: Low to High</option>
              <option value="highToLow">Price: High to Low</option>
            </select>
          </div>

          <button
            onClick={() => {
              setKeyword("");
              setBrand("");
              setSort("");
            }}
            className="btn-outline w-full py-3 mt-4 animate-fade-in-up delay-400"
          >
            Clear Filters
          </button>
        </div>
      </div>
    </>
  );
};

export default SearchSideBar;
