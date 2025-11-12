import axios from "axios";
import { refreshToken } from "./auth";

const API_URL = "http://localhost:3000/api/tasks";

const axiosInstance = axios.create();

axiosInstance.interceptors.request.use(
    async (config) => {
        const token = localStorage.getItem("accessToken");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;
        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const newAccessToken = await refreshToken();
                axios.defaults.headers.common[
                    "Authorization"
                ] = `Bearer ${newAccessToken}`;
                return axiosInstance(originalRequest);
            } catch (refreshError) {
                localStorage.removeItem("accessToken");
                localStorage.removeItem("refreshToken");
                localStorage.removeItem("username");
                window.dispatchEvent(new Event("sessionExpired"));
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

export const getTasks = async () => {
    const response = await axiosInstance.get(API_URL);
    return response.data;
};

export const createTask = async (
    title: string,
    description: string,
    priority: string = "media",
    status: string = "pendiente"
) => {
    const response = await axiosInstance.post(API_URL, {
        title,
        description,
        priority,
        status,
    });
    return response.data;
};

export const updateTask = async (
    id: number,
    title: string,
    description: string,
    priority: string,
    status: string
) => {
    const response = await axiosInstance.put(`${API_URL}/${id}`, {
        title,
        description,
        priority,
        status,
    });
    return response.data;
};


export const deleteTask = async (id: number) => {
    await axiosInstance.delete(`${API_URL}/${id}`);
};
