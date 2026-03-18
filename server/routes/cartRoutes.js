const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const { protect } = require('../middlewares/auth');

router.use(protect);

router.get('/', cartController.getCart);
router.post('/add', cartController.addToCart);

// Sửa lại tên hàm cho đúng với Controller bạn đã gửi
router.put('/update', cartController.updateCartQuantity); 
router.delete('/:id', cartController.removeCartItem);
router.delete('/clear/all', cartController.clearCart);

module.exports = router;