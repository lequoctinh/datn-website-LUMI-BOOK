    const { pool } = require('../config/db');

   // Controller lấy thông báo (Backend)
exports.getNotifications = async (req, res) => {
    try {
        const userId = req.user.id;
        const [rows] = await pool.execute(
            `SELECT * FROM thong_bao WHERE nguoi_dung_id = ? ORDER BY ngay_tao DESC`, 
            [userId]
        );
        
        const [unreadCount] = await pool.execute(
            `SELECT COUNT(*) as total FROM thong_bao WHERE nguoi_dung_id = ? AND trang_thai_doc = 0`,
            [userId]
        );

        res.json({ 
            success: true, 
            data: rows, 
            unreadCount: unreadCount[0].total 
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
    exports.markAsRead = async (req, res) => {
        const { id } = req.params;
        const userId = req.user.id;
        try {
            await pool.execute(
                `UPDATE thong_bao SET trang_thai_doc = 1 WHERE id = ? AND nguoi_dung_id = ?`,
                [id, userId]
            );
            res.json({ success: true, message: 'Đã đọc' });
        } catch (error) {
            res.status(500).json({ message: 'Lỗi cập nhật trạng thái đọc' });
        }
    };

    exports.markAllAsRead = async (req, res) => {
        const userId = req.user.id;
        try {
            await pool.execute(
                `UPDATE thong_bao SET trang_thai_doc = 1 WHERE nguoi_dung_id = ?`,
                [userId]
            );
            res.json({ success: true, message: 'Đã đọc tất cả thông báo' });
        } catch (error) {
            res.status(500).json({ message: 'Lỗi cập nhật thông báo' });
        }
    };