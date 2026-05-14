import React, { useState } from "react";
import API from "../Services/api";
import { useNavigate } from "react-router-dom";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate()

    const submitHandler = async (e)=>{
        e.preventDefault();
        try {
            const {data} = await API.post("/users/login", {
                email,
                password
            });
            localStorage.setItem("token", data.token);
            alert("Login Successfully")
            console.log(data);
        } catch (error) {
            console.log(error.message);
            alert("Invalid Credentials");
        }

        navigate("/")
    }
    
    return(
        <>
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <form onSubmit={submitHandler} className="bg-white p-8 rounded-lg shadow-md w-96">
                <h2 className="text-2xl font-bold mb-6 text-center">Log in</h2>
                <input type="text" value={email} onChange={(e)=> setEmail(e.target.value)} placeholder="Enter your Email" className="border p-2 w-full mb-4 rounded"/>
                <br /><br />
                <input type="password" value={password} placeholder="Password" onChange={(e)=> setPassword(e.target.value)} className="border p-2 w-full mb-4 rounded" />
                <br /><br />
                <button type="submit" className="bg-blue-500 text-white w-full py-2 rounded hover:bg-blue-600">Login</button>
            </form>
        </div>
        </>
    )
}

export default Login;