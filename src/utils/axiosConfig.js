import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://51a5b06a1dee.ngrok-free.app/api", // backend base URL
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
