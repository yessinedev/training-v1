// lib/axios.js
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "/api", // Use the proxy route
});

export default axiosInstance;