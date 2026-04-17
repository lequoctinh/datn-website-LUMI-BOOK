const { pool } = require('../config/db');

exports.getCart = async (req, res) => {
    try {
        const [rows] = await pool.execute(
            `SELECT g.*, s.ten_sach, s.gia_ban, s.hinh_anh, s.so_luong_ton as kho_con 
             FROM gio_hang g 
             JOIN sach s ON g.sach_id = s.id 
             WHERE g.nguoi_dung_id = ?`,
            [req.user.id]
        );
        res.json({ success: true, data: rows });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi lấy giỏ hàng' });
    }
};

exports.addToCart = async (req, res) => {
    const { sach_id, so_luong } = req.body;
    try {
        const [checkStock] = await pool.execute('SELECT so_luong_ton FROM sach WHERE id = ?', [sach_id]);
        
        if (checkStock.length === 0 || checkStock[0].so_luong_ton < so_luong) {
            return res.status(400).json({ message: 'Số lượng trong kho không đủ' });
        }

        const [exist] = await pool.execute(
            'SELECT id, so_luong FROM gio_hang WHERE nguoi_dung_id = ? AND sach_id = ?',
            [req.user.id, sach_id]
        );

        if (exist.length > 0) {
            await pool.execute(
                'UPDATE gio_hang SET so_luong = so_luong + ? WHERE id = ?',
                [so_luong, exist[0].id]
            );
        } else {
            await pool.execute(
                'INSERT INTO gio_hang (nguoi_dung_id, sach_id, so_luong) VALUES (?, ?, ?)',
                [req.user.id, sach_id, so_luong]
            );
        }
        res.json({ success: true, message: 'Đã thêm vào giỏ hàng' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi thêm vào giỏ hàng' });
    }
};

exports.updateCart = async (req, res) => {
    const { id } = req.params;
    const { so_luong } = req.body;
    try {
        await pool.execute('UPDATE gio_hang SET so_luong = ? WHERE id = ?', [so_luong, id]);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi cập nhật' });
    }
};

exports.removeFromCart = async (req, res) => {
    try {
        await pool.execute('DELETE FROM gio_hang WHERE id = ?', [req.params.id]);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi xóa vật phẩm' });
    }
};

exports.clearCart = async (req, res) => {
    try {
        await pool.execute(
            'DELETE FROM gio_hang WHERE nguoi_dung_id = ?',
            [req.user.id]
        );
        res.json({ success: true, message: 'Giỏ hàng đã được làm trống' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi khi xóa giỏ hàng' });
    }
};