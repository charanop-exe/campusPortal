// ============================================================
// User Model — Database operations for the users table
// ============================================================

import pool from '../config/db.js';

const UserModel = {
    /**
     * Find a user by email address
     */
    async findByEmail(email) {
        const [rows] = await pool.execute(
            'SELECT * FROM users WHERE email = ?',
            [email]
        );
        return rows[0] || null;
    },

    /**
     * Create a new user
     */
    async create({ name, email, password, role }) {
        const [result] = await pool.execute(
            'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
            [name, email, password, role]
        );
        return { id: result.insertId, name, email, role };
    },

    /**
     * Find a user by ID
     */
    async findById(id) {
        const [rows] = await pool.execute(
            'SELECT id, name, email, role, created_at FROM users WHERE id = ?',
            [id]
        );
        return rows[0] || null;
    },
};

export default UserModel;
