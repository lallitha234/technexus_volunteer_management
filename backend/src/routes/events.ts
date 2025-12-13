import { Router } from 'express';
import { authenticate, requireAdmin } from '../middleware/auth.js';
import * as eventsController from '../controllers/events.js';
import * as shiftsController from '../controllers/shifts.js';

const router = Router();

router.use(authenticate, requireAdmin);

// Event routes
router.post('/', eventsController.createEvent);
router.get('/', eventsController.listEvents);
router.get('/:id', eventsController.getEvent);
router.patch('/:id', eventsController.updateEvent);
router.post('/:id/publish', eventsController.publishEvent);
router.post('/:id/complete', eventsController.completeEvent);
router.post('/:id/cancel', eventsController.cancelEvent);
router.delete('/:id', eventsController.deleteEvent);

// Shift routes
router.post('/create-shift', shiftsController.createShift);
router.get('/:eventId/shifts', shiftsController.getEventShifts);
router.post('/:id/assign', shiftsController.assignVolunteerToShift);
router.delete('/:id/assign/:volunteerId', shiftsController.unassignVolunteerFromShift);

export default router;
