const { pool } = require('../config/db');
const fs = require('fs').promises;
const path = require('path');

const deleteFile = async (fileName) => {
    if (!fileName) return;
    try {
        const filePath = path.join(__dirname, '../uploads/products/', fileName);
        await fs.unlink(filePath);
    } catch (err) {
        console.error("Không thể xóa file cũ:", err.message);
    }
};

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
            `SELECT dm.id, dm.ten_danh_muc FROM sach_danh_muc sdm JOIN danh_muc dm ON sdm.danh_muc_id = dm.id WHERE sdm.sach_id = ?`, 
            [bookId]
        );

        const [authors] = await pool.execute(
            `SELECT tg.id, tg.ten_tac_gia FROM sach_tac_gia stg JOIN tac_gia tg ON stg.tac_gia_id = tg.id WHERE stg.sach_id = ?`, 
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
        const data = req.body;
        const hinh_anh = req.files['hinh_anh'] ? req.files['hinh_anh'][0].filename : null;
        const album_anh = req.files['album_anh'] ? req.files['album_anh'].map(f => f.filename) : [];

        await connection.beginTransaction();

        const [bookResult] = await connection.execute(
            `INSERT INTO sach (
                ten_sach, nha_cung_cap, nguoi_dich, nxb_id, nam_xuat_ban, ngon_ngu,
                gia_ban, gia_giam, so_luong_ton, so_trang, kich_thuoc, hinh_thuc,
                mo_ta, noi_dung, hinh_anh, album_anh, trang_thai
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                data.ten_sach, data.nha_cung_cap || null, data.nguoi_dich || null, data.nxb_id || null, 
                data.nam_xuat_ban || null, data.ngon_ngu || 'Tiếng Việt', data.gia_ban || 0, 
                data.gia_giam || 0, data.so_luong_ton || 0, data.so_trang || null, 
                data.kich_thuoc || null, data.hinh_thuc || null, data.mo_ta || null, 
                data.noi_dung || null, hinh_anh, JSON.stringify(album_anh), data.trang_thai || 'hien_thi'
            ]
        );
        const newBookId = bookResult.insertId;
        const dmIds = JSON.parse(data.danh_muc_ids || '[]');
        if (dmIds.length > 0) {
            const dmValues = dmIds.map(id => [newBookId, id]);
            await connection.query('INSERT INTO sach_danh_muc (sach_id, danh_muc_id) VALUES ?', [dmValues]);
        }

        const tgIds = JSON.parse(data.tac_gia_ids || '[]');
        if (tgIds.length > 0) {
            const tgValues = tgIds.map(id => [newBookId, id]);
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
        const data = req.body;

        const [oldBook] = await pool.execute('SELECT hinh_anh, album_anh FROM sach WHERE id = ?', [bookId]);
        if (oldBook.length === 0) throw new Error("Sách không tồn tại");

        let hinh_anh = oldBook[0].hinh_anh;
        let album_anh = JSON.parse(oldBook[0].album_anh || '[]');
        if (req.files['hinh_anh']) {
            await deleteFile(hinh_anh); 
            hinh_anh = req.files['hinh_anh'][0].filename;
        }
        if (req.files['album_anh']) {
            for (const img of album_anh) await deleteFile(img); 
            album_anh = req.files['album_anh'].map(f => f.filename);
        }

        await connection.beginTransaction();

        await connection.execute(
            `UPDATE sach SET 
                ten_sach = ?, nha_cung_cap = ?, nguoi_dich = ?, nxb_id = ?, nam_xuat_ban = ?, ngon_ngu = ?,
                gia_ban = ?, gia_giam = ?, so_luong_ton = ?, so_trang = ?, kich_thuoc = ?, hinh_thuc = ?,
                mo_ta = ?, noi_dung = ?, hinh_anh = ?, album_anh = ?, trang_thai = ?
            WHERE id = ?`,
            [
                data.ten_sach, data.nha_cung_cap || null, data.nguoi_dich || null, data.nxb_id || null, 
                data.nam_xuat_ban || null, data.ngon_ngu || 'Tiếng Việt', data.gia_ban || 0, 
                data.gia_giam || 0, data.so_luong_ton || 0, data.so_trang || null, 
                data.kich_thuoc || null, data.hinh_thuc || null, data.mo_ta || null, 
                data.noi_dung || null, hinh_anh, JSON.stringify(album_anh), data.trang_thai, bookId
            ]
        );

        await connection.execute('DELETE FROM sach_danh_muc WHERE sach_id = ?', [bookId]);
        const dmIds = JSON.parse(data.danh_muc_ids || '[]');
        if (dmIds.length > 0) {
            const dmValues = dmIds.map(id => [bookId, id]);
            await connection.query('INSERT INTO sach_danh_muc (sach_id, danh_muc_id) VALUES ?', [dmValues]);
        }

        await connection.execute('DELETE FROM sach_tac_gia WHERE sach_id = ?', [bookId]);
        const tgIds = JSON.parse(data.tac_gia_ids || '[]');
        if (tgIds.length > 0) {
            const tgValues = tgIds.map(id => [bookId, id]);
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

// LẤY SÁCH MỚI PHÁT HÀNH
exports.getNewArrivals = async (req, res) => {
    try {
        const query = `
            SELECT 
                s.id, s.ten_sach, s.gia_ban, s.gia_giam, s.hinh_anh,
                (SELECT tg.ten_tac_gia FROM sach_tac_gia stg 
                JOIN tac_gia tg ON stg.tac_gia_id = tg.id 
                WHERE stg.sach_id = s.id LIMIT 1) AS author,
                s.created_at
            FROM sach s
            WHERE s.trang_thai = 'hien_thi'
            ORDER BY s.created_at DESC
            LIMIT 8
        `;

        const [rows] = await pool.query(query);
        
        const formattedData = rows.map(book => {
            const discount = book.gia_giam > 0 
                ? Math.round(((book.gia_ban - book.gia_giam) / book.gia_ban) * 100) 
                : 0;
            return { ...book, discount_percent: `-${discount}%` };
        });

        res.json({ success: true, data: formattedData });
    } catch (error) {
        console.error("Lỗi getNewArrivals:", error);
        res.status(500).json({ message: 'Lỗi server khi lấy sách mới' });
    }
};
exports.getAllBooks = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 12; 
        const offset = (page - 1) * limit;
        
        const search = req.query.search || '';
        const categoryId = req.query.category_id || null;
        const priceRange = req.query.price_range || null; 
        const sortBy = req.query.sort_by || 'newest';

        let query = `
            SELECT DISTINCT s.id, s.ten_sach, s.gia_ban, s.gia_giam, s.hinh_anh,
            (SELECT tg.ten_tac_gia FROM sach_tac_gia stg JOIN tac_gia tg ON stg.tac_gia_id = tg.id WHERE stg.sach_id = s.id LIMIT 1) AS author
            FROM sach s
            LEFT JOIN sach_danh_muc sdm ON s.id = sdm.sach_id
            WHERE s.trang_thai = 'hien_thi'
        `;
        
        let countQuery = `SELECT COUNT(DISTINCT s.id) as total FROM sach s LEFT JOIN sach_danh_muc sdm ON s.id = sdm.sach_id WHERE s.trang_thai = 'hien_thi'`;
        let queryParams = [];

        if (search) {
            const searchPart = ` AND s.ten_sach LIKE ?`;
            query += searchPart;
            countQuery += searchPart;
            queryParams.push(`%${search}%`);
        }

        if (categoryId && categoryId !== 'all') {
            const catPart = ` AND sdm.danh_muc_id = ?`;
            query += catPart;
            countQuery += catPart;
            queryParams.push(categoryId);
        }

        if (priceRange) {
            let pricePart = '';
            if (priceRange === 'under-100') pricePart = ` AND (CASE WHEN s.gia_giam > 0 THEN s.gia_giam ELSE s.gia_ban END) < 100000`;
            else if (priceRange === '100-300') pricePart = ` AND (CASE WHEN s.gia_giam > 0 THEN s.gia_giam ELSE s.gia_ban END) BETWEEN 100000 AND 300000`;
            else if (priceRange === 'above-300') pricePart = ` AND (CASE WHEN s.gia_giam > 0 THEN s.gia_giam ELSE s.gia_ban END) > 300000`;
            
            query += pricePart;
            countQuery += pricePart;
        }

        switch (sortBy) {
            case 'price-asc': query += ` ORDER BY (CASE WHEN s.gia_giam > 0 THEN s.gia_giam ELSE s.gia_ban END) ASC`; break;
            case 'price-desc': query += ` ORDER BY (CASE WHEN s.gia_giam > 0 THEN s.gia_giam ELSE s.gia_ban END) DESC`; break;
            case 'best-seller': query += ` ORDER BY (SELECT SUM(so_luong) FROM don_hang_chi_tiet WHERE sach_id = s.id) DESC`; break;
            default: query += ` ORDER BY s.created_at DESC`;
        }

        query += ` LIMIT ? OFFSET ?`;
        const finalParams = [...queryParams, limit, offset];

        const [rows] = await pool.query(query, finalParams);
        const [countResult] = await pool.query(countQuery, queryParams);
        
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
        console.error(error);
        res.status(500).json({ message: 'Lỗi server khi lấy danh sách sản phẩm' });
    }
};