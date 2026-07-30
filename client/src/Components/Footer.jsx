import { Link } from "react-router-dom";
import { ArrowUp, Globe, Mail, Share2 } from "lucide-react";

const Footer = () => {
  const token = localStorage.getItem("token");

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="border-t border-brand-border bg-brand-dark mt-auto relative">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Info */}
          <div className="md:col-span-2">
            <h3 className="font-display text-4xl text-brand-red tracking-widest mb-3">
              KGF
            </h3>
            <p className="text-brand-muted text-sm leading-relaxed max-w-sm mb-4">
              Premium streetwear for those who dare to stand out. Quality engineered, bold by design. Redefining fashion with power.
            </p>
            {/* Social Icons */}
            <div className="flex items-center gap-3 text-brand-muted">
              {[
                { icon: Globe, label: "Website" },
                { icon: Mail, label: "Email" },
                { icon: Share2, label: "Share" },
              ].map(({ icon: Icon, label }) => (
                <button
                  key={label}
                  className="w-9 h-9 rounded-lg border border-brand-border flex items-center justify-center hover:border-brand-red hover:text-brand-red transition-all hover:scale-110"
                  aria-label={label}
                >
                  <Icon size={18} />
                </button>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4 uppercase tracking-widest text-xs">
              Quick Links
            </h4>
            <div className="flex flex-col gap-2.5">
              <Link to="/" className="text-brand-muted hover:text-brand-red text-sm transition-colors w-fit">
                All Products
              </Link>
              <Link to="/cart" className="text-brand-muted hover:text-brand-red text-sm transition-colors w-fit">
                Shopping Cart
              </Link>
              <Link to="/wishlist" className="text-brand-muted hover:text-brand-red text-sm transition-colors w-fit">
                Saved Wishlist
              </Link>
              {token && (
                <Link to="/myorders" className="text-brand-muted hover:text-brand-red text-sm transition-colors w-fit">
                  My Orders
                </Link>
              )}
            </div>
          </div>

          {/* Account */}
          <div>
            <h4 className="text-white font-semibold mb-4 uppercase tracking-widest text-xs">
              Account
            </h4>
            <div className="flex flex-col gap-2.5">
              {!token ? (
                <>
                  <Link to="/login" className="text-brand-muted hover:text-brand-red text-sm transition-colors w-fit">
                    Log In
                  </Link>
                  <Link to="/register" className="text-brand-muted hover:text-brand-red text-sm transition-colors w-fit">
                    Create Account
                  </Link>
                </>
              ) : (
                <Link to="/myorders" className="text-brand-muted hover:text-brand-red text-sm transition-colors w-fit">
                  Order History
                </Link>
              )}
              <Link to="/admin/login" className="text-brand-muted hover:text-brand-red text-sm transition-colors w-fit">
                Admin Portal
              </Link>
            </div>
          </div>
        </div>

        <div className="h-px bg-brand-border my-8" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-brand-muted text-xs">
            © {new Date().getFullYear()} KGF Store. All rights reserved. Built for champions.
          </p>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-2 text-xs font-semibold text-brand-muted hover:text-brand-red transition-colors px-3 py-1.5 rounded-lg border border-brand-border hover:border-brand-red"
          >
            Back to top <ArrowUp size={14} />
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
