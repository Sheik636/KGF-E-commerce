import { useState, useEffect } from "react";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";
import IntroLoader from "./Components/IntroLoader";
import FireLoader from "./Components/FireLoader";
import AdminProtectedRoute from "./Components/AdminProtectedRoute";
import UserProtectedRoute from "./Components/UserProtectedRoute";
import Home from "./Pages/Home";
import AdminLogin from "./Pages/AdminLogin";
import Login from "./Pages/Login";
import Register from "./Pages/RegisterUser";
import Cart from "./Pages/Cart";
import Wishlist from "./Pages/Wishlist";
import AdminDashboard from "./Pages/AdminDashboard";
import CreateProduct from "./Pages/CreateProduct";
import EditProduct from "./Pages/EditProduct";
import Checkout from "./Pages/CheckOut";
import MyOrders from "./Pages/MyOrders";
import AdminOrders from "./Pages/AdminOrders";
import AdminUsers from "./Pages/AdminUsers";
import ProductDetails from "./Pages/ProductDetails";
import NotFound from "./Pages/NotFound";
import ScrollToTop from "./Components/ScrollToTop";

function AppContent() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");
  const isAdminLogin = location.pathname === "/admin/login";

  const [showIntro, setShowIntro] = useState(
    () => !sessionStorage.getItem("kgf_intro_seen")
  );
  const [routeLoading, setRouteLoading] = useState(false);

  useEffect(() => {
    if (showIntro) return;
    setRouteLoading(true);
    const timer = setTimeout(() => setRouteLoading(false), 450);
    return () => clearTimeout(timer);
  }, [location.pathname, showIntro]);

  const handleIntroComplete = () => {
    sessionStorage.setItem("kgf_intro_seen", "1");
    setShowIntro(false);
  };

  return (
    <>
      {showIntro && <IntroLoader onComplete={handleIntroComplete} />}

      {routeLoading && !showIntro && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-brand-black/80 backdrop-blur-sm pointer-events-none">
          <FireLoader size="lg" text="Loading..." />
        </div>
      )}

      <div className="min-h-screen bg-brand-black flex flex-col">
        {!isAdminRoute && !showIntro && <Navbar />}
        <main
          key={location.pathname}
          className={`flex-1 ${isAdminLogin || showIntro ? "" : "animate-fade-in"}`}
        >
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
        </main>
        {!isAdminRoute && !showIntro && <Footer />}
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
