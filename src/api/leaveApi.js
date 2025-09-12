import { useAxios } from "../utils/axiosConfig";


export const useLeaveApi = () => {
    const axiosInstance = useAxios();

    const createLeave = async (payload) => {
        const res = await axiosInstance.post("/create-leave", payload);
        return res.data;
    };
    const getLeaveById = async (id) => {
        const res = await axiosInstance.get(`/get-leave/${id}`);
        return res.data.body;
    }
     const updateLeave = async (payload) => {
        try {
            const response = await axiosInstance.put(`/update-leave`, payload);
            return response.data.body;
        } catch (error) {
            throw error.response?.data || { msg: "Failed to update appointment" };
        }
    }

    return { createLeave,getLeaveById,updateLeave };
};
