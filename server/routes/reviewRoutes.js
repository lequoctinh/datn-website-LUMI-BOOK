const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const { protect } = require('../middlewares/auth');

router.post('/create', protect, reviewController.createReview);
router.get('/book/:sach_id', reviewController.getReviewsByBook);
router.delete('/delete/:id', protect, reviewController.deleteReview);

router.get('/admin/all', protect, reviewController.getAllReviewsAdmin);
router.put('/admin/status/:id', protect, reviewController.updateReviewStatus);

module.exports = router;