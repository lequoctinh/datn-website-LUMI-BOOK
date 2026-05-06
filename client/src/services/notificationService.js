import axiosClient from '../utils/axiosClient';

const notificationService = {
    getAll: () => {
        return axiosClient.get('/notifications'); 
    },
    markAsRead: (id) => {
        return axiosClient.put(`/notifications/${id}/read`);
    },
    markAllAsRead: () => {
        return axiosClient.put('/notifications/mark-all-read');
    }
};

export default notificationService;