import { useNavigate, Link } from "react-router-dom";

const AdminSlideBar =()=>{
    const navigate = useNavigate();

    const logoutHandler =()=>{
        localStorage.removeItem("AdminToken");
        navigate("/admin/login");
    }

    return(
        <div className="w-64 min-h-screen bg-black text-white">
            <h1 className="text-2xl font-bold mb-8 bg-gradient-to-r from-red-500 to-blue-500 p-3">KGF Admin</h1>
            <div className="flex flex-col space-y-4 p-5">
                <Link to={"/admin"} className="hover:bg-gray-800 p-2 rounded">Dashboard</Link>
                <Link to={"/admin/create"} className="hover:bg-gray-800 p-2 rounded">Create Product</Link>
                <Link to={"/admin/orders"} className="hover:bg-gray-800 p-2 rounded">Orders</Link>
                <Link to={"/admin/users"} className="hover:bg-gray-800 p-2 rounded">Users</Link>
                <button onClick={logoutHandler} className="bg-red-500 mt-10 py-2 rounded">Log Out</button>
            </div>
        </div>
    )
}

export default AdminSlideBar