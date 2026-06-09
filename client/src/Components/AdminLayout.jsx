import { useState } from "react";
import { NavLink, useNavigate, Link } from "react-router-dom";

const navItems = [
  { to: "/admin", label: "Dashboard", end: true },
  { to: "/admin/create", label: "Create Product" },
  { to: "/admin/orders", label: "Orders" },
  { to: "/admin/users", label: "Users" },
];

const AdminSlideBar = ({ mobileOpen, onClose }) => {
  const navigate = useNavigate();

  const logoutHandler = () => {
    localStorage.removeItem("Admintoken");
    navigate("/admin/login");
  };

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300 ${
      isActive
        ? "bg-brand-red/15 text-brand-red border-l-2 border-brand-red"
        : "text-brand-muted hover:text-white hover:bg-brand-card"
    }`;

  const sidebar = (
    <>
      <div className="p-5 border-b border-brand-border">
        <Link to="/admin" className="block" onClick={onClose}>
          <h1 className="font-display text-3xl text-brand-red tracking-widest">KGF</h1>
          <p className="text-xs text-brand-muted uppercase tracking-[0.2em] mt-1">
            Admin Panel
          </p>
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={linkClass}
            onClick={onClose}
          >
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-brand-border space-y-2">
        <Link
          to="/"
          className="block text-center text-sm text-brand-muted hover:text-white py-2 transition-colors"
          onClick={onClose}
        >
          ← Back to Store
        </Link>
        <button onClick={logoutHandler} className="btn-outline w-full py-2.5 text-sm">
          Log Out
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-64 min-h-screen bg-brand-dark border-r border-brand-border flex-col shrink-0">
        {sidebar}
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 lg:hidden animate-fade-in"
          onClick={onClose}
        />
      )}

      {/* Mobile drawer */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-brand-dark border-r border-brand-border z-50 flex flex-col transition-transform duration-500 lg:hidden ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {sidebar}
      </aside>
    </>
  );
};

const AdminLayout = ({ children, title, subtitle }) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-brand-black">
      <AdminSlideBar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile top bar */}
        <div className="lg:hidden flex items-center justify-between p-4 border-b border-brand-border bg-brand-dark">
          <button
            onClick={() => setMobileOpen(true)}
            className="text-white p-2 rounded-lg border border-brand-border hover:border-brand-red transition-colors"
            aria-label="Open menu"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <span className="font-display text-2xl text-brand-red">KGF ADMIN</span>
          <div className="w-9" />
        </div>

        <main className="flex-1 p-6 lg:p-8 overflow-auto">
          {(title || subtitle) && (
            <div className="animate-fade-in-up mb-8">
              {title && (
                <h1 className="font-display text-4xl lg:text-5xl text-white tracking-wide">
                  {title}
                </h1>
              )}
              <div className="w-16 h-0.5 bg-brand-red mt-2" />
              {subtitle && <p className="text-brand-muted mt-2">{subtitle}</p>}
            </div>
          )}
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
