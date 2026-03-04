const { pool } = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Helper: Tạo Token JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE,
    });
};

// 1. ĐĂNG KÝ TÀI KHOẢN THƯỜNG
exports.register = async (req, res) => {
    const { ho_ten, email, mat_khau, so_dien_thoai } = req.body;

    if (!ho_ten || !email || !mat_khau) {
        return res.status(400).json({ message: 'Vui lòng nhập đầy đủ thông tin!' });
    }

    try {
        const [existingUsers] = await pool.execute(
            'SELECT id FROM nguoi_dung WHERE email = ? AND deleted_at IS NULL', 
            [email]
        );
        
        if (existingUsers.length > 0) {
            return res.status(400).json({ message: 'Email này đã được sử dụng!' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(mat_khau, salt);

        const [result] = await pool.execute(
            `INSERT INTO nguoi_dung 
            (ho_ten, email, mat_khau, so_dien_thoai, role, trang_thai) 
            VALUES (?, ?, ?, ?, ?, ?)`,
            [ho_ten, email, hashedPassword, so_dien_thoai || null, 'customer', 'active']
        );

        const token = generateToken(result.insertId);

        res.status(201).json({
            success: true,
            token,
            user: { 
                id: result.insertId, 
                ho_ten, 
                email, 
                role: 'customer',
                avatar_url: null 
            },
            message: 'Đăng ký thành công!'
        });

    } catch (error) {
        console.error("Lỗi đăng ký:", error);
        res.status(500).json({ message: 'Lỗi server khi đăng ký!' });
    }
};

// 2. ĐĂNG NHẬP TÀI KHOẢN THƯỜNG
exports.login = async (req, res) => {
    const { email, mat_khau } = req.body;

    if (!email || !mat_khau) {
        return res.status(400).json({ message: 'Vui lòng nhập email và mật khẩu!' });
    }

    try {
        const [rows] = await pool.execute(
            'SELECT * FROM nguoi_dung WHERE email = ? AND deleted_at IS NULL', 
            [email]
        );
        
        if (rows.length === 0) {
            return res.status(401).json({ message: 'Email hoặc mật khẩu không đúng!' });
        }

        const user = rows[0];

        if (!user.mat_khau) {
            return res.status(400).json({ message: 'Tài khoản này đăng nhập bằng Google, vui lòng chọn đăng nhập Google!' });
        }

        const isMatch = await bcrypt.compare(mat_khau, user.mat_khau);
        if (!isMatch) {
            return res.status(401).json({ message: 'Email hoặc mật khẩu không đúng!' });
        }

        if (user.trang_thai === 'locked') {
            return res.status(403).json({ message: 'Tài khoản của bạn đã bị khóa! Vui lòng liên hệ CSKH.' });
        }

        const token = generateToken(user.id);

        res.json({
            success: true,
            token,
            user: { 
                id: user.id, 
                ho_ten: user.ho_ten, 
                email: user.email, 
                role: user.role, 
                avatar: user.avatar_url,
                so_dien_thoai: user.so_dien_thoai
            },
            message: 'Đăng nhập thành công!'
        });

    } catch (error) {
        console.error("Lỗi đăng nhập:", error);
        res.status(500).json({ message: 'Lỗi server khi đăng nhập!' });
    }
};

// 3. ĐĂNG NHẬP BẰNG GOOGLE
exports.googleLogin = async (req, res) => {
    const { email, ho_ten, google_sub, avatar_url } = req.body;

    try {
        const [rows] = await pool.execute(
            'SELECT * FROM nguoi_dung WHERE email = ? AND deleted_at IS NULL', 
            [email]
        );
        
        let user = rows[0];
        let userId;

        if (user) {
            userId = user.id;
            
            if (user.trang_thai === 'locked') {
                return res.status(403).json({ message: 'Tài khoản của bạn đã bị khóa!' });
            }

            await pool.execute(
                `UPDATE nguoi_dung 
                SET google_sub = ?, google_avatar_url = ?, avatar_url = COALESCE(avatar_url, ?) 
                WHERE id = ?`, 
                [google_sub, avatar_url, avatar_url, userId]
            );
        } else {
            const [result] = await pool.execute(
                `INSERT INTO nguoi_dung 
                (ho_ten, email, google_sub, google_avatar_url, avatar_url, role, trang_thai) 
                VALUES (?, ?, ?, ?, ?, ?, ?)`,
                [ho_ten, email, google_sub, avatar_url, avatar_url, 'customer', 'active']
            );
            userId = result.insertId;
            user = { id: userId, ho_ten, email, role: 'customer', avatar_url, so_dien_thoai: null };
        }

        const token = generateToken(userId);

        res.json({
            success: true,
            token,
            user: { 
                id: userId, 
                ho_ten: user.ho_ten || ho_ten, 
                email: user.email, 
                role: user.role, 
                avatar: user.avatar_url || avatar_url 
            },
            message: 'Đăng nhập Google thành công!'
        });

    } catch (error) {
        console.error("Lỗi Google Login:", error);
        res.status(500).json({ message: 'Lỗi server khi đăng nhập Google!' });
    }
};

exports.getMe = async (req, res) => {
    try {
        const [rows] = await pool.execute(
            `SELECT id, ho_ten, email, so_dien_thoai, role, avatar_url, trang_thai, created_at 
            FROM nguoi_dung 
            WHERE id = ? AND deleted_at IS NULL`, 
            [req.user.id]
        );
        
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Người dùng không tồn tại hoặc đã bị xóa' });
        }

        const user = rows[0];

        res.json({ 
            success: true, 
            user: user 
        });
    } catch (error) {
        console.error("Lỗi Get Me:", error);
        res.status(500).json({ message: 'Lỗi server' });
    }
};