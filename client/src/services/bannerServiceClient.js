import axiosClient from "../utils/axiosClient";

const bannerServiceClient = {
    getAll: () => {
        return axiosClient.get('/banners/active');
    }
};

export default bannerServiceClient;