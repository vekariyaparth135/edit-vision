import mongoose from 'mongoose';

const testimonialSchema = new mongoose.Schema(
  {
    clientName: {
      type: String,
      required: [true, 'Client name is required'],
      trim: true,
    },
    clientRole: {
      type: String,
      default: 'Content Creator',
    },
    clientCompany: {
      type: String,
      default: '',
    },
    avatar: {
      type: String,
      default: '',
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      default: 5,
    },
    comment: {
      type: String,
      required: [true, 'Testimonial comment is required'],
    },
    projectTitle: {
      type: String,
      default: '',
    },
    videoUrl: {
      type: String,
      default: '',
    },
    order: {
      type: Number,
      default: 0,
    },
    published: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

testimonialSchema.index({ published: 1, order: 1 });

const Testimonial = mongoose.model('Testimonial', testimonialSchema);
export default Testimonial;

