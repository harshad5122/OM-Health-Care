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

  const getUserList = async (payload) => {
    try {
      const response = await axiosInstance.get(`/user/list/?skip=${payload?.skip}&limit=${payload?.limit}&search=${payload?.search}&from_date=${payload?.from_date}&to_date=${payload?.to_date}`);
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

  const editUser = async (id, userData) => {
    try {
      const response = await axiosInstance.put(`/edit/user/${id}`, userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { msg: "Failed to update user" };
    }
  }

  const getUserById = async (id) => {
    try {
      const response = await axiosInstance.get(`/user/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { msg: "Failed to get user" };
    }
  }

  const deleteUser = async (id) => {
    try {
      const response = await axiosInstance.delete(`/delete/user/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { msg: "Failed to delete user" };
    }
  };


  return {
    getAdminList,
    getProfile,
    getStaffList,
    updateProfile,
    getUserList,
    createUser,
    editUser,
    getUserById,
    deleteUser
  }
}