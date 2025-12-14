import { Router } from 'express';
import { authenticate, requireAdmin } from '../middleware/auth.js';
import * as eventsController from '../controllers/events.js';
import * as shiftsController from '../controllers/shifts.js';

const router = Router();

router.use(authenticate, requireAdmin);

// Shift routes - must be defined before /:id routes to avoid route conflicts
router.post('/create-shift', shiftsController.createShift);
router.get('/:eventId/shifts', shiftsController.getEventShifts);
// Shift assignment routes - use /shifts/:shiftId to avoid conflict with event :id
router.post('/shifts/:shiftId/assign', shiftsController.assignVolunteerToShift);
router.delete('/shifts/:shiftId/assign/:volunteerId', shiftsController.unassignVolunteerFromShift);

// Event routes - defined after shift routes to avoid conflicts
router.post('/', eventsController.createEvent);
router.get('/', eventsController.listEvents);
router.get('/:id', eventsController.getEvent);
router.patch('/:id', eventsController.updateEvent);
router.post('/:id/publish', eventsController.publishEvent);
router.post('/:id/complete', eventsController.completeEvent);
router.post('/:id/cancel', eventsController.cancelEvent);
router.delete('/:id', eventsController.deleteEvent);

export default router;
