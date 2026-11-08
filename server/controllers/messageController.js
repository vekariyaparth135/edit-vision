import Message from '../models/Message.js';
import ActivityLog from '../models/ActivityLog.js';

// @desc    Create new contact message
// @route   POST /api/messages
// @access  Public
export const createMessage = async (req, res) => {
  try {
    const { name, phone, email, service, budget, message } = req.body;

    if (!name || !phone || !message) {
      return res.status(400).json({
        success: false,
        message: 'Name, phone number, and message are required',
      });
    }

    const newMessage = await Message.create({
      name,
      phone,
      email: email || '',
      service: service || 'General Inquiry',
      budget: budget || '',
      message,
      status: 'unread',
    });

    await ActivityLog.create({
      action: 'Client Inquiry Received',
      details: `New inquiry from ${name} (${phone}) for ${service || 'General Inquiry'}`,
      user: name,
      status: 'info',
      ip: req.ip || req.socket.remoteAddress || '',
    }).catch(() => {});

    res.status(201).json({
      success: true,
      message: 'Thank you! Your inquiry has been sent to Vekariya Raj. We will contact you shortly.',
      data: newMessage,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all messages for admin
// @route   GET /api/messages
// @access  Private (Admin)
export const getMessages = async (req, res) => {
  try {
    const { status } = req.query;
    const query = {};

    if (status && status !== 'all') {
      query.status = status;
    }

    const messages = await Message.find(query).sort({ createdAt: -1 });
    const unreadCount = await Message.countDocuments({ status: 'unread' });

    res.status(200).json({
      success: true,
      count: messages.length,
      unreadCount,
      data: messages,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update message status / reply notes
// @route   PUT /api/messages/:id
// @access  Private (Admin)
export const updateMessageStatus = async (req, res) => {
  try {
    const { status, replyNotes } = req.body;
    const update = {};

    if (status) update.status = status;
    if (replyNotes !== undefined) update.replyNotes = replyNotes;

    const message = await Message.findByIdAndUpdate(req.params.id, update, {
      new: true,
    });

    if (!message) {
      return res.status(404).json({ success: false, message: 'Message not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Message status updated',
      data: message,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete message
// @route   DELETE /api/messages/:id
// @access  Private (Admin)
export const deleteMessage = async (req, res) => {
  try {
    const message = await Message.findByIdAndDelete(req.params.id);
    if (!message) {
      return res.status(404).json({ success: false, message: 'Message not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Message deleted successfully',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get current logged in client's project inquiries
// @route   GET /api/messages/my
// @access  Private (Client / Any Authenticated User)
export const getMyInquiries = async (req, res) => {
  try {
    const userEmail = req.user.email;
    const messages = await Message.find({ email: userEmail }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: messages.length,
      data: messages,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

