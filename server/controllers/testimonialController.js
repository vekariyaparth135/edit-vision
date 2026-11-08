import Testimonial from '../models/Testimonial.js';

// @desc    Get published testimonials
// @route   GET /api/testimonials
// @access  Public
export const getTestimonials = async (req, res) => {
  try {
    const list = await Testimonial.find({ published: true }).sort({ order: 1, createdAt: -1 });
    res.status(200).json({ success: true, count: list.length, data: list });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all testimonials for admin
// @route   GET /api/testimonials/admin/all
// @access  Private (Admin)
export const getAllTestimonialsAdmin = async (req, res) => {
  try {
    const list = await Testimonial.find().sort({ order: 1, createdAt: -1 });
    res.status(200).json({ success: true, count: list.length, data: list });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create testimonial
// @route   POST /api/testimonials
// @access  Private (Admin)
export const createTestimonial = async (req, res) => {
  try {
    const { clientName, clientRole, clientCompany, rating, comment, projectTitle, videoUrl, order } =
      req.body;

    let avatar = req.body.avatar || '';
    if (req.file) {
      avatar = req.file.path;
    }

    const newTestimonial = await Testimonial.create({
      clientName,
      clientRole: clientRole || 'Client',
      clientCompany: clientCompany || '',
      avatar:
        avatar ||
        `https://ui-avatars.com/api/?name=${encodeURIComponent(clientName)}&background=C9A24B&color=000`,
      rating: Number(rating) || 5,
      comment,
      projectTitle: projectTitle || '',
      videoUrl: videoUrl || '',
      order: Number(order) || 0,
      published: true,
    });

    res.status(201).json({
      success: true,
      message: 'Testimonial created successfully',
      data: newTestimonial,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update testimonial
// @route   PUT /api/testimonials/:id
// @access  Private (Admin)
export const updateTestimonial = async (req, res) => {
  try {
    const updates = { ...req.body };

    if (req.file) {
      updates.avatar = req.file.path;
    }
    if (updates.rating !== undefined) {
      updates.rating = Number(updates.rating);
    }
    if (updates.published !== undefined) {
      updates.published = updates.published === true || updates.published === 'true';
    }

    const updated = await Testimonial.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      return res.status(404).json({ success: false, message: 'Testimonial not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Testimonial updated successfully',
      data: updated,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete testimonial
// @route   DELETE /api/testimonials/:id
// @access  Private (Admin)
export const deleteTestimonial = async (req, res) => {
  try {
    const deleted = await Testimonial.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Testimonial not found' });
    }

    res.status(200).json({ success: true, message: 'Testimonial deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

