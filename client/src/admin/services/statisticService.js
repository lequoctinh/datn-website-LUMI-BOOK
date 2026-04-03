import axiosClient from '../../utils/axiosClient';

const statisticService = {
    getDashboardData: (startDate, endDate) => {
        return axiosClient.get('/admin/stats/overview', {
            params: { startDate, endDate }
        });
    },

    getLowStockBooks: () => {
        return axiosClient.get('/admin/stats/low-stock');
    },

    getTopSelling: () => {
        return axiosClient.get('/admin/stats/top-selling');
    },

    getTopRated: () => {
        return axiosClient.get('/admin/stats/top-rated');
    }
};

export default statisticService;