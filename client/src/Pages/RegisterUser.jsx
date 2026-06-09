import { useState } from "react";
import API from "../Services/api";
import { Link } from "react-router-dom";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const { data } = await API.post("/users/register", { name, email, password });
      localStorage.setItem("token", data.token);
      localStorage.setItem("userInfo", JSON.stringify(data));
      alert("Registration Successful");
      window.location.href = "/";
    } catch (error) {
      alert("Registration Failed");
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(229,9,20,0.12),transparent_70%)]" />

      <div className="relative w-full max-w-md animate-scale-in">
        <div className="card-dark p-8 shadow-[0_0_60px_rgba(229,9,20,0.1)]">
          <div className="text-center mb-8">
            <h1 className="font-display text-5xl text-brand-red mb-2">KGF</h1>
            <h2 className="text-xl font-semibold text-white">Join the Movement</h2>
            <p className="text-brand-muted text-sm mt-1">Create your account today</p>
          </div>

          <form onSubmit={submitHandler} className="space-y-4">
            <div>
              <label className="block text-sm text-brand-muted mb-1.5">Full Name</label>
              <input
                type="text"
                placeholder="John Doe"
                className="input-dark"
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm text-brand-muted mb-1.5">Email</label>
              <input
                type="email"
                placeholder="you@example.com"
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
            <button type="submit" className="btn-primary w-full py-3 mt-2">
              Create Account
            </button>
          </form>

          <p className="text-center text-brand-muted text-sm mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-brand-red hover:underline font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
