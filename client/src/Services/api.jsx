import axios from "axios";

const API =axios.create({
    baseURL: "http://localhost:5000/api"
});

API.interceptors.request.use((req)=>{
    const admin = req.url?.startsWith("/admin")

    const token = admin? localStorage.getItem("Admintoken"):localStorage.getItem("token");

    if(token){
        req.headers.Authorization = `Bearer ${token}`;
    }
    return req; 
})

export default API;