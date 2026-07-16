import { Link, useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { SearchContext } from "../context/SearchContext";
import { useSelector } from "react-redux";

const Navbar = () => {
  const token = localStorage.getItem("token");

  const cartItems = useSelector((state) => state.cart.cartItems);
  const wishlistItems = useSelector((state) => state.wishlist.wishlistItems);
  const totalQuantity = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const { setIsOpen } = useContext(SearchContext);
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const logoutHandler = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userInfo");
    navigate("/login");
  };

  return (
    <nav
      className={`sticky top-0 z-40 transition-all duration-500 ${
        scrolled
          ? "bg-brand-black/95 backdrop-blur-md shadow-[0_4px_30px_rgba(229,9,20,0.15)] border-b border-brand-border"
          : "bg-brand-black border-b border-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center animate-fade-in">
        <Link to="/" className="group flex items-center gap-2">
          <span className="font-display text-4xl text-brand-red tracking-widest group-hover:scale-105 transition-transform duration-300">
            KGF
          </span>
          <span className="hidden sm:block w-px h-6 bg-brand-border" />
          <span className="hidden sm:block text-xs text-brand-muted uppercase tracking-widest">
            Store
          </span>
        </Link>

        <div className="flex items-center gap-4 sm:gap-6">
          <Link to="/" className="nav-link text-sm hidden sm:block">
            Home
          </Link>

          {token && (
            <Link to="/myorders" className="nav-link text-sm hidden md:block">
              Orders
            </Link>
          )}

          <Link to="/wishlist" className="nav-link text-sm flex items-center gap-2">
            <span className="hidden sm:inline">Wishlist</span>
            {wishlistItems.length > 0 && (
              <span className="bg-brand-red text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {wishlistItems.length}
              </span>
            )}
          </Link>

          <Link to="/cart" className="nav-link text-sm flex items-center gap-2">
            Cart
            {totalQuantity > 0 && (
              <span className="bg-brand-red text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center animate-scale-in">
                {totalQuantity}
              </span>
            )}
          </Link>

          <button
            onClick={() => setIsOpen(true)}
            className="text-brand-muted hover:text-brand-red transition-colors duration-300 hover:scale-110 transform"
            aria-label="Search"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>

          {!token ? (
            <div className="flex items-center gap-3">
              <Link to="/login" className="btn-outline text-sm px-4 py-2">
                Log In
              </Link>
              <Link to="/register" className="btn-primary text-sm px-4 py-2 hidden sm:inline-block">
                Sign Up
              </Link>
            </div>
          ) : (
            <button onClick={logoutHandler} className="btn-outline text-sm px-4 py-2">
              Log Out
            </button>
          )}
        </div>
      </div>
      <div className="red-line" />
    </nav>
  );
};

export default Navbar;
