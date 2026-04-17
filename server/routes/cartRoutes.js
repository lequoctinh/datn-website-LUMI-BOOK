const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const { protect } = require('../middlewares/auth');

router.use(protect);

router.get('/', cartController.getCart);
router.post('/add', cartController.addToCart);

router.put('/update/:id', cartController.updateCart);
router.delete('/:id', cartController.removeFromCart);
router.delete('/clear/all', cartController.clearCart);

module.exports = router;