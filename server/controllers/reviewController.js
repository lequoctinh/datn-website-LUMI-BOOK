const { pool } = require('../config/db');

exports.createReview = async (req, res) => {
    try {
        const { sach_id, don_hang_id, so_sao, binh_luan } = req.body;
        const userId = req.user.id;

        const [order] = await pool.execute(
            `SELECT trang_thai FROM don_hang WHERE id = ? AND nguoi_dung_id = ?`,
            [don_hang_id, userId]
        );

        if (order.length === 0) {
            return res.status(404).json({ success: false, message: 'Đơn hàng không tồn tại' });
        }

        if (order[0].trang_thai !== 'da_giao') {
            return res.status(400).json({ success: false, message: 'Chưa thể đánh giá đơn hàng này' });
        }

        const [orderItem] = await pool.execute(
            `SELECT id FROM don_hang_chi_tiet WHERE don_hang_id = ? AND sach_id = ?`,
            [don_hang_id, sach_id]
        );

        if (orderItem.length === 0) {
            return res.status(400).json({ success: false, message: 'Sách không thuộc đơn hàng' });
        }

        const [existingReview] = await pool.execute(
            `SELECT id FROM danh_gia WHERE nguoi_dung_id = ? AND sach_id = ? AND don_hang_id = ?`,
            [userId, sach_id, don_hang_id]
        );

        if (existingReview.length > 0) {
            return res.status(400).json({ success: false, message: 'Bạn đã đánh giá sản phẩm này rồi' });
        }

        await pool.execute(
            `INSERT INTO danh_gia (nguoi_dung_id, sach_id, don_hang_id, so_sao, binh_luan, trang_thai) 
            VALUES (?, ?, ?, ?, ?, 'hien_thi')`,
            [userId, sach_id, don_hang_id, so_sao, binh_luan]
        );

        res.status(201).json({ success: true, message: 'Đánh giá thành công' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Lỗi server' });
    }
};

exports.getReviewsByBook = async (req, res) => {
    try {
        const { sach_id } = req.params;

        const [rows] = await pool.execute(
            `SELECT dg.*, nd.ho_ten, nd.email 
            FROM danh_gia dg 
            JOIN nguoi_dung nd ON dg.nguoi_dung_id = nd.id 
            WHERE dg.sach_id = ? AND dg.trang_thai = 'hien_thi' 
            ORDER BY dg.ngay_danh_gia DESC`,
            [sach_id]
        );

        const [stats] = await pool.execute(
            `SELECT COUNT(*) as total, AVG(so_sao) as average 
            FROM danh_gia 
            WHERE sach_id = ? AND trang_thai = 'hien_thi'`,
            [sach_id]
        );

        res.json({
            success: true,
            data: rows,
            stats: {
                total: stats[0].total,
                average: parseFloat(stats[0].average || 0).toFixed(1)
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Lỗi server' });
    }
};

exports.getAllReviewsAdmin = async (req, res) => {
    try {
        const [rows] = await pool.execute(
            `SELECT 
                dg.*, 
                nd.ho_ten, 
                nd.email, 
                nd.avatar_url, 
                s.ten_sach 
            FROM danh_gia dg 
            JOIN nguoi_dung nd ON dg.nguoi_dung_id = nd.id 
            JOIN sach s ON dg.sach_id = s.id 
            ORDER BY dg.ngay_danh_gia DESC` 
        );
        res.json({ success: true, data: rows });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Lỗi server' });
    }
};

exports.updateReviewStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { trang_thai } = req.body;

        const [result] = await pool.execute(
            `UPDATE danh_gia SET trang_thai = ? WHERE id = ?`,
            [trang_thai, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy đánh giá' });
        }

        res.json({ success: true, message: 'Cập nhật thành công' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Lỗi server' });
    }
};

exports.deleteReview = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        const role = req.user.role;

        let query = `DELETE FROM danh_gia WHERE id = ?`;
        let params = [id];

        if (role !== 'admin') {
            query += ` AND nguoi_dung_id = ?`;
            params.push(userId);
        }

        const [result] = await pool.execute(query, params);

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Không thể xóa' });
        }

        res.json({ success: true, message: 'Đã xóa đánh giá' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Lỗi server' });
    }
};