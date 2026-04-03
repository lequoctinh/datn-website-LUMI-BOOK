const express = require('express');
const router = express.Router();
const voucherController = require('../controllers/voucherController');
const { protect, admin } = require('../middlewares/auth');

//  GET /api/admin/vouchers
router.get('/', protect, admin, voucherController.getAllVouchers);

//  GET /api/admin/vouchers/:id
router.get('/:id', protect, admin, voucherController.getVoucherById);

// POST /api/admin/vouchers
router.post('/', protect, admin, voucherController.createVoucher);

//  PUT /api/admin/vouchers/:id
router.put('/:id', protect, admin, voucherController.updateVoucher);

// DELETE /api/admin/vouchers/:id
router.delete('/:id', protect, admin, voucherController.deleteVoucher);

// PUT /api/admin/vouchers/status/:id
router.put('/status/:id', protect, admin, voucherController.updateStatus);

// Route cho khách hàng sử dụng ở trang Checkout (không cần quyền admin)
router.post('/check', protect, voucherController.checkVoucher);

module.exports = router;