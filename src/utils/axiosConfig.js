import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://c16ebadfc0bd.ngrok-free.app/api", 
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
