// ============================================================
// Registration Model — Database operations for registrations
// ============================================================

import pool from '../config/db.js';

const RegistrationModel = {
    /**
     * Register a user for an event
     */
    async create({ user_id, event_id }) {
        const [result] = await pool.execute(
            'INSERT INTO registrations (user_id, event_id) VALUES (?, ?)',
            [user_id, event_id]
        );
        return { id: result.insertId, user_id, event_id };
    },

    /**
     * Check if a user is already registered for an event
     */
    async findByUserAndEvent(user_id, event_id) {
        const [rows] = await pool.execute(
            'SELECT * FROM registrations WHERE user_id = ? AND event_id = ?',
            [user_id, event_id]
        );
        return rows[0] || null;
    },

    /**
     * Get all registrations (admin view) with user and event details
     */
    async getAll() {
        const [rows] = await pool.execute(`
            SELECT r.id, r.registered_at,
                   u.name AS student_name, u.email AS student_email,
                   e.title AS event_title, e.date AS event_date, e.venue AS event_venue
            FROM registrations r
            JOIN users  u ON r.user_id  = u.id
            JOIN events e ON r.event_id = e.id
            ORDER BY r.registered_at DESC
        `);
        return rows;
    },

    /**
     * Get registrations for events created by a specific faculty member
     */
    async getByEventCreator(creatorId) {
        const [rows] = await pool.execute(`
            SELECT r.id, r.registered_at,
                   u.name AS student_name, u.email AS student_email,
                   e.title AS event_title, e.date AS event_date, e.venue AS event_venue
            FROM registrations r
            JOIN users  u ON r.user_id  = u.id
            JOIN events e ON r.event_id = e.id
            WHERE e.created_by = ?
            ORDER BY r.registered_at DESC
        `, [creatorId]);
        return rows;
    },

    /**
     * Get registrations for a specific student (by user ID)
     */
    async getByUserId(userId) {
        const [rows] = await pool.execute(`
            SELECT r.id, r.registered_at,
                   e.title AS event_title, e.date AS event_date, e.venue AS event_venue,
                   u2.name AS creator_name
            FROM registrations r
            JOIN events e ON r.event_id = e.id
            JOIN users u2 ON e.created_by = u2.id
            WHERE r.user_id = ?
            ORDER BY r.registered_at DESC
        `, [userId]);
        return rows;
    },

    /**
     * Get registrations for a specific event (by event ID)
     */
    async getByEventId(eventId) {
        const [rows] = await pool.execute(`
            SELECT r.id, r.registered_at,
                   u.name AS student_name, u.email AS student_email
            FROM registrations r
            JOIN users u ON r.user_id = u.id
            WHERE r.event_id = ?
            ORDER BY r.registered_at DESC
        `, [eventId]);
        return rows;
    },

    /**
     * Get registration counts grouped by event_id
     */
    async getCountsByEventIds() {
        const [rows] = await pool.execute(`
            SELECT event_id, COUNT(*) AS count
            FROM registrations
            GROUP BY event_id
        `);
        const map = {};
        rows.forEach(r => { map[r.event_id] = r.count; });
        return map;
    },
};

export default RegistrationModel;
