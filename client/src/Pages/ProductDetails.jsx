import { useState } from 'react';
import API from '../Services/api';
import { useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CartContext } from "../context/CartContext"
import {toast} from "react-toastify";


const ProductDetails = () => {

    const { addToCart } =useContext(CartContext)

    const navigate = useNavigate()

    const [selectedImage, setSelectedImage] = useState("");
    const [name, setName] = useState("");
    const [product, setProduct] = useState(null);
    const [chooseSize, setChooseSize] = useState("")

    const {id}= useParams();

    useEffect(()=>{
        const fetchProducts = async()=>{
        try {
            const {data} = await API.get(`/products/${id}`);
            setProduct(data)
            setSelectedImage(data.images?.[0]);
            setName(data.name)
        } catch (error) {
            console.log(error.message)
        }
    }
    fetchProducts()
    },[id]);

    if(!product){
        return (
            <h1 className='text-center mt-10 text-2xl'>Loading...</h1>
        )
    }

    const handleAddToCart = ()=>{
        if(!chooseSize){
            return toast.warning("Please Select a Size")
        }

        addToCart({
            ...product, chooseSize, quantity:1
        },
    toast.success("Added to cart"))
        // navigate("/cart")
        console.log("Clicked");
        console.log(product);
        console.log(chooseSize);
    }

    const buyNow =()=>{
        handleAddToCart();

        navigate("/checkout");

    }

  return (
    <>
        <div className='max-w-7xl mx-auto p-6 grid md:grid-cols-2 gap-10'>
            <div>
                <div className='mt-4'>
                    <img src={selectedImage} alt={name} className="w-[300px] h-[500px] object-cover rounded-xl"/>
                </div>
                <div className="flex gap-3 mt-4">
                    {product?.images?.map(
                        (img,index)=>(
                                <img key={index}src={img}alt="thumbnail" onClick={()=>setSelectedImage(img)}className="w-24 h-24 object-cover rounded-lg cursor-pointer border hover:scale-105 transition"
                                />
                            ))}
                </div>
            </div>
            <div>
                <h1 className='text-4xl font-bold mb-4'>{product?.name}</h1>
                <p className='text-gray-500 mb-2'>Brand:{product.brand}</p>
                <h2 className='text-3xl font-bold text-green-600 mb-6'>₹ {product.price}/-</h2>
                <div className='mb-6'>
                    <h3 className='font-semibold mb-3'>Select Size</h3>
                    <div className='flex gap-3'>
                        {product?.sizes?.map((size,index)=>(
                            <button key={index} onClick={()=>setChooseSize(size)} className={`px-4 py-2 border rounded-lg ${chooseSize===size ? "bg-black text-white" : "bg-white"}`}>{size}</button>
                        ))}
                    </div>
                </div>
                <p className="mb-6 font-semibold">
                    {product.stock > 0 ? "In Stock" : "Out Of Stock"}
                </p>
                <div className='flex gap-4'>
                    <button onClick={handleAddToCart} className='bg-black text-white px-6 py-3 rounded-lg w-full'>Add to Cart</button>
                    <button onClick={buyNow} className='bg-green-500 text-white px-6 py-3 rounded-lg w-full'>Buy Now</button>
                </div>
            </div>
        </div>
    </>
  )
}

export default ProductDetails