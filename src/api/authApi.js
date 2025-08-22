import axiosInstance from "../utils/axiosConfig";

// Signup API
export const signupUser = async (userData) => {
  try {
    const response = await axiosInstance.post("/auth/signup", userData);
    return response.data; // only return useful data
  } catch (error) {
    throw error.response?.data || { msg: "Something went wrong" };
  }
};


// Signin API
export const signinUser = async (loginData) => {
  try {
    const response = await axiosInstance.post("/auth/signin", loginData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { msg: "Something went wrong" };
  }
};

