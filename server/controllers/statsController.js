import Media from '../models/Media.js';
import Message from '../models/Message.js';
import Visit from '../models/Visit.js';
import ActivityLog from '../models/ActivityLog.js';

// @desc    Log a visitor page view
// @route   POST /api/stats/visit
// @access  Public
export const logVisit = async (req, res) => {
  try {
    const { path = '/' } = req.body;
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '';
    const userAgent = req.headers['user-agent'] || '';

    await Visit.create({ path, ip, userAgent });

    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get dashboard stats for admin
// @route   GET /api/stats/dashboard
// @access  Private (Admin)
export const getDashboardStats = async (req, res) => {
  try {
    const [
      totalVideos,
      totalPhotos,
      totalMedia,
      totalMessages,
      unreadMessages,
      totalVisits,
      recentMedia,
      recentMessages,
      categoryCounts,
      recentLogs,
    ] = await Promise.all([
      Media.countDocuments({ type: 'video' }),
      Media.countDocuments({ type: 'photo' }),
      Media.countDocuments(),
      Message.countDocuments(),
      Message.countDocuments({ status: 'unread' }),
      Visit.countDocuments(),
      Media.find().sort({ createdAt: -1 }).limit(5),
      Message.find().sort({ createdAt: -1 }).limit(5),
      Media.aggregate([
        { $group: { _id: '$category', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),
      ActivityLog.find().sort({ createdAt: -1 }).limit(10),
    ]);

    // Calculate visits in the last 7 days grouped by day
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const visitsByDay = await Visit.aggregate([
      { $match: { createdAt: { $gte: sevenDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Build complete 7-day array even if count is 0
    const last7DaysData = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
      const found = visitsByDay.find((v) => v._id === dateStr);
      last7DaysData.push({
        date: dateStr,
        day: dayName,
        visits: found ? found.count : 0,
      });
    }

    res.status(200).json({
      success: true,
      data: {
        summary: {
          totalVideos,
          totalPhotos,
          totalMedia,
          totalMessages,
          unreadMessages,
          totalVisits,
        },
        visitsChart: last7DaysData,
        categoryChart: categoryCounts.map((c) => ({
          category: c._id || 'Uncategorized',
          count: c.count,
        })),
        recentMedia,
        recentMessages,
        recentLogs,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get activity logs
// @route   GET /api/stats/logs
// @access  Private (Admin)
export const getActivityLogs = async (req, res) => {
  try {
    const logs = await ActivityLog.find().sort({ createdAt: -1 }).limit(50);
    res.status(200).json({ success: true, count: logs.length, data: logs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
