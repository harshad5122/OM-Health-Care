// hooks/useAxios.js
import axios from "axios";
import { useAuth } from "../context/AuthContext";

export const useAxios = () => {
  const { token } = useAuth();

  const axiosInstance = axios.create({
    baseURL: "http://localhost:3005/api",
    headers: { "Content-Type": "application/json" },
  });

  axiosInstance.interceptors.request.use(
    (config) => {
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  return axiosInstance;
};
