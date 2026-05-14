import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../Services/api";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      const { data } = await API.post("/admin/login", {
        email,
        password,
      });

      // ❌ block normal users
      // if (!data.isAdmin) {
      //   alert("Not an admin");
      //   return;
      // }

      localStorage.setItem("Admintoken", data.token);
      // localStorage.setItem("userInfo", JSON.stringify(data));

      navigate("/admin");
    } catch (error) {
      console.log(error.message)
      alert("Invalid admin credentials");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form
        onSubmit={submitHandler}
        className="bg-white p-8 rounded-lg shadow-lg w-96"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">
          Admin Login
        </h2>

        <input
          type="email"
          placeholder="Admin Email"
          className="border p-2 w-full mb-4 rounded"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="border p-2 w-full mb-4 rounded"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          type="submit"
          className="bg-black text-white w-full py-2 rounded"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default AdminLogin;