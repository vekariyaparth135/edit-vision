import express from 'express';
import {
  login,
  register,
  resetCredentials,
  getMe,
  updatePassword,
  setPasswordDirect,
  updateProfile,
  logout,
} from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';
import { handleSingleUpload } from '../middleware/upload.js';

const router = express.Router();

router.post('/login', login);
router.post('/register', register);
router.post('/reset-credentials', resetCredentials);
router.get('/me', protect, getMe);
router.put('/updateprofile', protect, handleSingleUpload('avatar'), updateProfile);
router.put('/updatepassword', protect, updatePassword);
router.put('/setpassword', protect, setPasswordDirect);
router.post('/logout', logout);

export default router;
