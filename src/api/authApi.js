import { useAxios } from "../utils/axiosConfig";

// Signup API
export const useAuthApi = () => {
  const axiosInstance = useAxios();
  const signupUser = async (userData) => {
    try {
      const response = await axiosInstance.post("/auth/signup", userData);
      return response.data; // only return useful data
    } catch (error) {
      throw error.response?.data || { msg: "Something went wrong" };
    }
  };


  // Signin API
  const signinUser = async (loginData) => {
    try {
      const response = await axiosInstance.post("/auth/signin", loginData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { msg: "Something went wrong" };
    }
  };


  const logoutUser = async (token) => {
    try {
      const response = await axiosInstance.post(
        `/auth/logout`,
        {},
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );
      return response.data.body;
    } catch (error) {
      throw error.response?.data || { msg: "Failed to logout" };
    }
  };

  const changePassword = async (userData) => {
    try {
      const response = await axiosInstance.post("/auth/change-password", userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { msg: "Something went wrong" };
    }
  };
  return {
    signupUser,
    signinUser,
    logoutUser,
    changePassword
  };
}