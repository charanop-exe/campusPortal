// ============================================================
// Database Connection — MySQL2 Pool (Promise-based)
// ============================================================

import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'campusconnect',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

// Quick connectivity check on startup
(async () => {
    try {
        const conn = await pool.getConnection();
        console.log('✅ Connected to MySQL database');
        conn.release();
    } catch (err) {
        console.error('❌ MySQL connection failed:', err.message);
    }
})();

export default pool;
