import axiosInstance from "../utils/axiosConfig";

export const addDoctor = async (token, payload) => {
    try {
        const response = await axiosInstance.post(`/add/doctor`, payload, {
            headers: {
                Authorization: `${token}`,
            },
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || { msg: "Failed to update profile" };
    }
};