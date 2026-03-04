const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

const connectDB = async () => {
    try {
        await pool.getConnection();
        console.log('✅ KẾT NỐI MySQL THÀNH CÔNG!');
    } catch (error) {
        console.error('❌KẾT NỐI THẤT BẠI RỒI CHÚ EM:', error.message);
        process.exit(1);
    }
};

module.exports = { pool, connectDB };