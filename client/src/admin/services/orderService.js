import axiosClient from '../../utils/axiosClient';

const orderService = {
    getAll: () => {
        return axiosClient.get('/admin/orders'); 
    },
    updateStatus: (id, status) => {
        return axiosClient.put(`/admin/update-order-status/${id}`, { trang_thai: status });
    },
    getDetail: (id) => {
        return axiosClient.get(`/admin/orders/${id}`); 
    },
    delete: (id) => {
        return axiosClient.delete(`/admin/orders/${id}`);
    }
};

export default orderService;    