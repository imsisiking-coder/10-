import express from 'express';
import * as scheduleController from '../controllers/scheduleController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// 모든 라우트에 인증 필요
router.use(authenticateToken);

router.post('/', scheduleController.createSchedule);
router.get('/', scheduleController.getSchedules);
router.put('/:id', scheduleController.updateSchedule);
router.post('/:id/complete', scheduleController.completeSchedule);
router.delete('/:id', scheduleController.deleteSchedule);

export default router;
