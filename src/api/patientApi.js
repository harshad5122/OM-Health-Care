import { useAxios } from "../utils/axiosConfig";

export const usePatientApi = () => {
    const axiosInstance = useAxios();

    
    const editPatientStatus = async (id, payload) => {
        try {
            const response = await axiosInstance.put(`/update-patient-status/${id}`, payload);
            return response.data.body;
        } catch (error) {
            throw error.response?.data || { msg: "Failed to update leave" };
        }
    };

    const getPatientByAssignDoctor = async (id) => {
        const res = await axiosInstance.get(`/get-patients-by-assign-doctor?doctor_id=${id}`);
        return res.data.body;
    }

    return { editPatientStatus,getPatientByAssignDoctor};
};
