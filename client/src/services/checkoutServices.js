import axiosClient from "../utils/axiosClient";

const checkoutService = {
    getCart: () => {
        return axiosClient.get('/cart');
    },
    placeOrder: (orderData) => {
        return axiosClient.post('/checkout/place-order', orderData);
    }
};

export default checkoutService;