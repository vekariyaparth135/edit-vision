import User from '../models/User.js';
import Message from '../models/Message.js';
import Media from '../models/Media.js';
import Service from '../models/Service.js';
import Testimonial from '../models/Testimonial.js';
import ActivityLog from '../models/ActivityLog.js';

// @desc    Get all users with filtering and stats
// @route   GET /api/admin/users
// @access  Private (Admin Only)
export const getAllUsers = async (req, res) => {
  try {
    const { search, role, sort = '-createdAt' } = req.query;
    const query = {};

    if (role && role !== 'all') {
      if (role === 'user') {
        query.role = { $in: ['user', 'client'] };
      } else {
        query.role = role;
      }
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const users = await User.find(query).select('-password').sort(sort);

    // Calculate counts
    const totalUsers = await User.countDocuments({});
    const totalAdmins = await User.countDocuments({ role: 'admin' });
    const totalRegularUsers = await User.countDocuments({ role: { $in: ['user', 'client'] } });

    // Aggregate inquiry count for each user
    const usersWithInquiryCounts = await Promise.all(
      users.map(async (u) => {
        const inquiryCount = await Message.countDocuments({ email: u.email });
        return {
          id: u._id,
          _id: u._id,
          name: u.name,
          email: u.email,
          role: u.role === 'client' ? 'user' : u.role,
          avatar: u.avatar || '',
          createdAt: u.createdAt,
          inquiryCount,
        };
      })
    );

    res.status(200).json({
      success: true,
      count: usersWithInquiryCounts.length,
      stats: {
        totalUsers,
        totalAdmins,
        totalRegularUsers,
      },
      data: usersWithInquiryCounts,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single user details with their inquiries
// @route   GET /api/admin/users/:id
// @access  Private (Admin Only)
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const inquiries = await Message.find({ email: user.email }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: {
        ...user.toObject(),
        role: user.role === 'client' ? 'user' : user.role,
        inquiries,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create a new user / admin manually
// @route   POST /api/admin/users
// @access  Private (Admin Only)
export const createUserByAdmin = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password',
      });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const existing = await User.findOne({ email: normalizedEmail });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'A user with this email already exists',
      });
    }

    const newUser = await User.create({
      name: name || 'New User',
      email: normalizedEmail,
      password,
      role: role === 'admin' ? 'admin' : 'user',
    });

    await ActivityLog.create({
      action: 'User Created by Admin',
      details: `Admin ${req.user.name} created user ${normalizedEmail} as ${newUser.role}`,
      user: req.user.name,
      status: 'info',
    }).catch(() => {});

    res.status(201).json({
      success: true,
      message: `User created successfully as ${newUser.role}`,
      data: {
        id: newUser._id,
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        createdAt: newUser.createdAt,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update user role (user <-> admin)
// @route   PUT /api/admin/users/:id/role
// @access  Private (Admin Only)
export const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;

    if (!['admin', 'user'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Role must be either "admin" or "user"',
      });
    }

    const targetUser = await User.findById(req.params.id);
    if (!targetUser) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Safety: Protect primary admin
    if (targetUser.email === 'admin12@gmail.com' && role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Cannot demote the primary Admin (admin12@gmail.com)',
      });
    }

    targetUser.role = role;
    await targetUser.save();

    await ActivityLog.create({
      action: 'User Role Changed',
      details: `Role of ${targetUser.email} changed to ${role} by ${req.user.name}`,
      user: req.user.name,
      status: 'warning',
    }).catch(() => {});

    res.status(200).json({
      success: true,
      message: `Role for ${targetUser.email} successfully updated to ${role}`,
      data: {
        id: targetUser._id,
        _id: targetUser._id,
        name: targetUser.name,
        email: targetUser.email,
        role: targetUser.role,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private (Admin Only)
export const deleteUserByAdmin = async (req, res) => {
  try {
    const targetUser = await User.findById(req.params.id);
    if (!targetUser) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Protect primary admin from deletion
    if (targetUser.email === 'admin12@gmail.com') {
      return res.status(403).json({
        success: false,
        message: 'Cannot delete the primary Admin account (admin12@gmail.com)',
      });
    }

    // Protect admin from deleting their own logged-in account
    if (targetUser._id.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'You cannot delete your own active admin account',
      });
    }

    await targetUser.deleteOne();

    await ActivityLog.create({
      action: 'User Account Deleted',
      details: `User ${targetUser.email} was removed by ${req.user.name}`,
      user: req.user.name,
      status: 'warning',
    }).catch(() => {});

    res.status(200).json({
      success: true,
      message: `User ${targetUser.email} deleted successfully`,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get complete system overview data for admin
// @route   GET /api/admin/overview
// @access  Private (Admin Only)
export const getAdminOverview = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({});
    const regularUsers = await User.countDocuments({ role: { $in: ['user', 'client'] } });
    const totalMessages = await Message.countDocuments({});
    const unreadMessages = await Message.countDocuments({ status: 'unread' });
    const totalMedia = await Media.countDocuments({});
    const totalServices = await Service.countDocuments({});
    const totalTestimonials = await Testimonial.countDocuments({});

    const recentUsers = await User.find({}).select('-password').sort({ createdAt: -1 }).limit(5);
    const recentMessages = await Message.find({}).sort({ createdAt: -1 }).limit(5);
    const recentLogs = await ActivityLog.find({}).sort({ createdAt: -1 }).limit(8);

    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        regularUsers,
        totalMessages,
        unreadMessages,
        totalMedia,
        totalServices,
        totalTestimonials,
      },
      recentUsers,
      recentMessages,
      recentLogs,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

