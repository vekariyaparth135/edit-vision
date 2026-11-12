import express from 'express';
import {
  getAllUsers,
  getUserById,
  createUserByAdmin,
  updateUserRole,
  deleteUserByAdmin,
  getAdminOverview,
} from '../controllers/adminController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

// Strict Admin-only middleware for all routes in this router
router.use(protect, adminOnly);

// System overview
router.get('/overview', getAdminOverview);

// User Management routes
router.get('/users', getAllUsers);
router.post('/users', createUserByAdmin);
router.get('/users/:id', getUserById);
router.put('/users/:id/role', updateUserRole);
router.delete('/users/:id', deleteUserByAdmin);

export default router;
