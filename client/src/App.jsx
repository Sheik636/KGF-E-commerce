import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import Navbar from "./Components/Navbar";
import AdminProtectedRoute from "./Components/AdminProtectedRoute";
import Home from "./Pages/Home";
import AdminLogin from "./Pages/AdminLogin";
import Login from "./Pages/Login";
import Register from "./Pages/RegisterUser";
import Cart from "./Pages/Cart";
import AdminDashboard from "./Pages/AdminDashboard";
import CreateProduct from "./Pages/CreateProduct";
import EditProduct from "./Pages/EditProduct";
import Checkout from "./Pages/CheckOut";
import MyOrders from "./Pages/MyOrders";
import AdminOrders from "./Pages/AdminOrders";
import AdminUsers from "./Pages/AdminUsers";
import ProductDetails from "./Pages/ProductDetails";

function AppContent() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");
  const isAdminLogin = location.pathname === "/admin/login";

  return (
    <div className="min-h-screen bg-brand-black">
      {!isAdminRoute && <Navbar />}
      <main key={location.pathname} className={isAdminLogin ? "" : "animate-fade-in"}>
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
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/myorders" element={<MyOrders />} />
          <Route path="/product/:id" element={<ProductDetails />} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
