import axiosClient from '../utils/axiosClient';

const authService = {
    // Đăng ký
    register: (data) => {
        return axiosClient.post('/auth/register', data);
    },

    // Đăng nhập thường
    login: (data) => {
        return axiosClient.post('/auth/login', data);
    },

    // Đăng nhập Google
    loginGoogle: (data) => {
        return axiosClient.post('/auth/google', data);
    },

    // Lấy thông tin user hiện tại
    getMe: () => {
        return axiosClient.get('/auth/me');
    }
};

export default authService;