import axiosClient from '../../utils/axiosClient';

const voucherService = {
    getAll: () => axiosClient.get('/admin/vouchers'),
    getById: (id) => axiosClient.get(`/admin/vouchers/${id}`),
    create: (data) => axiosClient.post('/admin/vouchers', data),
    update: (id, data) => axiosClient.put(`/admin/vouchers/${id}`, data),
    delete: (id) => axiosClient.delete(`/admin/vouchers/${id}`),
    toggleStatus: (id, status) => axiosClient.put(`/admin/vouchers/status/${id}`, { trang_thai: status })
};

export default voucherService;