const { pool } = require('../config/db');

// 1. Lấy toàn bộ đơn hàng 
exports.getAllOrders = async (req, res) => {
    try {
        const [rows] = await pool.execute(
            `SELECT dh.*, nd.ho_ten, nd.email 
            FROM don_hang dh
            JOIN nguoi_dung nd ON dh.nguoi_dung_id = nd.id
            ORDER BY dh.ngay_dat DESC`
        );
        res.json({ success: true, data: rows });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Lỗi lấy danh sách đơn hàng' });
    }
};

// 2. Cập nhật trạng thái đơn hàng 
exports.updateOrderStatus = async (req, res) => {
    const { id } = req.params;
    const { trang_thai } = req.body; 
    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();

        const [order] = await connection.execute(
            'SELECT trang_thai, ma_khuyen_mai_id FROM don_hang WHERE id = ?', 
            [id]
        );

        if (order.length === 0) {
            return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
        }

        const currentStatus = order[0].trang_thai;

        if (currentStatus === 'da_huy' || currentStatus === 'hoan_thanh') {
            return res.status(400).json({ 
                message: 'Đơn hàng đã đóng (Hủy/Hoàn thành), không thể thay đổi trạng thái' 
            });
        }

        if (trang_thai === 'da_huy') {
            if (order[0].ma_khuyen_mai_id) {
                await connection.execute(
                    'UPDATE ma_khuyen_mai SET da_su_dung = GREATEST(0, da_su_dung - 1) WHERE id = ?',
                    [order[0].ma_khuyen_mai_id]
                );
            }

            const [items] = await connection.execute(
                'SELECT sach_id, so_luong FROM don_hang_chi_tiet WHERE don_hang_id = ?', 
                [id]
            );

            for (const item of items) {
                await connection.execute(
                    'UPDATE sach SET so_luong_ton = so_luong_ton + ? WHERE id = ?', 
                    [item.so_luong, item.sach_id]
                );
            }
        }
        await connection.execute(
            `UPDATE don_hang SET trang_thai = ? WHERE id = ?`,
            [trang_thai, id]
        );

        await connection.commit();
        res.json({ success: true, message: `Đã cập nhật trạng thái đơn hàng thành: ${trang_thai}` });

    } catch (error) {
        await connection.rollback();
        res.status(500).json({ success: false, message: error.message || 'Lỗi server' });
    } finally {
        connection.release();
    }
};

// 3. Lấy chi tiết đơn hàng 
exports.getOrderDetail = async (req, res) => {
    const { id } = req.params;
    try {
        const [order] = await pool.execute(
            `SELECT dh.*, mkm.ma_code, mkm.gia_tri as voucher_value, mkm.loai_giam, nd.ho_ten, nd.email FROM don_hang dh JOIN nguoi_dung nd ON dh.nguoi_dung_id = nd.id
            LEFT JOIN ma_khuyen_mai mkm ON dh.ma_khuyen_mai_id = mkm.id 
            WHERE dh.id = ?`, 
            [id]
        );
        
        if (order.length === 0) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy đơn hàng' });
        }

        const [items] = await pool.execute(
            `SELECT ct.*, s.ten_sach, s.hinh_anh FROM don_hang_chi_tiet ct JOIN sach s ON ct.sach_id = s.id WHERE ct.don_hang_id = ?`, 
            [id]
        );  

        res.json({ success: true, order: order[0], items });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Lỗi lấy chi tiết đơn hàng' });
    }
};