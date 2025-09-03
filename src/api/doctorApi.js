import { useAxios } from "../utils/axiosConfig";


export const useDoctorApi = () => {
    const axiosInstance = useAxios();

    const addDoctor = async (payload) => {
        const res = await axiosInstance.post("/add/doctor", payload);
        return res.data;
    };

    return { addDoctor };
};
