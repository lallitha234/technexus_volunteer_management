import { Router } from 'express';
import { authenticate, requireAdmin } from '../middleware/auth.js';
import * as analyticsController from '../controllers/analytics.js';

const router = Router();

router.use(authenticate, requireAdmin);

router.get('/volunteers', analyticsController.exportVolunteers);
router.get('/attendance', analyticsController.exportAttendance);

export default router;
