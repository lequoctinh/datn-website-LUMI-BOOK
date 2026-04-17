import axiosClient from '../../utils/axiosClient';

const bannerService = {
    getAll: () => {
        return axiosClient.get('/banners');
    },
    create: (formData) => {
        return axiosClient.post('/banners', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
    },
    update: (id, formData) => {
        return axiosClient.put(`/banners/${id}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
    },
    toggleStatus: (id) => {
        return axiosClient.patch(`/banners/${id}/status`);
    }
};

export default bannerService;