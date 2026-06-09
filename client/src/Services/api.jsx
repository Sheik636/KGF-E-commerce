import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

API.interceptors.request.use((req) => {
  const url = req.url || "";
  const method = (req.method || "get").toLowerCase();
  const adminToken = localStorage.getItem("Admintoken");
  const userToken = localStorage.getItem("token");

  const needsAdminToken =
    url.startsWith("/admin") ||
    url === "/orders/all" ||
    url.includes("/deliver") ||
    (url.startsWith("/products") && method !== "get");

  const token = needsAdminToken && adminToken ? adminToken : userToken;

  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default API;
