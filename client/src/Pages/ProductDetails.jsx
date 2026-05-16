import { useState } from 'react';
import API from '../Services/api';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';

const ProductDetails = () => {
    const [selectedImage, setSelectedImage] = useState("");
    const [name, setName] = useState("");
    const [product, setProduct] = useState(null);

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
    },[id])
  return (
    <>
        <div className='mt-4'>
            <img src={selectedImage} alt={name} className="w-[500px] h-[500px] object-cover rounded-xl"/>
        </div>
        <div className="flex gap-3 mt-4">
            {product?.images?.map(
                (img,index)=>(
                        <img key={index}src={img}alt="thumbnail" onClick={()=>setSelectedImage(img)}className="w-24 h-24 object-cover rounded-lg cursor-pointer border hover:scale-105 transition"
                        />
                    ))}
        </div>
    </>
  )
}

export default ProductDetails