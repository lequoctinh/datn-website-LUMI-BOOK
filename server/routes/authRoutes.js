const express = require('express');
const router = express.Router();
const { register, login, googleLogin, getMe,updateProfile, changePassword, verifyEmail } = require('../controllers/authController');
const { upload, uploadAvatar, getAddresses, addAddress, deleteAddress } = require('../controllers/userController');
const { protect } = require('../middlewares/auth');

router.post('/register', register);
router.post('/login', login);
router.post('/google', googleLogin);
router.post('/verify-email', verifyEmail);

router.get('/me', protect, getMe);
router.put('/update-profile', protect, updateProfile);
router.put('/change-password', protect, changePassword);

router.post('/upload-avatar', protect, upload.single('avatar'), uploadAvatar);

router.get('/addresses', protect, getAddresses);
router.post('/addresses', protect, addAddress);
router.delete('/addresses/:id', protect, deleteAddress);

module.exports = router;