const express = require('express');
const router = express.Router();
const adminOrderController = require('../controllers/adminOrderController');
const { protect, admin } = require('../middlewares/auth');

router.use(protect);
router.use(admin); 

// Route lấy danh sách: /api/admin/orders
router.get('/orders', adminOrderController.getAllOrders);

// Route cập nhật: /api/admin/update-order-status/:id
router.put('/update-order-status/:id', adminOrderController.updateOrderStatus);

router.get('/orders/:id', adminOrderController.getOrderDetail);

// Thêm vào cùng nhóm với các route admin khác
router.get('/stats/overview', adminOrderController.getDashboardStats);

router.get('/stats/charts', adminOrderController.getChartData);

router.get('/stats/low-stock', adminOrderController.getLowStockBooks);

router.get('/stats/top-selling', adminOrderController.getTopSellingBooks);

router.get('/stats/top-rated', adminOrderController.getTopRatedBooks);
module.exports = router;