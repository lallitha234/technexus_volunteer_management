import { Router } from 'express';
import { authenticate, requireAdmin } from '../middleware/auth.js';
import * as messagesController from '../controllers/messages.js';

const router = Router();

router.use(authenticate, requireAdmin);

router.post('/broadcast', messagesController.broadcastMessage);
router.post('/send', messagesController.sendMessage);
router.get('/volunteer/:id', messagesController.getVolunteerMessages);

export default router;
