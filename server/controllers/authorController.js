const { pool } = require('../config/db');

exports.getAllAuthors = async (req, res) => {
    try {
        const [rows] = await pool.execute('SELECT * FROM tac_gia ORDER BY created_at DESC');
        res.json({ success: true, data: rows });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi lấy danh sách tác giả' });
    }
};

exports.createAuthor = async (req, res) => {
    try {
        const { ten_tac_gia } = req.body;
        if (!ten_tac_gia || ten_tac_gia.trim() === '') {
            return res.status(400).json({ message: 'Tên tác giả không được để trống' });
        }
        const [result] = await pool.execute(
            'INSERT INTO tac_gia (ten_tac_gia) VALUES (?)',
            [ten_tac_gia.trim()]
        );
        res.status(201).json({ 
            success: true, 
            message: 'Thêm tác giả thành công', 
            id: result.insertId 
        });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi thêm tác giả' });
    }
};

exports.updateAuthor = async (req, res) => {
    try {
        const { ten_tac_gia } = req.body;
        const authorId = req.params.id;
        if (!ten_tac_gia || ten_tac_gia.trim() === '') {
            return res.status(400).json({ message: 'Tên tác giả không được để trống' });
        }
        const [result] = await pool.execute(
            'UPDATE tac_gia SET ten_tac_gia = ? WHERE id = ?',
            [ten_tac_gia.trim(), authorId]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Không tìm thấy tác giả để cập nhật' });
        }
        res.json({ success: true, message: 'Cập nhật tác giả thành công' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi cập nhật tác giả' });
    }
};

exports.deleteAuthor = async (req, res) => {
    try {
        const authorId = req.params.id;
        const [books] = await pool.execute('SELECT id FROM sach_tac_gia WHERE tac_gia_id = ? LIMIT 1', [authorId]);
        if (books.length > 0) {
            return res.status(400).json({ 
                success: false, 
                message: 'Không thể xóa! Đang có sách của tác giả này trong hệ thống.' 
            });
        }
        const [result] = await pool.execute('DELETE FROM tac_gia WHERE id = ?', [authorId]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Không tìm thấy tác giả để xóa' });
        }
        res.json({ success: true, message: 'Xóa tác giả thành công' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server khi xóa tác giả' });
    }
};