// src/api/messageApi.js
import axiosInstance from "../utils/axiosConfig";


export const getMessages = async ( adminId, token) => {
  try {
    const response = await axiosInstance.get(
      `/message/list?user_id=${adminId}`, 
      {
        headers: {
          Authorization: `${token}`,
        },
      }
    );
    console.log('response->',response.data)
    return response.data.body; 
    
  } catch (error) {
    throw error.response?.data || { msg: "Failed to fetch messages" };
  }
};
