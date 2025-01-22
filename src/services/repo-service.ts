import { ACCESS_TOKEN, API_BASE_URL } from "@/constants/auth";
import axios from "axios";
import localforage from "localforage";

export const getRepositoryByAppId = async (appId: string) => {
    try {
        const token = await localforage.getItem(ACCESS_TOKEN);
        console.log(`${API_BASE_URL}/repos/${appId}/read`)
        const response = await axios.get(`${API_BASE_URL}/repos/${appId}/applications`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return await response.data;
    } catch (error) {
        console.error("Error fetching applications", error)
        throw error
    }
}