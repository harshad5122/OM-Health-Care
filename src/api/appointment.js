import { useAxios } from "../utils/axiosConfig";


export const useAppointmentApi = () => {
    const axiosInstance = useAxios();

    const createAppointment = async (payload) => {
        const res = await axiosInstance.post("/create-appintment", payload);
        return res.data;
    };



    return { createAppointment };
};
