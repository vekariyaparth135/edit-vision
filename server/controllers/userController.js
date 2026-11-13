import User from '../models/User.js';
import Message from '../models/Message.js';
import ActivityLog from '../models/ActivityLog.js';

// @desc    Get current user profile and inquiry summary
// @route   GET /api/user/profile
// @access  Private (User/Client)
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Inquiries submitted with this user's email
    const totalInquiries = await Message.countDocuments({ email: user.email });
    const pendingInquiries = await Message.countDocuments({
      email: user.email,
      status: 'unread',
    });
    const completedInquiries = await Message.countDocuments({
      email: user.email,
      status: { $in: ['contacted', 'archived'] },
    });

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar || '',
        createdAt: user.createdAt,
      },
      stats: {
        totalInquiries,
        pendingInquiries,
        completedInquiries,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update user's own profile (name, avatar)
// @route   PUT /api/user/profile
// @access  Private (User)
export const updateUserProfile = async (req, res) => {
  try {
    const { name, avatar } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (name) user.name = name.trim();
    if (avatar !== undefined) user.avatar = avatar;

    if (req.file) {
      user.avatar = req.file.path;
    }

    await user.save();

    await ActivityLog.create({
      action: 'User Profile Updated',
      details: `Profile updated by user ${user.name} (${user.email})`,
      user: user.name,
      status: 'info',
    }).catch(() => {});

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update user's own password
// @route   PUT /api/user/password
// @access  Private (User)
export const updateUserPassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both current and new password',
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 6 characters long',
      });
    }

    const user = await User.findById(req.user._id).select('+password');
    const isMatch = await user.comparePassword(currentPassword);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect',
      });
    }

    user.password = newPassword;
    await user.save();

    await ActivityLog.create({
      action: 'User Password Changed',
      details: `Password changed by user ${user.name} (${user.email})`,
      user: user.name,
      status: 'success',
    }).catch(() => {});

    res.status(200).json({
      success: true,
      message: 'Password updated successfully',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get user's own submitted inquiries / video edit bookings
// @route   GET /api/user/inquiries
// @access  Private (User)
export const getUserInquiries = async (req, res) => {
  try {
    const userEmail = req.user.email;
    const inquiries = await Message.find({ email: userEmail }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: inquiries.length,
      data: inquiries,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Submit a new project inquiry / video edit brief from User Panel
// @route   POST /api/user/inquiries
// @access  Private (User)
export const createUserInquiry = async (req, res) => {
  try {
    const { phone, service, budget, message } = req.body;

    if (!phone || !message) {
      return res.status(400).json({
        success: false,
        message: 'Phone number and project details message are required',
      });
    }

    const newInquiry = await Message.create({
      name: req.user.name || 'Client',
      email: req.user.email,
      phone,
      service: service || 'Cinematic Video Editing',
      budget: budget || '',
      message,
      status: 'unread',
    });

    await ActivityLog.create({
      action: 'User Inquiry Submitted',
      details: `Project inquiry submitted by ${req.user.name} (${phone}) for ${service || 'General Editing'}`,
      user: req.user.name,
      status: 'info',
      ip: req.ip || req.socket.remoteAddress || '',
    }).catch(() => {});

    res.status(201).json({
      success: true,
      message: 'Project request sent to Vekariya Raj successfully!',
      data: newInquiry,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Cancel / delete user's own inquiry
// @route   DELETE /api/user/inquiries/:id
// @access  Private (User)
export const deleteUserInquiry = async (req, res) => {
  try {
    const inquiry = await Message.findOne({
      _id: req.params.id,
      email: req.user.email,
    });

    if (!inquiry) {
      return res.status(404).json({
        success: false,
        message: 'Inquiry not found or you are not authorized to remove it',
      });
    }

    await inquiry.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Inquiry cancelled successfully',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

