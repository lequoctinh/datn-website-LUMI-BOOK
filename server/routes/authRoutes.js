const express = require('express');
const router = express.Router();
const { register, login, googleLogin, getMe, verifyEmail } = require('../controllers/authController');
const { protect } = require('../middlewares/auth');

router.post('/register', register);
router.post('/login', login);
router.post('/google', googleLogin);
router.post('/verify-email', verifyEmail);
router.get('/me', protect, getMe);


module.exports = router;