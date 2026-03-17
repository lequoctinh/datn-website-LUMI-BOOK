const express = require('express');
const router = express.Router();
const { getBooksAdmin, getBookById, createBook, updateBook, toggleStatusBook,getBestSellers, getNewArrivals, getAllBooks } = require('../controllers/bookController');
const { protect, admin } = require('../middlewares/auth');

router.get('/admin', protect, admin, getBooksAdmin);
router.get('/admin/:id', protect, admin, getBookById);
router.post('/admin', protect, admin, createBook);
router.put('/admin/:id', protect, admin, updateBook);
router.patch('/admin/:id/status', protect, admin, toggleStatusBook);

router.get('/best-sellers', getBestSellers);
router.get('/new-arrivals', getNewArrivals);

router.get('/', getAllBooks);
router.get('/:id', getBookById);

module.exports = router;