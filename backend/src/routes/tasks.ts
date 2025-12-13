import { Router } from 'express';
import { authenticate, requireAdmin } from '../middleware/auth.js';
import * as tasksController from '../controllers/tasks.js';

const router = Router();

router.use(authenticate, requireAdmin);

router.post('/', tasksController.createTask);
router.get('/', tasksController.listTasks);
router.patch('/:id/status', tasksController.updateTaskStatus);
router.patch('/:id/complete', tasksController.completeTask);

export default router;
