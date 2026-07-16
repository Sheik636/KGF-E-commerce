import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="min-h-[calc(100vh-160px)] flex items-center justify-center px-4">
      <div className="text-center animate-fade-in-up">
        <p className="font-display text-[8rem] leading-none text-brand-red/20">404</p>
        <h1 className="font-display text-4xl text-white tracking-wide mb-3">PAGE NOT FOUND</h1>
        <p className="text-brand-muted mb-8 max-w-md mx-auto">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link to="/" className="btn-primary px-8 py-3 inline-block">
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
