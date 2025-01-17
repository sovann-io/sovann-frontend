import { ACCESS_TOKEN, API_BASE_URL } from "@/constants/auth";
import axios from "axios";
import localforage from "localforage";

export const getApplicationListService = () => {
    try {
        return localforage.getItem(ACCESS_TOKEN).then(async (token) => {
            const response = await axios.get(`${API_BASE_URL}/applications/user/list`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            return response.data
        })
    } catch (error) {
        console.error("Error fetching applications", error)
    }
}