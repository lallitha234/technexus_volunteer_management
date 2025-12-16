import { Router } from 'express';
import * as badgesController from '../controllers/badges.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

// All badge routes require authentication
router.use(authenticate);

// GET /badges - List all badges
router.get('/', badgesController.listBadges);

export default router;
