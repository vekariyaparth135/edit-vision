import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import ActivityLog from '../models/ActivityLog.js';

const ADMIN_EMAILS = [
  'admin12@gmail.com',
  'mahirgohil9@gmail.com',
  'admin@editvision.com',
  'raj@editvision.com',
];

const generateToken = (id, role) => {
  return jwt.sign(
    { id, role },
    process.env.JWT_SECRET || 'edit_vision_super_secret_jwt_key_2026_raj_vekariya',
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

const sendTokenResponse = (user, statusCode, res) => {
  const token = generateToken(user._id, user.role);

  const cookieOptions = {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  };

  res
    .status(statusCode)
    .cookie('token', token, cookieOptions)
    .json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar || '',
        role: user.role,
      },
    });
};

// @desc    Register new user (Client by default, Raj Vekariya as Admin)
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long',
      });
    }

    // Check if user already exists
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email already exists. Please sign in or use a different email.',
      });
    }

    // Only Raj Vekariya designated emails can be admin
    const normalizedEmail = email.toLowerCase().trim();
    const isRajAdmin = ADMIN_EMAILS.includes(normalizedEmail);
    const assignedRole = isRajAdmin ? 'admin' : 'user';
    const assignedName = name || (isRajAdmin ? 'Vekariya Raj' : 'User');

    const user = await User.create({
      name: assignedName,
      email: normalizedEmail,
      password,
      role: assignedRole,
    });

    await ActivityLog.create({
      action: isRajAdmin ? 'Admin Account Registered' : 'New User Registered',
      details: `${isRajAdmin ? 'Admin' : 'User'} account created for ${email}`,
      user: user.name,
      status: 'success',
      ip: req.ip || req.socket.remoteAddress || '',
    }).catch(() => { });

    sendTokenResponse(user, 201, res);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Setup / Reset own admin email & password from login screen
// @route   POST /api/auth/reset-credentials
// @access  Public
export const resetCredentials = async (req, res) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and new password',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long',
      });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const isRajAdmin = ADMIN_EMAILS.includes(normalizedEmail);

    let user = await User.findOne({ email: normalizedEmail });

    if (user) {
      user.password = password;
      if (name) user.name = name;
      await user.save();
    } else {
      user = await User.create({
        name: name || (isRajAdmin ? 'Vekariya Raj' : 'User'),
        email: normalizedEmail,
        password,
        role: isRajAdmin ? 'admin' : 'user',
      });
    }

    await ActivityLog.create({
      action: isRajAdmin ? 'Admin Credentials Configured' : 'User Password Updated',
      details: `Password configured for ${email} (${user.role})`,
      user: user.name,
      status: 'success',
      ip: req.ip || req.socket.remoteAddress || '',
    }).catch(() => { });

    sendTokenResponse(user, 200, res);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Admin login
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password',
      });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail }).select('+password');
    if (!user) {
      // Log failed attempt
      await ActivityLog.create({
        action: 'Failed Login Attempt',
        details: `Unknown email attempted: ${normalizedEmail}`,
        user: normalizedEmail,
        status: 'warning',
        ip: req.ip || req.socket.remoteAddress || '',
      }).catch(() => { });

      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      await ActivityLog.create({
        action: 'Failed Login Attempt',
        details: `Incorrect password for ${email}`,
        user: user.name,
        status: 'warning',
        ip: req.ip || req.socket.remoteAddress || '',
      }).catch(() => { });

      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Log successful login
    await ActivityLog.create({
      action: 'Admin Logged In',
      details: `Successful login from ${req.headers['user-agent']?.split(' ')[0] || 'Browser'}`,
      user: user.name,
      status: 'success',
      ip: req.ip || req.socket.remoteAddress || '',
    }).catch(() => { });

    sendTokenResponse(user, 200, res);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar || '',
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update admin profile (name, email, avatar)
// @route   PUT /api/auth/updateprofile
// @access  Private
export const updateProfile = async (req, res) => {
  try {
    const { name, email, avatar } = req.body;
    const user = await User.findById(req.user.id);

    if (name) user.name = name;
    if (email) user.email = email;
    if (avatar !== undefined) user.avatar = avatar;

    if (req.file) {
      user.avatar = req.file.path;
    }

    await user.save();

    await ActivityLog.create({
      action: 'Profile Updated',
      details: `Admin profile details updated for ${user.name}`,
      user: user.name,
      status: 'info',
    }).catch(() => { });

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Change admin password (verifies current password)
// @route   PUT /api/auth/updatepassword
// @access  Private
export const updatePassword = async (req, res) => {
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

    const user = await User.findById(req.user.id).select('+password');

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
      action: 'Password Changed',
      details: 'Admin password changed securely via authentication verification',
      user: user.name,
      status: 'success',
    }).catch(() => { });

    sendTokenResponse(user, 200, res);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Direct password set (authenticated admin can set without current password)
// @route   PUT /api/auth/setpassword
// @access  Private
export const setPasswordDirect = async (req, res) => {
  try {
    const { newPassword } = req.body;

    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 6 characters long',
      });
    }

    const user = await User.findById(req.user.id);
    user.password = newPassword;
    await user.save();

    await ActivityLog.create({
      action: 'Password Set Directly',
      details: 'New password established directly from Admin Console',
      user: user.name,
      status: 'success',
    }).catch(() => { });

    sendTokenResponse(user, 200, res);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Admin logout
// @route   POST /api/auth/logout
// @access  Private
export const logout = async (req, res) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });

  if (req.user) {
    await ActivityLog.create({
      action: 'Admin Logged Out',
      details: 'Session terminated',
      user: req.user.name,
      status: 'info',
    }).catch(() => { });
  }

  res.status(200).json({
    success: true,
    message: 'Logged out successfully',
  });
};

// Auto-seed default admin if database is newly initialized
export const ensureDefaultAdmin = async () => {
  try {
    const adminEmail = (process.env.ADMIN_EMAIL || 'admin12@gmail.com').toLowerCase().trim();
    const adminPassword =
      process.env.ADMIN_PASSWORD ||
      process.env.ADMIN_DEFAULT_PASSWORD ||
      'Admin@123456';
    const admin = await User.findOne({ email: adminEmail });
    if (!admin) {
      await User.create({
        name: process.env.ADMIN_NAME || 'Vekariya Raj',
        email: adminEmail,
        password: adminPassword,
        role: 'admin',
      });
      console.log(`[System]: Default Admin (${adminEmail}) verified/created.`);
    }
  } catch (err) {
    // Ignore in dev/read-only mode
  }
};
