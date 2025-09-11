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
            throw error.response?.data || { msg: "Failed to fetch patients" };
        }
    };

    const getAppointments = async (id, from_date, to_date) => {
        try {
            const response = await axiosInstance.get(`/get-appointment-by-doctor/${id}?from=${from_date}&to=${to_date}`);
            return response.data.body;
        } catch (error) {
            throw error.response?.data || { msg: "Failed to fetch appointments" };
        }
    }

    const updateAppointment = async (payload) => {
        try {
            const response = await axiosInstance.put(`/update-appointment`, payload);
            return response.data.body;
        } catch (error) {
            throw error.response?.data || { msg: "Failed to update appointment" };
        }
    }


    return { createAppointment, getPatients, getAppointments, updateAppointment };
};
