import { Router } from 'express';
import { authenticate, requireAdmin } from '../middleware/auth.js';
import * as authController from '../controllers/auth.js';

const router = Router();

/**
 * POST /auth/login
 * Supabase auth is handled client-side; this endpoint can validate tokens
 */
router.post('/login', authController.loginWithSupabase);

export default router;
