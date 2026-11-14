import app from '../server/server.js';
import connectDB from '../server/config/db.js';
import { ensureDefaultAdmin } from '../server/controllers/authController.js';

export default async function handler(req, res) {
  try {
    await connectDB();
    await ensureDefaultAdmin();
  } catch (error) {
    console.error('Serverless DB init error:', error);
    return res.status(503).json({
      success: false,
      message: 'Database is unavailable. Check the server MongoDB configuration.',
    });
  }
  return app(req, res);
}
