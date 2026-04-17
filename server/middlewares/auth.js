const jwt = require('jsonwebtoken');
const { pool } = require('../config/db');

exports.protect = async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }
    if (!token) {
        return res.status(401).json({ message: 'Bạn chưa đăng nhập!' });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const [rows] = await pool.execute(
            'SELECT id, role, trang_thai FROM nguoi_dung WHERE id = ? AND deleted_at IS NULL', 
            [decoded.id]
        );
        if (rows.length === 0) {
            return res.status(401).json({ message: 'Tài khoản không tồn tại hoặc đã bị xóa!' });
        }
        req.user = rows[0]; 
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Token không hợp lệ hoặc đã hết hạn!' });
    }
};

exports.admin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        return res.status(403).json({ message: 'Không có quyền truy cập. Yêu cầu quyền Admin.' });
    }
};