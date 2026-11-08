import express from 'express';
import { logVisit, getDashboardStats, getActivityLogs } from '../controllers/statsController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

router.post('/visit', logVisit);
router.get('/dashboard', protect, adminOnly, getDashboardStats);
router.get('/logs', protect, adminOnly, getActivityLogs);

export default router;
