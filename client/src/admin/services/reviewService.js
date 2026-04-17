import axiosClient from '../../utils/axiosClient';
const reviewService = {
    getAll: () => {
        return axiosClient.get('/reviews/admin/all'); 
    },
    updateStatus: (id, trang_thai) => {
        return axiosClient.put(`/reviews/admin/status/${id}`, { trang_thai });
    },
    delete: (id) => {
        return axiosClient.delete(`/reviews/delete/${id}`);
    }
};

export default reviewService;