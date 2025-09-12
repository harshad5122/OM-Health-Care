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

    return { createLeave,getLeaveById };
};
