import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Service title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Service description is required'],
    },
    icon: {
      type: String,
      default: 'Film', // Lucide icon name: Film, Scissors, Sparkles, Wand2, Layers, Palette, MonitorPlay
    },
    startingPrice: {
      type: String,
      required: true,
      default: '₹1,999',
    },
    currency: {
      type: String,
      default: '₹',
    },
    features: {
      type: [String],
      default: [],
    },
    turnaround: {
      type: String,
      default: '24-48 Hours',
    },
    popular: {
      type: Boolean,
      default: false,
    },
    order: {
      type: Number,
      default: 0,
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

serviceSchema.index({ order: 1, active: 1 });

const Service = mongoose.model('Service', serviceSchema);
export default Service;

