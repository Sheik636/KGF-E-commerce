import {BrowserRouter, Route, Routes, useLocation} from "react-router-dom";
import Navbar from "./Components/Navbar";
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
import ProductDetails from "./Pages/ProductDetails";


function AppContent(){
   const location = useLocation()

   const hideNav = location.pathname.startsWith("/admin");
  return (
    <>
     {!hideNav && <Navbar />}
    
    
     
      <Routes>

        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/create" element={<CreateProduct />}/>
        <Route path="/admin/edit/:id" element={< EditProduct/>}/>
        <Route path="/admin/orders" element={<AdminOrders />}></Route>

        <Route path="/" element={<Home />}></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/register" element={<Register />}></Route>
        <Route path="/cart" element={<Cart />}></Route>
        <Route path="/checkout" element={<Checkout />}></Route>
        <Route path="/myorders" element={<MyOrders />}></Route>
        <Route path="/product/:id" element={<ProductDetails />}></Route>
        

      </Routes>
    
    </>
  )
}

function App(){
  return(
    <BrowserRouter>
    <AppContent/>
    </BrowserRouter>
  )
}

export default App