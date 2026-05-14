import {useState}from 'react';
import Cropper from "react-easy-crop";
import API from "../Services/api";
import getCroppedImg from "../utiles/cropImage";

const ImageCropper = ({setImage}) => {

    const [crop, setCrop] = useState({x:0, y:0});
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
    const [imageSrc, setImageSrc] = useState(null);
    const [loading, setLoading] = useState(false);
    

    const onSelectFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
    setImageSrc(reader.result);
    };

    reader.readAsDataURL(file);
};

const handleCropUpload = async()=>{
    try {
        setLoading(true);
        const croppedImg = await getCroppedImg(imageSrc, croppedAreaPixels);
        const formData= new FormData();
        formData.append("image", croppedImg, "cropped.jpg")

        const {data}= await API.post("/products/upload", formData,{headers:{"Content-type":"multipart/form-data"},
        }
    )
    setImage(data.image)
    alert("Image Uploaded Successfully");
    setLoading(false)
    } catch (error) {
        console.log(error.message);
        setLoading(false);
    }
}

  return (
    <div className='w-full'>
        <input type="file" onChange={onSelectFile} className='border p-2 rounded-lg mb-4 w-full' />
        {imageSrc &&(
            <div className='relative w-full h-96 bg-black rounded-lg overflow-hidden'>
                <Cropper image={imageSrc} crop={crop} zoom={zoom} aspect={1} onCropChange={setCrop} onZoomChange={setZoom} onCropComplete={(croppedArea, croppedAreaPixels)=>{
                    setCroppedAreaPixels(croppedAreaPixels);
                }}/>
            </div>
        )}
        {imageSrc && (
            <div className='mt-4'>
                <label className="text-sm font-semibold">Zoom</label>
                <input type="range" min={1} max={3} step={0.1} value={zoom} onChange={(e)=>setZoom(e.target.value)} className='w-full'/>
            </div>
        )}
        {imageSrc &&(
            <button type='button' onClick={handleCropUpload} disabled={loading} className='bg-green-500 text-white px-4 py-2 rounded-lg mt-4 w-full disabled:bg-gray-400'>{loading? "uploading...":"Crop & Upload"}</button>
        )}
    </div>
  )
}

export default ImageCropper;
