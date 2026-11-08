import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Phone, MessageCircle, Play, User, Shield, LogOut } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from './ThemeToggle';

export default function Navbar() {
  const { settings } = useSettings();
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Showreel', href: '/#showreel' },
    { name: 'Portfolio', href: '/#portfolio' },
    { name: 'Before / After', href: '/#before-after' },
    { name: 'Services', href: '/#services' },
    { name: 'About', href: '/#about' },
    { name: 'Reviews', href: '/#testimonials' },
    { name: 'Contact', href: '/#contact' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${isScrolled
        ? 'bg-black/90 dark:bg-black/90 light:bg-white/90 backdrop-blur-md border-b border-gold/20 shadow-lg py-3'
        : 'bg-gradient-to-b from-black/80 to-transparent py-5'
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="relative w-11 h-11 sm:w-12 sm:h-12 rounded-full overflow-hidden p-0.5 bg-gradient-to-tr from-gold via-gold-light to-gold shadow-gold-sm group-hover:scale-105 transition-transform">
              <img
                src={settings.logoUrl || '/Logo.png'}
                alt={settings.brandName || 'Edit Vision'}
                className="w-full h-full object-cover rounded-full bg-black"
                onError={(e) => {
                  e.target.src = '/Logo.png';
                }}
              />
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-xl sm:text-2xl font-bold tracking-wider text-white light:text-black group-hover:text-gold transition-colors">
                EDIT VISION
              </span>
              <span className="text-[10px] tracking-[0.25em] uppercase text-gold font-medium">
                Vekariya Raj
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden xl:flex items-center space-x-7">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-sm font-medium tracking-wide text-gray-300 light:text-gray-700 hover:text-gold light:hover:text-gold-dark transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-gold hover:after:w-full after:transition-all after:duration-300"
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Action CTAs & Controls */}
          <div className="hidden sm:flex items-center space-x-3">
            <ThemeToggle />

            {/* Direct Call */}
            <a
              href={`tel:${settings.contactNumber || '9723501437'}`}
              className="flex items-center space-x-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border border-gold/40 text-gold hover:bg-gold/10 hover:border-gold transition-all"
              title="Call Vekariya Raj"
            >
              <Phone className="w-3.5 h-3.5 text-gold" />
              <span>{settings.contactNumber || '9723501437'}</span>
            </a>

            {/* Account Portal / Login Buttons */}
            {isAuthenticated ? (
              user?.role === 'admin' ? (
                <div className="flex items-center space-x-2">
                  <Link
                    to="/admin"
                    className="flex items-center space-x-1.5 text-xs font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full bg-gold/15 border border-gold/60 text-gold hover:bg-gold hover:text-black transition-all"
                    title="Dashboard"
                  >
                    <Shield className="w-3.5 h-3.5" />
                    <span>Dashboard</span>
                  </Link>
                  <button
                    onClick={logout}
                    className="p-1.5 rounded-full text-gray-400 hover:text-red-400 hover:bg-white/10 transition-colors"
                    title="Sign Out"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Link
                    to="/client"
                    className="flex items-center space-x-1.5 text-xs font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 text-gray-200 hover:border-gold hover:text-gold transition-all"
                    title="Client Portal"
                  >
                    <User className="w-3.5 h-3.5 text-gold" />
                    <span>{user?.name?.split(' ')[0] || 'Client'}</span>
                  </Link>
                  <button
                    onClick={logout}
                    className="p-1.5 rounded-full text-gray-400 hover:text-red-400 hover:bg-white/10 transition-colors"
                    title="Sign Out"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                  </button>
                </div>
              )
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="flex items-center space-x-1.5 text-xs font-semibold px-3.5 py-1.5 rounded-full border border-white/20 text-gray-300 hover:border-gold hover:text-gold transition-all"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Sign In</span>
                </Link>
              </div>
            )}

            {/* WhatsApp CTA */}
            <a
              href={`https://wa.me/91${settings.whatsappNumber || '9723501437'}?text=${encodeURIComponent(
                'Hi Raj, I visited your Edit Vision portfolio and want to discuss a video project.'
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-1.5 text-xs font-bold tracking-wider uppercase px-4 py-2 rounded-full bg-gold-gradient text-black hover:shadow-gold-md hover:scale-105 active:scale-95 transition-all"
            >
              <MessageCircle className="w-3.5 h-3.5 text-black" />
              <span>Hire Me</span>
            </a>
          </div>

          {/* Mobile hamburger button */}
          <div className="flex items-center space-x-3 lg:hidden">
            <ThemeToggle />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-gold hover:bg-gold/10 transition-colors"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-dark/95 dark:bg-black/95 light:bg-white/95 backdrop-blur-xl border-b border-gold/20 px-6 py-6 transition-all duration-300">
          <div className="flex flex-col space-y-4">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-base font-medium tracking-wide text-gray-200 light:text-gray-800 hover:text-gold py-1 border-b border-white/5"
              >
                {link.name}
              </a>
            ))}

            <div className="pt-4 flex flex-col space-y-3">
              {isAuthenticated ? (
                user?.role === 'admin' ? (
                  <Link
                    to="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center space-x-2 py-2.5 rounded-lg bg-gold/20 border border-gold text-gold text-sm font-bold uppercase tracking-wider"
                  >
                    <Shield className="w-4 h-4" />
                    <span>Open Dashboard</span>
                  </Link>
                ) : (
                  <Link
                    to="/client"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center space-x-2 py-2.5 rounded-lg bg-white/10 border border-white/20 text-white text-sm font-bold uppercase tracking-wider"
                  >
                    <User className="w-4 h-4 text-gold" />
                    <span>Open Client Portal</span>
                  </Link>
                )
              ) : (
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center space-x-2 py-2.5 rounded-lg border border-white/20 text-gray-200 text-xs font-semibold"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Sign In / Client Portal</span>
                </Link>
              )}

              <a
                href={`tel:${settings.contactNumber || '9723501437'}`}
                className="flex items-center justify-center space-x-2 py-2.5 rounded-lg border border-gold/40 text-gold text-sm font-semibold"
              >
                <Phone className="w-4 h-4 text-gold" />
                <span>Call: {settings.contactNumber || '9723501437'}</span>
              </a>

              <a
                href={`https://wa.me/91${settings.whatsappNumber || '9723501437'}?text=${encodeURIComponent(
                  'Hi Raj, I saw your portfolio and would like to hire you for video editing.'
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center space-x-2 py-3 rounded-lg bg-gold-gradient text-black font-bold uppercase tracking-wider text-sm shadow-gold-sm"
              >
                <MessageCircle className="w-4 h-4 text-black" />
                <span>Chat on WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
