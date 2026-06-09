import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../Services/api";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { data } = await API.post("/admin/login", { email, password });
      localStorage.setItem("Admintoken", data.token);
      navigate("/admin");
    } catch {
      alert("Invalid admin credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden bg-brand-black">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(229,9,20,0.15),transparent_70%)]" />

      <div className="relative w-full max-w-md animate-scale-in">
        <div className="card-dark p-8 shadow-[0_0_60px_rgba(229,9,20,0.15)]">
          <div className="text-center mb-8">
            <h1 className="font-display text-5xl text-brand-red mb-2">KGF</h1>
            <h2 className="text-xl font-semibold text-white">Admin Portal</h2>
            <p className="text-brand-muted text-sm mt-1">Authorized personnel only</p>
          </div>

          <form onSubmit={submitHandler} className="space-y-4">
            <div>
              <label className="block text-sm text-brand-muted mb-1.5">Email</label>
              <input
                type="email"
                placeholder="admin@kgf.com"
                className="input-dark"
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm text-brand-muted mb-1.5">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                className="input-dark"
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3 mt-2 disabled:opacity-50"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <p className="text-center text-brand-muted text-sm mt-6">
            <Link to="/" className="text-brand-red hover:underline">
              ← Back to Store
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
