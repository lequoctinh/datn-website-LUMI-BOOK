const { pool } = require('../config/db');
// 1. Lấy toàn bộ đơn hàng ctl
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

// 2. Cập nhật trạng thái đơn hàng ctl
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

// 3. Lấy chi tiết đơn hàng ctl
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

// api Dashboard
exports.getDashboardStats = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        let params = [];
        let dateCondition = "";

        if (startDate && endDate) {
            dateCondition = " AND DATE(ngay_dat) BETWEEN ? AND ?";
            params = [startDate, endDate];
        }

        const [revenueRes] = await pool.execute(`
            SELECT SUM(tong_tien) as total FROM don_hang 
            WHERE trang_thai = 'da_giao' ${dateCondition}
        `, params);

        const [newOrdersRes] = await pool.execute(`
            SELECT COUNT(id) as total FROM don_hang 
            WHERE trang_thai = 'cho_duyet' ${dateCondition}
        `, params);

        const [usersRes] = await pool.execute(`SELECT COUNT(id) as total FROM nguoi_dung WHERE role = 'customer'`);
        const [booksRes] = await pool.execute(`SELECT COUNT(id) as total FROM sach`);

        const [revenueChart] = await pool.execute(`
            SELECT DATE_FORMAT(ngay_dat, '%d/%m') as date, SUM(tong_tien) as revenue
            FROM don_hang
            WHERE trang_thai = 'da_giao' ${dateCondition}
            GROUP BY DATE(ngay_dat)
            ORDER BY ngay_dat ASC LIMIT 15
        `, params);

        const [statusChart] = await pool.execute(`
            SELECT trang_thai as status, COUNT(*) as count
            FROM don_hang 
            WHERE 1=1 ${dateCondition}
            GROUP BY trang_thai
        `, params);

        res.json({
            success: true,
            overview: {
                totalRevenue: revenueRes[0].total || 0,
                newOrdersCount: newOrdersRes[0].total || 0,
                totalUsers: usersRes[0].total || 0,
                totalBooks: booksRes[0].total || 0
            },
            revenueChart,
            statusChart
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getChartData = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        let params = [];
        let dateCondition = "";

        if (startDate && endDate) {
            dateCondition = " AND DATE(ngay_dat) BETWEEN ? AND ?";
            params = [startDate, endDate];
        }

        const [revenueData] = await pool.execute(`
            SELECT DATE(ngay_dat) as date, SUM(tong_tien) as revenue
            FROM don_hang
            WHERE trang_thai = 'da_giao' ${dateCondition}
            GROUP BY DATE(ngay_dat)
            ORDER BY date ASC
        `, params);

        const [statusData] = await pool.execute(`
            SELECT trang_thai as status, COUNT(*) as count
            FROM don_hang
            WHERE 1=1 ${dateCondition}
            GROUP BY trang_thai
        `, params);

        res.json({
            success: true,
            revenueChart: revenueData,
            statusChart: statusData
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getLowStockBooks = async (req, res) => {
    try {
        const query = `
            SELECT id, ten_sach, so_luong_ton, gia_ban, hinh_anh 
            FROM sach 
            WHERE so_luong_ton < 10 
            ORDER BY so_luong_ton ASC
        `;
        const [rows] = await pool.execute(query);
        res.json({ success: true, data: rows });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Lỗi lấy sản phẩm sắp hết hàng' });
    }
};

exports.getTopSellingBooks = async (req, res) => {
    try {
        const query = `
            SELECT s.id, s.ten_sach, s.hinh_anh, s.gia_ban, SUM(ct.so_luong) as total_sold
            FROM don_hang_chi_tiet ct
            JOIN sach s ON ct.sach_id = s.id
            JOIN don_hang dh ON ct.don_hang_id = dh.id
            WHERE dh.trang_thai = 'da_giao'
            GROUP BY s.id
            ORDER BY total_sold DESC
            LIMIT 5
        `;
        const [rows] = await pool.execute(query);
        res.json({ success: true, data: rows });
    } catch (error) {
        res.json({ success: true, data: [] });
    }
};

exports.getTopRatedBooks = async (req, res) => {
    try {
        const query = `
            SELECT s.id, s.ten_sach, s.hinh_anh, AVG(dg.sao) as avg_rating, COUNT(dg.id) as total_reviews
            FROM danh_gia dg
            JOIN sach s ON dg.sach_id = s.id
            GROUP BY s.id
            ORDER BY avg_rating DESC
            LIMIT 5
        `;
        const [rows] = await pool.execute(query);
        res.json({ success: true, data: rows });
    } catch (error) {
        res.json({ success: true, data: [] });
    }
};