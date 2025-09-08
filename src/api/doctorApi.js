import { useAxios } from "../utils/axiosConfig";


export const useDoctorApi = () => {
    const axiosInstance = useAxios();

    const addDoctor = async (payload) => {
        const res = await axiosInstance.post("/add/doctor", payload);
        return res.data;
    };

    const getDoctor = async ({ skip, limit, search,from_date,to_date }) => {
        const res = await axiosInstance.get(`/get/doctor/?skip=${skip}&limit=${limit}&search=${search}&from_date=${from_date}&to_date=${to_date}`);
        return res.data.body;
    };
    const getDoctorById = async (id) => {
        const res = await axiosInstance.get(`/get/doctor/${id}`);
        return res.data.body;
    }

    const updateDoctor = async (id, payload) => {
        const res = await axiosInstance.put(`/edit/doctor/${id}`, payload);
        return res.data.body;
    }

    return { addDoctor, getDoctor, getDoctorById, updateDoctor };
};
