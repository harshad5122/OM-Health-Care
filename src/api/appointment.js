import { useAxios } from "../utils/axiosConfig";


export const useAppointmentApi = () => {
    const axiosInstance = useAxios();

    const createAppointment = async (payload) => {
        const res = await axiosInstance.post("/create-appointment", payload);
        return res.data;
    };
    const getPatients = async () => {
        try {
        const response = await axiosInstance.get(`/get-patients`);
        return response.data.body; 
        } catch (error) {
        throw error.response?.data || { msg: "Failed to fetch profile" };
        }
    };



    return { createAppointment ,getPatients};
};
