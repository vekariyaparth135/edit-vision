import express from 'express';
import { getSettings, updateSettings } from '../controllers/settingsController.js';
import { protect, adminOnly } from '../middleware/auth.js';
import { handleFieldsUpload } from '../middleware/upload.js';

const router = express.Router();

const settingsUploadMiddleware = handleFieldsUpload([
  { name: 'logo', maxCount: 1 },
  { name: 'favicon', maxCount: 1 },
  { name: 'bioPhoto', maxCount: 1 },
  { name: 'heroPoster', maxCount: 1 },
  { name: 'beforeAfterRaw', maxCount: 1 },
  { name: 'beforeAfterEdited', maxCount: 1 },
]);

// Public route
router.get('/', getSettings);

// Admin-only route (strictly Vekariya Raj)
router.put('/', protect, adminOnly, settingsUploadMiddleware, updateSettings);

export default router;

