import { Link, useNavigate} from "react-router-dom"
import { useContext } from "react";
import { SearchContext } from "../context/SearchContext";
import { useSelector } from "react-redux";

const Navbar = () => {
  const token = localStorage.getItem("token");
  const adminToken = localStorage.getItem("adminToken");

  const cartItems = useSelector((state)=>state.cart.cartItems)
  const totalQuantity=cartItems.reduce((acc,item)=>acc+item.quantity,0)

  const { setIsOpen }= useContext(SearchContext)

  const navigate =useNavigate()

  const logoutHandler = () => {
    if(adminToken){
      localStorage.removeItem("adminToken");
      navigate('/admin/login')
    }
    localStorage.removeItem("token");
    localStorage.removeItem("userInfo");

    navigate("/login");
  };

    
  return (
    <>
    <div className="bg-gradient-to-r from-red-500 to-blue-500 text-white px-8 py-5 flex justify-between items-center shadow-lg">
        <h1 className="text-2xl font-bold">KGF</h1>
        <div className="space-x-4">
            <Link to="/">Home</Link>
            <Link to="/cart">Cart <span className="ml-2 bg-white text-black px-2 py-1 rounded-full text-xs font-bold">{totalQuantity}</span> </Link>
            <button onClick={()=>setIsOpen(true)}>🔍</button>
            {!token ?(<>
            <Link to="/login">Log In</Link><span>OR</span>
            <Link to="/register">Sign In</Link>
            </>):(<button onClick={logoutHandler}>Log Out</button>)}
        </div>    
    </div>
    </>
  )
}

export default Navbar