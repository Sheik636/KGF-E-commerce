import { Link, useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { SearchContext } from "../context/SearchContext";
import { useSelector } from "react-redux";
import { Menu, X, Search, ShoppingBag, Heart, Package, Home, LogIn, UserPlus, LogOut } from "lucide-react";

const Navbar = () => {
  const token = localStorage.getItem("token");

  const cartItems = useSelector((state) => state.cart.cartItems);
  const wishlistItems = useSelector((state) => state.wishlist.wishlistItems);
  const totalQuantity = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const { setIsOpen } = useContext(SearchContext);
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [navigate]);

  const logoutHandler = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userInfo");
    setMobileOpen(false);
    navigate("/login");
  };

  const closeMobile = () => setMobileOpen(false);

  return (
    <nav
      className={`sticky top-0 z-40 transition-all duration-500 ${
        scrolled
          ? "bg-brand-black/95 backdrop-blur-md shadow-[0_4px_30px_rgba(229,9,20,0.15)] border-b border-brand-border"
          : "bg-brand-black border-b border-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center animate-fade-in">
        {/* Logo */}
        <Link to="/" className="group flex items-center gap-2" onClick={closeMobile}>
          <span className="font-display text-4xl text-brand-red tracking-widest group-hover:scale-105 transition-transform duration-300">
            KGF
          </span>
          <span className="hidden sm:block w-px h-6 bg-brand-border" />
          <span className="hidden sm:block text-xs text-brand-muted uppercase tracking-widest">
            Store
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-4 lg:gap-6">
          <Link to="/" className="nav-link text-sm">
            Home
          </Link>

          <a
            href="/#about"
            onClick={(e) => {
              if (window.location.pathname === "/") {
                e.preventDefault();
                document.getElementById("about")?.scrollIntoView({ behavior: "smooth" });
              }
            }}
            className="nav-link text-sm"
          >
            About
          </a>

          {token && (
            <Link to="/myorders" className="nav-link text-sm">
              Orders
            </Link>
          )}

          <Link to="/wishlist" className="nav-link text-sm flex items-center gap-2">
            Wishlist
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
            <Search size={20} />
          </button>

          {!token ? (
            <div className="flex items-center gap-3">
              <Link to="/login" className="btn-outline text-sm px-4 py-2">
                Log In
              </Link>
              <Link to="/register" className="btn-primary text-sm px-4 py-2">
                Sign Up
              </Link>
            </div>
          ) : (
            <button onClick={logoutHandler} className="btn-outline text-sm px-4 py-2">
              Log Out
            </button>
          )}
        </div>

        {/* Mobile: Search + Cart + Hamburger */}
        <div className="flex md:hidden items-center gap-3">
          <button
            onClick={() => setIsOpen(true)}
            className="text-brand-muted hover:text-brand-red transition-colors"
            aria-label="Search"
          >
            <Search size={20} />
          </button>

          <Link to="/cart" className="relative text-brand-muted hover:text-white transition-colors" onClick={closeMobile}>
            <ShoppingBag size={20} />
            {totalQuantity > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-brand-red text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {totalQuantity}
              </span>
            )}
          </Link>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="text-white hover:text-brand-red transition-colors p-1"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-400 ease-out ${
          mobileOpen ? "max-h-[500px] border-t border-brand-border" : "max-h-0"
        }`}
      >
        <div className="px-6 py-4 space-y-1 bg-brand-dark">
          <MobileLink to="/" icon={Home} label="Home" onClick={closeMobile} />

          {token && (
            <MobileLink to="/myorders" icon={Package} label="My Orders" onClick={closeMobile} />
          )}

          <MobileLink to="/wishlist" icon={Heart} label="Wishlist" badge={wishlistItems.length} onClick={closeMobile} />

          <MobileLink to="/cart" icon={ShoppingBag} label="Cart" badge={totalQuantity} onClick={closeMobile} />

          <div className="h-px bg-brand-border my-3" />

          {!token ? (
            <>
              <MobileLink to="/login" icon={LogIn} label="Log In" onClick={closeMobile} />
              <MobileLink to="/register" icon={UserPlus} label="Sign Up" onClick={closeMobile} />
            </>
          ) : (
            <button
              onClick={logoutHandler}
              className="flex items-center gap-3 w-full px-3 py-3 rounded-lg text-brand-muted hover:bg-brand-card hover:text-brand-red transition-all text-sm font-medium"
            >
              <LogOut size={18} />
              Log Out
            </button>
          )}
        </div>
      </div>

      <div className="red-line" />
    </nav>
  );
};

const MobileLink = ({ to, icon: Icon, label, badge, onClick }) => (
  <Link
    to={to}
    onClick={onClick}
    className="flex items-center justify-between px-3 py-3 rounded-lg text-brand-muted hover:bg-brand-card hover:text-white transition-all text-sm font-medium"
  >
    <div className="flex items-center gap-3">
      <Icon size={18} />
      {label}
    </div>
    {badge > 0 && (
      <span className="bg-brand-red text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
        {badge}
      </span>
    )}
  </Link>
);

export default Navbar;
