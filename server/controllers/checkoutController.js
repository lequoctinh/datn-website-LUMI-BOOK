const { pool } = require('../config/db');

// 1. API CHECKOUT: Đặt hàng từ giỏ hàng
exports.createOrder = async (req, res) => {
    const { ho_ten_nhan, sdt_nhan, dia_chi_nhan, phuong_thuc_thanh_toan, ghi_chu, ma_khuyen_mai_id } = req.body;
    const userId = req.user.id;
    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();

        const [cartItems] = await connection.execute(
            `SELECT g.*, s.gia_ban, s.so_luong_ton 
            FROM gio_hang g JOIN sach s ON g.sach_id = s.id 
            WHERE g.nguoi_dung_id = ?`, [userId]
        );

        if (cartItems.length === 0) {
            return res.status(400).json({ message: 'Giỏ hàng trống!' });
        }

        let tong_tien = 0;
        for (const item of cartItems) {
            if (item.so_luong > item.so_luong_ton) {
                throw new Error(`Sách ID ${item.sach_id} không đủ số lượng trong kho!`);
            }
            tong_tien += item.so_luong * item.gia_ban;
        }
        let so_tien_giam = 0;
        let final_voucher_id = ma_khuyen_mai_id || null;

        if (final_voucher_id) {
            const [vouchers] = await connection.execute(
                `SELECT * FROM ma_khuyen_mai WHERE id = ? AND trang_thai = 'hoat_dong' AND ngay_bat_dau <= NOW() AND ngay_ket_thuc >= NOW()`,
                [final_voucher_id]
            );

            const v = vouchers[0];
            if (!v) throw new Error('Mã giảm giá không tồn tại hoặc đã hết hạn!');
            if (v.da_su_dung >= v.so_luong) throw new Error('Mã giảm giá đã hết lượt sử dụng!');
            
            if (Number(tong_tien) < Number(v.don_hang_toi_thieu)) {
                throw new Error(`Đơn hàng tối thiểu phải từ ${Number(v.don_hang_toi_thieu).toLocaleString()}đ`);
            }

            if (v.loai_ma === 'tri_an' && v.nguoi_dung_id !== userId) {
                throw new Error('Mã giảm giá này không dành cho bạn!');
            }

            if (v.loai_ma === 'nguoi_moi') {
                    const [oldOrders] = await connection.execute('SELECT id FROM don_hang WHERE nguoi_dung_id = ? AND trang_thai != "da_huy" LIMIT 1',
                [userId]
            );
                if (oldOrders.length > 0) throw new Error('Mã chỉ áp dụng cho đơn hàng đầu tiên!');
            }

            const [used] = await connection.execute(
                'SELECT COUNT(*) as total FROM don_hang WHERE nguoi_dung_id = ? AND ma_khuyen_mai_id = ? AND trang_thai != "da_huy"',
                [userId, v.id]
            );
            if (used[0].total >= v.gioi_han_moi_user) {
                throw new Error('Bạn đã sử dụng hết lượt cho mã giảm giá này!');
            }

            if (v.loai_giam === 'phan_tram') {
                so_tien_giam = (Number(tong_tien) * Number(v.gia_tri)) / 100;
                if (v.gia_tri_toi_da && so_tien_giam > Number(v.gia_tri_toi_da)) {
                    so_tien_giam = Number(v.gia_tri_toi_da);
                }
            } else {
                so_tien_giam = Number(v.gia_tri);
            }

            await connection.execute(
                `UPDATE ma_khuyen_mai SET da_su_dung = da_su_dung + 1 WHERE id = ?`,
                [final_voucher_id]
            );
        }
        const tong_tien_sau_giam = Math.round(Number(tong_tien) - so_tien_giam);

        const [orderResult] = await connection.execute(
            `INSERT INTO don_hang (nguoi_dung_id, tong_tien, phuong_thuc_thanh_toan, ho_ten_nguoi_nhan, sdt_nguoi_nhan, dia_chi_giao_hang, trang_thai, ma_khuyen_mai_id) VALUES (?, ?, ?, ?, ?, ?, 'cho_duyet', ?)`,
            [userId, tong_tien_sau_giam, phuong_thuc_thanh_toan, ho_ten_nhan, sdt_nhan, dia_chi_nhan, final_voucher_id]
        );
        const orderId = orderResult.insertId;

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
        const [order] = await connection.execute('SELECT trang_thai, ma_khuyen_mai_id FROM don_hang WHERE id = ?', [id]);

        if (order[0].trang_thai !== 'cho_duyet') {
            return res.status(400).json({ message: 'Đơn hàng đã được xử lý, không thể hủy!' });
        }
        if (order[0].ma_khuyen_mai_id) {
            await connection.execute(
                'UPDATE ma_khuyen_mai SET da_su_dung = GREATEST(0, da_su_dung - 1) WHERE id = ?',
                [order[0].ma_khuyen_mai_id]
            );
        }
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
        const orderId = req.params.id;
        const userId = req.user.id;

        const [order] = await pool.execute(
            `SELECT * FROM don_hang WHERE id = ?`, 
            [orderId]
        );

        const [items] = await pool.execute(
            `SELECT 
                ct.*, 
                s.ten_sach, 
                s.hinh_anh,
                (SELECT COUNT(*) FROM danh_gia dg 
                WHERE dg.don_hang_id = ct.don_hang_id 
                AND dg.sach_id = ct.sach_id 
                AND dg.nguoi_dung_id = ?) as da_danh_gia
            FROM don_hang_chi_tiet ct 
            JOIN sach s ON ct.sach_id = s.id 
            WHERE ct.don_hang_id = ?`, 
            [userId, orderId]
        );

        res.json({ 
            success: true, 
            order: order[0], 
            items: items.map(item => ({
                ...item,
                da_danh_gia: item.da_danh_gia > 0
            }))
        });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi lấy chi tiết đơn hàng' });
    }
};