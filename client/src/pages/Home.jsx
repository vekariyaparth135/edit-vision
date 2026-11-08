import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Play,
  Sparkles,
  Film,
  Scissors,
  Palette,
  Layers,
  MonitorPlay,
  Image as ImageIcon,
  CheckCircle,
  Phone,
  MessageCircle,
  Mail,
  Send,
  Star,
  ChevronLeft,
  ChevronRight,
  Sliders,
  ExternalLink,
  Award,
  Clock,
  Users,
} from 'lucide-react';

import { useSettings } from '../context/SettingsContext';
import { mediaApi, servicesApi, testimonialsApi, messagesApi } from '../services/api';
import BeforeAfterSlider from '../components/BeforeAfterSlider';
import VideoModal from '../components/VideoModal';
import LightboxModal from '../components/LightboxModal';
import LoadingSpinner from '../components/LoadingSpinner';

export default function Home() {
  const { settings } = useSettings();

  // State
  const [mediaList, setMediaList] = useState([]);
  const [servicesList, setServicesList] = useState([]);
  const [testimonialsList, setTestimonialsList] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [loadingMedia, setLoadingMedia] = useState(true);

  // Modals
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  // Testimonial carousel index
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  // Contact form state
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    service: 'Viral Reels & Shorts (9:16)',
    budget: '',
    message: '',
  });
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formSuccess, setFormSuccess] = useState('');
  const [formError, setFormError] = useState('');

  // Categories
  const categories = ['All', 'Wedding', 'Reels', 'YouTube', 'Ads', 'Corporate', 'Photos'];

  // Fetch Public Data
  useEffect(() => {
    const fetchPublicData = async () => {
      try {
        setLoadingMedia(true);
        const [mediaRes, servicesRes, testimonialsRes] = await Promise.all([
          mediaApi.getPublic({ limit: 40 }),
          servicesApi.getPublic(),
          testimonialsApi.getPublic(),
        ]);

        if (mediaRes.data.success) setMediaList(mediaRes.data.data);
        if (servicesRes.data.success) setServicesList(servicesRes.data.data);
        if (testimonialsRes.data.success) setTestimonialsList(testimonialsRes.data.data);
      } catch (err) {
        console.error('Error fetching data:', err);
      } finally {
        setLoadingMedia(false);
      }
    };

    fetchPublicData();
  }, []);

  // Filter media based on tab
  const filteredMedia =
    activeCategory === 'All'
      ? mediaList
      : mediaList.filter((item) => item.category === activeCategory);

  // Handle Contact Form Submit
  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setFormSubmitting(true);
    setFormSuccess('');
    setFormError('');

    try {
      const res = await messagesApi.create(formData);
      if (res.data.success) {
        setFormSuccess('Thank you! Your message has been sent to Vekariya Raj. We will get in touch shortly.');
        setFormData({
          name: '',
          phone: '',
          email: '',
          service: 'Viral Reels & Shorts (9:16)',
          budget: '',
          message: '',
        });
      }
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to send message. Please call or WhatsApp directly.');
    } finally {
      setFormSubmitting(false);
    }
  };

  const nextTestimonial = () => {
    if (testimonialsList.length === 0) return;
    setActiveTestimonial((prev) => (prev + 1) % testimonialsList.length);
  };

  const prevTestimonial = () => {
    if (testimonialsList.length === 0) return;
    setActiveTestimonial((prev) => (prev - 1 + testimonialsList.length) % testimonialsList.length);
  };

  const getServiceIcon = (iconName) => {
    switch (iconName) {
      case 'Scissors':
        return <Scissors className="w-6 h-6 text-gold" />;
      case 'Palette':
        return <Palette className="w-6 h-6 text-gold" />;
      case 'Layers':
        return <Layers className="w-6 h-6 text-gold" />;
      case 'MonitorPlay':
        return <MonitorPlay className="w-6 h-6 text-gold" />;
      case 'Sparkles':
        return <Sparkles className="w-6 h-6 text-gold" />;
      default:
        return <Film className="w-6 h-6 text-gold" />;
    }
  };

  return (
    <div className="min-h-screen bg-dark dark:bg-dark light:bg-light transition-colors duration-300">
      {/* 1. HERO SECTION */}
      <section
        id="showreel"
        className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 pb-16"
      >
        {/* Full-screen Background Video / Poster */}
        <div className="absolute inset-0 z-0">
          <video
            autoPlay
            loop
            muted
            playsInline
            poster={settings.heroPoster}
            className="w-full h-full object-cover filter brightness-40 dark:brightness-35 contrast-110"
          >
            <source src={settings.heroShowreelUrl} type="video/mp4" />
          </video>
          {/* Gradients to blend smoothly into site */}
          <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/70 to-black/80 dark:from-dark dark:via-dark/70 dark:to-black/80 light:from-light/95 light:via-light/80 light:to-black/50" />
          <div className="absolute inset-0 bg-dark-radial opacity-60 pointer-events-none" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center flex flex-col items-center">
          {/* Brand Logo with Gold Ring */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7 }}
            className="relative mb-6"
          >
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full p-1 bg-gradient-to-tr from-gold via-gold-light to-gold shadow-gold-lg">
              <img
                src={settings.logoUrl || '/Logo.png'}
                alt={settings.brandName || 'Edit Vision'}
                className="w-full h-full object-cover rounded-full bg-black"
                onError={(e) => {
                  e.target.src = '/Logo.png';
                }}
              />
            </div>
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-black/90 border border-gold/40 text-[10px] tracking-widest text-gold uppercase font-bold whitespace-nowrap">
              {settings.ownerName || 'Vekariya Raj'}
            </div>
          </motion.div>

          {/* Brand Title & Tagline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-bold tracking-wider text-white light:text-black mb-4">
              EDIT <span className="text-gold-gradient">VISION</span>
            </h1>
            <p className="font-serif text-lg sm:text-2xl md:text-3xl text-gold-light italic font-medium tracking-wide mb-6">
              "{settings.tagline || 'Where Every Frame Tells a Story'}"
            </p>
            <p className="max-w-2xl mx-auto text-sm sm:text-base text-gray-300 light:text-gray-700 leading-relaxed font-light mb-10">
              {settings.heroSubtitle}
            </p>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-wrap items-center justify-center gap-4 sm:gap-6"
          >
            <a
              href="#portfolio"
              className="px-8 py-3.5 rounded-full bg-gold-gradient text-black font-bold uppercase tracking-wider text-xs sm:text-sm hover:shadow-gold-md hover:scale-105 active:scale-95 transition-all flex items-center space-x-2"
            >
              <span>View My Work</span>
              <Play className="w-4 h-4 fill-black" />
            </a>

            <a
              href="#contact"
              className="px-8 py-3.5 rounded-full border-2 border-gold text-gold hover:bg-gold/10 font-bold uppercase tracking-wider text-xs sm:text-sm hover:scale-105 active:scale-95 transition-all"
            >
              Hire Vekariya Raj
            </a>

            <button
              onClick={() =>
                setSelectedVideo({
                  title: 'Edit Vision Showreel',
                  url: settings.heroShowreelUrl,
                  category: 'Showreel',
                  description: 'Cinematic Reel Compilation by Vekariya Raj',
                })
              }
              className="flex items-center space-x-2 text-xs uppercase tracking-wider text-gray-300 hover:text-gold transition-colors px-4 py-2 rounded-full bg-black/40 border border-white/10"
            >
              <Play className="w-3.5 h-3.5 text-gold" />
              <span>Watch Full Showreel</span>
            </button>
          </motion.div>

          {/* Stat Badges in Hero */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="mt-16 grid grid-cols-3 gap-6 sm:gap-12 border-t border-gold/20 pt-8 max-w-2xl w-full"
          >
            <div>
              <div className="font-serif text-2xl sm:text-4xl font-bold text-gold">
                {settings.statsProjectsCompleted}+
              </div>
              <div className="text-[11px] uppercase tracking-wider text-gray-400 light:text-gray-600 mt-1">
                Projects Done
              </div>
            </div>
            <div>
              <div className="font-serif text-2xl sm:text-4xl font-bold text-gold">
                {settings.statsHappyClients}+
              </div>
              <div className="text-[11px] uppercase tracking-wider text-gray-400 light:text-gray-600 mt-1">
                Happy Clients
              </div>
            </div>
            <div>
              <div className="font-serif text-2xl sm:text-4xl font-bold text-gold">
                {settings.statsExperienceYears}+
              </div>
              <div className="text-[11px] uppercase tracking-wider text-gray-400 light:text-gray-600 mt-1">
                Years Editing
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. PORTFOLIO / WORK SECTION */}
      <section id="portfolio" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <span className="text-xs font-bold tracking-[0.2em] uppercase text-gold">
            Selected Works
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-white light:text-black mt-2">
            Cinematic Portfolio
          </h2>
          <div className="w-16 h-0.5 bg-gold mx-auto mt-4" />
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2 rounded-full text-xs sm:text-sm font-semibold tracking-wider uppercase transition-all duration-300 ${activeCategory === cat
                ? 'bg-gold text-black shadow-gold-sm font-bold'
                : 'bg-dark-card light:bg-light-card text-gray-400 light:text-gray-700 hover:text-gold border border-white/5 light:border-black/5 hover:border-gold/40'
                }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Media Grid */}
        {loadingMedia ? (
          <LoadingSpinner text="Loading Showcase Items..." />
        ) : filteredMedia.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <Film className="w-12 h-12 text-gold/40 mx-auto mb-3" />
            <p>No showcase items found in "{activeCategory}". Check back soon for new projects.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredMedia.map((item, index) => (
              <motion.div
                key={item._id || index}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="group relative rounded-2xl overflow-hidden bg-dark-card border border-white/5 hover:border-gold/50 shadow-xl transition-all duration-300 hover:-translate-y-1.5 flex flex-col"
              >
                {/* Thumbnail / Media Container */}
                <div
                  className="relative aspect-video overflow-hidden bg-black cursor-pointer"
                  onClick={() => {
                    if (item.type === 'photo') {
                      setSelectedImage(item);
                    } else {
                      setSelectedVideo(item);
                    }
                  }}
                >
                  <img
                    src={item.thumbnail || item.url}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108"
                    loading="lazy"
                  />

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

                  {/* Play Button Overlay for Videos */}
                  {item.type === 'video' ? (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-14 h-14 rounded-full bg-gold/90 text-black flex items-center justify-center shadow-gold-md group-hover:scale-110 group-hover:bg-gold transition-transform">
                        <Play className="w-6 h-6 fill-black ml-0.5" />
                      </div>
                    </div>
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="w-12 h-12 rounded-full bg-black/80 border border-gold text-gold flex items-center justify-center">
                        <ImageIcon className="w-5 h-5" />
                      </div>
                    </div>
                  )}

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 flex items-center space-x-2">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-black/70 backdrop-blur-md text-gold border border-gold/30">
                      {item.category}
                    </span>
                    {item.featured && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-gold text-black">
                        Featured
                      </span>
                    )}
                  </div>

                  {item.duration && (
                    <div className="absolute bottom-3 right-3 px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-black/80 text-white">
                      {item.duration}
                    </div>
                  )}
                </div>

                {/* Details Footer */}
                <div className="p-5 flex-1 flex flex-col justify-between bg-dark-card light:bg-light-card">
                  <div>
                    <h3 className="text-base font-semibold text-white light:text-black group-hover:text-gold transition-colors line-clamp-1">
                      {item.title}
                    </h3>
                    {item.description && (
                      <p className="text-xs text-gray-400 light:text-gray-600 mt-1 line-clamp-2">
                        {item.description}
                      </p>
                    )}
                  </div>

                  {item.clientName && (
                    <div className="mt-4 pt-3 border-t border-white/5 light:border-black/5 flex items-center justify-between text-[11px] text-gray-400">
                      <span>Client: <strong className="text-gray-200 light:text-gray-800">{item.clientName}</strong></span>
                      <span className="text-gold uppercase tracking-wider font-semibold">View &rarr;</span>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* 3. BEFORE / AFTER COMPARISON SECTION */}
      <section id="before-after" className="py-24 bg-black/50 border-y border-gold/20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-xs font-bold tracking-[0.2em] uppercase text-gold">
              Color Science & Mastery
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-bold text-white light:text-black mt-2">
              Before vs After Color Grading
            </h2>
            <p className="max-w-2xl mx-auto text-sm text-gray-300 light:text-gray-600 mt-3 font-light">
              Slide back and forth to inspect how raw, flat camera LOG footage is revitalized into a rich, contrast-balanced, cinematic film print using DaVinci Resolve.
            </p>
          </div>

          <BeforeAfterSlider
            rawImage={settings.beforeAfterRaw}
            editedImage={settings.beforeAfterEdited}
            title={settings.beforeAfterTitle}
          />

          {/* Color Grading Highlights */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="p-6 rounded-xl bg-dark-card light:bg-light-card border border-white/5">
              <Palette className="w-8 h-8 text-gold mx-auto mb-3" />
              <h4 className="font-bold text-sm text-white light:text-black mb-1">
                Custom Film Looks & LUTs
              </h4>
              <p className="text-xs text-gray-400 light:text-gray-600">
                Kodak 2383 and custom film-print simulations tailored specifically to your project mood.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-dark-card light:bg-light-card border border-white/5">
              <Sparkles className="w-8 h-8 text-gold mx-auto mb-3" />
              <h4 className="font-bold text-sm text-white light:text-black mb-1">
                Flawless Skin Tones
              </h4>
              <p className="text-xs text-gray-400 light:text-gray-600">
                Precision qualification and color isolation preserving natural, radiant skin textures.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-dark-card light:bg-light-card border border-white/5">
              <Sliders className="w-8 h-8 text-gold mx-auto mb-3" />
              <h4 className="font-bold text-sm text-white light:text-black mb-1">
                Shot-to-Shot Matching
              </h4>
              <p className="text-xs text-gray-400 light:text-gray-600">
                Seamless color consistency across Sony, Canon, RED, ARRI, and iPhone multi-camera shoots.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. SERVICES & PRICING SECTION */}
      <section id="services" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-xs font-bold tracking-[0.2em] uppercase text-gold">
            What I Offer
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-white light:text-black mt-2">
            Creative Editing Services
          </h2>
          <p className="text-sm text-gray-400 light:text-gray-600 mt-2">
            Transparent pricing, lightning-fast delivery, and unlimited creative attention.
          </p>
          <div className="w-16 h-0.5 bg-gold mx-auto mt-4" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {servicesList.map((srv, idx) => (
            <div
              key={srv._id || idx}
              className={`relative rounded-2xl p-8 flex flex-col justify-between bg-dark-card light:bg-light-card border transition-all duration-300 hover:-translate-y-2 ${srv.popular
                ? 'border-gold shadow-gold-md'
                : 'border-white/10 light:border-black/10 hover:border-gold/40'
                }`}
            >
              {srv.popular && (
                <div className="absolute -top-3.5 right-6 px-3 py-1 rounded-full bg-gold text-black text-[10px] font-bold uppercase tracking-widest shadow-gold-sm">
                  Most Popular
                </div>
              )}

              <div>
                <div className="w-14 h-14 rounded-xl bg-gold/10 border border-gold/30 flex items-center justify-center mb-6">
                  {getServiceIcon(srv.icon)}
                </div>

                <h3 className="font-serif text-2xl font-bold text-white light:text-black mb-2">
                  {srv.title}
                </h3>
                <p className="text-xs text-gray-400 light:text-gray-600 mb-6 leading-relaxed">
                  {srv.description}
                </p>

                {/* Price */}
                <div className="mb-6 pb-6 border-b border-white/5 light:border-black/5">
                  <div className="text-[11px] uppercase tracking-wider text-gray-400">
                    Starting from
                  </div>
                  <div className="font-serif text-3xl font-bold text-gold mt-1">
                    {srv.startingPrice}
                  </div>
                  <div className="text-[11px] text-gray-400 mt-1 flex items-center space-x-1">
                    <Clock className="w-3.5 h-3.5 text-gold" />
                    <span>Turnaround: {srv.turnaround}</span>
                  </div>
                </div>

                {/* Feature checklist */}
                <ul className="space-y-3 mb-8 text-xs text-gray-300 light:text-gray-700">
                  {srv.features?.map((feat, fidx) => (
                    <li key={fidx} className="flex items-start space-x-2">
                      <CheckCircle className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Order Button */}
              <a
                href={`https://wa.me/91${settings.whatsappNumber || '9723501437'}?text=${encodeURIComponent(
                  `Hi Raj, I am interested in your "${srv.title}" service (${srv.startingPrice}). Let's discuss details!`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className={`w-full py-3 rounded-xl text-center text-xs font-bold uppercase tracking-wider transition-all ${srv.popular
                  ? 'bg-gold-gradient text-black hover:shadow-gold-sm'
                  : 'border border-gold/40 text-gold hover:bg-gold hover:text-black'
                  }`}
              >
                Inquire on WhatsApp
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* 5. ABOUT VEKARIYA RAJ SECTION */}
      <section id="about" className="py-24 bg-dark-surface/60 light:bg-gray-50 border-t border-gold/20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Photo & Software Badges */}
            <div className="lg:col-span-5 flex flex-col items-center">
              <div className="relative w-64 h-64 sm:w-80 sm:h-80 rounded-2xl overflow-hidden p-1.5 bg-gradient-to-tr from-gold via-gold-light to-gold shadow-gold-lg">
                <img
                  src={settings.bioPhoto}
                  alt={settings.ownerName}
                  className="w-full h-full object-cover rounded-xl"
                />
              </div>

              <div className="mt-8 text-center">
                <h3 className="font-serif text-2xl font-bold text-white light:text-black">
                  {settings.ownerName}
                </h3>
                <p className="text-xs uppercase tracking-widest text-gold font-semibold mt-1">
                  {settings.ownerTitle}
                </p>
                <p className="text-xs text-gray-400 mt-1">Based in Gujarat, Working Worldwide</p>
              </div>
            </div>

            {/* Story & Software Tools */}
            <div className="lg:col-span-7 space-y-6">
              <span className="text-xs font-bold tracking-[0.2em] uppercase text-gold">
                The Editor Behind the Screen
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white light:text-black leading-tight">
                {settings.bioHeading}
              </h2>
              <p className="text-sm text-gray-300 light:text-gray-700 leading-relaxed">
                {settings.bioText}
              </p>

              {/* Software Skills Progress */}
              <div className="pt-4 space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gold">
                  Software Proficiency
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {settings.softwareTools?.map((tool, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl bg-dark-card light:bg-white border border-white/5 light:border-black/5"
                    >
                      <div className="flex justify-between text-xs font-semibold mb-1.5 text-white light:text-black">
                        <span>{tool.name}</span>
                        <span className="text-gold font-mono">{tool.level}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-gray-800 light:bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gold-gradient rounded-full"
                          style={{ width: `${tool.level}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Skills checklist */}
              <div className="pt-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gold mb-3">
                  Core Competencies
                </h4>
                <div className="flex flex-wrap gap-2">
                  {settings.skills?.map((skill, sidx) => (
                    <span
                      key={sidx}
                      className="px-3 py-1 rounded-full text-xs bg-dark-card light:bg-white border border-gold/20 text-gray-300 light:text-gray-700"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. TESTIMONIALS SECTION */}
      <section id="testimonials" className="py-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <span className="text-xs font-bold tracking-[0.2em] uppercase text-gold">
            Real Feedback
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-white light:text-black mt-2">
            Client Testimonials
          </h2>
          <div className="w-16 h-0.5 bg-gold mx-auto mt-4" />
        </div>

        {testimonialsList.length > 0 ? (
          <div className="relative bg-dark-card light:bg-light-card border border-gold/30 rounded-3xl p-8 sm:p-12 shadow-2xl">
            <div className="flex flex-col items-center text-center">
              {/* Star Rating */}
              <div className="flex items-center space-x-1 mb-6 text-gold">
                {[...Array(testimonialsList[activeTestimonial].rating || 5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-gold" />
                ))}
              </div>

              {/* Quote */}
              <p className="font-serif text-lg sm:text-2xl text-gray-200 light:text-gray-800 italic leading-relaxed mb-8 max-w-3xl">
                "{testimonialsList[activeTestimonial].comment}"
              </p>

              {/* Client Info */}
              <div className="flex items-center space-x-4">
                <img
                  src={testimonialsList[activeTestimonial].avatar}
                  alt={testimonialsList[activeTestimonial].clientName}
                  className="w-14 h-14 rounded-full object-cover border-2 border-gold shadow-gold-sm"
                  onError={(e) => {
                    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      testimonialsList[activeTestimonial].clientName
                    )}&background=C9A24B&color=000`;
                  }}
                />
                <div className="text-left">
                  <h4 className="font-bold text-white light:text-black text-base">
                    {testimonialsList[activeTestimonial].clientName}
                  </h4>
                  <p className="text-xs text-gold">
                    {testimonialsList[activeTestimonial].clientRole}
                  </p>
                  {testimonialsList[activeTestimonial].clientCompany && (
                    <p className="text-[11px] text-gray-400">
                      {testimonialsList[activeTestimonial].clientCompany}
                    </p>
                  )}
                </div>
              </div>

              {/* Carousel Controls */}
              <div className="flex items-center space-x-4 mt-8">
                <button
                  onClick={prevTestimonial}
                  className="p-2.5 rounded-full border border-gold/40 text-gold hover:bg-gold hover:text-black transition-all"
                  aria-label="Previous review"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-xs text-gray-400 font-mono">
                  {activeTestimonial + 1} / {testimonialsList.length}
                </span>
                <button
                  onClick={nextTestimonial}
                  className="p-2.5 rounded-full border border-gold/40 text-gold hover:bg-gold hover:text-black transition-all"
                  aria-label="Next review"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-center text-gray-400">No testimonials yet.</p>
        )}
      </section>

      {/* 7. CONTACT SECTION */}
      <section id="contact" className="py-24 bg-dark-surface light:bg-gray-100 border-t border-gold/20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Left Contact Info */}
            <div className="lg:col-span-5 space-y-6">
              <span className="text-xs font-bold tracking-[0.2em] uppercase text-gold">
                Let's Collaborate
              </span>
              <h2 className="font-serif text-3xl sm:text-5xl font-bold text-white light:text-black">
                Ready to Bring Your Story to Life?
              </h2>
              <p className="text-sm text-gray-300 light:text-gray-700 leading-relaxed">
                Whether you need a full wedding film, high-converting social media reels, or cinematic color grading, share your vision below or contact directly.
              </p>

              {/* Direct Touchpoints */}
              <div className="space-y-4 pt-4">
                <a
                  href={`tel:${settings.contactNumber || '9723501437'}`}
                  className="flex items-center space-x-4 p-4 rounded-xl bg-dark-card light:bg-white border border-white/5 hover:border-gold/40 transition-colors group"
                >
                  <div className="w-12 h-12 rounded-lg bg-gold/10 border border-gold/30 flex items-center justify-center text-gold group-hover:bg-gold group-hover:text-black transition-colors">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[11px] uppercase tracking-wider text-gray-400">
                      Click to Call
                    </div>
                    <div className="text-base font-bold text-white light:text-black font-mono">
                      +91 {settings.contactNumber || '9723501437'}
                    </div>
                  </div>
                </a>

                <a
                  href={`https://wa.me/91${settings.whatsappNumber || '9723501437'}?text=${encodeURIComponent(
                    'Hi Vekariya Raj, I want to discuss a video project with Edit Vision.'
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-4 p-4 rounded-xl bg-dark-card light:bg-white border border-white/5 hover:border-gold/40 transition-colors group"
                >
                  <div className="w-12 h-12 rounded-lg bg-gold/10 border border-gold/30 flex items-center justify-center text-gold group-hover:bg-gold group-hover:text-black transition-colors">
                    <MessageCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[11px] uppercase tracking-wider text-gray-400">
                      WhatsApp Fast Response
                    </div>
                    <div className="text-base font-bold text-white light:text-black">
                      Chat on WhatsApp
                    </div>
                  </div>
                </a>

                <a
                  href={`mailto:${settings.contactEmail || 'raj@editvision.com'}`}
                  className="flex items-center space-x-4 p-4 rounded-xl bg-dark-card light:bg-white border border-white/5 hover:border-gold/40 transition-colors group"
                >
                  <div className="w-12 h-12 rounded-lg bg-gold/10 border border-gold/30 flex items-center justify-center text-gold group-hover:bg-gold group-hover:text-black transition-colors">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[11px] uppercase tracking-wider text-gray-400">
                      Email Inquiries
                    </div>
                    <div className="text-base font-bold text-white light:text-black">
                      {settings.contactEmail || 'raj@editvision.com'}
                    </div>
                  </div>
                </a>
              </div>
            </div>

            {/* Right Contact Form */}
            <div className="lg:col-span-7 bg-dark-card light:bg-white border border-gold/30 rounded-3xl p-8 sm:p-10 shadow-2xl">
              <h3 className="font-serif text-2xl font-bold text-white light:text-black mb-2">
                Send a Project Inquiry
              </h3>
              <p className="text-xs text-gray-400 light:text-gray-600 mb-6">
                Fill out the form below. Raj usually replies within 2 hours.
              </p>

              {formSuccess && (
                <div className="mb-6 p-4 rounded-xl bg-gold/15 border border-gold/40 text-gold text-sm flex items-center space-x-2">
                  <span>{formSuccess}</span>
                </div>
              )}

              {formError && (
                <div className="mb-6 p-4 rounded-xl bg-red-500/20 border border-red-500 text-red-300 text-sm">
                  {formError}
                </div>
              )}

              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 light:text-gray-700 mb-1.5">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Parth Patel"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-dark/80 light:bg-gray-50 border border-white/10 light:border-gray-300 focus:border-gold outline-none text-white light:text-black text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 light:text-gray-700 mb-1.5">
                      Phone Number (WhatsApp) *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. 9876543210"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-dark/80 light:bg-gray-50 border border-white/10 light:border-gray-300 focus:border-gold outline-none text-white light:text-black text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 light:text-gray-700 mb-1.5">
                      Email Address
                    </label>
                    <input
                      type="email"
                      placeholder="name@company.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-dark/80 light:bg-gray-50 border border-white/10 light:border-gray-300 focus:border-gold outline-none text-white light:text-black text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 light:text-gray-700 mb-1.5">
                      Service Interested In
                    </label>
                    <select
                      value={formData.service}
                      onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-dark/80 light:bg-gray-50 border border-white/10 light:border-gray-300 focus:border-gold outline-none text-white light:text-black text-sm"
                    >
                      <option value="Viral Reels & Shorts (9:16)">Viral Reels & Shorts (9:16)</option>
                      <option value="Cinematic Video Editing">Cinematic Video Editing</option>
                      <option value="DaVinci Resolve Color Grading">DaVinci Resolve Color Grading</option>
                      <option value="YouTube Long-Form Editing">YouTube Long-Form Editing</option>
                      <option value="Wedding Highlights & Film">Wedding Highlights & Film</option>
                      <option value="Motion Graphics & VFX">Motion Graphics & VFX</option>
                      <option value="High-CTR Thumbnails">High-CTR Thumbnails</option>
                      <option value="Other / Custom Request">Other / Custom Request</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 light:text-gray-700 mb-1.5">
                    Estimated Budget (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. ₹5,000 - ₹15,000"
                    value={formData.budget}
                    onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-dark/80 light:bg-gray-50 border border-white/10 light:border-gray-300 focus:border-gold outline-none text-white light:text-black text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 light:text-gray-700 mb-1.5">
                    Project Details & Scope *
                  </label>
                  <textarea
                    required
                    rows="4"
                    placeholder="Describe your video requirements, raw footage length, references, and deadline..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-dark/80 light:bg-gray-50 border border-white/10 light:border-gray-300 focus:border-gold outline-none text-white light:text-black text-sm"
                  />
                </div>

                <button
                  type="submit"
                  disabled={formSubmitting}
                  className="w-full py-4 rounded-xl bg-gold-gradient text-black font-bold uppercase tracking-wider text-sm shadow-gold-md hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center space-x-2 disabled:opacity-60"
                >
                  <span>{formSubmitting ? 'Sending Inquiry...' : 'Submit Inquiry'}</span>
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* MODALS */}
      {selectedVideo && (
        <VideoModal video={selectedVideo} onClose={() => setSelectedVideo(null)} />
      )}

      {selectedImage && (
        <LightboxModal image={selectedImage} onClose={() => setSelectedImage(null)} />
      )}
    </div>
  );
}

