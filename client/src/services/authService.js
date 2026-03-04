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
    },
    updateProfile(data) {
        return axiosClient.put('/auth/update-profile', data);
    },
    changePassword(data) {
        return axiosClient.put('/auth/change-password', data);
    },
    // Upload file ảnh
    uploadAvatar(formData) {
        return axiosClient.post('/auth/upload-avatar', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
    },
    // Địa chỉ
    getAddresses() {
        return axiosClient.get('/auth/addresses');
    },
    addAddress(data) {
        return axiosClient.post('/auth/addresses', data);
    },
    deleteAddress(id) {
        return axiosClient.delete(`/auth/addresses/${id}`);
    }
};

export default authService;