import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema(
  {
    brandName: {
      type: String,
      default: 'Edit Vision',
    },
    tagline: {
      type: String,
      default: 'Where Every Frame Tells a Story',
    },
    ownerName: {
      type: String,
      default: 'Vekariya Raj',
    },
    ownerTitle: {
      type: String,
      default: 'Professional Video Editor & Motion Designer',
    },
    contactNumber: {
      type: String,
      default: '9723501437',
    },
    whatsappNumber: {
      type: String,
      default: '9723501437',
    },
    contactEmail: {
      type: String,
      default: 'raj@editvision.com',
    },
    address: {
      type: String,
      default: 'Gujarat, India',
    },
    logoUrl: {
      type: String,
      default: '/Logo.png',
    },
    faviconUrl: {
      type: String,
      default: '/Logo.png',
    },
    heroShowreelUrl: {
      type: String,
      default: 'https://assets.mixkit.co/videos/preview/mixkit-cinematic-mystery-forest-at-dawn-42576-large.mp4',
    },
    heroShowreelType: {
      type: String,
      enum: ['video', 'youtube'],
      default: 'video',
    },
    heroPoster: {
      type: String,
      default: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=1920&q=80',
    },
    heroSubtitle: {
      type: String,
      default: 'Transforming raw footage into cinematic masterpieces. High-impact video editing, precision color grading, and viral social media content designed to captivate your audience.',
    },
    bioHeading: {
      type: String,
      default: 'Crafting Visual Stories That Resonate & Inspire',
    },
    bioText: {
      type: String,
      default: 'Hey, I am Vekariya Raj, a passionate video editor and creative colorist with over 5 years of experience delivering high-end cinematic edits. From high-converting social media reels and viral YouTube videos to luxurious wedding films and commercial advertisements, I combine storytelling rhythm with modern visual aesthetics to make every frame unforgettable.',
    },
    bioPhoto: {
      type: String,
      default: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
    },
    softwareTools: {
      type: [
        {
          name: { type: String },
          icon: { type: String },
          level: { type: Number, default: 95 },
        },
      ],
      default: [
        { name: 'Adobe Premiere Pro', icon: 'Film', level: 95 },
        { name: 'Adobe After Effects', icon: 'Layers', level: 90 },
        { name: 'DaVinci Resolve', icon: 'Palette', level: 92 },
        { name: 'Adobe Photoshop', icon: 'Image', level: 85 },
        { name: 'Final Cut Pro', icon: 'Video', level: 80 },
      ],
    },
    skills: {
      type: [String],
      default: [
        'Cinematic Storytelling',
        'Advanced Color Grading (LUTs & Curves)',
        'Sound Design & Audio Mastering',
        'Motion Graphics & Kinetic Typography',
        'Fast-Paced Reels & Shorts Pacing',
        'Multi-Camera Sync & Cutting',
        'VFX & Seamless Transitions',
      ],
    },
    statsExperienceYears: {
      type: Number,
      default: 5,
    },
    statsProjectsCompleted: {
      type: Number,
      default: 150,
    },
    statsHappyClients: {
      type: Number,
      default: 60,
    },
    statsHoursRendered: {
      type: Number,
      default: 1800,
    },
    beforeAfterTitle: {
      type: String,
      default: 'Raw Log vs Color Graded Cinematic Master',
    },
    beforeAfterRaw: {
      type: String,
      default: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1200&q=60&sat=-80',
    },
    beforeAfterEdited: {
      type: String,
      default: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1200&q=90&sat=20',
    },
    socialLinks: {
      instagram: { type: String, default: 'https://instagram.com' },
      youtube: { type: String, default: 'https://youtube.com' },
      linkedin: { type: String, default: 'https://linkedin.com' },
      behance: { type: String, default: 'https://behance.net' },
      facebook: { type: String, default: '' },
      twitter: { type: String, default: '' },
    },
    seoTitle: {
      type: String,
      default: 'Edit Vision | Vekariya Raj - Freelance Video Editor & Colorist',
    },
    seoDescription: {
      type: String,
      default: 'Official portfolio of Vekariya Raj, professional freelance video editor. Specialized in cinematic wedding films, viral reels, YouTube edits, corporate videos, and color grading.',
    },
    seoKeywords: {
      type: String,
      default: 'video editor, freelance video editor, Vekariya Raj, Edit Vision, reels editing, color grading, wedding video editor, Premiere Pro, DaVinci Resolve',
    },
    colors: {
      goldPrimary: { type: String, default: '#C9A24B' },
      goldGradientEnd: { type: String, default: '#E8C766' },
      bgDark: { type: String, default: '#0A0A0A' },
      bgLight: { type: String, default: '#FFFFFF' },
    },
  },
  { timestamps: true }
);

const Settings = mongoose.model('Settings', settingsSchema);
export default Settings;

