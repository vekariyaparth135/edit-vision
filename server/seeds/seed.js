import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import User from '../models/User.js';
import Media from '../models/Media.js';
import Service from '../models/Service.js';
import Testimonial from '../models/Testimonial.js';
import Message from '../models/Message.js';
import Settings from '../models/Settings.js';
import Visit from '../models/Visit.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

const seedDatabase = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/edit_vision';
    console.log(`[Seed Script]: Connecting to ${mongoUri}...`);
    await mongoose.connect(mongoUri);
    console.log('[Seed Script]: Connected to MongoDB.');

    // 1. Clear existing collections
    console.log('[Seed Script]: Clearing old database records...');
    await Promise.all([
      User.deleteMany(),
      Media.deleteMany(),
      Service.deleteMany(),
      Testimonial.deleteMany(),
      Message.deleteMany(),
      Settings.deleteMany(),
      Visit.deleteMany(),
    ]);

    // 2. Create Admin User
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@editvision.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@123456';
    const adminName = process.env.ADMIN_NAME || 'Vekariya Raj';

    const admin = await User.create({
      name: adminName,
      email: adminEmail,
      password: adminPassword, // pre('save') hook will hash this
      role: 'admin',
    });
    console.log(`[Seed Script]: Admin created -> Email: ${admin.email} | Password: ${adminPassword}`);

    // 3. Create Settings
    await Settings.create({
      brandName: 'Edit Vision',
      tagline: 'Where Every Frame Tells a Story',
      ownerName: 'Vekariya Raj',
      ownerTitle: 'Cinematic Video Editor & Motion Designer',
      contactNumber: '9723501437',
      whatsappNumber: '9723501437',
      contactEmail: 'raj@editvision.com',
      address: 'Gujarat, India',
      logoUrl: '/Logo.png',
      faviconUrl: '/Logo.png',
      heroShowreelUrl: 'https://assets.mixkit.co/videos/preview/mixkit-cinematic-mystery-forest-at-dawn-42576-large.mp4',
      heroShowreelType: 'video',
      heroPoster: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=1920&q=80',
      heroSubtitle: 'Elevating visual narratives through bespoke cinematic editing, high-precision DaVinci color grading, and dynamic viral storytelling for visionary creators and luxury brands.',
      bioHeading: 'Hi, I am Vekariya Raj — Turning Vision Into Visual Poetry',
      bioText: 'With over 5 years behind the editing console, I specialize in crafting emotionally resonant, high-retention video content. Whether transforming raw LOG footage into rich cinematic masterworks, producing high-impact viral Instagram Reels, or orchestrating multi-cam wedding epics, I treat every frame with relentless attention to detail, tone, and pacing.',
      bioPhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
      softwareTools: [
        { name: 'Adobe Premiere Pro', icon: 'Film', level: 98 },
        { name: 'Adobe After Effects', icon: 'Layers', level: 92 },
        { name: 'DaVinci Resolve Studio', icon: 'Palette', level: 95 },
        { name: 'Adobe Photoshop', icon: 'Image', level: 88 },
        { name: 'Adobe Audition', icon: 'Scissors', level: 85 },
      ],
      skills: [
        'Cinematic Story Pacing & Rhythm',
        'Commercial & Film Color Grading',
        'Viral 9:16 Short-Form Editing (Reels/TikTok)',
        'Kinetic Typography & Motion Graphics',
        'Sound Design, Foley & Audio Mixing',
        'Multi-Camera Wedding & Event Assembly',
        'Green Screen & Visual Effects Compositing',
      ],
      statsExperienceYears: 5,
      statsProjectsCompleted: 180,
      statsHappyClients: 75,
      statsHoursRendered: 2400,
      beforeAfterTitle: 'Raw Log Footage vs Cinematic Rec.709 Color Grade',
      beforeAfterRaw: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=60&sat=-80',
      beforeAfterEdited: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=95&sat=35',
      socialLinks: {
        instagram: 'https://instagram.com',
        youtube: 'https://youtube.com',
        linkedin: 'https://linkedin.com',
        behance: 'https://behance.net',
        facebook: '',
        twitter: '',
      },
      seoTitle: 'Edit Vision | Vekariya Raj - Freelance Video Editor',
      seoDescription: 'Premier video editing portfolio of Vekariya Raj (Edit Vision). Professional wedding films, viral reels, YouTube editing, and color grading services.',
      seoKeywords: 'Edit Vision, Vekariya Raj, Video Editor Gujarat, Reels Editor, Wedding Video Editor, DaVinci Resolve Colorist, Freelance Editor India',
      colors: {
        goldPrimary: '#C9A24B',
        goldGradientEnd: '#E8C766',
        bgDark: '#0A0A0A',
        bgLight: '#FFFFFF',
      },
    });
    console.log('[Seed Script]: Default settings created.');

    // 4. Seed Services
    const services = [
      {
        title: 'Cinematic Video Editing',
        description: 'Complete narrative cutting, music synchronization, sound FX, and pacing for travel films, brand documentaries, and music videos.',
        icon: 'Film',
        startingPrice: '₹4,999',
        features: [
          '4K Ultra HD Export',
          'Professional Sound Design & Foley',
          'Advanced Transitions & Motion Cuts',
          'Licensed Background Music Included',
          'Up to 3 Revision Rounds',
        ],
        turnaround: '3 - 5 Days',
        popular: true,
        order: 1,
      },
      {
        title: 'Viral Reels & Shorts (9:16)',
        description: 'High-retention editing built for Instagram Reels and YouTube Shorts with dynamic auto-captions, sound effects, and scroll-stopping hooks.',
        icon: 'Scissors',
        startingPrice: '₹1,499',
        features: [
          'High-Retention Dynamic Captions',
          'Fast Zoom Cuts & Sound FX',
          'Trending Music & Hook Framing',
          'Optimized for Instagram & TikTok Algorithms',
          'Bulk Pack Discounts Available',
        ],
        turnaround: '24 - 48 Hours',
        popular: true,
        order: 2,
      },
      {
        title: 'DaVinci Resolve Color Grading',
        description: 'Transform dull flat LOG footage into rich, filmic, emotionally evocative looks tailored to your brand mood and aesthetic.',
        icon: 'Palette',
        startingPrice: '₹2,999',
        features: [
          'LOG / RAW Color Conversion',
          'Skin Tone Perfection & Match',
          'Custom Film Emulation & Look Development',
          'Shot-to-Shot Color Balancing',
          'Rec.709 & HDR Deliverables',
        ],
        turnaround: '24 - 72 Hours',
        popular: false,
        order: 3,
      },
      {
        title: 'Motion Graphics & VFX',
        description: 'Custom animated intros, lower thirds, logo reveals, 3D text tracking, and kinetic typography in Adobe After Effects.',
        icon: 'Layers',
        startingPrice: '₹3,499',
        features: [
          'Custom 2D/3D Title Animations',
          'Logo Reveals & Brand Stingers',
          'Camera Tracking & Object Replacement',
          'Green Screen Keying & Cleanup',
          'Alpha Channel Transparent Exports',
        ],
        turnaround: '2 - 4 Days',
        popular: false,
        order: 4,
      },
      {
        title: 'YouTube Long-Form Editing',
        description: 'Engaging, story-driven edits for creators. Retention-focused pacing, b-roll placement, meme inserts, and sound design.',
        icon: 'MonitorPlay',
        startingPrice: '₹3,999',
        features: [
          'Retention Optimization Techniques',
          'Story Structuring & B-Roll Sourcing',
          'Audio Cleanup & Noise Removal',
          'Chapter Markers & End Screens',
          'Thumbnails Synergy Consulting',
        ],
        turnaround: '2 - 3 Days',
        popular: false,
        order: 5,
      },
      {
        title: 'High-CTR Thumbnails & Posters',
        description: 'Click-magnet YouTube thumbnails and social media promotional key art that boost your video views instantly.',
        icon: 'Sparkles',
        startingPrice: '₹799',
        features: [
          'High Contrast & Vibrant Palette',
          'Custom Cutouts & Face Retouching',
          'A/B Test Design Variations',
          'Optimized for Mobile Screens',
          'Same-Day Delivery Available',
        ],
        turnaround: '12 - 24 Hours',
        popular: false,
        order: 6,
      },
    ];

    await Service.insertMany(services);
    console.log(`[Seed Script]: ${services.length} services seeded.`);

    // 5. Seed Media (Videos and Photos)
    const mediaItems = [
      {
        title: 'Ethereal Forest Cinematic Teaser',
        description: 'Dramatic anamorphic teaser showcasing mist, atmospheric light rays, and mood grading.',
        type: 'video',
        url: 'https://assets.mixkit.co/videos/preview/mixkit-cinematic-mystery-forest-at-dawn-42576-large.mp4',
        thumbnail: 'https://images.unsplash.com/photo-1511497584788-87676104235f?auto=format&fit=crop&w=800&q=80',
        category: 'Ads',
        videoSource: 'direct',
        featured: true,
        order: 1,
        clientName: 'Wanderlust Media',
        duration: '0:45',
        views: 1240,
      },
      {
        title: 'Royal Heritage Wedding Teaser',
        description: 'Udaipur palace destination wedding film. Slow motion cinematic drone sequences and traditional emotion.',
        type: 'video',
        url: 'https://assets.mixkit.co/videos/preview/mixkit-going-down-a-curved-highway-down-a-mountain-41576-large.mp4',
        thumbnail: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
        category: 'Wedding',
        videoSource: 'direct',
        featured: true,
        order: 2,
        clientName: 'Aarav & Meera',
        duration: '1:30',
        views: 3100,
      },
      {
        title: 'Viral Fitness Transformation Reel',
        description: 'Fast-paced gym motivation edit with sound design, heartbeat drops, and synchronized kinetic captions.',
        type: 'video',
        url: 'https://assets.mixkit.co/videos/preview/mixkit-boxer-training-with-a-punching-bag-41315-large.mp4',
        thumbnail: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80',
        category: 'Reels',
        videoSource: 'direct',
        featured: true,
        order: 3,
        clientName: 'Apex Fitness Club',
        duration: '0:30',
        views: 8900,
      },
      {
        title: 'Tech Review & Desk Setup Showcase',
        description: 'Sleek YouTube video edit with smooth macros, floating HUD specs, and lofi ambient audio mixing.',
        type: 'video',
        url: 'https://assets.mixkit.co/videos/preview/mixkit-hands-typing-on-a-laptop-keyboard-41300-large.mp4',
        thumbnail: 'https://images.unsplash.com/photo-1593062096033-9a26b09da705?auto=format&fit=crop&w=800&q=80',
        category: 'YouTube',
        videoSource: 'direct',
        featured: true,
        order: 4,
        clientName: 'TechVisionary YT',
        duration: '8:42',
        views: 5200,
      },
      {
        title: 'Luxury Watch Commercial - Chrono Gold',
        description: 'Macro 4K product advertisement with liquid gold reflections and dynamic speed ramping.',
        type: 'video',
        url: 'https://assets.mixkit.co/videos/preview/mixkit-close-up-of-a-camera-lens-41489-large.mp4',
        thumbnail: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=80',
        category: 'Ads',
        videoSource: 'direct',
        featured: true,
        order: 5,
        clientName: 'Aurelia Timepieces',
        duration: '0:40',
        views: 4120,
      },
      {
        title: 'FinTech Corporate Annual Summit Film',
        description: 'Executive interviews, keynote b-roll, motion info-graphics, and clean corporate brand presence.',
        type: 'video',
        url: 'https://assets.mixkit.co/videos/preview/mixkit-hands-of-a-man-working-on-a-computer-42044-large.mp4',
        thumbnail: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=800&q=80',
        category: 'Corporate',
        videoSource: 'direct',
        featured: false,
        order: 6,
        clientName: 'InnovateX Global',
        duration: '3:15',
        views: 1850,
      },
      {
        title: 'Golden Hour Sunset Color Grade Still',
        description: 'Warm Kodak film look curve grading for high-end fashion editorial shoot.',
        type: 'photo',
        url: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1200&q=80',
        thumbnail: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=800&q=80',
        category: 'Photos',
        videoSource: 'direct',
        featured: false,
        order: 7,
        clientName: 'Vogue India Editorial',
        views: 890,
      },
      {
        title: 'Moody Cyberpunk Neon Portrait Grade',
        description: 'Teal and orange dual-tone split grading for nighttime urban street photography.',
        type: 'photo',
        url: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=1200&q=80',
        thumbnail: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=800&q=80',
        category: 'Photos',
        videoSource: 'direct',
        featured: false,
        order: 8,
        clientName: 'Urban Nocturne',
        views: 1320,
      },
    ];

    await Media.insertMany(mediaItems);
    console.log(`[Seed Script]: ${mediaItems.length} media items seeded.`);

    // 6. Seed Testimonials
    const testimonials = [
      {
        clientName: 'Devang Patel',
        clientRole: 'Wedding Film Director',
        clientCompany: 'Patel Cinematics, Ahmedabad',
        rating: 5,
        comment: 'Raj delivered our 35-minute wedding film ahead of deadline with breathtaking color grading. The bride and groom literally cried tears of joy. Edit Vision is now our permanent editor!',
        projectTitle: 'Grand Palace Wedding Film',
        order: 1,
      },
      {
        clientName: 'Rhea Shah',
        clientRole: 'Lifestyle & Fashion Creator',
        clientCompany: '150K+ Instagram Creator',
        rating: 5,
        comment: 'My reels went from 5k views to over 350k after Raj started editing my content! His sound design, pacing, and hooks are insane. 10/10 recommended for creators.',
        projectTitle: 'Monthly Viral Reels Retainer',
        order: 2,
      },
      {
        clientName: 'Karan Mehta',
        clientRole: 'Founder & CEO',
        clientCompany: 'Zenith Apparel',
        rating: 5,
        comment: 'Edit Vision handled our nationwide product launch video. High-energy, crisp color grade, and razor-sharp sound effects. The turnaround time of 48 hours was incredible.',
        projectTitle: 'Summer Collection Commercial',
        order: 3,
      },
      {
        clientName: 'Vikram Joshi',
        clientRole: 'YouTuber & Educator',
        clientCompany: 'Code & Create (80K Subs)',
        rating: 5,
        comment: 'Working with Vekariya Raj is seamless. He understands retention graphs and exactly when to zoom, pop graphics, and cut. My average watch time surged by 42%!',
        projectTitle: 'YouTube Series Editing',
        order: 4,
      },
    ];

    await Testimonial.insertMany(testimonials);
    console.log(`[Seed Script]: ${testimonials.length} testimonials seeded.`);

    // 7. Seed Initial Sample Messages
    const sampleMessages = [
      {
        name: 'Harshil Shah',
        phone: '9898123456',
        email: 'harshil@gmail.com',
        service: 'Viral Reels & Shorts (9:16)',
        budget: '₹10,000 - ₹25,000',
        message: 'Hi Raj, I have 15 raw reels recorded for my restaurant brand. Need fast turnaround and dynamic captions with sound effects. Please call or WhatsApp me!',
        status: 'unread',
      },
      {
        name: 'Pooja Trivedi',
        phone: '9825098765',
        email: 'pooja.t@weddingmoments.in',
        service: 'Cinematic Video Editing',
        budget: '₹30,000+',
        message: 'Hello, looking for a wedding editor for a 3-day NRI wedding shot in Sony FX3 S-Log3. Need teaser + 20 min highlight. Loved your portfolio!',
        status: 'read',
        replyNotes: 'Shared initial rate card over WhatsApp.',
      },
    ];

    await Message.insertMany(sampleMessages);
    console.log(`[Seed Script]: ${sampleMessages.length} sample messages seeded.`);

    // 8. Seed Sample Visits for analytics chart
    const pastVisits = [];
    const now = new Date();
    for (let i = 0; i < 45; i++) {
      const pastDate = new Date(now.getTime() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000));
      pastVisits.push({
        path: Math.random() > 0.3 ? '/' : '/portfolio',
        ip: '127.0.0.1',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        createdAt: pastDate,
      });
    }
    await Visit.insertMany(pastVisits);
    console.log(`[Seed Script]: ${pastVisits.length} visits seeded for analytics.`);

    console.log('--------------------------------------------------');
    console.log('✅ DATABASE SEEDING COMPLETED SUCCESSFULLY!');
    console.log(`👉 Admin Login: ${adminEmail}`);
    console.log(`👉 Admin Pass:  ${adminPassword}`);
    console.log('--------------------------------------------------');

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('[Seed Script Error]:', error);
    process.exit(1);
  }
};

seedDatabase();

