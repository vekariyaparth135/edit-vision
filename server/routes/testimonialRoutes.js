import express from 'express';
import {
  getTestimonials,
  getAllTestimonialsAdmin,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
} from '../controllers/testimonialController.js';
import { protect, adminOnly } from '../middleware/auth.js';
import { handleSingleUpload } from '../middleware/upload.js';

const router = express.Router();

// Public routes
router.get('/', getTestimonials);

// Admin-only routes (strictly Vekariya Raj)
router.get('/admin/all', protect, adminOnly, getAllTestimonialsAdmin);
router.post('/', protect, adminOnly, handleSingleUpload('avatar'), createTestimonial);
router.put('/:id', protect, adminOnly, handleSingleUpload('avatar'), updateTestimonial);
router.delete('/:id', protect, adminOnly, deleteTestimonial);

export default router;

