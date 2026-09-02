import { useState, lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";
import IntroLoader from "./Components/IntroLoader";
import FireLoader from "./Components/FireLoader";
import AdminProtectedRoute from "./Components/AdminProtectedRoute";
import UserProtectedRoute from "./Components/UserProtectedRoute";
import ScrollToTop from "./Components/ScrollToTop";

// Dynamic imports for code-splitting
const Home = lazy(() => import("./Pages/Home"));
const AdminLogin = lazy(() => import("./Pages/AdminLogin"));
const Login = lazy(() => import("./Pages/Login"));
const Register = lazy(() => import("./Pages/RegisterUser"));
const UserProfile = lazy(() => import("./Pages/UserProfile"));
const Cart = lazy(() => import("./Pages/Cart"));
const Wishlist = lazy(() => import("./Pages/Wishlist"));
const AdminDashboard = lazy(() => import("./Pages/AdminDashboard"));
const CreateProduct = lazy(() => import("./Pages/CreateProduct"));
const EditProduct = lazy(() => import("./Pages/EditProduct"));
const Checkout = lazy(() => import("./Pages/CheckOut"));
const MyOrders = lazy(() => import("./Pages/MyOrders"));
const AdminOrders = lazy(() => import("./Pages/AdminOrders"));
const AdminUsers = lazy(() => import("./Pages/AdminUsers"));
const ProductDetails = lazy(() => import("./Pages/ProductDetails"));
const NotFound = lazy(() => import("./Pages/NotFound"));

const PageFallback = () => (
  <div className="flex-1 flex items-center justify-center min-h-[50vh]">
    <FireLoader size="lg" text="Loading..." />
  </div>
);

function AppContent() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");
  const isAdminLogin = location.pathname === "/admin/login";

  const [showIntro, setShowIntro] = useState(
    () => !sessionStorage.getItem("kgf_intro_seen")
  );

  const handleIntroComplete = () => {
    sessionStorage.setItem("kgf_intro_seen", "1");
    setShowIntro(false);
  };

  const isProfilePage = location.pathname === "/profile";

  return (
    <>
      {showIntro && <IntroLoader onComplete={handleIntroComplete} />}

      <div className="min-h-screen bg-brand-black flex flex-col">
        {!isAdminRoute && !showIntro && <Navbar />}
        <main
          key={location.pathname}
          className={`flex-1 ${isAdminLogin || showIntro ? "" : "animate-fade-in"}`}
        >
          <Suspense fallback={<PageFallback />}>
            <Routes>
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route
                path="/admin"
                element={
                  <AdminProtectedRoute>
                    <AdminDashboard />
                  </AdminProtectedRoute>
                }
              />
              <Route
                path="/admin/create"
                element={
                  <AdminProtectedRoute>
                    <CreateProduct />
                  </AdminProtectedRoute>
                }
              />
              <Route
                path="/admin/edit/:id"
                element={
                  <AdminProtectedRoute>
                    <EditProduct />
                  </AdminProtectedRoute>
                }
              />
              <Route
                path="/admin/orders"
                element={
                  <AdminProtectedRoute>
                    <AdminOrders />
                  </AdminProtectedRoute>
                }
              />
              <Route
                path="/admin/users"
                element={
                  <AdminProtectedRoute>
                    <AdminUsers />
                  </AdminProtectedRoute>
                }
              />

              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/wishlist" element={<Wishlist />} />
              <Route path="/product/:id" element={<ProductDetails />} />
              <Route
                path="/profile"
                element={
                  <UserProtectedRoute>
                    <UserProfile />
                  </UserProtectedRoute>
                }
              />
              <Route
                path="/checkout"
                element={
                  <UserProtectedRoute>
                    <Checkout />
                  </UserProtectedRoute>
                }
              />
              <Route
                path="/myorders"
                element={
                  <UserProtectedRoute>
                    <MyOrders />
                  </UserProtectedRoute>
                }
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </main>
        {!isAdminRoute && !isProfilePage && !showIntro && <Footer />}
      </div>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
