// src/api/uploadFileApi.js
import { useAxios } from "../utils/axiosConfig";

export const useUploadFile = () => {
  const axiosInstance = useAxios();
  const uploadFile = async (file, token) => {
    try {
      const formData = new FormData();
      formData.append("files", file);

      const response = await axiosInstance.post("/file/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `${token}`,
        },
      });
      console.log("Full API response upload file->", response.data);
      return response.data;
    } catch (error) {
      throw error.response?.data || { msg: "File upload failed" };
    }
  };
  return {
    uploadFile
  }
}
