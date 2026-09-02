import { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import API from "../Services/api";
import { Link, useNavigate, useLocation } from "react-router-dom";

const Register = () => {
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [timer, setTimer] = useState(60);
  const navigate = useNavigate();
  const location = useLocation();

  const otpInputsRef = useRef([]);

  useEffect(() => {
    document.title = step === 1 ? "KGF Store — Create Account" : "KGF Store — Verify OTP";
  }, [step]);

  // Handle location state if redirected from Login page with unverified email
  useEffect(() => {
    if (location.state?.email) {
      setEmail(location.state.email);
      if (location.state.unverified) {
        setStep(2);
      }
    }
  }, [location.state]);

  // Countdown timer for Resend OTP
  useEffect(() => {
    let interval = null;
    if (step === 2 && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  // Send OTP handler (Step 1 submit)
  const sendOtpHandler = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      setLoading(true);
      const { data } = await API.post("/users/send-otp", { email });
      toast.success(data.message || "OTP code sent to your email!");
      setStep(2);
      setTimer(60);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send verification code");
    } finally {
      setLoading(false);
    }
  };

  // OTP input change handler
  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    // Auto focus next input
    if (value && index < 5) {
      otpInputsRef.current[index + 1]?.focus();
    }
  };

  // Handle backspace key in OTP box
  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpInputsRef.current[index - 1]?.focus();
    }
  };

  // Handle pasting 6 digit code
  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").trim();
    if (/^\d{6}$/.test(pastedData)) {
      const digits = pastedData.split("");
      setOtp(digits);
      otpInputsRef.current[5]?.focus();
    }
  };

  // Verify OTP and complete registration (Step 2 submit)
  const verifyOtpHandler = async (e) => {
    e.preventDefault();
    const fullOtp = otp.join("");
    if (fullOtp.length !== 6) {
      toast.error("Please enter the complete 6-digit OTP code");
      return;
    }

    try {
      setLoading(true);
      const { data } = await API.post("/users/verify-otp", {
        name,
        email,
        password,
        otp: fullOtp,
      });

      localStorage.setItem("token", data.token);
      localStorage.setItem("userInfo", JSON.stringify(data));
      toast.success("Email verified & account created successfully!");
      navigate("/");
    } catch (error) {
      toast.error(error.response?.data?.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP handler
  const handleResendOtp = async () => {
    if (timer > 0) return;
    try {
      setResending(true);
      const { data } = await API.post("/users/resend-otp", { email });
      toast.success(data.message || "New OTP sent!");
      setTimer(60);
      setOtp(["", "", "", "", "", ""]);
      otpInputsRef.current[0]?.focus();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to resend OTP");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(229,9,20,0.12),transparent_70%)]" />

      <div className="relative w-full max-w-md animate-scale-in">
        <div className="card-dark p-8 shadow-[0_0_60px_rgba(229,9,20,0.1)]">
          <div className="text-center mb-8">
            <h1 className="font-display text-5xl text-brand-red mb-2">KGF</h1>
            <h2 className="text-xl font-semibold text-white">
              {step === 1 ? "Join the Movement" : "Verify Email"}
            </h2>
            <p className="text-brand-muted text-sm mt-1">
              {step === 1
                ? "Create your account today"
                : `Enter 6-digit code sent to ${email}`}
            </p>
          </div>

          {step === 1 ? (
            <form onSubmit={sendOtpHandler} className="space-y-4">
              <div>
                <label className="block text-sm text-brand-muted mb-1.5">Full Name</label>
                <input
                  type="text"
                  placeholder="John Doe"
                  className="input-dark"
                  value={name}
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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-brand-muted mb-1.5">Create Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="input-dark"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full py-3 mt-2 disabled:opacity-50"
              >
                {loading ? "Sending Code..." : "Continue to Verification"}
              </button>
            </form>
          ) : (
            <form onSubmit={verifyOtpHandler} className="space-y-6">
              <div className="flex justify-between items-center text-xs text-brand-muted bg-black/40 p-3 rounded-lg border border-white/5">
                <span className="truncate max-w-[240px] text-white/80">{email}</span>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-brand-red hover:underline font-medium ml-2"
                >
                  Edit Email
                </button>
              </div>

              <div>
                <label className="block text-sm text-center text-brand-muted mb-3">
                  Verification Code (OTP)
                </label>
                <div className="flex justify-between gap-2" onPaste={handleOtpPaste}>
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => (otpInputsRef.current[index] = el)}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(index, e)}
                      className="w-12 h-14 text-center font-mono text-xl font-bold rounded-lg bg-black/40 border border-white/10 text-white focus:border-brand-red focus:ring-1 focus:ring-brand-red outline-none transition-all"
                    />
                  ))}
                </div>
              </div>

              <div className="text-center">
                {timer > 0 ? (
                  <p className="text-xs text-brand-muted">
                    Resend code in <span className="text-brand-red font-mono font-semibold">{timer}s</span>
                  </p>
                ) : (
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={resending}
                    className="text-xs text-brand-red hover:underline font-medium disabled:opacity-50"
                  >
                    {resending ? "Resending..." : "Resend Verification Code"}
                  </button>
                )}
              </div>

              <button
                type="submit"
                disabled={loading || otp.join("").length !== 6}
                className="btn-primary w-full py-3 disabled:opacity-50"
              >
                {loading ? "Verifying..." : "Verify & Complete Registration"}
              </button>
            </form>
          )}

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
