import axios from 'axios';

const rawApiUrl = import.meta.env.VITE_API_URL;

const normalizeApiBaseUrl = (url) => {
    if (!url) return '/api';

    const trimmed = url.replace(/\/+$/, '');
    return trimmed.endsWith('/api') ? trimmed : `${trimmed}/api`;
};

const apiBaseUrl = normalizeApiBaseUrl(rawApiUrl);

const apiClient = axios.create({
    baseURL: apiBaseUrl,
    withCredentials: true,
});

apiClient.interceptors.request.use((config) => {
    try {
        const userStr = localStorage.getItem("user");
        if (userStr) {
            const user = JSON.parse(userStr);
            if (user && user.token) {
                config.headers.Authorization = `Bearer ${user.token}`;
            }
        }
    } catch (error) {
        console.error("Error reading token from localStorage:", error);
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default apiClient;
