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

export default apiClient;
