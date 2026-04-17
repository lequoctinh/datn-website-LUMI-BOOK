const express = require('express');
const router = express.Router();
const { getBooksAdmin, getBookById, createBook, updateBook, toggleStatusBook, getBestSellers, getNewArrivals, getAllBooks } = require('../controllers/bookController');
const { protect, admin } = require('../middlewares/auth');
const upload = require('../utils/upload'); 

const bookUpload = upload.fields([
    { name: 'hinh_anh', maxCount: 1 },  
    { name: 'album_anh', maxCount: 8 }    
]);

// --- ROUTES CHO ADMIN ---
// Lấy danh sách 
router.get('/admin', protect, admin, getBooksAdmin);

// Lấy chi tiết 1 cuốn sách
router.get('/admin/:id', protect, admin, getBookById);

// Thêm mới sách 
router.post('/admin', protect, admin, bookUpload, createBook);

// Cập nhật sách 
router.put('/admin/:id', protect, admin, bookUpload, updateBook);

// Thay đổi trạng thái ẩn/hiện
router.patch('/admin/:id/status', protect, admin, toggleStatusBook);


// --- ROUTES CHO CLIENT 
router.get('/best-sellers', getBestSellers);
router.get('/new-arrivals', getNewArrivals);
router.get('/', getAllBooks);
router.get('/:id', getBookById);

module.exports = router;