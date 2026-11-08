import express from 'express';
import {
  createMessage,
  getMessages,
  getMyInquiries,
  updateMessageStatus,
  deleteMessage,
} from '../controllers/messageController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

// Public route (contact form submission)
router.post('/', createMessage);

// Client route (view own submitted project inquiries)
router.get('/my', protect, getMyInquiries);

// Admin-only routes (strictly Vekariya Raj)
router.get('/', protect, adminOnly, getMessages);
router.put('/:id', protect, adminOnly, updateMessageStatus);
router.delete('/:id', protect, adminOnly, deleteMessage);

export default router;

