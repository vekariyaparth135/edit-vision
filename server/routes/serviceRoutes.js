import express from 'express';
import {
  getServices,
  getAllServicesAdmin,
  createService,
  updateService,
  deleteService,
} from '../controllers/serviceController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', getServices);

// Admin-only routes (strictly Vekariya Raj)
router.get('/admin/all', protect, adminOnly, getAllServicesAdmin);
router.post('/', protect, adminOnly, createService);
router.put('/:id', protect, adminOnly, updateService);
router.delete('/:id', protect, adminOnly, deleteService);

export default router;

