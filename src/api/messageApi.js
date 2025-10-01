// src/api/messageApi.js

import { useAxios } from "../utils/axiosConfig";


export const useMessageApi = () => {
  const axiosInstance = useAxios();
  const getMessageList = async (payload, token) => {
    try {
       const queryParam = payload.type === 'broadcast' 
        ? `broadcast_id=${payload.id}` 
        : `user_id=${payload.id}`;
      const response = await axiosInstance.get(
        `/message/list?${queryParam}`,
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );
      console.log('response->', response.data)
      return response.data.body;

    } catch (error) {
      throw error.response?.data || { msg: "Failed to fetch messages" };
      return [];
    }
  };

   const getBroadcastList = async (token) => {
    try {
      const response = await axiosInstance.get(
        `/broadcasts`, 
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );
      // return response.data.body;
       return Array.isArray(response?.data?.body) ? response.data.body : [];
    } catch (error) {
       console.error("Failed to fetch broadcast list:", error);
      throw error.response?.data || { msg: "Failed to fetch broadcast list" };
      return [];
    }
  };

  const getBroadcastRecipients = async (broadcastId, token) => {
    try {
      const response = await axiosInstance.get(
        `/broadcasts/recipients/${broadcastId}`, 
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );
      return Array.isArray(response?.data?.body) ? response.data.body : [];
    } catch (error) {
      console.error("Failed to fetch broadcast recipients:", error);
      return [];
    }
  };


  return {
    getMessageList,
    getBroadcastList,
    getBroadcastRecipients 
  };
}

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
