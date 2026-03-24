const { pool } = require('../config/db');

// Lấy toàn bộ đơn hàng của hệ thống
exports.getAllOrders = async (req, res) => {
    try {
        const [rows] = await pool.execute(
            `SELECT * FROM don_hang ORDER BY ngay_dat DESC`
        );
        res.json({ success: true, data: rows });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Lỗi lấy danh sách đơn hàng' });
    }
};

// Cập nhật trạng thái (Duyệt, Giao hàng, Hoàn thành)
exports.updateOrderStatus = async (req, res) => {
    const { id } = req.params;
    const { trang_thai } = req.body;
    try {
        await pool.execute(
            `UPDATE don_hang SET trang_thai = ? WHERE id = ?`,
            [trang_thai, id]
        );
        res.json({ success: true, message: 'Cập nhật trạng thái thành công' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Lỗi cập nhật trạng thái' });
    }
};

// exports.updateOrderStatus = async (req, res) => {
//     const { id } = req.params;
//     const { trang_thai } = req.body; 
//     try {
//         await pool.execute(
//             `UPDATE don_hang SET trang_thai = ? WHERE id = ?`,
//             [trang_thai, id]
//         );
//         res.json({ success: true, message: 'Cập nhật trạng thái thành công' });
//     } catch (error) {
//         res.status(500).json({ success: false, message: 'Lỗi server' });
//     }
// };
// Lấy chi tiết một đơn hàng (bao gồm danh sách sách)
exports.getOrderDetail = async (req, res) => {
    const { id } = req.params;
    try {
        const [order] = await pool.execute(`SELECT * FROM don_hang WHERE id = ?`, [id]);
        
        if (order.length === 0) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy đơn hàng' });
        }

        const [items] = await pool.execute(
            `SELECT ct.*, s.ten_sach, s.hinh_anh 
            FROM don_hang_chi_tiet ct 
            JOIN sach s ON ct.sach_id = s.id 
            WHERE ct.don_hang_id = ?`, 
            [id]
        );  

        res.json({ success: true, order: order[0], items });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Lỗi lấy chi tiết đơn hàng' });
    }
};