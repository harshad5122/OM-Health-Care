import { useAxios } from "../utils/axiosConfig";


export const useAppointmentApi = () => {
    const axiosInstance = useAxios();

    const createAppointment = async (payload) => {
        const res = await axiosInstance.post("/create-appointment", payload);
        return res.data;
    };
   
    const getPatients = async (id, from_date, to_date, status,skip, limit, search) => {
        try {
            let url = `/get-patients?`;

            if (id) url += `doctor_id=${id}&`;
            if (from_date) url += `from_date=${from_date}&`;
            if (to_date) url += `to_date=${to_date}&`;
            if (status) url += `patient_status=${status}&`;
            if (skip !== undefined && skip !== null) url += `skip=${skip}&`;
            if (limit !== undefined && limit !== null) url += `limit=${limit}&`;
            if (search) url += `search=${search}&`;
            // remove trailing '&' if present
            if (url.endsWith("&")) url = url.slice(0, -1);

            const response = await axiosInstance.get(url);
            return response.data.body;
        } catch (error) {
            throw error.response?.data || { msg: "Failed to fetch patients" };
        }
    };

    // const getPatients = async (id, from_date, to_date,status) => {
    //     try {
    //         let url = "/get-patients";
    //         if (id) {
    //         url += `?doctor_id=${id}`; 
    //         }
    //         if ( from_date && to_date) {
    //             url = `/get-patients/?from_date=${from_date}&to_date=${to_date}&doctor_id=${id}`;
    //         }
    //         const response = await axiosInstance.get(url);
    //         return response.data.body;
    //     } catch (error) {
    //         throw error.response?.data || { msg: "Failed to fetch patients" };
    //     }
    // };

    const getAppointments = async (id, from_date, to_date) => {
        try {
            const response = await axiosInstance.get(`/get-appointment-by-doctor/${id}?from=${from_date}&to=${to_date}`);
            return response.data.body;
        } catch (error) {
            throw error.response?.data || { msg: "Failed to fetch appointments" };
        }
    }
    // const getAppointmentList = async (id,from_date, to_date,status,skip, limit, search,) => {
    //     try {
    //         const response = await axiosInstance.get(`/get-appointment-list/${id}?from=${from_date}&to=${to_date}&status=${status}`);
    //         return response.data.body;
    //     } catch (error) {
    //         throw error.response?.data || { msg: "Failed to fetch appointments" };
    //     }
    // }
    const getAppointmentList = async (id, from_date, to_date, status, skip, limit, search) => {
        try {
            let query = `/get-appointment-list/${id}?from=${from_date}&to=${to_date}&status=${status}`;

            if (skip !== undefined && skip !== null) {
                query += `&skip=${skip}`;
            }
            if (limit !== undefined && limit !== null) {
                query += `&limit=${limit}`;
            }
            if (search) {
                query += `&search=${search}`;
            }

            const response = await axiosInstance.get(query);
            return response.data.body;
        } catch (error) {
            throw error.response?.data || { msg: "Failed to fetch appointments" };
        }
    };


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
