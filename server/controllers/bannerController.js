const { pool } = require('../config/db');
exports.getAllBanners = async (req, res) => {
    try {
        const [rows] = await pool.execute('SELECT * FROM banner ORDER BY created_at DESC');
        res.json({ success: true, data: rows });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Lỗi khi lấy danh sách banner' });
    }
};
exports.getActiveBanners = async (req, res) => {
    try {
        const [rows] = await pool.execute("SELECT * FROM banner WHERE trang_thai = 'hien_thi' ORDER BY id DESC");
        res.json({ success: true, data: rows });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Lỗi khi lấy banner hiển thị' });
    }
};

exports.createBanner = async (req, res) => {
    try {
        const { tieu_de, danh_muc, noi_dung, gia_ban, gia_giam } = req.body;
        
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'Vui lòng upload hình ảnh banner' });
        }

        const hinh_anh = req.file.filename;

        const sql = 'INSERT INTO banner (tieu_de, danh_muc, noi_dung, hinh_anh, gia_ban, gia_giam, trang_thai) VALUES (?, ?, ?, ?, ?, ?, ?)';
        const params = [
            tieu_de || null, 
            danh_muc || null, 
            noi_dung || null, 
            hinh_anh, 
            parseFloat(gia_ban) || 0, 
            parseFloat(gia_giam) || 0, 
            'hien_thi'
        ];

        const [result] = await pool.execute(sql, params);

        res.status(201).json({
            success: true,
            message: 'Thêm banner thành công',
            id: result.insertId
        });
    } catch (error) {
        console.error("Lỗi Create Banner:", error.message);
        res.status(500).json({ success: false, message: 'Lỗi khi thêm banner: ' + error.message });
    }
};
exports.updateBanner = async (req, res) => {
    try {
        const { tieu_de, danh_muc, noi_dung, gia_ban, gia_giam, trang_thai } = req.body;
        const bannerId = req.params.id;

        const [oldBanner] = await pool.execute('SELECT hinh_anh FROM banner WHERE id = ?', [bannerId]);
        if (oldBanner.length === 0) return res.status(404).json({ success: false, message: 'Không tìm thấy' });

        const hinh_anh = req.file ? req.file.filename : oldBanner[0].hinh_anh;

        const sql = 'UPDATE banner SET tieu_de = ?, danh_muc = ?, noi_dung = ?, hinh_anh = ?, gia_ban = ?, gia_giam = ?, trang_thai = ? WHERE id = ?';
        const params = [
            tieu_de || null,
            danh_muc || null,
            noi_dung || null,
            hinh_anh,
            parseFloat(gia_ban) || 0,
            parseFloat(gia_giam) || 0,
            trang_thai || 'hien_thi',
            bannerId
        ];

        await pool.execute(sql, params);
        res.json({ success: true, message: 'Cập nhật thành công' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.toggleBannerStatus = async (req, res) => {
    try {
        const bannerId = req.params.id;
        
        const [banner] = await pool.execute('SELECT trang_thai FROM banner WHERE id = ?', [bannerId]);
        if (banner.length === 0) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy banner' });
        }

        const newStatus = banner[0].trang_thai === 'hien_thi' ? 'an' : 'hien_thi';
        
        await pool.execute('UPDATE banner SET trang_thai = ? WHERE id = ?', [newStatus, bannerId]);

        res.json({ 
            success: true, 
            message: `Đã ${newStatus === 'hien_thi' ? 'hiển thị' : 'ẩn'} banner thành công`,
            currentStatus: newStatus 
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Lỗi khi thay đổi trạng thái banner' });
    }
};
