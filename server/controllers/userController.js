const { pool } = require('../config/db');
const multer = require('multer');
const path = require('path');

// --- CẤU HÌNH UPLOAD ẢNH ---
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/avartar/'); 
    },
    filename: function (req, file, cb) {
        cb(null, 'avatar-' + Date.now() + path.extname(file.originalname));
    }
});
exports.upload = multer({ storage: storage });
exports.uploadAvatar = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'Chưa chọn file ảnh!' });
    }
    const imageUrl = `${req.protocol}://${req.get('host')}/uploads/avartar/${req.file.filename}`;
    res.json({ success: true, imageUrl });
};
// --- QUẢN LÝ ĐỊA CHỈ ---
exports.getAddresses = async (req, res) => {
    try {
        const [rows] = await pool.execute('SELECT * FROM dia_chi WHERE nguoi_dung_id = ? ORDER BY is_default DESC', [req.user.id]);
        res.json({ success: true, data: rows });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server' });
    }
};
exports.addAddress = async (req, res) => {
    const { ho_ten_nhan, sdt_nhan, tinh_thanh, quan_huyen, phuong_xa, dia_chi_chi_tiet, is_default } = req.body;
    const userId = req.user.id;
    try {
        if (is_default) {
            await pool.execute('UPDATE dia_chi SET is_default = 0 WHERE nguoi_dung_id = ?', [userId]);
        }
        await pool.execute(
            `INSERT INTO dia_chi (nguoi_dung_id, ho_ten_nhan, sdt_nhan, tinh_thanh, quan_huyen, phuong_xa, dia_chi_chi_tiet, is_default) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [userId, ho_ten_nhan, sdt_nhan, tinh_thanh, quan_huyen, phuong_xa, dia_chi_chi_tiet, is_default ? 1 : 0]
        );
        res.json({ success: true, message: 'Thêm địa chỉ thành công' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi thêm địa chỉ' });
    }
};
exports.deleteAddress = async (req, res) => {
    try {
        await pool.execute('DELETE FROM dia_chi WHERE id = ? AND nguoi_dung_id = ?', [req.params.id, req.user.id]);
        res.json({ success: true, message: 'Đã xóa địa chỉ' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi xóa địa chỉ' });
    }
};

exports.updateAddress = async (req, res) => {
    try {
        const { id } = req.params;
        const { ho_ten_nhan, sdt_nhan, tinh_thanh, quan_huyen, phuong_xa, dia_chi_chi_tiet, is_default } = req.body;
        const userId = req.user.id;

        if (is_default) {
            await pool.execute('UPDATE dia_chi SET is_default = 0 WHERE nguoi_dung_id = ?', [userId]);
        }

        const query = `
            UPDATE dia_chi 
            SET ho_ten_nhan = ?, sdt_nhan = ?, tinh_thanh = ?, quan_huyen = ?, phuong_xa = ?, dia_chi_chi_tiet = ?, is_default = ?
            WHERE id = ? AND nguoi_dung_id = ?
        `;
        
        const [result] = await pool.execute(query, [
            ho_ten_nhan, sdt_nhan, tinh_thanh, quan_huyen, phuong_xa, 
            dia_chi_chi_tiet, is_default ? 1 : 0, id, userId
        ]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: "Không tìm thấy địa chỉ hoặc bạn không có quyền" });
        }

        res.json({ success: true, message: "Cập nhật địa chỉ thành công" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Lỗi cập nhật địa chỉ" });
    }
};

exports.setDefaultAddress = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        await pool.execute('UPDATE dia_chi SET is_default = 0 WHERE nguoi_dung_id = ?', [userId]);
        await pool.execute('UPDATE dia_chi SET is_default = 1 WHERE id = ? AND nguoi_dung_id = ?', [id, userId]);
        res.json({ success: true, message: "Đã thiết lập địa chỉ mặc định" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Lỗi thiết lập mặc định" });
    }
};