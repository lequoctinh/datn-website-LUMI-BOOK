const { pool } = require('../config/db');

exports.getBooksAdmin = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;
        const search = req.query.search || '';

        let query = `
            SELECT s.*, nxb.ten_nha_xuat_ban 
            FROM sach s 
            LEFT JOIN nha_xuat_ban nxb ON s.nxb_id = nxb.id 
            WHERE 1=1
        `;
        let countQuery = `SELECT COUNT(*) as total FROM sach WHERE 1=1`;
        let queryParams = [];

        if (search) {
            query += ` AND s.ten_sach LIKE ?`;
            countQuery += ` AND ten_sach LIKE ?`;
            queryParams.push(`%${search}%`);
        }

        query += ` ORDER BY s.created_at DESC LIMIT ? OFFSET ?`;
        queryParams.push(limit, offset);

        const [rows] = await pool.query(query, queryParams);
        const [countResult] = await pool.query(countQuery, search ? [`%${search}%`] : []);
        
        const total = countResult[0].total;

        res.json({
            success: true,
            data: rows,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server' });
    }
};

exports.getBookById = async (req, res) => {
    try {
        const bookId = req.params.id;
        
        const [bookRows] = await pool.execute(
            `SELECT s.*, nxb.ten_nha_xuat_ban 
            FROM sach s 
            LEFT JOIN nha_xuat_ban nxb ON s.nxb_id = nxb.id 
            WHERE s.id = ?`, 
            [bookId]
        );

        if (bookRows.length === 0) return res.status(404).json({ message: 'Không tìm thấy sách' });
        const book = bookRows[0];

        const [categories] = await pool.execute(
            `SELECT dm.id, dm.ten_danh_muc 
            FROM sach_danh_muc sdm 
            JOIN danh_muc dm ON sdm.danh_muc_id = dm.id 
            WHERE sdm.sach_id = ?`, 
            [bookId]
        );

        const [authors] = await pool.execute(
            `SELECT tg.id, tg.ten_tac_gia 
            FROM sach_tac_gia stg 
            JOIN tac_gia tg ON stg.tac_gia_id = tg.id 
            WHERE stg.sach_id = ?`, 
            [bookId]
        );

        book.danh_muc = categories;
        book.tac_gia = authors;

        res.json({ success: true, data: book });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server' });
    }
};

exports.createBook = async (req, res) => {
    const connection = await pool.getConnection(); 
    try {
        const { 
            ten_sach, nha_cung_cap, nguoi_dich, nxb_id, nam_xuat_ban, ngon_ngu,
            gia_ban, gia_giam, so_luong_ton, so_trang, kich_thuoc, hinh_thuc,
            mo_ta, noi_dung, hinh_anh, album_anh, trang_thai,
            danh_muc_ids, tac_gia_ids 
        } = req.body;

        await connection.beginTransaction();

        const [bookResult] = await connection.execute(
            `INSERT INTO sach (
                ten_sach, nha_cung_cap, nguoi_dich, nxb_id, nam_xuat_ban, ngon_ngu,
                gia_ban, gia_giam, so_luong_ton, so_trang, kich_thuoc, hinh_thuc,
                mo_ta, noi_dung, hinh_anh, album_anh, trang_thai
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                ten_sach, nha_cung_cap || null, nguoi_dich || null, nxb_id || null, nam_xuat_ban || null, ngon_ngu || 'Tiếng Việt',
                gia_ban || 0, gia_giam || 0, so_luong_ton || 0, so_trang || null, kich_thuoc || null, hinh_thuc || null,
                mo_ta || null, noi_dung || null, hinh_anh || null, album_anh ? JSON.stringify(album_anh) : null, trang_thai || 'hien_thi'
            ]
        );
        const newBookId = bookResult.insertId;

        if (Array.isArray(danh_muc_ids) && danh_muc_ids.length > 0) {
            const dmValues = danh_muc_ids.map(dm_id => [newBookId, dm_id]);
            await connection.query('INSERT INTO sach_danh_muc (sach_id, danh_muc_id) VALUES ?', [dmValues]);
        }

        if (Array.isArray(tac_gia_ids) && tac_gia_ids.length > 0) {
            const tgValues = tac_gia_ids.map(tg_id => [newBookId, tg_id]);
            await connection.query('INSERT INTO sach_tac_gia (sach_id, tac_gia_id) VALUES ?', [tgValues]);
        }

        await connection.commit();
        res.status(201).json({ success: true, message: 'Thêm sách thành công!', id: newBookId });
    } catch (error) {
        await connection.rollback();
        res.status(500).json({ message: error.message });
    } finally {
        connection.release();
    }
};

exports.updateBook = async (req, res) => {
    const connection = await pool.getConnection();
    try {
        const bookId = req.params.id;
        const { 
            ten_sach, nha_cung_cap, nguoi_dich, nxb_id, nam_xuat_ban, ngon_ngu,
            gia_ban, gia_giam, so_luong_ton, so_trang, kich_thuoc, hinh_thuc,
            mo_ta, noi_dung, hinh_anh, album_anh, trang_thai,
            danh_muc_ids, tac_gia_ids
        } = req.body;

        await connection.beginTransaction();

        await connection.execute(
            `UPDATE sach SET 
                ten_sach = ?, nha_cung_cap = ?, nguoi_dich = ?, nxb_id = ?, nam_xuat_ban = ?, ngon_ngu = ?,
                gia_ban = ?, gia_giam = ?, so_luong_ton = ?, so_trang = ?, kich_thuoc = ?, hinh_thuc = ?,
                mo_ta = ?, noi_dung = ?, hinh_anh = ?, album_anh = ?, trang_thai = ?
            WHERE id = ?`,
            [
                ten_sach, nha_cung_cap || null, nguoi_dich || null, nxb_id || null, nam_xuat_ban || null, ngon_ngu || 'Tiếng Việt',
                gia_ban || 0, gia_giam || 0, so_luong_ton || 0, so_trang || null, kich_thuoc || null, hinh_thuc || null,
                mo_ta || null, noi_dung || null, hinh_anh || null, album_anh ? JSON.stringify(album_anh) : null, trang_thai,
                bookId
            ]
        );

        await connection.execute('DELETE FROM sach_danh_muc WHERE sach_id = ?', [bookId]);
        if (Array.isArray(danh_muc_ids) && danh_muc_ids.length > 0) {
            const dmValues = danh_muc_ids.map(dm_id => [bookId, dm_id]);
            await connection.query('INSERT INTO sach_danh_muc (sach_id, danh_muc_id) VALUES ?', [dmValues]);
        }

        await connection.execute('DELETE FROM sach_tac_gia WHERE sach_id = ?', [bookId]);
        if (Array.isArray(tac_gia_ids) && tac_gia_ids.length > 0) {
            const tgValues = tac_gia_ids.map(tg_id => [bookId, tg_id]);
            await connection.query('INSERT INTO sach_tac_gia (sach_id, tac_gia_id) VALUES ?', [tgValues]);
        }

        await connection.commit();
        res.json({ success: true, message: 'Cập nhật thành công!' });
    } catch (error) {
        await connection.rollback();
        res.status(500).json({ message: error.message });
    } finally {
        connection.release();
    }
};

exports.toggleStatusBook = async (req, res) => {
    try {
        const bookId = req.params.id;
        const { trang_thai } = req.body; 

        if (!['hien_thi', 'an'].includes(trang_thai)) {
            return res.status(400).json({ message: 'Trạng thái không hợp lệ' });
        }

        await pool.execute('UPDATE sach SET trang_thai = ? WHERE id = ?', [trang_thai, bookId]);
        res.json({ success: true, message: 'Đã thay đổi trạng thái' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server' });
    }
};

// LẤY SÁCH BÁN CHẠY
exports.getBestSellers = async (req, res) => {
    try {
        const query = `
            SELECT 
                s.id, s.ten_sach, s.gia_ban, s.gia_giam, s.hinh_anh,
                (SELECT tg.ten_tac_gia FROM sach_tac_gia stg JOIN tac_gia tg ON stg.tac_gia_id = tg.id WHERE stg.sach_id = s.id LIMIT 1) AS author,
                IFNULL(SUM(dhct.so_luong), 0) AS total_sold
            FROM sach s
            LEFT JOIN don_hang_chi_tiet dhct ON s.id = dhct.sach_id
            LEFT JOIN don_hang dh ON dhct.don_hang_id = dh.id AND dh.trang_thai = 'da_giao'
            WHERE s.trang_thai = 'hien_thi'
            GROUP BY s.id
            ORDER BY total_sold DESC, s.created_at DESC
            LIMIT 8
        `;

        const [rows] = await pool.query(query);
        res.json({ success: true, data: rows });
    } catch (error) {
        console.error("Lỗi getBestSellers:", error);
        res.status(500).json({ message: 'Lỗi server khi lấy sách bán chạy' });
    }
};