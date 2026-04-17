const express = require('express');
const router = express.Router();
const { getAllPublishers, createPublisher, updatePublisher, deletePublisher } = require('../controllers/publisherController');
const { protect, admin } = require('../middlewares/auth');

router.get('/', getAllPublishers);
router.post('/', protect, admin, createPublisher);
router.put('/:id', protect, admin, updatePublisher);
router.delete('/:id', protect, admin, deletePublisher);

module.exports = router;