import { useAxios } from "../utils/axiosConfig";


export const useDashboardApi = () => {
    const axiosInstance = useAxios();

    const getChart = async (payload) => {
        try {
            const response = await axiosInstance.post(`/get-charts`, payload);
            return response.data;
        } catch (error) {
            throw error.response?.data || { msg: "Failed to update appointment" };
        }
    }
 
    return { getChart};
};
