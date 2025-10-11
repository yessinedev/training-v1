import axios from "axios";



const axiosInstance = axios.create({
  baseURL: "https://trainingapi.etudionet.life/api", 
});

export default axiosInstance;