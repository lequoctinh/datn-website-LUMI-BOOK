import axiosClient from '../utils/axiosClient';

const customerService = {
    getAll: async () => {
        const res = await axiosClient.get('/auth/admin/users');
        return res; 
    },
    updateStatus: (id, status) => {
        return axiosClient.put(`/auth/admin/users/${id}/status`, { trang_thai: status });
    },
    delete: (id) => {
        return axiosClient.delete(`/auth/admin/users/${id}`);
    }
};

export default customerService;