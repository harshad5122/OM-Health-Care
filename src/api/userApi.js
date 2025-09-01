// src/api/userApi.js
import axiosInstance from "../utils/axiosConfig";

export const getAdminList = async (token) => {
  try {
    const response = await axiosInstance.get(`/admin/list`, {
      headers: {
        Authorization: `${token}`,
      },
    });
    return response.data.body;
  } catch (error) {
    throw error.response?.data || { msg: "Failed to fetch admin list" };
  }
};

export const getStaffList = async (token) => {
  try {
    const response = await axiosInstance.get(`/staff/list`, {
      headers: {
        Authorization: `${token}`,
      },
    });
    return response.data.body;
  } catch (error) {
    throw error.response?.data || { msg: "Failed to fetch staff list" };
  }
};

export const getUserList = async (token) => {
  try {
    const response = await axiosInstance.get(`/user/list`, {
      headers: {
        Authorization: `${token}`,
      },
    });
    return response.data.body;
  } catch (error) {
    throw error.response?.data || { msg: "Failed to fetch user list" };
  }
};


export const getProfile = async (token) => {
  try {
    const response = await axiosInstance.get(`/user/profile`, {
      headers: {
        Authorization: `${token}`, // must be "Bearer <token>"
      },
    });
    return response.data.body; // adjust if your backend wraps response differently
  } catch (error) {
    throw error.response?.data || { msg: "Failed to fetch profile" };
  }
};


export const updateProfile = async (token, profileData) => {
  try {
    const response = await axiosInstance.put(`/update/profile`, profileData, {
      headers: {
        Authorization: `${token}`,
      },
    });
    return response.data.body;
  } catch (error) {
    throw error.response?.data || { msg: "Failed to update profile" };
  }
};