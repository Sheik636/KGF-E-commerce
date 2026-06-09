import { useState } from "react";
import Cropper from "react-easy-crop";
import { toast } from "react-toastify";
import API from "../Services/api";
import getCroppedImg from "../utiles/cropImage";

const ImageCropper = ({ setImages }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [imageSrc, setImageSrc] = useState(null);
  const [loading, setLoading] = useState(false);
  const [ratio, setRatio] = useState(3 / 4);

  const onSelectFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setImageSrc(reader.result);
    reader.readAsDataURL(file);
  };

  const handleCropUpload = async () => {
    try {
      setLoading(true);
      const croppedImg = await getCroppedImg(imageSrc, croppedAreaPixels);
      const formData = new FormData();
      formData.append("image", croppedImg, "cropped.jpg");

      const { data } = await API.post("/products/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (data.images) {
        setImages((prev) => [...prev, data.images]);
      }
      toast.success("Image uploaded");
      setImageSrc(null);
    } catch {
      toast.error("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <label className="block w-full cursor-pointer">
        <div className="input-dark border-dashed text-center py-6 hover:border-brand-red transition-colors">
          <span className="text-brand-muted text-sm">
            Click to select an image
          </span>
        </div>
        <input type="file" accept="image/*" onChange={onSelectFile} className="hidden" />
      </label>

      {imageSrc && (
        <>
          <div className="mt-4">
            <label className="block text-sm text-brand-muted mb-1.5">Crop Ratio</label>
            <select
              value={ratio}
              onChange={(e) => setRatio(Number(e.target.value))}
              className="input-dark"
            >
              <option value={1}>1:1 Square</option>
              <option value={9 / 16}>9:16 Portrait</option>
              <option value={16 / 9}>16:9 Landscape</option>
              <option value={4 / 5}>4:5 Instagram</option>
              <option value={3 / 4}>3:4 Product</option>
            </select>
          </div>

          <div className="relative w-full h-80 bg-brand-black rounded-xl overflow-hidden mt-4 border border-brand-border">
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              aspect={ratio}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={(_, pixels) => setCroppedAreaPixels(pixels)}
            />
          </div>

          <div className="mt-4">
            <label className="text-sm text-brand-muted">Zoom</label>
            <input
              type="range"
              min={1}
              max={3}
              step={0.1}
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              className="w-full accent-brand-red mt-1"
            />
          </div>

          <button
            type="button"
            onClick={handleCropUpload}
            disabled={loading}
            className="btn-primary w-full py-2.5 mt-4 disabled:opacity-50"
          >
            {loading ? "Uploading..." : "Crop & Upload"}
          </button>
        </>
      )}
    </div>
  );
};

export default ImageCropper;
