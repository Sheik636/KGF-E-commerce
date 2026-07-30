import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import API from "../Services/api";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "KGF Store — Sign In";
  }, []);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { data } = await API.post("/users/login", { email, password });
      localStorage.setItem("token", data.token);
      localStorage.setItem("userInfo", JSON.stringify(data));
      toast.success("Welcome back!");
      navigate("/");
    } catch {
      toast.error("Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(229,9,20,0.12),transparent_70%)]" />

      <div className="relative w-full max-w-md animate-scale-in">
        <div className="card-dark p-8 shadow-[0_0_60px_rgba(229,9,20,0.1)]">
          <div className="text-center mb-8">
            <h1 className="font-display text-5xl text-brand-red mb-2">KGF</h1>
            <h2 className="text-xl font-semibold text-white">Welcome Back</h2>
            <p className="text-brand-muted text-sm mt-1">Sign in to your account</p>
          </div>

          <form onSubmit={submitHandler} className="space-y-4">
            <div className="animate-fade-in-up delay-100">
              <label className="block text-sm text-brand-muted mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="input-dark"
                required
              />
            </div>
            <div className="animate-fade-in-up delay-200">
              <label className="block text-sm text-brand-muted mb-1.5">Password</label>
              <input
                type="password"
                value={password}
                placeholder="••••••••"
                onChange={(e) => setPassword(e.target.value)}
                className="input-dark"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3 mt-2 animate-fade-in-up delay-300 disabled:opacity-50"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <p className="text-center text-brand-muted text-sm mt-6">
            Don't have an account?{" "}
            <Link to="/register" className="text-brand-red hover:underline font-medium">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
