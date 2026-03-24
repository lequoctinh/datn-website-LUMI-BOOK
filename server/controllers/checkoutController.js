const { pool } = require('../config/db');

// 1. API CHECKOUT: Đặt hàng từ giỏ hàng
exports.createOrder = async (req, res) => {
    const { ho_ten_nhan, sdt_nhan, dia_chi_nhan, phuong_thuc_thanh_toan, ghi_chu } = req.body;
    const userId = req.user.id;
    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();

        // Lấy sản phẩm trong giỏ hàng
        const [cartItems] = await connection.execute(
            `SELECT g.*, s.gia_ban, s.so_luong_ton 
            FROM gio_hang g JOIN sach s ON g.sach_id = s.id 
            WHERE g.nguoi_dung_id = ?`, [userId]
        );

        if (cartItems.length === 0) {
            return res.status(400).json({ message: 'Giỏ hàng trống!' });
        }

        // Tính tổng tiền & Kiểm tra kho
        let tong_tien = 0;
        for (const item of cartItems) {
            if (item.so_luong > item.so_luong_ton) {
                throw new Error(`Sách ID ${item.sach_id} không đủ số lượng trong kho!`);
            }
            tong_tien += item.so_luong * item.gia_ban;
        }

        // 1. Tạo đơn hàng
        const [orderResult] = await connection.execute(
            `INSERT INTO don_hang (nguoi_dung_id, tong_tien, phuong_thuc_thanh_toan, ho_ten_nguoi_nhan, sdt_nguoi_nhan, dia_chi_giao_hang, trang_thai) 
            VALUES (?, ?, ?, ?, ?, ?, 'cho_duyet')`,
            [userId, tong_tien, phuong_thuc_thanh_toan, ho_ten_nhan, sdt_nhan, dia_chi_nhan]
        );
        const orderId = orderResult.insertId;

        // 2. Thêm chi tiết đơn hàng & Trừ kho
        for (const item of cartItems) {
            await connection.execute(
                `INSERT INTO don_hang_chi_tiet (don_hang_id, sach_id, so_luong, gia_luc_mua) VALUES (?, ?, ?, ?)`,
                [orderId, item.sach_id, item.so_luong, item.gia_ban]
            );
            await connection.execute(
                `UPDATE sach SET so_luong_ton = so_luong_ton - ? WHERE id = ?`,
                [item.so_luong, item.sach_id]
            );
        }

        // 3. Xóa giỏ hàng
        await connection.execute(`DELETE FROM gio_hang WHERE nguoi_dung_id = ?`, [userId]);

        await connection.commit();
        res.json({ success: true, message: 'Đặt hàng thành công!', orderId });
    } catch (error) {
        await connection.rollback();
        res.status(500).json({ message: error.message || 'Lỗi khi đặt hàng' });
    } finally {
        connection.release();
    }
};

// 2. API CẬP NHẬT ĐƠN HÀNG (Chỉ khi 'cho_duyet')
exports.updateOrder = async (req, res) => {
    const { id } = req.params;
    const { ho_ten_nhan, sdt_nhan, dia_chi_giao_hang } = req.body;
    try {
        const [order] = await pool.execute('SELECT trang_thai FROM don_hang WHERE id = ?', [id]);
        if (order[0].trang_thai !== 'cho_duyet') {
            return res.status(400).json({ message: 'Không thể cập nhật đơn hàng đã xác nhận/đang giao!' });
        }

        await pool.execute(
            `UPDATE don_hang SET ho_ten_nguoi_nhan = ?, sdt_nguoi_nhan = ?, dia_chi_giao_hang = ? WHERE id = ?`,
            [ho_ten_nhan, sdt_nhan, dia_chi_giao_hang, id]
        );
        res.json({ success: true, message: 'Cập nhật thông tin thành công' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi cập nhật đơn hàng' });
    }
};

// 3. API HỦY ĐƠN HÀNG (Cộng lại kho)
exports.cancelOrder = async (req, res) => {
    const { id } = req.params;
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();
        const [order] = await connection.execute('SELECT trang_thai FROM don_hang WHERE id = ?', [id]);

        if (order[0].trang_thai !== 'cho_duyet') {
            return res.status(400).json({ message: 'Đơn hàng đã được xử lý, không thể hủy!' });
        }

        // Lấy chi tiết để cộng lại kho
        const [items] = await connection.execute('SELECT sach_id, so_luong FROM don_hang_chi_tiet WHERE don_hang_id = ?', [id]);
        for (const item of items) {
            await connection.execute('UPDATE sach SET so_luong_ton = so_luong_ton + ? WHERE id = ?', [item.so_luong, item.sach_id]);
        }

        await connection.execute(`UPDATE don_hang SET trang_thai = 'da_huy' WHERE id = ?`, [id]);

        await connection.commit();
        res.json({ success: true, message: 'Đã hủy đơn hàng' });
    } catch (error) {
        await connection.rollback();
        res.status(500).json({ message: 'Lỗi khi hủy đơn hàng' });
    } finally {
        connection.release();
    }
};

// 4. LỊCH SỬ & THEO DÕI ĐƠN HÀNG
exports.getMyOrders = async (req, res) => {
    try {
        const [rows] = await pool.execute(
            `SELECT * FROM don_hang WHERE nguoi_dung_id = ? ORDER BY ngay_dat DESC`, [req.user.id]
        );
        res.json({ success: true, data: rows });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi lấy lịch sử đơn hàng' });
    }
};

exports.getOrderDetail = async (req, res) => {
    try {
        const [order] = await pool.execute(`SELECT * FROM don_hang WHERE id = ?`, [req.params.id]);
        const [items] = await pool.execute(
            `SELECT ct.*, s.ten_sach, s.hinh_anh 
            FROM don_hang_chi_tiet ct 
            JOIN sach s ON ct.sach_id = s.id 
            WHERE ct.don_hang_id = ?`, [req.params.id]
        );
        res.json({ success: true, order: order[0], items });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi lấy chi tiết đơn hàng' });
    }
};