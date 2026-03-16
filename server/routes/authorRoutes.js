const express = require('express');
const router = express.Router();
const { getAllAuthors, createAuthor, updateAuthor, deleteAuthor } = require('../controllers/authorController');
const { protect, admin } = require('../middlewares/auth');

router.get('/', getAllAuthors);
router.post('/', protect, admin, createAuthor);
router.put('/:id', protect, admin, updateAuthor);
router.delete('/:id', protect, admin, deleteAuthor);

module.exports = router;