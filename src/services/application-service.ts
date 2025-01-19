import { ACCESS_TOKEN, API_BASE_URL } from "@/constants/auth";
import axios from "axios";
import localforage from "localforage";

export const getApplicationListService = async () => {
    try {
        const token = await localforage.getItem(ACCESS_TOKEN);
        const response = await axios.get(`${API_BASE_URL}/applications/user/list`, {
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

export const getApplicationDetailById = async (id: string) => {
    try {
        const token = await localforage.getItem(ACCESS_TOKEN);
        const response = await axios.get(`${API_BASE_URL}/applications/${id}/details`, {
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

export const editAppNameById = async (id: string, appName: string) => {
    try {
        const token = await localforage.getItem(ACCESS_TOKEN);
        const response = await axios.put(`${API_BASE_URL}/applications/${id}/edit-app-name`, JSON.stringify({
            "app_name": appName
        }), {
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

export const deleteAppNameById = async (id: string) => {
    try {
        const token = await localforage.getItem(ACCESS_TOKEN);
        const response = await axios.delete(`${API_BASE_URL}/applications/${id}/delete`, {
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