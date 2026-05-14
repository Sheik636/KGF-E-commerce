import {useState, useEffect}from 'react';
import { Link } from 'react-router-dom';
import API from '../Services/api';
import AdminSlideBar from '../Components/AdminSlideBar'


const AdminDashboard = () => {
    const [products, setProducts]= useState([]);
    const fetchProducts =async()=>{
        const {data}= await API.get("/products");
        setProducts(data);
    }

    useEffect(()=>{
        // const user = JSON.parse(localStorage.getItem("userInfo"));
        // if(!user?.isAdmin){
        //     navigate("/")
        // }
        fetchProducts()
    },[]);
    console.log(products)

    const deleteHandler =async (id)=>{
        const confirmDelete = window.confirm("Are you sure?");
        if(!confirmDelete) return;
        try {
            await API.delete(`/products/${id}`,{
                headers:{
                    Authorization: `Bearer ${localStorage.getItem("Admintoken")}`
                },
            })
            fetchProducts()
        } catch (error) {
            console.log(error.response?.data || error.message)
        }
    }

  return (
  <div className="flex">

    {/* Sidebar */}
    <AdminSlideBar />

    {/* Main Content */}
    <div className="flex-1 p-6">

      <h1 className="text-2xl font-bold mb-4">
        KGF Dashboard
      </h1>

      <h2 className="mb-4">
        Number of Products: {products.length}
      </h2>

      {products.map((item) => (
        <div
          key={item._id}
          className="flex justify-between border p-3 mt-3 rounded"
        >
          <span>{item.name}</span>

          <div className="space-x-2">

            <Link
              to={`/admin/edit/${item._id}`}
              className="bg-blue-500 text-white px-3 py-1 rounded"
            >
              Edit
            </Link>

            <button
              onClick={() => deleteHandler(item._id)}
              className="bg-red-500 text-white px-3 py-1 rounded"
            >
              Delete
            </button>

          </div>
        </div>
      ))}

    </div>
  </div>
);
}

export default AdminDashboard