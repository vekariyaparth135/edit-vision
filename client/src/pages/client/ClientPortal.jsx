import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  User,
  Film,
  MessageCircle,
  Phone,
  Send,
  Clock,
  CheckCircle2,
  Lock,
  LogOut,
  ExternalLink,
  PlusCircle,
  ShieldCheck,
  Calendar,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useSettings } from '../../context/SettingsContext';
import api from '../../services/api';

export default function ClientPortal() {
  const { user, logout } = useAuth();
  const { settings } = useSettings();

  // Inquiries State
  const [inquiries, setInquiries] = useState([]);
  const [loadingInquiries, setLoadingInquiries] = useState(true);

  // New Project Booking Form State
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingData, setBookingData] = useState({
    name: user?.name || '',
    phone: '',
    email: user?.email || '',
    service: 'Reels / Shorts Editing',
    budget: '',
    message: '',
  });
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState('');
  const [bookingError, setBookingError] = useState('');

  // Password Change State
  const [showPasswordSection, setShowPasswordSection] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [pwdLoading, setPwdLoading] = useState(false);
  const [pwdSuccess, setPwdSuccess] = useState('');
  const [pwdError, setPwdError] = useState('');

  // Fetch client's inquiries
  const fetchMyInquiries = async () => {
    try {
      setLoadingInquiries(true);
      const res = await api.get('/messages/my');
      setInquiries(res.data.data || []);
    } catch (err) {
      console.error('Failed to load inquiries:', err);
    } finally {
      setLoadingInquiries(false);
    }
  };

  useEffect(() => {
    fetchMyInquiries();
  }, []);

  // Submit project booking
  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    setBookingLoading(true);
    setBookingError('');
    setBookingSuccess('');

    try {
      await api.post('/messages', bookingData);
      setBookingSuccess('Project request sent to Vekariya Raj successfully!');
      setBookingData({
        name: user?.name || '',
        phone: '',
        email: user?.email || '',
        service: 'Reels / Shorts Editing',
        budget: '',
        message: '',
      });
      fetchMyInquiries();
      setTimeout(() => {
        setShowBookingModal(false);
        setBookingSuccess('');
      }, 2000);
    } catch (err) {
      setBookingError(err.response?.data?.message || 'Failed to submit request');
    } finally {
      setBookingLoading(false);
    }
  };

  // Change Password
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPwdError('');
    setPwdSuccess('');

    if (newPassword.length < 6) {
      setPwdError('Password must be at least 6 characters');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPwdError('Passwords do not match');
      return;
    }

    setPwdLoading(true);
    try {
      await api.put('/auth/setpassword', { newPassword });
      setPwdSuccess('Your password has been updated successfully!');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setShowPasswordSection(false), 2500);
    } catch (err) {
      setPwdError(err.response?.data?.message || 'Failed to update password');
    } finally {
      setPwdLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-gray-100 flex flex-col">
      {/* Top Navigation */}
      <header className="border-b border-gold/20 bg-dark-card/60 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-full p-0.5 bg-gradient-to-tr from-gold to-gold-light">
              <img
                src={settings.logoUrl || '/Logo.png'}
                alt="Edit Vision"
                className="w-full h-full object-cover rounded-full bg-black"
                onError={(e) => {
                  e.target.src = '/Logo.png';
                }}
              />
            </div>
            <div>
              <span className="font-serif text-xl font-bold tracking-wider text-white group-hover:text-gold transition-colors">
                EDIT VISION
              </span>
              <span className="block text-[10px] tracking-widest uppercase text-gold font-medium">
                Client Portal
              </span>
            </div>
          </Link>

          <div className="flex items-center space-x-4">
            <Link
              to="/"
              className="text-xs text-gray-400 hover:text-white transition-colors hidden sm:inline-flex items-center space-x-1"
            >
              <span>View Portfolio</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>

            <div className="flex items-center space-x-2 bg-white/5 border border-white/10 rounded-full px-3 py-1.5">
              <span className="text-xs text-gray-300 font-medium">
                {user?.name || 'Client'}
              </span>
            </div>

            <button
              onClick={logout}
              className="p-2 rounded-full text-gray-400 hover:text-red-400 hover:bg-white/5 transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {/* Welcome Hero Banner */}
        <div className="relative rounded-3xl bg-gradient-to-r from-dark-card via-black to-dark-card border border-gold/30 p-8 sm:p-10 overflow-hidden shadow-2xl">
          <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-gold/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-gold/10 border border-gold/30 text-gold text-xs font-semibold uppercase tracking-wider">
                <ShieldCheck className="w-3.5 h-3.5 text-gold" />
                <span>Verified Client Hub</span>
              </div>
              <h1 className="font-serif text-3xl sm:text-4xl font-bold text-white tracking-wide">
                Welcome, <span className="text-gold-gradient">{user?.name || 'Client'}</span>
              </h1>
              <p className="text-gray-400 text-sm max-w-xl">
                Collaborate directly with <strong className="text-white">Vekariya Raj</strong> on your video projects. Book new editing jobs, track your inquiries, and chat in real-time.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => setShowBookingModal(true)}
                className="px-5 py-3 rounded-full bg-gold text-black font-bold text-xs uppercase tracking-wider hover:bg-gold-light hover:shadow-gold-md transition-all flex items-center space-x-2"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Book New Project</span>
              </button>

              <a
                href={`https://wa.me/91${settings.whatsappNumber || '9723501437'}?text=${encodeURIComponent(
                  `Hi Raj, I am logged into the Edit Vision Client Portal as ${user?.name || 'a client'}. I would like to discuss a project.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-3 rounded-full bg-gold/15 border border-gold/40 text-gold font-bold text-xs uppercase tracking-wider hover:bg-gold hover:text-black transition-all flex items-center space-x-2"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp Raj</span>
              </a>
            </div>
          </div>
        </div>

        {/* Quick Stats & Contact */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-dark-card border border-white/5 rounded-2xl p-6 flex items-center space-x-4">
            <div className="w-12 h-12 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center text-gold">
              <Film className="w-6 h-6" />
            </div>
            <div>
              <span className="text-2xl font-bold text-white">{inquiries.length}</span>
              <p className="text-xs uppercase tracking-wider text-gray-400 font-medium">
                Total Inquiries
              </p>
            </div>
          </div>

          <div className="bg-dark-card border border-white/5 rounded-2xl p-6 flex items-center space-x-4">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <Phone className="w-6 h-6" />
            </div>
            <div>
              <span className="text-sm font-bold text-white">
                {settings.contactNumber || '9723501437'}
              </span>
              <p className="text-xs uppercase tracking-wider text-gray-400 font-medium">
                Direct Call Line
              </p>
            </div>
          </div>

          <div className="bg-dark-card border border-white/5 rounded-2xl p-6 flex items-center space-x-4">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <span className="text-sm font-bold text-white">Cinematic Quality</span>
              <p className="text-xs uppercase tracking-wider text-gray-400 font-medium">
                4K / DaVinci Resolve
              </p>
            </div>
          </div>
        </div>

        {/* Section: My Project Inquiries */}
        <div className="bg-dark-card border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between border-b border-white/5 pb-4">
            <div>
              <h2 className="font-serif text-2xl font-bold text-white">
                My Project Inquiries & Requests
              </h2>
              <p className="text-xs text-gray-400">
                All requests submitted using your email ({user?.email})
              </p>
            </div>

            <button
              onClick={() => setShowBookingModal(true)}
              className="px-4 py-2 rounded-xl bg-gold/10 hover:bg-gold/20 text-gold text-xs font-semibold tracking-wider transition-colors flex items-center space-x-1.5"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>New Request</span>
            </button>
          </div>

          {loadingInquiries ? (
            <div className="py-12 text-center text-gray-500 text-sm">
              Loading your inquiries...
            </div>
          ) : inquiries.length === 0 ? (
            <div className="py-12 text-center space-y-3">
              <div className="w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-gray-500">
                <Film className="w-6 h-6" />
              </div>
              <h3 className="text-base font-semibold text-white">No inquiries yet</h3>
              <p className="text-xs text-gray-400 max-w-sm mx-auto">
                Ready to elevate your video content? Click below to send your first project brief to Vekariya Raj.
              </p>
              <button
                onClick={() => setShowBookingModal(true)}
                className="mt-2 px-4 py-2 rounded-full bg-gold text-black text-xs font-bold uppercase tracking-wider hover:bg-gold-light transition-all"
              >
                Submit Project Brief
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {inquiries.map((inq) => (
                <div
                  key={inq._id}
                  className="bg-black/60 border border-white/10 rounded-2xl p-5 hover:border-gold/30 transition-all space-y-3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center space-x-3">
                      <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-gold/10 text-gold border border-gold/30">
                        {inq.service || 'Video Project'}
                      </span>
                      {inq.budget && (
                        <span className="text-xs text-gray-400 font-mono">
                          Budget: {inq.budget}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center space-x-2 text-xs text-gray-400">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{new Date(inq.createdAt).toLocaleDateString()}</span>
                      <span
                        className={`ml-2 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          inq.status === 'unread'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            : inq.status === 'read'
                            ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                            : 'bg-gold/15 text-gold border border-gold/30'
                        }`}
                      >
                        {inq.status === 'unread'
                          ? 'Received'
                          : inq.status === 'read'
                          ? 'Under Review'
                          : inq.status}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-gray-300 leading-relaxed bg-white/5 p-3 rounded-xl">
                    {inq.message}
                  </p>

                  <div className="flex justify-end pt-1">
                    <a
                      href={`https://wa.me/91${settings.whatsappNumber || '9723501437'}?text=${encodeURIComponent(
                        `Hi Raj, following up on my project inquiry regarding "${inq.service}" (${inq.message.slice(0, 40)}...)`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-gold hover:text-gold-light flex items-center space-x-1"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>Follow up on WhatsApp</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Section: Client Account & Password */}
        <div className="bg-dark-card border border-white/10 rounded-3xl p-6 sm:p-8 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-serif text-xl font-bold text-white">Client Account Security</h2>
              <p className="text-xs text-gray-400">
                Logged in as <strong className="text-white">{user?.email}</strong>
              </p>
            </div>

            <button
              onClick={() => setShowPasswordSection(!showPasswordSection)}
              className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-gray-300 transition-colors flex items-center space-x-1.5"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>{showPasswordSection ? 'Cancel' : 'Change Password'}</span>
            </button>
          </div>

          {showPasswordSection && (
            <form onSubmit={handlePasswordChange} className="pt-4 border-t border-white/5 space-y-4 max-w-md">
              {pwdError && (
                <div className="p-3 rounded-xl bg-red-500/20 text-red-300 text-xs flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{pwdError}</span>
                </div>
              )}
              {pwdSuccess && (
                <div className="p-3 rounded-xl bg-gold/15 border border-gold/40 text-gold text-xs flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-gold" />
                  <span>{pwdSuccess}</span>
                </div>
              )}

              <div>
                <label className="block text-xs uppercase tracking-wider text-gray-400 mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                  className="w-full bg-black/60 border border-white/10 focus:border-gold rounded-xl px-4 py-2.5 text-xs text-white outline-none"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-gray-400 mb-1">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                  className="w-full bg-black/60 border border-white/10 focus:border-gold rounded-xl px-4 py-2.5 text-xs text-white outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={pwdLoading}
                className="px-6 py-2.5 rounded-xl bg-gold text-black font-bold text-xs uppercase tracking-wider hover:bg-gold-light transition-all disabled:opacity-50"
              >
                {pwdLoading ? 'Updating...' : 'Save New Password'}
              </button>
            </form>
          )}
        </div>
      </main>

      {/* Booking Modal */}
      {showBookingModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-dark-card border border-gold/40 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative">
            <h3 className="font-serif text-2xl font-bold text-white mb-1">
              Book a Video Project
            </h3>
            <p className="text-xs text-gray-400 mb-6">
              Send your project brief directly to Vekariya Raj.
            </p>

            {bookingError && (
              <div className="mb-4 p-3 rounded-xl bg-red-500/20 text-red-300 text-xs">
                {bookingError}
              </div>
            )}
            {bookingSuccess && (
              <div className="mb-4 p-3 rounded-xl bg-gold/15 border border-gold/40 text-gold text-xs">
                {bookingSuccess}
              </div>
            )}

            <form onSubmit={handleBookingSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-gray-400 mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    value={bookingData.name}
                    onChange={(e) => setBookingData({ ...bookingData, name: e.target.value })}
                    required
                    className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-gold"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-gray-400 mb-1">
                    Phone / WhatsApp Number
                  </label>
                  <input
                    type="tel"
                    value={bookingData.phone}
                    onChange={(e) => setBookingData({ ...bookingData, phone: e.target.value })}
                    placeholder="e.g. 9723501437"
                    required
                    className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-gold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-gray-400 mb-1">
                    Service Needed
                  </label>
                  <select
                    value={bookingData.service}
                    onChange={(e) => setBookingData({ ...bookingData, service: e.target.value })}
                    className="w-full bg-black border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-gold"
                  >
                    <option value="Reels / Shorts Editing">Reels / Shorts Editing</option>
                    <option value="YouTube Video Editing">YouTube Video Editing</option>
                    <option value="Cinematic Color Grading">Cinematic Color Grading</option>
                    <option value="Wedding Highlights & Teasers">Wedding Highlights & Teasers</option>
                    <option value="Commercial & Brand Ads">Commercial & Brand Ads</option>
                    <option value="Motion Graphics & VFX">Motion Graphics & VFX</option>
                    <option value="Thumbnails & Posters">Thumbnails & Posters</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-gray-400 mb-1">
                    Estimated Budget
                  </label>
                  <input
                    type="text"
                    value={bookingData.budget}
                    onChange={(e) => setBookingData({ ...bookingData, budget: e.target.value })}
                    placeholder="e.g. ₹5,000 - ₹15,000"
                    className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-gold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-gray-400 mb-1">
                  Project Details & Footage Link
                </label>
                <textarea
                  rows={4}
                  value={bookingData.message}
                  onChange={(e) => setBookingData({ ...bookingData, message: e.target.value })}
                  placeholder="Describe your video vision, deadline, style references, or paste your Google Drive / Dropbox footage link..."
                  required
                  className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-gold"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowBookingModal(false)}
                  className="px-4 py-2 rounded-xl text-gray-400 hover:text-white text-xs font-semibold"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={bookingLoading}
                  className="px-6 py-2.5 rounded-xl bg-gold text-black font-bold text-xs uppercase tracking-wider hover:bg-gold-light transition-all disabled:opacity-50 flex items-center space-x-2"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{bookingLoading ? 'Sending...' : 'Send to Raj'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

