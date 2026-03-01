// ============================================================
// Registration Routes — /api
// ============================================================

import { Router } from 'express';
import { registerForEvent, getRegistrations } from '../controllers/registrationController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import authorize from '../middleware/roleMiddleware.js';

const router = Router();

// POST /api/register-event  — Students register for an event
router.post('/register-event', authMiddleware, authorize('student'), registerForEvent);

// GET  /api/registrations   — All authenticated users view registrations (scoped by role)
router.get('/registrations', authMiddleware, authorize('admin', 'faculty', 'student'), getRegistrations);

export default router;
