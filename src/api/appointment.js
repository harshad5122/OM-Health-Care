import { useAxios } from "../utils/axiosConfig";


export const useAppointmentApi = () => {
    const axiosInstance = useAxios();

    const createAppointment = async (payload) => {
        const res = await axiosInstance.post("/create-appointment", payload);
        return res.data;
    };
    // const getPatients = async () => {
    //     try {
    //         const response = await axiosInstance.get(`/get-patients`);
    //         return response.data.body;
    //     } catch (error) {
    //         throw error.response?.data || { msg: "Failed to fetch patients" };
    //     }
    // };
    const getPatients = async (id, from_date, to_date) => {
        try {
            let url = "/get-patients";
            if (id && from_date && to_date) {
                url = `/get-patients/?from_date=${from_date}&to_date=${to_date}&doctor_id=${id}`;
            }
            const response = await axiosInstance.get(url);
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
    const getAppointmentList = async (id,from_date, to_date,status) => {
        try {
            const response = await axiosInstance.get(`/get-appointment-list/${id}?from=${from_date}&to=${to_date}&status=${status}`);
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

   const getAppointmentsByPatients = async (doctorid,patientid, from_date, to_date) => {
        try {
            const response = await axiosInstance.get(`/get-appointment-by-patient/${doctorid}/${patientid}?from=${from_date}&to=${to_date}`);
            return response.data.body;
        } catch (error) {
            throw error.response?.data || { msg: "Failed to fetch appointments" };
        }
    }
    return { createAppointment, getPatients, getAppointments, updateAppointment ,getAppointmentList,getAppointmentsByPatients};
};
