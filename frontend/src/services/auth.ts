import axios from "axios";

const API_URL = "https://yygiw0mscc.execute-api.us-east-1.amazonaws.com/api/auth";

export const login = async (email: string, password: string) => {
    const response = await axios.post(`${API_URL}/login`, {
        email,
        password,
    });
    localStorage.setItem("accessToken", response.data.accessToken);
    localStorage.setItem("refreshToken", response.data.refreshToken);
    localStorage.setItem("username", response.data.username);
    return response.data;
};

export const register = async (
    username: string,
    email: string,
    password: string
) => {
    const response = await axios.post(`${API_URL}/register`, {
        username,
        email,
        password,
    });
    return response.data;
};

export const refreshToken = async () => {
    const refreshToken = localStorage.getItem("refreshToken");
    const response = await axios.post(`${API_URL}/refresh-token`, {
        token: refreshToken,
    });
    localStorage.setItem("accessToken", response.data.accessToken);
    return response.data.accessToken;
};
