import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  User,
  Film,
  MessageSquare,
  Phone,
  Send,
  Clock,
  CheckCircle,
  Lock,
  LogOut,
  ExternalLink,
  PlusCircle,
  Shield,
  Calendar,
  AlertCircle,
  Trash2,
  X,
  Sparkles,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useSettings } from '../../context/SettingsContext';
import { userApi } from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';

export default function UserDashboard() {
  const { user, logout } = useAuth();
  const { settings } = useSettings();
  const navigate = useNavigate();

  // Inquiries State
  const [inquiries, setInquiries] = useState([]);
  const [loadingInquiries, setLoadingInquiries] = useState(true);

  // New Brief Modal State
  const [showBriefModal, setShowBriefModal] = useState(false);
  const [briefData, setBriefData] = useState({
    phone: '',
    service: 'Reels / Shorts Editing',
    budget: '',
    message: '',
  });
  const [submittingBrief, setSubmittingBrief] = useState(false);

  // Profile Edit State
  const [name, setName] = useState(user?.name || '');
  const [profileLoading, setProfileLoading] = useState(false);

  // Password Update State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);

  // Notifications
  const [notification, setNotification] = useState({ type: '', message: '' });

  const notify = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification({ type: '', message: '' }), 4000);
  };

  const fetchInquiries = async () => {
    try {
      setLoadingInquiries(true);
      const res = await userApi.getInquiries();
      setInquiries(res.data.data || []);
    } catch (err) {
      console.error('Failed to load user inquiries', err);
    } finally {
      setLoadingInquiries(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  // Handle new project submission
  const handleSubmitBrief = async (e) => {
    e.preventDefault();
    setSubmittingBrief(true);

    try {
      await userApi.createInquiry(briefData);
      notify('success', 'Your project brief was sent to Vekariya Raj successfully!');
      setShowBriefModal(false);
      setBriefData({
        phone: '',
        service: 'Reels / Shorts Editing',
        budget: '',
        message: '',
      });
      fetchInquiries();
    } catch (err) {
      notify('error', err.response?.data?.message || 'Failed to submit project brief');
    } finally {
      setSubmittingBrief(false);
    }
  };

  // Handle cancel inquiry
  const handleCancelInquiry = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this project request?')) return;

    try {
      await userApi.deleteInquiry(id);
      notify('success', 'Project request cancelled successfully');
      fetchInquiries();
    } catch (err) {
      notify('error', err.response?.data?.message || 'Failed to cancel request');
    }
  };

  // Handle Profile Update
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setProfileLoading(true);

    try {
      await userApi.updateProfile({ name });
      notify('success', 'Profile updated successfully');
    } catch (err) {
      notify('error', err.response?.data?.message || 'Failed to update profile');
    } finally {
      setProfileLoading(false);
    }
  };

  // Handle Password Update
  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      notify('error', 'New passwords do not match');
      return;
    }
    if (newPassword.length < 6) {
      notify('error', 'New password must be at least 6 characters');
      return;
    }

    setPasswordLoading(true);
    try {
      await userApi.updatePassword({ currentPassword, newPassword });
      notify('success', 'Password updated successfully');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      notify('error', err.response?.data?.message || 'Failed to update password');
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'unread':
        return (
          <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-gold/10 text-gold-light border border-gold/30 text-[10px] font-bold uppercase tracking-wider">
            <Clock className="w-3 h-3" />
            <span>Under Review</span>
          </span>
        );
      case 'read':
        return (
          <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white/10 text-gray-300 border border-white/20 text-[10px] font-bold uppercase tracking-wider">
            <CheckCircle className="w-3 h-3" />
            <span>Reviewed by Raj</span>
          </span>
        );
      case 'contacted':
        return (
          <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-gold text-black font-bold text-[10px] uppercase tracking-wider shadow-gold-sm">
            <Sparkles className="w-3 h-3" />
            <span>Active / In Discussion</span>
          </span>
        );
      case 'archived':
      default:
        return (
          <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white/5 text-gray-400 border border-white/10 text-[10px] font-medium uppercase tracking-wider">
            <span>Completed</span>
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-30 bg-dark-surface/90 backdrop-blur-md border-b border-white/10 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link to="/" className="w-9 h-9 rounded-full overflow-hidden p-0.5 bg-gradient-to-tr from-gold to-gold-light shadow-gold-sm">
              <img
                src={settings.logoUrl || '/Logo.png'}
                alt="Edit Vision"
                className="w-full h-full object-cover rounded-full bg-black"
              />
            </Link>
            <div>
              <Link to="/" className="font-serif text-lg font-bold tracking-wider text-white hover:text-gold transition-colors">
                EDIT VISION
              </Link>
              <div className="flex items-center space-x-1.5 text-[10px] uppercase tracking-widest text-gold font-medium">
                <span>User Portal</span>
                <span className="text-gray-600">•</span>
                <span className="text-gray-400">{user?.name}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {user?.role === 'admin' && (
              <Link
                to="/admin"
                className="hidden sm:flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full bg-gold/20 border border-gold/40 text-gold text-xs font-semibold hover:bg-gold hover:text-black transition-all"
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Switch to Admin CMS</span>
              </Link>
            )}

            <Link
              to="/"
              className="text-xs text-gray-400 hover:text-white transition-colors hidden sm:block"
            >
              Return to Portfolio &rarr;
            </Link>

            <button
              onClick={handleLogout}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border border-white/10 text-xs text-red-400 hover:bg-red-500/10 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto w-full p-4 sm:p-8 flex-1 space-y-8">
        {/* Notification Alert */}
        {notification.message && (
          <div
            className={`p-4 rounded-2xl flex items-center justify-between border ${
              notification.type === 'error'
                ? 'bg-red-500/10 border-red-500/30 text-red-400'
                : 'bg-gold/10 border-gold/30 text-gold-light'
            }`}
          >
            <div className="flex items-center space-x-2">
              {notification.type === 'error' ? (
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
              ) : (
                <CheckCircle className="w-5 h-5 flex-shrink-0" />
              )}
              <span className="text-xs sm:text-sm font-medium">{notification.message}</span>
            </div>
            <button onClick={() => setNotification({ type: '', message: '' })}>
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Hero Welcome Banner */}
        <div className="relative overflow-hidden bg-dark-card border border-gold/30 rounded-3xl p-6 sm:p-10 shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gold/5 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div>
              <span className="text-[11px] font-bold tracking-widest uppercase px-3 py-1 rounded-full bg-gold/10 text-gold border border-gold/20 inline-block mb-3">
                Client Dashboard
              </span>
              <h1 className="font-serif text-2xl sm:text-4xl font-bold text-white">
                Welcome back, <span className="text-gold-gradient">{user?.name}</span>
              </h1>
              <p className="text-xs sm:text-sm text-gray-400 mt-2 max-w-xl">
                Track your video editing briefs, submit new project requests, and communicate directly with Vekariya Raj.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setShowBriefModal(true)}
                className="py-3 px-6 rounded-xl bg-gold-gradient text-black font-bold text-xs uppercase tracking-wider hover:brightness-110 transition-all shadow-gold-sm flex items-center space-x-2"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Submit New Project</span>
              </button>

              <a
                href="https://wa.me/919723501437"
                target="_blank"
                rel="noopener noreferrer"
                className="py-3 px-5 rounded-xl border border-gold/40 text-gold text-xs font-bold uppercase tracking-wider hover:bg-gold/10 transition-all flex items-center space-x-2"
              >
                <Phone className="w-4 h-4" />
                <span>WhatsApp Raj (9723501437)</span>
              </a>
            </div>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-dark-card border border-white/10 rounded-2xl p-5 flex items-center space-x-4">
            <div className="w-12 h-12 rounded-xl bg-gold/10 border border-gold/30 flex items-center justify-center text-gold">
              <Film className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-bold font-serif text-white">{inquiries.length}</div>
              <div className="text-xs text-gray-400 font-medium uppercase tracking-wider">Total Project Requests</div>
            </div>
          </div>

          <div className="bg-dark-card border border-white/10 rounded-2xl p-5 flex items-center space-x-4">
            <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gold">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-bold font-serif text-white">
                {inquiries.filter((i) => i.status === 'unread' || i.status === 'read').length}
              </div>
              <div className="text-xs text-gray-400 font-medium uppercase tracking-wider">In Review / Queued</div>
            </div>
          </div>

          <div className="bg-dark-card border border-white/10 rounded-2xl p-5 flex items-center space-x-4">
            <div className="w-12 h-12 rounded-xl bg-gold/20 border border-gold/40 flex items-center justify-center text-gold">
              <CheckCircle className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-bold font-serif text-gold">
                {inquiries.filter((i) => i.status === 'contacted' || i.status === 'archived').length}
              </div>
              <div className="text-xs text-gray-400 font-medium uppercase tracking-wider">Contacted / Completed</div>
            </div>
          </div>
        </div>

        {/* Section: My Submitted Projects */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-serif text-2xl font-bold text-white">My Project Requests</h2>
              <p className="text-xs text-gray-400">View real-time status updates for your editing orders.</p>
            </div>

            <button
              onClick={() => setShowBriefModal(true)}
              className="text-xs font-bold text-gold hover:text-gold-light flex items-center space-x-1"
            >
              <span>+ New Project Brief</span>
            </button>
          </div>

          <div className="bg-dark-card border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
            {loadingInquiries ? (
              <div className="py-16 flex justify-center">
                <LoadingSpinner size="lg" text="Loading your requests..." />
              </div>
            ) : inquiries.length === 0 ? (
              <div className="py-16 text-center text-gray-500 space-y-3">
                <Film className="w-12 h-12 mx-auto opacity-30 text-gold" />
                <p className="text-sm">You haven't submitted any video editing requests yet.</p>
                <button
                  onClick={() => setShowBriefModal(true)}
                  className="py-2.5 px-5 rounded-xl bg-gold text-black font-bold text-xs uppercase tracking-wider hover:bg-gold-light transition-all shadow-gold-sm inline-flex items-center space-x-2"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Submit Your First Project Brief</span>
                </button>
              </div>
            ) : (
              <div className="divide-y divide-white/5">
                {inquiries.map((inq) => (
                  <div
                    key={inq._id}
                    className="p-5 sm:p-6 hover:bg-white/[0.02] transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center space-x-3 flex-wrap gap-y-1">
                        <span className="font-serif font-bold text-base text-white">
                          {inq.service}
                        </span>
                        {getStatusBadge(inq.status)}
                        {inq.budget && (
                          <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-white/5 text-gold border border-white/10 font-mono">
                            Budget: {inq.budget}
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-gray-300 leading-relaxed max-w-3xl">
                        {inq.message}
                      </p>

                      <div className="flex items-center space-x-4 text-[11px] text-gray-500 pt-1">
                        <span className="flex items-center space-x-1">
                          <Calendar className="w-3 h-3" />
                          <span>Submitted: {new Date(inq.createdAt).toLocaleDateString()}</span>
                        </span>
                        <span>Contact: {inq.phone}</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 self-end md:self-center">
                      <a
                        href={`https://wa.me/919723501437?text=${encodeURIComponent(
                          `Hi Raj, following up on my request for ${inq.service} (Ref: ${inq._id.slice(-6)})`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="py-2 px-3 rounded-lg border border-gold/30 text-gold text-xs font-semibold hover:bg-gold/10 transition-colors flex items-center space-x-1.5"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>Chat with Raj</span>
                      </a>

                      <button
                        onClick={() => handleCancelInquiry(inq._id)}
                        title="Cancel this request"
                        className="p-2 rounded-lg border border-red-500/20 text-red-400 hover:bg-red-500/10 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Profile & Security Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* My Profile */}
          <div className="bg-dark-card border border-white/10 rounded-2xl p-6 sm:p-8">
            <div className="flex items-center space-x-3 mb-6 pb-4 border-b border-white/10">
              <div className="w-10 h-10 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center text-gold">
                <User className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif text-lg font-bold text-white">My Profile</h3>
                <p className="text-[11px] text-gray-400">Manage your name and contact details</p>
              </div>
            </div>

            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div>
                <label className="block text-[11px] uppercase tracking-wider font-semibold text-gray-400 mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-gold"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider font-semibold text-gray-400 mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  disabled
                  value={user?.email || ''}
                  className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-2.5 text-xs text-gray-500 cursor-not-allowed"
                />
                <span className="text-[10px] text-gray-500 mt-1 block">
                  Email cannot be modified directly.
                </span>
              </div>

              <button
                type="submit"
                disabled={profileLoading}
                className="py-2.5 px-5 rounded-xl bg-gold text-black font-bold text-xs uppercase tracking-wider hover:bg-gold-light transition-all shadow-gold-sm disabled:opacity-50"
              >
                {profileLoading ? 'Saving...' : 'Update Profile'}
              </button>
            </form>
          </div>

          {/* Change Password */}
          <div className="bg-dark-card border border-white/10 rounded-2xl p-6 sm:p-8">
            <div className="flex items-center space-x-3 mb-6 pb-4 border-b border-white/10">
              <div className="w-10 h-10 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center text-gold">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif text-lg font-bold text-white">Security & Password</h3>
                <p className="text-[11px] text-gray-400">Update your account login password</p>
              </div>
            </div>

            <form onSubmit={handleUpdatePassword} className="space-y-4">
              <div>
                <label className="block text-[11px] uppercase tracking-wider font-semibold text-gray-400 mb-1.5">
                  Current Password
                </label>
                <input
                  type="password"
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  autoComplete="new-password"
                  className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-gold"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider font-semibold text-gray-400 mb-1.5">
                  New Password
                </label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  autoComplete="new-password"
                  className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-gold"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider font-semibold text-gray-400 mb-1.5">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  autoComplete="new-password"
                  className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-gold"
                />
              </div>

              <button
                type="submit"
                disabled={passwordLoading}
                className="py-2.5 px-5 rounded-xl border border-gold/40 text-gold font-bold text-xs uppercase tracking-wider hover:bg-gold/10 transition-all disabled:opacity-50"
              >
                {passwordLoading ? 'Updating...' : 'Change Password'}
              </button>
            </form>
          </div>
        </div>
      </main>

      {/* New Project Brief Modal */}
      {showBriefModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-dark-card border border-gold/30 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center text-gold">
                  <Film className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-white">New Project Request</h3>
                  <p className="text-[11px] text-gray-400">Send your editing requirements directly to Vekariya Raj</p>
                </div>
              </div>
              <button
                onClick={() => setShowBriefModal(false)}
                className="text-gray-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitBrief} className="space-y-4">
              <div>
                <label className="block text-[11px] uppercase tracking-wider font-semibold text-gray-400 mb-1.5">
                  Select Service
                </label>
                <select
                  value={briefData.service}
                  onChange={(e) => setBriefData({ ...briefData, service: e.target.value })}
                  className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-gold"
                >
                  <option value="Reels / Shorts Editing">Reels & Viral Shorts Editing</option>
                  <option value="YouTube Video Production">YouTube Video Production & Storytelling</option>
                  <option value="Cinematic Color Grading">DaVinci Resolve Cinematic Color Grading</option>
                  <option value="Wedding Film Post-Production">Luxury Wedding & Event Film</option>
                  <option value="Commercial & Brand Ad">Commercial & Brand Campaign Ad</option>
                  <option value="Motion Graphics & VFX">Motion Graphics & Visual Effects</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider font-semibold text-gray-400 mb-1.5">
                  Contact Phone / WhatsApp
                </label>
                <input
                  type="tel"
                  required
                  value={briefData.phone}
                  onChange={(e) => setBriefData({ ...briefData, phone: e.target.value })}
                  placeholder="e.g. 9723501437"
                  className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-gold"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider font-semibold text-gray-400 mb-1.5">
                  Estimated Budget (Optional)
                </label>
                <input
                  type="text"
                  value={briefData.budget}
                  onChange={(e) => setBriefData({ ...briefData, budget: e.target.value })}
                  placeholder="e.g. ₹15,000 or $300"
                  className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-gold"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider font-semibold text-gray-400 mb-1.5">
                  Project Description / Vision
                </label>
                <textarea
                  required
                  rows={4}
                  value={briefData.message}
                  onChange={(e) => setBriefData({ ...briefData, message: e.target.value })}
                  placeholder="Describe your video project, footage details, references, and deadline..."
                  className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-gold"
                />
              </div>

              <div className="flex space-x-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowBriefModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-white/10 text-xs font-bold text-gray-400 hover:text-white hover:bg-white/5 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingBrief}
                  className="flex-1 py-2.5 rounded-xl bg-gold text-black text-xs font-bold uppercase tracking-wider hover:bg-gold-light transition-all shadow-gold-sm disabled:opacity-50"
                >
                  {submittingBrief ? 'Submitting...' : 'Send Brief to Raj'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

