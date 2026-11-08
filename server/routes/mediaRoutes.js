import express from 'express';
import {
  getMedia,
  getAllMediaAdmin,
  getMediaById,
  createMedia,
  updateMedia,
  deleteMedia,
  reorderMedia,
  togglePublish,
} from '../controllers/mediaController.js';
import { protect, adminOnly } from '../middleware/auth.js';
import { handleFieldsUpload } from '../middleware/upload.js';

const router = express.Router();

const mediaUploadMiddleware = handleFieldsUpload([
  { name: 'media', maxCount: 1 },
  { name: 'thumbnail', maxCount: 1 },
]);

// Public routes
router.get('/', getMedia);
router.get('/:id', getMediaById);

// Admin-only routes (strictly Vekariya Raj)
router.get('/admin/all', protect, adminOnly, getAllMediaAdmin);
router.post('/', protect, adminOnly, mediaUploadMiddleware, createMedia);
router.put('/reorder', protect, adminOnly, reorderMedia);
router.put('/:id', protect, adminOnly, mediaUploadMiddleware, updateMedia);
router.patch('/:id/toggle-publish', protect, adminOnly, togglePublish);
router.delete('/:id', protect, adminOnly, deleteMedia);

export default router;

