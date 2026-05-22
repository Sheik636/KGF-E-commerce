import {useState, useEffect} from 'react';
import { useParams } from 'react-router-dom';
import API from '../services/api';
import {useNavigate} from 'react-router-dom';
import ImageCropper from '../Components/ImageCropper';

const EditProduct = () => {
    const {id}= useParams()

    const navigate = useNavigate()
    
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [brand, setBrand] = useState("");
    const [images, setImages] = useState([]);
    

    
    useEffect(()=>{
        const fetchProducts = async()=>{
            const {data}= await API.get(`/products/${id}`);
            setName(data.name);
            setPrice(data.price);
            setBrand(data.brand);
            setImages(data.images || []);
        }
        fetchProducts();
    },[id])

    const updateHandler = async(e)=>{
        e.preventDefault();
        try {
           await API.put(`/products/${id}`, {name, price,brand, images}, 
            {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("Admintoken")}`,
            }});
            alert("Updated the Details");
            navigate('/admin');
        } catch (error) {
          console.log(error.message)        
        }
        
    }

  return (
    <div>
        <form onSubmit={updateHandler} className="max-w-md mx-auto p-6">
            <h2 className='text-2xl font-bold mb-4'>Edit Product</h2>
            <label className='text-sm'>Change Name</label>
            <input type="text" value={name} onChange={(e)=> setName(e.target.value)}  className="border p-2 block mb-2 rounded-lg"/>
            <label className='text-sm'>Change Price</label>
            <input type="text" value={price} onChange={(e)=> setPrice(e.target.value)}  className="border p-2 block mb-2 rounded-lg"/>
            <label className='text-sm'>Change Brand Name</label>
            <input type="text" value={brand} onChange={(e)=> setBrand(e.target.value)}  className="border p-2 block mb-2 rounded-lg"/>
            <br />
            <div className='flex gap-3 flex-wrap my-4'>
                {images.map((img,index)=>(
                    <div key={index} className='relative'>
                        <img src={img} alt="Preview" className='w-24 h-24 object-cover rounded-lg border'/>
                        <button type='button' onClick={()=>setImages(images.filter((_,i)=>i!==index))} className='absolute top-0 right-0 text-red-500 rounded-full w-6 h-6'>✕</button>
                    </div>
                    
                ))}
            </div>
            <ImageCropper setImages={setImages} />
            
            <button className="bg-blue-500 text-white px-3 py-1 rounded mt-4" type='submit'>Update</button>
        </form>
    </div>
  )
}

export default EditProduct;