import Service from '../models/Service.js';

// @desc    Get active services
// @route   GET /api/services
// @access  Public
export const getServices = async (req, res) => {
  try {
    const services = await Service.find({ active: true }).sort({ order: 1 });
    res.status(200).json({ success: true, count: services.length, data: services });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all services for admin
// @route   GET /api/services/admin/all
// @access  Private (Admin)
export const getAllServicesAdmin = async (req, res) => {
  try {
    const services = await Service.find().sort({ order: 1 });
    res.status(200).json({ success: true, count: services.length, data: services });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create service
// @route   POST /api/services
// @access  Private (Admin)
export const createService = async (req, res) => {
  try {
    const { title, description, icon, startingPrice, features, turnaround, popular, order } = req.body;

    const parsedFeatures = Array.isArray(features)
      ? features
      : typeof features === 'string'
      ? features.split('\n').map((f) => f.trim()).filter(Boolean)
      : [];

    const newService = await Service.create({
      title,
      description,
      icon: icon || 'Film',
      startingPrice: startingPrice || '₹1,999',
      features: parsedFeatures,
      turnaround: turnaround || '24-48 Hours',
      popular: popular === true || popular === 'true',
      order: Number(order) || 0,
      active: true,
    });

    res.status(201).json({
      success: true,
      message: 'Service created successfully',
      data: newService,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update service
// @route   PUT /api/services/:id
// @access  Private (Admin)
export const updateService = async (req, res) => {
  try {
    const updates = { ...req.body };

    if (updates.features && typeof updates.features === 'string') {
      updates.features = updates.features
        .split('\n')
        .map((f) => f.trim())
        .filter(Boolean);
    }

    if (updates.popular !== undefined) {
      updates.popular = updates.popular === true || updates.popular === 'true';
    }
    if (updates.active !== undefined) {
      updates.active = updates.active === true || updates.active === 'true';
    }

    const updated = await Service.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Service updated successfully',
      data: updated,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete service
// @route   DELETE /api/services/:id
// @access  Private (Admin)
export const deleteService = async (req, res) => {
  try {
    const deleted = await Service.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }

    res.status(200).json({ success: true, message: 'Service deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

