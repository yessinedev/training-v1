import axios from "axios";



const axiosInstance = axios.create({
  baseURL: "http://localhost:5000/api", // Use the proxy route
});

export default axiosInstance;