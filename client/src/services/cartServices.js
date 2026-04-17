import axiosClient from '../utils/axiosClient';

const cartService = {
    getCart: () => {
        return axiosClient.get('/cart');
    },
    addToCart: (data) => {
        return axiosClient.post('/cart/add', data);
    },
    updateCart: (id, so_luong) => {
        return axiosClient.put(`/cart/update/${id}`, { so_luong });
    },
    removeFromCart: (id) => {
        return axiosClient.delete(`/cart/${id}`);
    },
    clearCart: () => {
        return axiosClient.delete('/cart/clear/all');
    }
};

export default cartService;