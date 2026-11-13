import React, { useState } from 'react';
import { KeyRound, Check, Lock, AlertCircle, Eye, EyeOff, User, Mail, ShieldCheck } from 'lucide-react';
import { authApi } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useSettings } from '../../context/SettingsContext';

export default function PasswordChange() {
  const { user } = useAuth();
  const { settings, refreshSettings } = useSettings();

  const [activeTab, setActiveTab] = useState('password');

  // Password fields
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passLoading, setPassLoading] = useState(false);
  const [passMsg, setPassMsg] = useState({ type: '', text: '' });

  // Profile fields
  const [name, setName] = useState(user?.name || 'Vekariya Raj');
  const [email, setEmail] = useState(user?.email || '');
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileMsg, setProfileMsg] = useState({ type: '', text: '' });

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPassMsg({ type: '', text: '' });

    if (newPassword !== confirmPassword) {
      setPassMsg({ type: 'error', text: 'New password and confirmation do not match.' });
      return;
    }

    if (newPassword.length < 6) {
      setPassMsg({ type: 'error', text: 'New password must be at least 6 characters.' });
      return;
    }

    setPassLoading(true);
    try {
      // Use direct password set endpoint
      const res = await authApi.setPasswordDirect({ newPassword });
      if (res.data.success) {
        setPassMsg({ type: 'success', text: 'Admin password updated successfully! Please save it in a safe place.' });
        setNewPassword('');
        setConfirmPassword('');
      }
    } catch (err) {
      setPassMsg({
        type: 'error',
        text: err.response?.data?.message || 'Failed to update password.',
      });
    } finally {
      setPassLoading(false);
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileMsg({ type: '', text: '' });
    setProfileLoading(true);

    try {
      const res = await authApi.updateProfile({ name, email });
      if (res.data.success) {
        setProfileMsg({ type: 'success', text: 'Admin profile updated successfully!' });
        localStorage.setItem('user', JSON.stringify(res.data.user));
        await refreshSettings();
      }
    } catch (err) {
      setProfileMsg({
        type: 'error',
        text: err.response?.data?.message || 'Failed to update profile.',
      });
    } finally {
      setProfileLoading(false);
    }
  };

  return (
    <div className="max-w-2xl space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-serif text-3xl font-bold text-white">Security & Admin Profile</h1>
        <p className="text-xs text-gray-400 mt-1">
          Set your new admin password, update credentials, and review logging status.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-white/10 gap-2">
        <button
          onClick={() => setActiveTab('password')}
          className={`px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${activeTab === 'password'
            ? 'bg-gold text-black font-bold shadow-gold-sm'
            : 'text-gray-400 hover:text-white bg-dark-card'
            }`}
        >
          Set Admin Password
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          className={`px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${activeTab === 'profile'
            ? 'bg-gold text-black font-bold shadow-gold-sm'
            : 'text-gray-400 hover:text-white bg-dark-card'
            }`}
        >
          Admin Profile (Vekariya Raj)
        </button>
      </div>

      {/* TAB 1: PASSWORD SET */}
      {activeTab === 'password' && (
        <div className="p-6 sm:p-8 rounded-2xl bg-dark-card border border-white/5 shadow-2xl space-y-6">
          <div className="flex items-center space-x-2 pb-3 border-b border-white/10">
            <KeyRound className="w-5 h-5 text-gold" />
            <h3 className="font-serif text-lg font-bold text-white">Set New Password</h3>
          </div>

          {passMsg.text && (
            <div
              className={`p-4 rounded-xl text-xs flex items-center space-x-2 ${
                passMsg.type === 'success'
                  ? 'bg-gold/15 border border-gold/40 text-gold'
                  : 'bg-red-500/20 border border-red-500 text-red-300'
              }`}
            >
              {passMsg.type === 'success' ? (
                <Check className="w-4 h-4 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
              )}
              <span>{passMsg.text}</span>
            </div>
          )}

          <form onSubmit={handlePasswordSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-gray-300 uppercase tracking-wider mb-1.5 font-semibold">
                New Password * (At least 6 characters)
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  autoComplete="new-password"
                  className="w-full pl-10 pr-11 py-3 rounded-xl bg-black/60 border border-white/10 text-white focus:border-gold outline-none"
                />
                <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-gray-300 uppercase tracking-wider mb-1.5 font-semibold">
                Confirm New Password *
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  autoComplete="new-password"
                  className="w-full pl-10 pr-11 py-3 rounded-xl bg-black/60 border border-white/10 text-white focus:border-gold outline-none"
                />
                <KeyRound className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={passLoading}
                className="w-full py-3.5 rounded-xl bg-gold-gradient text-black font-bold uppercase tracking-wider text-xs shadow-gold-sm hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
              >
                {passLoading ? 'Setting New Password...' : 'Save & Activate Password'}
              </button>
            </div>
          </form>

          <div className="pt-4 border-t border-white/5 text-[11px] text-gray-400 flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-gold flex-shrink-0" />
            <span>Password changes are immediately encrypted using Bcrypt and logged in security audits.</span>
          </div>
        </div>
      )}

      {/* TAB 2: ADMIN PROFILE */}
      {activeTab === 'profile' && (
        <div className="p-6 sm:p-8 rounded-2xl bg-dark-card border border-white/5 shadow-2xl space-y-6">
          <div className="flex items-center space-x-2 pb-3 border-b border-white/10">
            <User className="w-5 h-5 text-gold" />
            <h3 className="font-serif text-lg font-bold text-white">Admin Profile & Details</h3>
          </div>

          {profileMsg.text && (
            <div
              className={`p-4 rounded-xl text-xs flex items-center space-x-2 ${
                profileMsg.type === 'success'
                  ? 'bg-gold/15 border border-gold/40 text-gold'
                  : 'bg-red-500/20 border border-red-500 text-red-300'
              }`}
            >
              {profileMsg.type === 'success' ? (
                <Check className="w-4 h-4 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
              )}
              <span>{profileMsg.text}</span>
            </div>
          )}

          <form onSubmit={handleProfileSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-gray-300 uppercase tracking-wider mb-1.5 font-semibold">
                Admin Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-black/60 border border-white/10 text-white focus:border-gold outline-none"
                />
                <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div>
              <label className="block text-gray-300 uppercase tracking-wider mb-1.5 font-semibold">
                Admin Login Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-black/60 border border-white/10 text-white focus:border-gold outline-none"
                />
                <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={profileLoading}
                className="w-full py-3.5 rounded-xl bg-gold-gradient text-black font-bold uppercase tracking-wider text-xs shadow-gold-sm hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
              >
                {profileLoading ? 'Saving Profile...' : 'Update Admin Details'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
