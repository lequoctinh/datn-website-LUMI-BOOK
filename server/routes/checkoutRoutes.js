const express = require('express');
const router = express.Router();
const checkoutController = require('../controllers/checkoutController');
const { protect } = require('../middlewares/auth'); // Middleware xác thực JWT

router.use(protect); // Tất cả các route bên dưới cần đăng nhập

router.post('/place-order', checkoutController.createOrder);
router.get('/my-orders', checkoutController.getMyOrders);
router.get('/my-orders/:id', checkoutController.getOrderDetail);
router.put('/update-order/:id', checkoutController.updateOrder);
router.put('/cancel-order/:id', checkoutController.cancelOrder);

module.exports = router;