const { pool } = require('../config/db');

exports.getAllPublishers = async (req, res) => {
    try {
        const [rows] = await pool.execute('SELECT * FROM nha_xuat_ban ORDER BY created_at DESC');
        res.json({ success: true, data: rows });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi lấy danh sách nhà xuất bản' });
    }
};

exports.createPublisher = async (req, res) => {
    try {
        const { ten_nha_xuat_ban } = req.body;
        if (!ten_nha_xuat_ban || ten_nha_xuat_ban.trim() === '') {
            return res.status(400).json({ message: 'Tên nhà xuất bản không được để trống' });
        }
        const [result] = await pool.execute(
            'INSERT INTO nha_xuat_ban (ten_nha_xuat_ban) VALUES (?)',
            [ten_nha_xuat_ban.trim()]
        );
        res.status(201).json({ 
            success: true, 
            message: 'Thêm nhà xuất bản thành công', 
            id: result.insertId 
        });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi thêm nhà xuất bản' });
    }
};

exports.updatePublisher = async (req, res) => {
    try {
        const { ten_nha_xuat_ban } = req.body;
        const publisherId = req.params.id;
        if (!ten_nha_xuat_ban || ten_nha_xuat_ban.trim() === '') {
            return res.status(400).json({ message: 'Tên nhà xuất bản không được để trống' });
        }
        const [result] = await pool.execute(
            'UPDATE nha_xuat_ban SET ten_nha_xuat_ban = ? WHERE id = ?',
            [ten_nha_xuat_ban.trim(), publisherId]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Không tìm thấy nhà xuất bản để cập nhật' });
        }
        res.json({ success: true, message: 'Cập nhật nhà xuất bản thành công' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi cập nhật nhà xuất bản' });
    }
};

exports.deletePublisher = async (req, res) => {
    try {
        const publisherId = req.params.id;
        const [books] = await pool.execute('SELECT id FROM sach WHERE nxb_id = ? LIMIT 1', [publisherId]);
        if (books.length > 0) {
            return res.status(400).json({ 
                success: false, 
                message: 'Không thể xóa! Đang có sách thuộc Nhà xuất bản này trong hệ thống.' 
            });
        }
        await pool.execute('DELETE FROM nha_xuat_ban WHERE id = ?', [publisherId]);
        res.json({ success: true, message: 'Xóa nhà xuất bản thành công' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server khi xóa nhà xuất bản' });
    }
};