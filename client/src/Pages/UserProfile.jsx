import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import API from "../Services/api";
import {
  User,
  Mail,
  CheckCircle2,
  Calendar,
  Package,
  Heart,
  ShoppingBag,
  MapPin,
  Trash2,
  AlertTriangle,
  X,
  LogOut,
  ShieldAlert,
  Plus,
} from "lucide-react";
import FireLoader from "../Components/FireLoader";

const UserProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Danger Zone Modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [confirmInput, setConfirmInput] = useState("");
  const [deleting, setDeleting] = useState(false);

  // Add Address Modal
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [savingAddress, setSavingAddress] = useState(false);
  const [addressForm, setAddressForm] = useState({
    name: "",
    address: "",
    city: "",
    postalCode: "",
    country: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    document.title = "KGF Store — My Profile";
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const { data } = await API.get("/users/profile");
      setProfile(data);
    } catch (error) {
      const userInfoStr = localStorage.getItem("userInfo");
      if (userInfoStr) {
        try {
          setProfile(JSON.parse(userInfoStr));
        } catch {
          toast.error("Failed to load user profile");
        }
      } else {
        toast.error(error.response?.data?.message || "Failed to load profile");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userInfo");
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const handleSaveAddress = async (e) => {
    e.preventDefault();
    const { name, address, city, postalCode, country } = addressForm;
    if (!name || !address || !city || !postalCode || !country) {
      toast.error("Please fill in all address fields");
      return;
    }

    try {
      setSavingAddress(true);
      const { data } = await API.post("/users/addresses", addressForm);
      setProfile((prev) => ({ ...prev, addresses: data }));
      toast.success("Address added successfully!");
      setShowAddressModal(false);
      setAddressForm({ name: "", address: "", city: "", postalCode: "", country: "" });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add address");
    } finally {
      setSavingAddress(false);
    }
  };

  const handleDeleteAccount = async (e) => {
    e.preventDefault();
    if (confirmInput.trim() !== "DELETE") {
      toast.error("Please type DELETE to confirm account removal");
      return;
    }

    try {
      setDeleting(true);
      const { data } = await API.delete("/users/profile");
      localStorage.removeItem("token");
      localStorage.removeItem("userInfo");
      toast.success(data.message || "Account deleted successfully");
      setShowDeleteModal(false);
      navigate("/register");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete account");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[60vh]">
        <FireLoader size="lg" text="Loading profile..." />
      </div>
    );
  }

  const initials = profile?.name
    ? profile.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";

  const memberSince = profile?.createdAt
    ? new Date(profile.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "N/A";

  return (
    <div className="min-h-[calc(100vh-80px)] py-8 px-4 max-w-5xl mx-auto relative pb-28">
      {/* Header Banner */}
      <div className="card-dark p-6 sm:p-8 mb-8 relative overflow-hidden shadow-[0_0_60px_rgba(229,9,20,0.1)] animate-fade-in">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-48 h-48 bg-brand-red/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 relative z-10">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-br from-brand-red to-red-900 flex items-center justify-center text-white text-2xl sm:text-3xl font-bold font-display shadow-lg border border-brand-red/30 shrink-0">
              {initials}
            </div>

            <div className="flex-1 text-center sm:text-left">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5 mb-1">
                <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-wide">{profile?.name}</h1>
                {profile?.isVerified !== false ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <CheckCircle2 size={14} /> Verified Account
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    Unverified Email
                  </span>
                )}
              </div>

              <p className="text-brand-muted text-xs sm:text-sm flex items-center justify-center sm:justify-start gap-2 mt-1">
                <Mail size={16} className="text-brand-red shrink-0" /> {profile?.email}
              </p>

              <p className="text-brand-muted/70 text-xs flex items-center justify-center sm:justify-start gap-2 mt-2">
                <Calendar size={14} className="shrink-0" /> Member since {memberSince}
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="btn-outline w-full sm:w-auto px-4 py-2 text-sm flex items-center justify-center gap-2 border-white/20 hover:border-brand-red text-white hover:bg-brand-red/10 shrink-0"
          >
            <LogOut size={16} /> Log Out
          </button>
        </div>
      </div>

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-8">
        <Link
          to="/myorders"
          className="card-dark p-5 sm:p-6 hover:border-brand-red/50 transition-all duration-300 group flex items-center gap-4"
        >
          <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-brand-red/10 text-brand-red flex items-center justify-center group-hover:scale-110 transition-transform shrink-0">
            <Package size={22} />
          </div>
          <div>
            <h3 className="text-white font-semibold text-sm sm:text-base group-hover:text-brand-red transition-colors">
              My Orders
            </h3>
            <p className="text-brand-muted text-xs">View purchase history & status</p>
          </div>
        </Link>

        <Link
          to="/wishlist"
          className="card-dark p-5 sm:p-6 hover:border-brand-red/50 transition-all duration-300 group flex items-center gap-4"
        >
          <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-brand-red/10 text-brand-red flex items-center justify-center group-hover:scale-110 transition-transform shrink-0">
            <Heart size={22} />
          </div>
          <div>
            <h3 className="text-white font-semibold text-sm sm:text-base group-hover:text-brand-red transition-colors">
              Saved Wishlist
            </h3>
            <p className="text-brand-muted text-xs">Items saved for later</p>
          </div>
        </Link>

        <Link
          to="/cart"
          className="card-dark p-5 sm:p-6 hover:border-brand-red/50 transition-all duration-300 group flex items-center gap-4"
        >
          <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-brand-red/10 text-brand-red flex items-center justify-center group-hover:scale-110 transition-transform shrink-0">
            <ShoppingBag size={22} />
          </div>
          <div>
            <h3 className="text-white font-semibold text-sm sm:text-base group-hover:text-brand-red transition-colors">
              Shopping Cart
            </h3>
            <p className="text-brand-muted text-xs">Review items ready for checkout</p>
          </div>
        </Link>
      </div>

      {/* Saved Addresses Section with Add Address (+ Icon Logo) Button */}
      <div className="card-dark p-5 sm:p-6 mb-8">
        <div className="flex items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2 min-w-0">
            <MapPin className="text-brand-red shrink-0" size={20} />
            <h2 className="text-base sm:text-lg font-semibold text-white truncate">Saved Addresses</h2>
          </div>

          <button
            onClick={() => setShowAddressModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand-red/10 hover:bg-brand-red text-brand-red hover:text-white border border-brand-red/30 transition-all text-xs font-semibold shrink-0 whitespace-nowrap shadow-sm hover:scale-105"
            title="Add New Address"
          >
            <Plus size={16} className="shrink-0" />
            <span>Add Address</span>
          </button>
        </div>

        {profile?.addresses && profile.addresses.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {profile.addresses.map((addr, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-black/40 border border-white/10 text-sm space-y-1"
              >
                <p className="font-semibold text-white">{addr.name}</p>
                <p className="text-brand-muted">{addr.address}</p>
                <p className="text-brand-muted">
                  {addr.city}, {addr.postalCode}
                </p>
                <p className="text-brand-muted/70 text-xs">{addr.country}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-brand-muted text-sm italic">
            No saved addresses found. Click "+ Add Address" to add a new shipping address.
          </p>
        )}
      </div>

      {/* Floating Danger Zone Logo Button (Bottom-Left Side) */}
      <div className="fixed bottom-5 left-4 sm:left-6 z-40">
        <button
          onClick={() => {
            setConfirmInput("");
            setShowDeleteModal(true);
          }}
          className="group relative flex items-center gap-2 px-3.5 py-2.5 sm:px-4 sm:py-3 rounded-full bg-red-950/90 hover:bg-red-600 border border-red-500/40 text-red-400 hover:text-white shadow-[0_0_20px_rgba(239,68,68,0.35)] backdrop-blur-md transition-all duration-300 transform hover:scale-105 active:scale-95"
          title="Danger Zone — Delete Account"
        >
          <ShieldAlert size={18} className="animate-pulse text-red-500 group-hover:text-white shrink-0" />
          <span className="text-[11px] sm:text-xs font-bold tracking-wider uppercase whitespace-nowrap">Danger Zone</span>
        </button>
      </div>

      {/* Add Address Modal */}
      {showAddressModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-md card-dark p-6 border-white/10 shadow-2xl animate-scale-in">
            <button
              onClick={() => setShowAddressModal(false)}
              className="absolute top-4 right-4 text-brand-muted hover:text-white p-1"
            >
              <X size={20} />
            </button>

            <div className="flex items-center gap-2.5 mb-4 text-brand-red">
              <MapPin size={22} />
              <h3 className="text-lg font-bold text-white">Add New Address</h3>
            </div>

            <form onSubmit={handleSaveAddress} className="space-y-4">
              <div>
                <label className="block text-xs text-brand-muted mb-1">Full Name / Label</label>
                <input
                  type="text"
                  placeholder="e.g. John Doe (Home)"
                  value={addressForm.name}
                  onChange={(e) => setAddressForm({ ...addressForm, name: e.target.value })}
                  className="input-dark text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-xs text-brand-muted mb-1">Street Address</label>
                <input
                  type="text"
                  placeholder="123 Main Street, Apt 4B"
                  value={addressForm.address}
                  onChange={(e) => setAddressForm({ ...addressForm, address: e.target.value })}
                  className="input-dark text-sm"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-brand-muted mb-1">City</label>
                  <input
                    type="text"
                    placeholder="New York"
                    value={addressForm.city}
                    onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                    className="input-dark text-sm"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs text-brand-muted mb-1">Postal Code</label>
                  <input
                    type="text"
                    placeholder="10001"
                    value={addressForm.postalCode}
                    onChange={(e) => setAddressForm({ ...addressForm, postalCode: e.target.value })}
                    className="input-dark text-sm"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-brand-muted mb-1">Country</label>
                <input
                  type="text"
                  placeholder="United States"
                  value={addressForm.country}
                  onChange={(e) => setAddressForm({ ...addressForm, country: e.target.value })}
                  className="input-dark text-sm"
                  required
                />
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddressModal(false)}
                  className="btn-outline flex-1 py-2.5 text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingAddress}
                  className="btn-primary flex-1 py-2.5 text-sm font-semibold disabled:opacity-50"
                >
                  {savingAddress ? "Saving..." : "Save Address"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Popup Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-md card-dark p-6 border-red-500/40 shadow-[0_0_60px_rgba(239,68,68,0.25)] animate-scale-in">
            <button
              onClick={() => setShowDeleteModal(false)}
              className="absolute top-4 right-4 text-brand-muted hover:text-white p-1"
            >
              <X size={20} />
            </button>

            <div className="flex items-center gap-3 text-red-500 mb-4">
              <div className="w-11 h-11 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center shrink-0">
                <ShieldAlert size={24} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Danger Zone — Delete Account</h3>
                <p className="text-xs text-red-400 font-medium">Permanent action</p>
              </div>
            </div>

            <p className="text-brand-muted text-sm mb-4 leading-relaxed">
              Are you sure you want to delete the account for <strong className="text-white">{profile?.email}</strong>? All profile data, addresses, and account permissions will be permanently deleted.
            </p>

            <form onSubmit={handleDeleteAccount} className="space-y-4">
              <div>
                <label className="block text-xs text-brand-muted mb-1.5">
                  Type <strong className="text-red-400 font-mono">DELETE</strong> to confirm:
                </label>
                <input
                  type="text"
                  placeholder="DELETE"
                  value={confirmInput}
                  onChange={(e) => setConfirmInput(e.target.value)}
                  className="input-dark font-mono text-center text-sm border-red-500/30 focus:border-red-500"
                  required
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowDeleteModal(false)}
                  className="btn-outline flex-1 py-2.5 text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={deleting || confirmInput.trim() !== "DELETE"}
                  className="px-4 py-2.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold text-sm flex-1 disabled:opacity-40 transition-all flex items-center justify-center gap-2 shadow-md shadow-red-900/40"
                >
                  {deleting ? "Deleting..." : "Delete Account"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
