import { Router } from 'express';
import { authenticate, requireAdmin } from '../middleware/auth.js';
import * as volunteersController from '../controllers/volunteers.js';

const router = Router();

// All volunteer routes require admin authentication
router.use(authenticate, requireAdmin);

router.get('/', volunteersController.listVolunteers);
router.post('/', volunteersController.createVolunteer);
router.get('/:id', volunteersController.getVolunteer);
router.patch('/:id', volunteersController.updateVolunteer);
router.delete('/:id', volunteersController.deleteVolunteer);
router.post('/:id/assign-badge', volunteersController.assignBadge);

export default router;
