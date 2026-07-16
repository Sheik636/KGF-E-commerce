import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="border-t border-brand-border bg-brand-dark mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-display text-3xl text-brand-red tracking-widest mb-2">KGF</h3>
            <p className="text-brand-muted text-sm leading-relaxed">
              Premium streetwear for those who dare to stand out. Quality crafted, bold by design.
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-3 uppercase tracking-widest text-xs">
              Shop
            </h4>
            <div className="flex flex-col gap-2">
              <Link to="/" className="text-brand-muted hover:text-brand-red text-sm transition-colors">
                All Products
              </Link>
              <Link to="/cart" className="text-brand-muted hover:text-brand-red text-sm transition-colors">
                Cart
              </Link>
              <Link to="/wishlist" className="text-brand-muted hover:text-brand-red text-sm transition-colors">
                Wishlist
              </Link>
              <Link to="/myorders" className="text-brand-muted hover:text-brand-red text-sm transition-colors">
                My Orders
              </Link>
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-3 uppercase tracking-widest text-xs">
              Account
            </h4>
            <div className="flex flex-col gap-2">
              <Link to="/login" className="text-brand-muted hover:text-brand-red text-sm transition-colors">
                Log In
              </Link>
              <Link to="/register" className="text-brand-muted hover:text-brand-red text-sm transition-colors">
                Sign Up
              </Link>
            </div>
          </div>
        </div>

        <div className="h-px bg-brand-border my-8" />
        <p className="text-center text-brand-muted text-xs">
          © {new Date().getFullYear()} KGF Store. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
