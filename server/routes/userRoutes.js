import express from 'express';
import {
  getUserProfile,
  updateUserProfile,
  updateUserPassword,
  getUserInquiries,
  createUserInquiry,
  deleteUserInquiry,
} from '../controllers/userController.js';
import { protect } from '../middleware/auth.js';
import { handleSingleUpload } from '../middleware/upload.js';

const router = express.Router();

// All user routes are protected for authenticated users to view/manage their own data
router.use(protect);

router.get('/profile', getUserProfile);
router.put('/profile', handleSingleUpload('avatar'), updateUserProfile);
router.put('/password', updateUserPassword);

router.get('/inquiries', getUserInquiries);
router.post('/inquiries', createUserInquiry);
router.delete('/inquiries/:id', deleteUserInquiry);

export default router;

