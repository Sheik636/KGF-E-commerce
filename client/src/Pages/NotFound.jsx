import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Home } from "lucide-react";

const NotFound = () => {
  useEffect(() => {
    document.title = "KGF Store — Page Not Found";
  }, []);

  return (
    <div className="min-h-[calc(100vh-160px)] flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(229,9,20,0.12),transparent_70%)] pointer-events-none" />

      <div className="text-center animate-fade-in-up relative z-10 max-w-md mx-auto">
        <p className="font-display text-[9rem] leading-none text-brand-red select-none animate-float fire-text">
          404
        </p>
        <h1 className="font-display text-4xl text-white tracking-wide mb-3">
          PAGE NOT FOUND
        </h1>
        <p className="text-brand-muted mb-8 text-sm leading-relaxed">
          The page you are looking for doesn't exist, was removed, or is temporarily unavailable.
        </p>
        <Link
          to="/"
          className="btn-primary px-8 py-3.5 inline-flex items-center gap-2 text-sm"
        >
          <Home size={18} /> Back to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
