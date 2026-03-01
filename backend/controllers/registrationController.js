// ============================================================
// Registration Controller — Event registration management
// ============================================================

import RegistrationModel from '../models/registrationModel.js';
import EventModel from '../models/eventModel.js';

// ── Register for an event (student) ──
export const registerForEvent = async (req, res) => {
    try {
        const { event_id } = req.body;

        if (!event_id) {
            return res.status(400).json({ message: 'Event ID is required.' });
        }

        // Check if event exists
        const event = await EventModel.getById(event_id);
        if (!event) {
            return res.status(404).json({ message: 'Event not found.' });
        }

        // Check for duplicate registration
        const existing = await RegistrationModel.findByUserAndEvent(req.user.id, event_id);
        if (existing) {
            return res.status(409).json({ message: 'You are already registered for this event.' });
        }

        const registration = await RegistrationModel.create({
            user_id: req.user.id,
            event_id: event_id,
        });

        res.status(201).json({ message: 'Successfully registered for the event!', registration });
    } catch (err) {
        console.error('Register for event error:', err);
        res.status(500).json({ message: 'Failed to register for event.' });
    }
};

// ── Get registrations (admin: all, faculty: own events, student: own) ──
export const getRegistrations = async (req, res) => {
    try {
        let registrations;

        if (req.user.role === 'admin') {
            registrations = await RegistrationModel.getAll();
        } else if (req.user.role === 'faculty') {
            registrations = await RegistrationModel.getByEventCreator(req.user.id);
        } else if (req.user.role === 'student') {
            registrations = await RegistrationModel.getByUserId(req.user.id);
        } else {
            return res.status(403).json({ message: 'Access denied.' });
        }

        res.json(registrations);
    } catch (err) {
        console.error('Get registrations error:', err);
        res.status(500).json({ message: 'Failed to fetch registrations.' });
    }
};
