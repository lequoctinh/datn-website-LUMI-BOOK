import axiosClient from '../utils/axiosClient';

const reviewService = {
    getReviewsByBook: (sach_id) => {
        return axiosClient.get(`/reviews/book/${sach_id}`);
    },
    createReview: (data) => {
        return axiosClient.post('/reviews/create', data);
    },
    deleteReview: (id) => {
        return axiosClient.delete(`/reviews/delete/${id}`);
    },
    getAdminReviews: () => {
        return axiosClient.get('/reviews/admin/all');
    },
    updateStatus: (id, trang_thai) => {
        return axiosClient.put(`/reviews/admin/status/${id}`, { trang_thai });
    }
};

export default reviewService;