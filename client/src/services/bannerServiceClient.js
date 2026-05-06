import axiosClient from "../utils/axiosClient";

const bannerServiceClient = {
    getAll: () => {
        return axiosClient.get('/banners');
    },
    getAll: () => {
        return axiosClient.get('/banners/active');
    },
    toggleStatus: (id) => {
        return axiosClient.patch(`/banners/${id}/status`);
    }
};

export default bannerServiceClient;