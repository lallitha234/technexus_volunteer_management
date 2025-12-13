import { Router } from 'express';
import { authenticate, requireAdmin } from '../middleware/auth.js';
import * as volunteersController from '../controllers/volunteers.js';

const router = Router();

// POST /volunteers - Allow creation without auth in dev mode
router.post('/', async (req, res, next) => {
  // In development, allow volunteer creation without authentication
  if (process.env.NODE_ENV === 'development') {
    return volunteersController.createVolunteer(req, res);
  }
  // In production, require authentication
  authenticate(req, res, () => {
    requireAdmin(req, res, () => {
      volunteersController.createVolunteer(req, res);
    });
  });
});

// All other volunteer routes require admin authentication
router.use(authenticate, requireAdmin);

router.get('/', volunteersController.listVolunteers);
router.get('/:id', volunteersController.getVolunteer);
router.patch('/:id', volunteersController.updateVolunteer);
router.delete('/:id', volunteersController.deleteVolunteer);
router.post('/:id/assign-badge', volunteersController.assignBadge);

export default router;
