import Media from '../models/Media.js';
import ActivityLog from '../models/ActivityLog.js';

// Helper to extract YouTube ID
const extractYouTubeId = (url) => {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|shorts\/)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
};

// @desc    Get public media (filtered, paginated, sorted)
// @route   GET /api/media
// @access  Public
export const getMedia = async (req, res) => {
  try {
    const { category, type, featured, limit = 50, page = 1 } = req.query;

    const query = { published: true };

    if (category && category !== 'All') {
      query.category = category;
    }

    if (type) {
      query.type = type;
    }

    if (featured === 'true') {
      query.featured = true;
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [items, total] = await Promise.all([
      Media.find(query)
        .sort({ order: 1, createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Media.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      count: items.length,
      total,
      data: items,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all media for admin (including unpublished)
// @route   GET /api/media/admin/all
// @access  Private (Admin)
export const getAllMediaAdmin = async (req, res) => {
  try {
    const items = await Media.find().sort({ order: 1, createdAt: -1 });
    res.status(200).json({
      success: true,
      count: items.length,
      data: items,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single media item
// @route   GET /api/media/:id
// @access  Public
export const getMediaById = async (req, res) => {
  try {
    const item = await Media.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Media item not found' });
    }

    // Increment views
    item.views += 1;
    await item.save();

    res.status(200).json({ success: true, data: item });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create new media item
// @route   POST /api/media
// @access  Private (Admin)
export const createMedia = async (req, res) => {
  try {
    const {
      title,
      description,
      type = 'video',
      category = 'Reels',
      videoSource = 'upload',
      url: bodyUrl,
      thumbnail: bodyThumbnail,
      featured = false,
      order = 0,
      clientName = '',
      duration = '',
    } = req.body;

    let mediaUrl = bodyUrl;
    let thumbnailUrl = bodyThumbnail;
    let externalId = '';

    // If file was uploaded via multer
    if (req.file) {
      mediaUrl = req.file.path;
    }

    if (req.files) {
      if (req.files.media && req.files.media[0]) {
        mediaUrl = req.files.media[0].path;
      }
      if (req.files.thumbnail && req.files.thumbnail[0]) {
        thumbnailUrl = req.files.thumbnail[0].path;
      }
    }

    if (!mediaUrl) {
      return res.status(400).json({
        success: false,
        message: 'Please upload a file or provide a video/image URL',
      });
    }

    // Process YouTube link
    const ytId = extractYouTubeId(mediaUrl);
    if (ytId) {
      externalId = ytId;
      if (!thumbnailUrl) {
        thumbnailUrl = `https://img.youtube.com/vi/${ytId}/maxresdefault.jpg`;
      }
    }

    const newMedia = await Media.create({
      title,
      description,
      type,
      url: mediaUrl,
      thumbnail: thumbnailUrl || (type === 'photo' ? mediaUrl : ''),
      category,
      videoSource: ytId ? 'youtube' : videoSource,
      externalId,
      featured: featured === true || featured === 'true',
      order: Number(order) || 0,
      clientName,
      duration,
      published: true,
    });

    await ActivityLog.create({
      action: 'Media Added',
      details: `Added new ${type}: "${title}" to ${category}`,
      user: req.user?.name || 'Vekariya Raj',
      status: 'success',
    }).catch(() => {});

    res.status(201).json({
      success: true,
      message: 'Media added successfully',
      data: newMedia,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update media item
// @route   PUT /api/media/:id
// @access  Private (Admin)
export const updateMedia = async (req, res) => {
  try {
    let item = await Media.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Media item not found' });
    }

    const updates = { ...req.body };

    if (req.files) {
      if (req.files.media && req.files.media[0]) {
        updates.url = req.files.media[0].path;
      }
      if (req.files.thumbnail && req.files.thumbnail[0]) {
        updates.thumbnail = req.files.thumbnail[0].path;
      }
    } else if (req.file) {
      updates.url = req.file.path;
    }

    if (updates.url) {
      const ytId = extractYouTubeId(updates.url);
      if (ytId) {
        updates.externalId = ytId;
        updates.videoSource = 'youtube';
        if (!updates.thumbnail && !item.thumbnail) {
          updates.thumbnail = `https://img.youtube.com/vi/${ytId}/maxresdefault.jpg`;
        }
      }
    }

    if (updates.featured !== undefined) {
      updates.featured = updates.featured === true || updates.featured === 'true';
    }
    if (updates.published !== undefined) {
      updates.published = updates.published === true || updates.published === 'true';
    }
    if (updates.order !== undefined) {
      updates.order = Number(updates.order);
    }

    item = await Media.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: 'Media updated successfully',
      data: item,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete media item
// @route   DELETE /api/media/:id
// @access  Private (Admin)
export const deleteMedia = async (req, res) => {
  try {
    const item = await Media.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Media item not found' });
    }

    await Media.findByIdAndDelete(req.params.id);

    await ActivityLog.create({
      action: 'Media Deleted',
      details: `Deleted ${item.type}: "${item.title}"`,
      user: req.user?.name || 'Vekariya Raj',
      status: 'warning',
    }).catch(() => {});

    res.status(200).json({
      success: true,
      message: 'Media deleted successfully',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Reorder media items
// @route   PUT /api/media/reorder
// @access  Private (Admin)
export const reorderMedia = async (req, res) => {
  try {
    const { items } = req.body; // Array of { id, order }

    if (!Array.isArray(items)) {
      return res.status(400).json({ success: false, message: 'Items array is required' });
    }

    const bulkOps = items.map((item, index) => ({
      updateOne: {
        filter: { _id: item.id || item._id },
        update: { order: item.order !== undefined ? item.order : index },
      },
    }));

    await Media.bulkWrite(bulkOps);

    res.status(200).json({
      success: true,
      message: 'Media order updated successfully',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Toggle publish status
// @route   PATCH /api/media/:id/toggle-publish
// @access  Private (Admin)
export const togglePublish = async (req, res) => {
  try {
    const item = await Media.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Media item not found' });
    }

    item.published = !item.published;
    await item.save();

    res.status(200).json({
      success: true,
      message: `Media ${item.published ? 'published' : 'unpublished'} successfully`,
      data: item,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

