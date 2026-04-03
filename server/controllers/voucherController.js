const { pool } = require('../config/db');

exports.checkVoucher = async (req, res) => {
    try {
        const { ma_code, tong_tien_don_hang } = req.body;
        const userId = req.user.id;

        const [rows] = await pool.execute(
            `SELECT * FROM ma_khuyen_mai WHERE ma_code = ? AND trang_thai = 'hoat_dong' AND ngay_bat_dau <= NOW() AND ngay_ket_thuc >= NOW()`,
            [ma_code]
        );

        if (rows.length === 0) {
            return res.status(400).json({ success: false, message: 'Mã giảm giá không tồn tại hoặc đã hết hạn' });
        }

        const voucher = rows[0];

        if (voucher.da_su_dung >= voucher.so_luong) {
            return res.status(400).json({ success: false, message: 'Mã giảm giá đã hết lượt sử dụng' });
        }

        if (parseFloat(tong_tien_don_hang) < parseFloat(voucher.don_hang_toi_thieu)) {
            return res.status(400).json({ success: false, message: `Đơn hàng tối thiểu phải từ ${Number(voucher.don_hang_toi_thieu)}đ` });
        }

        if (voucher.loai_ma === 'tri_an' && voucher.nguoi_dung_id !== userId) {
            return res.status(403).json({ success: false, message: 'Mã này không dành cho bạn' });
        }

        if (voucher.loai_ma === 'nguoi_moi') {
                const [orders] = await pool.execute('SELECT id FROM don_hang WHERE nguoi_dung_id = ? AND trang_thai != "da_huy" LIMIT 1', 
                [userId]
            );
            if (orders.length > 0) {
                return res.status(400).json({ success: false, message: 'Mã chỉ dành cho đơn hàng đầu tiên' });
            }
        }

        const [used] = await pool.execute(
            'SELECT COUNT(*) as total FROM don_hang WHERE nguoi_dung_id = ? AND ma_khuyen_mai_id = ?',
            [userId, voucher.id]
        );

        if (used[0].total >= voucher.gioi_han_moi_user) {
            return res.status(400).json({ success: false, message: 'Bạn đã sử dụng mã này rồi' });
        }

        let so_tien_giam = 0;
        const tong_tien = parseFloat(tong_tien_don_hang);
        const gia_tri = parseFloat(voucher.gia_tri);

        if (voucher.loai_giam === 'phan_tram') {
            so_tien_giam = (tong_tien * gia_tri) / 100;
            if (voucher.gia_tri_toi_da && so_tien_giam > parseFloat(voucher.gia_tri_toi_da)) {
                so_tien_giam = parseFloat(voucher.gia_tri_toi_da);
            }
        } else {
            so_tien_giam = gia_tri;
        }

        res.json({
            success: true,
            data: {
                id: voucher.id,
                ma_code: voucher.ma_code,
                so_tien_giam: so_tien_giam,
                tong_tien_sau_giam: tong_tien - so_tien_giam
            }
        });

    } catch (error) {
        res.status(500).json({ success: false, message: 'Lỗi kiểm tra mã' });
    }
};

exports.getAllVouchers = async (req, res) => {
    try {
        const [rows] = await pool.execute('SELECT * FROM ma_khuyen_mai ORDER BY created_at DESC');
        res.json({ success: true, data: rows });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Lỗi lấy danh sách mã' });
    }
};

exports.createVoucher = async (req, res) => {
    try {
        const { 
            ma_code, loai_giam, gia_tri, gia_tri_toi_da, 
            don_hang_toi_thieu, so_luong, ngay_bat_dau, 
            ngay_ket_thuc, loai_ma, nguoi_dung_id 
        } = req.body;

        if (!ma_code || !gia_tri) {
            return res.status(400).json({ message: 'Thiếu thông tin mã giảm giá' });
        }

        const [result] = await pool.execute(
            `INSERT INTO ma_khuyen_mai 
            (ma_code, loai_giam, gia_tri, gia_tri_toi_da, don_hang_toi_thieu, so_luong, ngay_bat_dau, ngay_ket_thuc, loai_ma, nguoi_dung_id) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [ma_code, loai_giam, gia_tri, gia_tri_toi_da || null, don_hang_toi_thieu || 0, so_luong || 0, ngay_bat_dau, ngay_ket_thuc, loai_ma || 'cong_khai', nguoi_dung_id || null]
        );

        res.status(201).json({ success: true, message: 'Tạo mã thành công', id: result.insertId });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Lỗi tạo mã khuyến mãi' });
    }
};

exports.deleteVoucher = async (req, res) => {
    try {
        const [result] = await pool.execute('DELETE FROM ma_khuyen_mai WHERE id = ?', [req.params.id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Không tìm thấy mã để xóa' });
        }
        res.json({ success: true, message: 'Xóa mã thành công' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Lỗi xóa mã' });
    }
};

// 1. Lấy chi tiết 1 mã để đổ vào Modal cập nhật
exports.getVoucherById = async (req, res) => {
    try {
        const [rows] = await pool.execute('SELECT * FROM ma_khuyen_mai WHERE id = ?', [req.params.id]);
        if (rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy mã' });
        }
        res.json({ success: true, data: rows[0] });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Lỗi server' });
    }
};

// 2. Cập nhật thông tin mã 
exports.updateVoucher = async (req, res) => {
    try {
        const { id } = req.params;
        const { 
            ma_code, loai_giam, gia_tri, gia_tri_toi_da, 
            don_hang_toi_thieu, so_luong, ngay_bat_dau, 
            ngay_ket_thuc, loai_ma, nguoi_dung_id 
        } = req.body;

        const sql = `
            UPDATE ma_khuyen_mai SET ma_code = ?, loai_giam = ?, gia_tri = ?, gia_tri_toi_da = ?, don_hang_toi_thieu = ?, so_luong = ?, ngay_bat_dau = ?, ngay_ket_thuc = ?, loai_ma = ?, nguoi_dung_id = ?, gioi_han_moi_user = ?, trang_thai = ? WHERE id = ?
        `;

        const [result] = await pool.execute(sql, [
            ma_code, loai_giam, gia_tri, gia_tri_toi_da || null, 
            don_hang_toi_thieu || 0, so_luong || 0, ngay_bat_dau, 
            ngay_ket_thuc, loai_ma, nguoi_dung_id || null, 
            req.body.gioi_han_moi_user || 1, req.body.trang_thai || 'hoat_dong', id
        ]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Cập nhật thất bại' });
        }

        res.json({ success: true, message: 'Cập nhật mã thành công' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Lỗi cập nhật mã' });
    }
};

// 3. Thay đổi trạng thái nhanh (Hoạt động/Ẩn)
exports.updateStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { trang_thai } = req.body; 

        await pool.execute('UPDATE ma_khuyen_mai SET trang_thai = ? WHERE id = ?', [trang_thai, id]);
        
        res.json({ success: true, message: 'Cập nhật trạng thái thành công' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Lỗi cập nhật trạng thái' });
    }
};