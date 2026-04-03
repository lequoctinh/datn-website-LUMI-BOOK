const { pool } = require('../config/db');

// GỬI ĐÁNH GIÁ MỚI
exports.createReview = async (req, res) => {
    try {
        const { nguoi_dung_id, sach_id, don_hang_id, so_sao, binh_luan } = req.body;

        const [orderRows] = await pool.execute(
            `SELECT trang_thai FROM don_hang WHERE id = ? AND nguoi_dung_id = ?`,
            [don_hang_id, nguoi_dung_id]
        );

        if (orderRows.length === 0) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy đơn hàng' });
        }

        if (orderRows[0].trang_thai !== 'da_giao') {
            return res.status(400).json({ success: false, message: 'Bạn chỉ có thể đánh giá khi đơn hàng đã giao thành công' });
        }

        const [existingReview] = await pool.execute(
            `SELECT id FROM danh_gia WHERE nguoi_dung_id = ? AND sach_id = ? AND don_hang_id = ?`,
            [nguoi_dung_id, sach_id, don_hang_id]
        );

        if (existingReview.length > 0) {
            return res.status(400).json({ success: false, message: 'Bạn đã đánh giá sản phẩm này rồi' });
        }

        await pool.execute(
            `INSERT INTO danh_gia (nguoi_dung_id, sach_id, don_hang_id, so_sao, binh_luan, trang_thai) 
            VALUES (?, ?, ?, ?, ?, 'hien_thi')`,
            [nguoi_dung_id, sach_id, don_hang_id, so_sao, binh_luan]
        );

        res.status(201).json({ success: true, message: 'Cảm ơn bạn đã đánh giá!' });
    } catch (error) {
        console.error("Lỗi createReview:", error);
        res.status(500).json({ message: 'Lỗi server khi gửi đánh giá' });
    }
};

// LẤY ĐÁNH GIÁ THEO SÁCH (Hiển thị ở trang chi tiết sản phẩm)
exports.getReviewsByBook = async (req, res) => {
    try {
        const bookId = req.params.sach_id;
        
        const query = `
            SELECT 
                dg.*, 
                nd.ho_ten, nd.avatar_url 
            FROM danh_gia dg
            JOIN nguoi_dung nd ON dg.nguoi_dung_id = nd.id
            WHERE dg.sach_id = ? AND dg.trang_thai = 'hien_thi'
            ORDER BY dg.ngay_danh_gia DESC
        `;

        const [rows] = await pool.query(query, [bookId]);

        const totalReviews = rows.length;
        const avgRating = totalReviews > 0 
            ? (rows.reduce((sum, item) => sum + item.so_sao, 0) / totalReviews).toFixed(1)
            : 0;

        res.json({ 
            success: true, 
            data: rows,
            stats: {
                total: totalReviews,
                average: parseFloat(avgRating)
            }
        });
    } catch (error) {
        console.error("Lỗi getReviewsByBook:", error);
        res.status(500).json({ message: 'Lỗi server khi lấy đánh giá' });
    }
};