require('dotenv').config();
const bcrypt = require('bcryptjs');
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'datn_lumi_book',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

const createSuperAdmin = async () => {
    const adminData = {
        ho_ten: 'Admin Lumi Book',
        email: 'admin@lumibook.com',
        mat_khau: 'lumibook2026', 
        so_dien_thoai: '0357699792',
        role: 'admin',
        trang_thai: 'active'
    };

    try {
        const [existing] = await pool.execute('SELECT id FROM nguoi_dung WHERE email = ?', [adminData.email]);
        
        if (existing.length > 0) {
            console.log('Tài khoản Admin đã tồn tại trong hệ thống!');
            process.exit(0);
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(adminData.mat_khau, salt);

        await pool.execute(
            `INSERT INTO nguoi_dung (ho_ten, email, mat_khau, so_dien_thoai, role, trang_thai) 
            VALUES (?, ?, ?, ?, ?, ?)`,
            [adminData.ho_ten, adminData.email, hashedPassword, adminData.so_dien_thoai, adminData.role, adminData.trang_thai]
        );

        console.log('Khởi tạo tài khoản Super Admin thành công!');
        console.log(`Email: ${adminData.email}`);
        console.log(`Mật khẩu: ${adminData.mat_khau}`);
        
    } catch (error) {
        console.error('Lỗi khởi tạo Admin:', error);
    } finally {
        process.exit(0);
    }
};

createSuperAdmin();