const express = require('express');
const router = express.Router();
const bannerController = require('../controllers/bannerController');
const upload = require('../utils/upload'); 

router.post('/', upload.single('hinh_anh_banner'), bannerController.createBanner);

router.put('/:id', upload.single('hinh_anh_banner'), bannerController.updateBanner);

router.get('/', bannerController.getAllBanners);
router.get('/active', bannerController.getActiveBanners);
router.patch('/:id/status', bannerController.toggleBannerStatus);

module.exports = router;