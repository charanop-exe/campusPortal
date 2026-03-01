// ============================================================
// Event Controller — CRUD operations for campus events
// ============================================================

import EventModel from '../models/eventModel.js';
import RegistrationModel from '../models/registrationModel.js';
import pool from '../config/db.js';

// ── Get all events (public) — includes registration count ──
export const getAllEvents = async (req, res) => {
    try {
        const events = await EventModel.getAll();
        const counts = await RegistrationModel.getCountsByEventIds();

        const eventsWithCounts = events.map(e => ({
            ...e,
            registration_count: counts[e.id] || 0,
        }));

        res.json(eventsWithCounts);
    } catch (err) {
        console.error('Get events error:', err);
        res.status(500).json({ message: 'Failed to fetch events.' });
    }
};

// ── Get a single event by ID ──
export const getEventById = async (req, res) => {
    try {
        const event = await EventModel.getById(req.params.id);
        if (!event) {
            return res.status(404).json({ message: 'Event not found.' });
        }
        res.json(event);
    } catch (err) {
        console.error('Get event error:', err);
        res.status(500).json({ message: 'Failed to fetch event.' });
    }
};

// ── Create a new event (admin / faculty) ──
export const createEvent = async (req, res) => {
    try {
        const { title, description, date, venue } = req.body;

        if (!title || !date || !venue) {
            return res.status(400).json({ message: 'Title, date, and venue are required.' });
        }

        const newEvent = await EventModel.create({
            title,
            description: description || '',
            date,
            venue,
            created_by: req.user.id,
        });

        res.status(201).json({ message: 'Event created successfully!', event: newEvent });
    } catch (err) {
        console.error('Create event error:', err);
        res.status(500).json({ message: 'Failed to create event.' });
    }
};

// ── Delete an event (admin only) ──
export const deleteEvent = async (req, res) => {
    try {
        const event = await EventModel.getById(req.params.id);
        if (!event) {
            return res.status(404).json({ message: 'Event not found.' });
        }

        await EventModel.deleteById(req.params.id);
        res.json({ message: 'Event deleted successfully.' });
    } catch (err) {
        console.error('Delete event error:', err);
        res.status(500).json({ message: 'Failed to delete event.' });
    }
};

// ── Get registrations for a specific event (admin/faculty) ──
export const getEventRegistrations = async (req, res) => {
    try {
        const event = await EventModel.getById(req.params.id);
        if (!event) {
            return res.status(404).json({ message: 'Event not found.' });
        }

        // Faculty can only view registrations for their own events
        if (req.user.role === 'faculty' && event.created_by !== req.user.id) {
            return res.status(403).json({ message: 'You can only view registrations for your own events.' });
        }

        const registrations = await RegistrationModel.getByEventId(req.params.id);
        res.json(registrations);
    } catch (err) {
        console.error('Get event registrations error:', err);
        res.status(500).json({ message: 'Failed to fetch registrations.' });
    }
};

// ── Public stats for landing page ──
export const getPublicStats = async (req, res) => {
    try {
        const [[{ totalEvents }]] = await pool.execute('SELECT COUNT(*) AS totalEvents FROM events');
        const [[{ totalRegistrations }]] = await pool.execute('SELECT COUNT(*) AS totalRegistrations FROM registrations');
        const [[{ totalUsers }]] = await pool.execute('SELECT COUNT(*) AS totalUsers FROM users');
        const [[{ upcomingEvents }]] = await pool.execute('SELECT COUNT(*) AS upcomingEvents FROM events WHERE date > NOW()');

        res.json({ totalEvents, totalRegistrations, totalUsers, upcomingEvents });
    } catch (err) {
        console.error('Stats error:', err);
        res.status(500).json({ message: 'Failed to fetch stats.' });
    }
};
