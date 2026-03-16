const { pool } = require('../config/db');

exports.getAllCategories = async (req, res) => {
    try {
        const [rows] = await pool.execute('SELECT * FROM danh_muc ORDER BY created_at DESC');
        res.json({ success: true, data: rows });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi lấy danh sách danh mục' });
    }
};

exports.createCategory = async (req, res) => {
    try {
        const { ten_danh_muc, mo_ta } = req.body;
        
        if (!ten_danh_muc || ten_danh_muc.trim() === '') {
            return res.status(400).json({ message: 'Tên danh mục không được để trống' });
        }

        const [result] = await pool.execute(
            'INSERT INTO danh_muc (ten_danh_muc, mo_ta) VALUES (?, ?)',
            [ten_danh_muc.trim(), mo_ta || null]
        );
        
        res.status(201).json({ 
            success: true, 
            message: 'Thêm danh mục thành công', 
            id: result.insertId 
        });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi thêm danh mục' });
    }
};

exports.updateCategory = async (req, res) => {
    try {
        const { ten_danh_muc, mo_ta } = req.body;
        const categoryId = req.params.id;

        if (!ten_danh_muc || ten_danh_muc.trim() === '') {
            return res.status(400).json({ message: 'Tên danh mục không được để trống' });
        }

        const [result] = await pool.execute(
            'UPDATE danh_muc SET ten_danh_muc = ?, mo_ta = ? WHERE id = ?',
            [ten_danh_muc.trim(), mo_ta || null, categoryId]
        );
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Không tìm thấy danh mục để cập nhật' });
        }

        res.json({ success: true, message: 'Cập nhật danh mục thành công' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi cập nhật danh mục' });
    }
};

exports.deleteCategory = async (req, res) => {
    try {
        const categoryId = req.params.id;
        const [books] = await pool.execute('SELECT id FROM sach_danh_muc WHERE danh_muc_id = ? LIMIT 1', [categoryId]);
        if (books.length > 0) {
            return res.status(400).json({ 
                success: false, 
                message: 'Không thể xóa! Danh mục này đang chứa sách.' 
            });
        }
        const [result] = await pool.execute('DELETE FROM danh_muc WHERE id = ?', [categoryId]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Không tìm thấy danh mục để xóa' });
        }
        res.json({ success: true, message: 'Xóa danh mục thành công' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server khi xóa danh mục' });
    }
};