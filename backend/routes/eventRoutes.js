// ============================================================
// Event Routes — /api/events
// ============================================================

import { Router } from 'express';
import { getAllEvents, getEventById, createEvent, deleteEvent, getEventRegistrations, getPublicStats } from '../controllers/eventController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import authorize from '../middleware/roleMiddleware.js';

const router = Router();

// GET  /api/events/stats   — Public: get platform stats for landing page
router.get('/stats', getPublicStats);

// GET  /api/events         — Public: list all events
router.get('/', getAllEvents);

// GET  /api/events/:id     — Public: get single event
router.get('/:id', getEventById);

// GET  /api/events/:id/registrations — Admin & Faculty: view registrants for an event
router.get('/:id/registrations', authMiddleware, authorize('admin', 'faculty'), getEventRegistrations);

// POST /api/events         — Admin & Faculty only
router.post('/', authMiddleware, authorize('admin', 'faculty'), createEvent);

// DELETE /api/events/:id   — Admin only
router.delete('/:id', authMiddleware, authorize('admin'), deleteEvent);

export default router;
