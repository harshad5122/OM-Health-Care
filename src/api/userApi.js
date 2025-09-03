// src/api/userApi.js

import { useAxios } from "../utils/axiosConfig";

export const useUserApi = () => {
  const axiosInstance = useAxios();
  const getAdminList = async (token) => {
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

  const getStaffList = async (token) => {
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

  const getUserList = async (token) => {
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


  const getProfile = async () => {
    try {
      const response = await axiosInstance.get(`/user/profile`);
      return response.data.body; // adjust if your backend wraps response differently
    } catch (error) {
      throw error.response?.data || { msg: "Failed to fetch profile" };
    }
  };


  const updateProfile = async (token, profileData) => {
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
  const createUser = async (userData) => {
    try {
      const response = await axiosInstance.post(`/user/add`, userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { msg: "Failed to update profile" };
    }
  };
  return {
    getAdminList,
    getProfile,
    getStaffList,
    updateProfile,
    getUserList,
    createUser
  }
}