import React, { createContext, useContext, useState, useEffect } from 'react';
import { settingsApi, statsApi } from '../services/api';

const defaultSettings = {
  brandName: 'Edit Vision',
  tagline: 'Where Every Frame Tells a Story',
  ownerName: 'Vekariya Raj',
  ownerTitle: 'Cinematic Video Editor & Colorist',
  contactNumber: '9723501437',
  whatsappNumber: '9723501437',
  contactEmail: 'raj@editvision.com',
  address: 'Gujarat, India',
  logoUrl: '/Logo.png',
  faviconUrl: '/Logo.png',
  heroShowreelUrl: 'https://assets.mixkit.co/videos/preview/mixkit-cinematic-mystery-forest-at-dawn-42576-large.mp4',
  heroShowreelType: 'video',
  heroPoster: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=1920&q=80',
  heroSubtitle: 'Transforming raw footage into cinematic masterworks. High-impact video editing, precision color grading, and viral social media content designed to captivate your audience.',
  bioHeading: 'Crafting Visual Stories That Resonate & Inspire',
  bioText: 'Hey, I am Vekariya Raj, a passionate video editor and creative colorist with over 5 years of experience delivering high-end cinematic edits. From high-converting social media reels and viral YouTube videos to luxurious wedding films and commercial advertisements, I combine storytelling rhythm with modern visual aesthetics to make every frame unforgettable.',
  bioPhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
  softwareTools: [
    { name: 'Adobe Premiere Pro', icon: 'Film', level: 98 },
    { name: 'Adobe After Effects', icon: 'Layers', level: 92 },
    { name: 'DaVinci Resolve Studio', icon: 'Palette', level: 95 },
    { name: 'Adobe Photoshop', icon: 'Image', level: 88 },
  ],
  skills: [
    'Cinematic Story Pacing & Rhythm',
    'Commercial & Film Color Grading',
    'Viral 9:16 Short-Form Editing (Reels/TikTok)',
    'Kinetic Typography & Motion Graphics',
    'Sound Design, Foley & Audio Mixing',
    'Multi-Camera Wedding & Event Assembly',
  ],
  statsExperienceYears: 5,
  statsProjectsCompleted: 150,
  statsHappyClients: 60,
  statsHoursRendered: 1800,
  beforeAfterTitle: 'Raw Log Footage vs Color Graded Cinematic Master',
  beforeAfterRaw: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=60&sat=-80',
  beforeAfterEdited: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=95&sat=35',
  socialLinks: {
    instagram: 'https://instagram.com',
    youtube: 'https://youtube.com',
    linkedin: 'https://linkedin.com',
    behance: 'https://behance.net',
  },
  seoTitle: 'Edit Vision | Vekariya Raj - Freelance Video Editor',
  seoDescription: 'Official portfolio of Vekariya Raj (Edit Vision). Professional wedding films, viral reels, YouTube editing, and color grading services.',
};

const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(defaultSettings);
  const [loading, setLoading] = useState(true);

  const fetchSettings = async () => {
    try {
      const res = await settingsApi.get();
      if (res.data.success && res.data.data) {
        setSettings({ ...defaultSettings, ...res.data.data });
      }
    } catch (e) {
      console.warn('Using default settings fallback:', e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
    // Log visit anonymously
    statsApi.logVisit(window.location.pathname).catch(() => {});
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, loading, refreshSettings: fetchSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => useContext(SettingsContext);

