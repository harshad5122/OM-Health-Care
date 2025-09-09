import { useAxios } from "../utils/axiosConfig";


export const useNotificationApi = () => {
    const axiosInstance = useAxios();

    const getNotifications = async () => {
        const res = await axiosInstance.get("/notification");
        return res.data;
    };



    return { getNotifications };
};
