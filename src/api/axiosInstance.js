import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:4000',
});

axiosInstance.interceptors.request.use((config) => {
    // אנחנו שולפים את הטוקן ממש רגע לפני שהבקשה יוצאת
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default axiosInstance;