import mongoose from 'mongoose';

const mediaSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a title'],
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    type: {
      type: String,
      enum: ['video', 'photo'],
      required: true,
      default: 'video',
    },
    url: {
      type: String,
      required: [true, 'Media URL or video link is required'],
    },
    thumbnail: {
      type: String,
      default: '',
    },
    category: {
      type: String,
      enum: ['Wedding', 'Reels', 'YouTube', 'Ads', 'Corporate', 'Photos', 'Color Grading'],
      default: 'Reels',
    },
    videoSource: {
      type: String,
      enum: ['upload', 'youtube', 'drive', 'vimeo', 'direct'],
      default: 'upload',
    },
    externalId: {
      type: String,
      default: '',
    },
    featured: {
      type: Boolean,
      default: false,
    },
    order: {
      type: Number,
      default: 0,
    },
    published: {
      type: Boolean,
      default: true,
    },
    clientName: {
      type: String,
      default: '',
    },
    duration: {
      type: String,
      default: '',
    },
    views: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// Index for ordering & filtering
mediaSchema.index({ published: 1, order: 1, createdAt: -1 });
mediaSchema.index({ category: 1 });

const Media = mongoose.model('Media', mediaSchema);
export default Media;

