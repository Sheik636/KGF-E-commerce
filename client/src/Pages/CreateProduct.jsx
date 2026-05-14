import { useState } from "react";
import API from "../services/api";
import AdminSlideBar from "../Components/AdminSlideBar";
import ImageCropper from "../Components/ImageCropper";
import { useNavigate } from "react-router-dom";

const CreateProduct = () => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [brand, setBrand] = useState("");
  const [sizes, setSizes] = useState([]);
  const [stock, setStock] = useState(0);
  const [image, setImage] = useState("");

  const navigate=useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      

    await API.post("/products", { name, price , brand, sizes, stock, image},
      {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("Admintoken")}`,
    }}
    );

    alert("Product created");
    navigate("/admin");
    } catch (error) {
      console.log(error.message)
    }
  };

  return (
    <>
    <div className="flex">
    <AdminSlideBar/>
    <form onSubmit={submitHandler} className="p-6">
      <h2 className="text-xl font-bold mb-4">Create Product</h2>

      <input
        placeholder="Name"
        className="border p-2 block mb-2 rounded-lg"
        onChange={(e) => setName(e.target.value)}
      />

      <input
        placeholder="Price"
        className="border p-2 block mb-2 rounded-lg"
        onChange={(e) => setPrice(Number(e.target.value))}
      />
      <input
        placeholder="Brand"
        className="border p-2 block mb-2 rounded-lg"
        onChange={(e) => setBrand(e.target.value)}
      />
      <input
        placeholder="Sizes"
        className="border p-2 block mb-2 rounded-lg"
        onChange={(e) => setSizes(e.target.value.split(","))}
      />
      <input
        placeholder="Opening Stock"
        className="border p-2 block mb-2 rounded-lg"
        onChange={(e) => setStock(Number(e.target.value))}
      />
      <ImageCropper setImage={setImage} />

      <button className="bg-green-500 text-white font-bold px-4 py-2 rounded-lg" type="submit">
        Create
      </button>
    </form>
    </div>
    </>
  );
};

export default CreateProduct;