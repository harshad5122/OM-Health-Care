import { useAxios } from "../utils/axiosConfig";


export const useNotificationApi = () => {
    const axiosInstance = useAxios();

    const getNotifications = async () => {
        const res = await axiosInstance.get("/notification");
        return res.data;
    };

    const updateNotificationStatus = async (payload) => {
        const res = await axiosInstance.put(`/update-status`, payload);
        return res.data.body;
    }

    const getNotificationById = async (id) => {
        const res = await axiosInstance.get(`/mark-seen/${id}`);
        return res.data.body;
    }

    return { getNotifications,updateNotificationStatus ,getNotificationById};
};
