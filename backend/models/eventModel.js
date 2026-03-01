// ============================================================
// Event Model — Database operations for the events table
// ============================================================

import pool from '../config/db.js';

const EventModel = {
    /**
     * Get all events, ordered by date (newest first)
     * Includes the creator's name via JOIN
     */
    async getAll() {
        const [rows] = await pool.execute(`
            SELECT e.*, u.name AS creator_name 
            FROM events e 
            JOIN users u ON e.created_by = u.id 
            ORDER BY e.date DESC
        `);
        return rows;
    },

    /**
     * Get a single event by ID
     */
    async getById(id) {
        const [rows] = await pool.execute(
            'SELECT e.*, u.name AS creator_name FROM events e JOIN users u ON e.created_by = u.id WHERE e.id = ?',
            [id]
        );
        return rows[0] || null;
    },

    /**
     * Create a new event
     */
    async create({ title, description, date, venue, created_by }) {
        const [result] = await pool.execute(
            'INSERT INTO events (title, description, date, venue, created_by) VALUES (?, ?, ?, ?, ?)',
            [title, description, date, venue, created_by]
        );
        return { id: result.insertId, title, description, date, venue, created_by };
    },

    /**
     * Delete an event by ID
     */
    async deleteById(id) {
        const [result] = await pool.execute(
            'DELETE FROM events WHERE id = ?',
            [id]
        );
        return result.affectedRows > 0;
    },
};

export default EventModel;
