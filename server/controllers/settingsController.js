import Settings from '../models/Settings.js';
import User from '../models/User.js';
import ActivityLog from '../models/ActivityLog.js';

// @desc    Get website settings
// @route   GET /api/settings
// @access  Public
export const getSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create({});
    }

    res.status(200).json({
      success: true,
      data: settings,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update website settings
// @route   PUT /api/settings
// @access  Private (Admin)
export const updateSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create({});
    }

    const updates = { ...req.body };

    // Strip protected MongoDB fields
    delete updates._id;
    delete updates.__v;
    delete updates.createdAt;
    delete updates.updatedAt;

    // Handle files if uploaded
    if (req.files) {
      if (req.files.logo && req.files.logo[0]) {
        updates.logoUrl = req.files.logo[0].path;
      }
      if (req.files.favicon && req.files.favicon[0]) {
        updates.faviconUrl = req.files.favicon[0].path;
      }
      if (req.files.bioPhoto && req.files.bioPhoto[0]) {
        updates.bioPhoto = req.files.bioPhoto[0].path;
      }
      if (req.files.heroPoster && req.files.heroPoster[0]) {
        updates.heroPoster = req.files.heroPoster[0].path;
      }
      if (req.files.beforeAfterRaw && req.files.beforeAfterRaw[0]) {
        updates.beforeAfterRaw = req.files.beforeAfterRaw[0].path;
      }
      if (req.files.beforeAfterEdited && req.files.beforeAfterEdited[0]) {
        updates.beforeAfterEdited = req.files.beforeAfterEdited[0].path;
      }
    }

    // Safely parse JSON strings or delete invalid objects
    if (typeof updates.softwareTools === 'string') {
      try {
        updates.softwareTools = JSON.parse(updates.softwareTools);
      } catch (e) {
        delete updates.softwareTools;
      }
    } else if (typeof updates.softwareTools === 'object' && !Array.isArray(updates.softwareTools)) {
      delete updates.softwareTools;
    }

    if (typeof updates.skills === 'string') {
      try {
        updates.skills = JSON.parse(updates.skills);
      } catch (e) {
        if (updates.skills.includes('[object')) {
          delete updates.skills;
        } else {
          updates.skills = updates.skills.split(',').map((s) => s.trim()).filter(Boolean);
        }
      }
    }

    if (typeof updates.socialLinks === 'string') {
      try {
        updates.socialLinks = JSON.parse(updates.socialLinks);
      } catch (e) {
        delete updates.socialLinks;
      }
    }

    if (typeof updates.colors === 'string') {
      try {
        updates.colors = JSON.parse(updates.colors);
      } catch (e) {
        delete updates.colors;
      }
    }

    // Also sync bioPhoto with admin user avatar if changed
    if (updates.bioPhoto && req.user) {
      await User.findByIdAndUpdate(req.user.id, { avatar: updates.bioPhoto }).catch(() => {});
    }

    settings = await Settings.findByIdAndUpdate(settings._id, updates, {
      new: true,
      runValidators: true,
    });

    // Record system activity log
    await ActivityLog.create({
      action: 'Site Settings Saved',
      details: `Website settings & identity updated by ${req.user?.name || 'Admin'}`,
      user: req.user?.name || 'Vekariya Raj',
      status: 'success',
    }).catch(() => {});

    res.status(200).json({
      success: true,
      message: 'Website settings updated successfully',
      data: settings,
    });
  } catch (error) {
    console.error('[Settings Update Error]:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};
