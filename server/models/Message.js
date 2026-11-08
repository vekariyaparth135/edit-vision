import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide your name'],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, 'Please provide your phone number'],
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      default: '',
    },
    service: {
      type: String,
      default: 'General Inquiry',
    },
    budget: {
      type: String,
      default: '',
    },
    message: {
      type: String,
      required: [true, 'Please provide your message'],
    },
    status: {
      type: String,
      enum: ['unread', 'read', 'contacted', 'archived'],
      default: 'unread',
    },
    replyNotes: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

messageSchema.index({ status: 1, createdAt: -1 });

const Message = mongoose.model('Message', messageSchema);
export default Message;

