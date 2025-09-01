// src/api/messageApi.js
import axiosInstance from "../utils/axiosConfig";


export const getMessageList = async ( adminId, token) => {
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

// // api/messageApi.js
// import axios from "axios";

// const BASE_URL = "http://localhost:3005/api"; 
// // later you can replace with your deployed backend URL

// export const getMessageList = async (userId, token) => {
//   try {
//     const res = await axios.get(`${BASE_URL}/message/list`, {
//       params: { user_id: userId },
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `${token}`,
//       },
//     });

//     console.log("Full API Response:", res.data);
//     console.log("api response", res.data.success);
//     console.log("api body:", Array.isArray(res.data.body));

//     const messages = res.data?.body || res.data?.data || res.data || [];
//     if (!Array.isArray(messages)) {
//       console.warn("API response is not an array:", messages);
//       return [];
//     }

//     return messages;
//   } catch (err) {
//     console.error("Error fetching messages:", err);
//     return [];
//   }
// };
