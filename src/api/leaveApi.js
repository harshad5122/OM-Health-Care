import { useAxios } from "../utils/axiosConfig";


export const useLeaveApi = () => {
    const axiosInstance = useAxios();

    const createLeave = async (payload) => {
        const res = await axiosInstance.post("/create-leave", payload);
        return res.data;
    };
    // const getLeaveById = async (id) => {
    //     const res = await axiosInstance.get(`/get-leave/${id}`);
    //     return res.data.body;
    // }
    const getLeaveById = async (id, from_date, to_date) => {
        try {
            let url = `/get-leave/${id}`;
            if (from_date && to_date) {
                url += `?from=${from_date}&to=${to_date}`;
            }

            const res = await axiosInstance.get(url);
            return res.data.body;
        } catch (error) {
            throw error.response?.data || { msg: "Failed to fetch leave data" };
        }
    };

     const updateLeave = async (payload) => {
        try {
            const response = await axiosInstance.put(`/update-leave-status`, payload);
            return response.data.body;
        } catch (error) {
            throw error.response?.data || { msg: "Failed to update appointment" };
        }
    }
    const deleteLeave = async (id) => {
        try {
        const response = await axiosInstance.delete(`/delete-leave/${id}`);
        return response.data;
        } catch (error) {
        throw error.response?.data || { msg: "Failed to delete user" };
        }
    };
    const editLeave = async (id, payload) => {
        try {
            const response = await axiosInstance.put(`/update-leave/${id}`, payload);
            return response.data.body;
        } catch (error) {
            throw error.response?.data || { msg: "Failed to update leave" };
        }
    };


    return { createLeave,getLeaveById,updateLeave,deleteLeave ,editLeave};
};
