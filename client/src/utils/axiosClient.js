import axios from 'axios';

const axiosClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    timeout: 15000,
    headers: {
        'Content-Type': 'application/json',
    },
});

axiosClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('lumi_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

axiosClient.interceptors.response.use(
    (response) => {
        return response.data;
    },
    (error) => {
        if (error.response) {
            const { status } = error.response;
            
            if (status === 401) {
                localStorage.removeItem('lumi_token');
                window.location.href = '/login';
            }
            
            return Promise.reject(error.response.data);
        }
        
        return Promise.reject({ message: "Lỗi kết nối server" });
    }
);

export default axiosClient;