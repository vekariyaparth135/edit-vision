import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, MessageCircle, Lock, ArrowUp } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

export default function Footer() {
  const { settings } = useSettings();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-black dark:bg-black light:bg-gray-100 text-white light:text-black border-t border-gold/20 pt-16 pb-8 overflow-hidden">
      {/* Decorative Gold Radial Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-24 bg-gold/10 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-full overflow-hidden p-0.5 bg-gradient-to-tr from-gold to-gold-light shadow-gold-sm">
                <img
                  src={settings.logoUrl || '/Logo.png'}
                  alt={settings.brandName || 'Edit Vision'}
                  className="w-full h-full object-cover rounded-full bg-black"
                  onError={(e) => {
                    e.target.src = '/Logo.png';
                  }}
                />
              </div>
              <div>
                <h3 className="font-serif text-2xl font-bold tracking-wider text-white light:text-black">
                  EDIT VISION
                </h3>
                <p className="text-xs text-gold tracking-widest uppercase">
                  {settings.ownerName || 'Vekariya Raj'}
                </p>
              </div>
            </div>
            <p className="text-sm text-gray-400 light:text-gray-600 leading-relaxed italic font-serif">
              "{settings.tagline || 'Where Every Frame Tells a Story'}"
            </p>
            <p className="text-xs text-gray-400 light:text-gray-600">
              Transforming your vision into high-impact cinematic reels, commercial videos, and wedding films with precision color grading.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-serif text-lg font-bold text-gold tracking-wider uppercase mb-4">
              Explore
            </h4>
            <ul className="space-y-2 text-sm text-gray-300 light:text-gray-700">
              <li>
                <a href="/#portfolio" className="hover:text-gold transition-colors">
                  Portfolio / Featured Works
                </a>
              </li>
              <li>
                <a href="/#before-after" className="hover:text-gold transition-colors">
                  Before vs After Color Grading
                </a>
              </li>
              <li>
                <a href="/#services" className="hover:text-gold transition-colors">
                  Services & Pricing
                </a>
              </li>
              <li>
                <a href="/#about" className="hover:text-gold transition-colors">
                  About Vekariya Raj
                </a>
              </li>
              <li>
                <a href="/#testimonials" className="hover:text-gold transition-colors">
                  Client Reviews
                </a>
              </li>
              <li>
                <a href="/#contact" className="hover:text-gold transition-colors">
                  Get a Free Quote
                </a>
              </li>
            </ul>
          </div>

          {/* Direct Contact */}
          <div>
            <h4 className="font-serif text-lg font-bold text-gold tracking-wider uppercase mb-4">
              Direct Contact
            </h4>
            <ul className="space-y-3 text-sm text-gray-300 light:text-gray-700">
              <li>
                <a
                  href={`tel:${settings.contactNumber || '9723501437'}`}
                  className="flex items-center space-x-2.5 hover:text-gold transition-colors"
                >
                  <Phone className="w-4 h-4 text-gold flex-shrink-0" />
                  <span>+91 {settings.contactNumber || '9723501437'}</span>
                </a>
              </li>
              <li>
                <a
                  href={`https://wa.me/91${settings.whatsappNumber || '9723501437'}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2.5 hover:text-gold transition-colors"
                >
                  <MessageCircle className="w-4 h-4 text-gold flex-shrink-0" />
                  <span>WhatsApp Chat</span>
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${settings.contactEmail || 'raj@editvision.com'}`}
                  className="flex items-center space-x-2.5 hover:text-gold transition-colors"
                >
                  <Mail className="w-4 h-4 text-gold flex-shrink-0" />
                  <span>{settings.contactEmail || 'raj@editvision.com'}</span>
                </a>
              </li>
              <li className="flex items-center space-x-2.5 text-gray-400 light:text-gray-600">
                <MapPin className="w-4 h-4 text-gold flex-shrink-0" />
                <span>{settings.address || 'Gujarat, India'}</span>
              </li>
            </ul>
          </div>

          {/* Connect & Socials */}
          <div>
            <h4 className="font-serif text-lg font-bold text-gold tracking-wider uppercase mb-4">
              Follow Work
            </h4>
            <p className="text-xs text-gray-400 light:text-gray-600 mb-4">
              Watch latest edits, behind the scenes, and editing breakdowns:
            </p>
            <div className="flex flex-wrap gap-2.5">
              {settings.socialLinks?.instagram && (
                <a
                  href={settings.socialLinks.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-full border border-gold/30 hover:border-gold hover:bg-gold/10 text-xs text-gold transition-all"
                >
                  Instagram
                </a>
              )}
              {settings.socialLinks?.youtube && (
                <a
                  href={settings.socialLinks.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-full border border-gold/30 hover:border-gold hover:bg-gold/10 text-xs text-gold transition-all"
                >
                  YouTube
                </a>
              )}
              {settings.socialLinks?.linkedin && (
                <a
                  href={settings.socialLinks.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-full border border-gold/30 hover:border-gold hover:bg-gold/10 text-xs text-gold transition-all"
                >
                  LinkedIn
                </a>
              )}
              {settings.socialLinks?.behance && (
                <a
                  href={settings.socialLinks.behance}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-full border border-gold/30 hover:border-gold hover:bg-gold/10 text-xs text-gold transition-all"
                >
                  Behance
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 light:border-black/10 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-400 light:text-gray-600 space-y-4 sm:space-y-0">
          <div>
            &copy; {new Date().getFullYear()} <strong>Edit Vision</strong> by{' '}
            <span className="text-gold">{settings.ownerName || 'Vekariya Raj'}</span>. All rights reserved.
          </div>

          <div className="flex items-center space-x-6">
            <button
              onClick={scrollToTop}
              className="flex items-center space-x-1 text-gold hover:text-gold-light transition-colors"
              title="Back to Top"
            >
              <span>Back to Top</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}

