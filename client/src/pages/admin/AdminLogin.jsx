import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Lock,
  Mail,
  ArrowRight,
  Eye,
  EyeOff,
  User,
  Shield,
  KeyRound,
  CheckCircle,
  AlertCircle,
  HelpCircle,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useSettings } from '../../context/SettingsContext';
import api from '../../services/api';

export default function AdminLogin() {
  const { login } = useAuth();
  const { settings } = useSettings();
  const navigate = useNavigate();

  // Login form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Status state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Set / Reset Admin Password modal
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetName, setResetName] = useState('Vekariya Raj');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [resetLoading, setResetLoading] = useState(false);
  const [resetError, setResetError] = useState('');
  const [resetSuccess, setResetSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const loggedUser = await login(email, password);

      if (loggedUser?.role === 'admin') {
        setSuccess('Welcome, Vekariya Raj! Opening Admin Dashboard...');
        setTimeout(() => navigate('/admin'), 500);
      } else {
        setError('Access Denied. Only Admin (Vekariya Raj) is authorized.');
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Invalid email or password. Only Vekariya Raj can access this portal.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResetSubmit = async (e) => {
    e.preventDefault();
    setResetError('');
    setResetSuccess('');

    if (newPassword.length < 6) {
      setResetError('Password must be at least 6 characters');
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setResetError('Passwords do not match');
      return;
    }

    setResetLoading(true);
    try {
      const res = await api.post('/auth/reset-credentials', {
        email: resetEmail,
        password: newPassword,
        name: resetName,
      });

      if (res.data.success) {
        setResetSuccess('Password set successfully! Logging in...');
        setPassword(newPassword);
        setEmail(resetEmail);
        setTimeout(async () => {
          setShowResetModal(false);
          const loggedUser = await login(resetEmail, newPassword);
          if (loggedUser?.role === 'admin') {
            navigate('/admin');
          } else {
            navigate('/client');
          }
        }, 1200);
      }
    } catch (err) {
      setResetError(err.response?.data?.message || 'Failed to update credentials');
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background radial gold glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gold/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-md bg-dark-card border border-gold/40 rounded-3xl p-8 sm:p-10 shadow-2xl z-10">
        {/* Logo and Heading */}
        <div className="flex flex-col items-center text-center mb-6">
          <Link to="/" className="group mb-3">
            <div className="w-20 h-20 rounded-full p-1 bg-gradient-to-tr from-gold via-gold-light to-gold shadow-gold-md group-hover:scale-105 transition-transform">
              <img
                src={settings.logoUrl || '/Logo.png'}
                alt="Edit Vision"
                className="w-full h-full object-cover rounded-full bg-black"
                onError={(e) => {
                  e.target.src = '/Logo.png';
                }}
              />
            </div>
          </Link>

          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-gold/10 border border-gold/30 text-[11px] font-bold uppercase tracking-wider text-gold mb-2">
            <Shield className="w-3.5 h-3.5 text-gold" />
            <span>Vekariya Raj &bull; Admin Only</span>
          </div>

          <h2 className="font-serif text-3xl font-bold tracking-wider text-white">
            EDIT <span className="text-gold-gradient">VISION</span>
          </h2>
          <p className="text-xs uppercase tracking-widest text-gray-400 font-medium mt-1">
            Sole Administrator CMS Portal
          </p>
        </div>

        {/* Error / Success Notifications */}
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/20 border border-red-500/50 text-red-200 text-xs leading-relaxed space-y-2 animate-fadeIn">
            <div className="flex items-start space-x-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-red-400" />
              <span>{error}</span>
            </div>
            <div className="pt-1 text-right text-[11px]">
              <button
                type="button"
                onClick={() => setShowResetModal(true)}
                className="text-gold hover:underline font-semibold"
              >
                &rarr; Set/Reset Admin Password?
              </button>
            </div>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 rounded-xl bg-gold/15 border border-gold/40 text-gold text-xs flex items-center space-x-2 animate-fadeIn">
            <CheckCircle className="w-4 h-4 flex-shrink-0 text-gold" />
            <span>{success}</span>
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-gray-300 uppercase tracking-wider mb-1.5 font-semibold">
              Admin Email
            </label>
            <div className="relative">
              <input
                type="email"
                required
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-black/60 border border-white/10 focus:border-gold outline-none text-white text-sm"
              />
              <Mail className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-gray-300 uppercase tracking-wider font-semibold">
                Password
              </label>
              <button
                type="button"
                onClick={() => setShowResetModal(true)}
                className="text-[11px] text-gold hover:underline"
              >
                Forgot / Set Password?
              </button>
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
                className="w-full pl-11 pr-11 py-3 rounded-xl bg-black/60 border border-white/10 focus:border-gold outline-none text-white text-sm"
              />
              <Lock className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-gold text-black font-bold uppercase tracking-wider text-xs shadow-gold-md hover:bg-gold-light hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              <span>{loading ? 'Authenticating...' : 'Sign In to Admin Dashboard'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>

        {/* Footer links */}
        <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between text-xs text-gray-400">
          <Link to="/" className="hover:text-white transition-colors">
            &larr; Return to Portfolio
          </Link>
          <Link to="/login" className="text-gold hover:text-gold-light transition-colors flex items-center space-x-1">
            <User className="w-3.5 h-3.5" />
            <span>User Portal &rarr;</span>
          </Link>
        </div>
      </div>

      {/* Set / Reset Password Modal */}
      {showResetModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-dark-card border border-gold/40 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative animate-fadeIn">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-gold/15 text-gold flex items-center justify-center">
                <KeyRound className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif text-xl font-bold text-white">
                  Set Admin Password
                </h3>
                <p className="text-[11px] text-gray-400">
                  Set direct access password for Vekariya Raj
                </p>
              </div>
            </div>

            {resetError && (
              <div className="mb-4 p-3 rounded-xl bg-red-500/20 border border-red-500/50 text-red-200 text-xs">
                {resetError}
              </div>
            )}
            {resetSuccess && (
              <div className="mb-4 p-3 rounded-xl bg-gold/15 border border-gold/40 text-gold text-xs">
                {resetSuccess}
              </div>
            )}

            <form onSubmit={handleResetSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-gray-300 uppercase tracking-wider mb-1 font-medium">
                  Admin Name
                </label>
                <input
                  type="text"
                  value={resetName}
                  onChange={(e) => setResetName(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-black/60 border border-white/10 text-white outline-none focus:border-gold"
                />
              </div>

              <div>
                <label className="block text-gray-300 uppercase tracking-wider mb-1 font-medium">
                  Admin Email
                </label>
                <input
                  type="email"
                  required
                  placeholder="Enter email"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-black/60 border border-white/10 text-white outline-none focus:border-gold"
                />
              </div>

              <div>
                <label className="block text-gray-300 uppercase tracking-wider mb-1 font-medium">
                  New Password
                </label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  autoComplete="new-password"
                  className="w-full px-3 py-2.5 rounded-xl bg-black/60 border border-white/10 text-white outline-none focus:border-gold"
                />
              </div>

              <div>
                <label className="block text-gray-300 uppercase tracking-wider mb-1 font-medium">
                  Confirm Password
                </label>
                <input
                  type="password"
                  required
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  autoComplete="new-password"
                  className="w-full px-3 py-2.5 rounded-xl bg-black/60 border border-white/10 text-white outline-none focus:border-gold"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowResetModal(false)}
                  className="px-4 py-2 rounded-xl text-gray-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={resetLoading}
                  className="px-5 py-2.5 rounded-xl bg-gold text-black font-bold uppercase tracking-wider hover:bg-gold-light disabled:opacity-50"
                >
                  {resetLoading ? 'Updating...' : 'Save & Login'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
