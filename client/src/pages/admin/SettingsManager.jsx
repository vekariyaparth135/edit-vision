import React, { useState, useEffect } from 'react';
import {
  Settings,
  Save,
  Upload,
  Link,
  Check,
  RefreshCw,
  User,
  Image as ImageIcon,
  AlertCircle,
  Eye,
} from 'lucide-react';
import { settingsApi } from '../../services/api';
import { useSettings } from '../../context/SettingsContext';
import LoadingSpinner from '../../components/LoadingSpinner';

export default function SettingsManager() {
  const { refreshSettings } = useSettings();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [activeTab, setActiveTab] = useState('brand');

  const [formData, setFormData] = useState({
    brandName: '',
    tagline: '',
    ownerName: '',
    ownerTitle: '',
    contactNumber: '',
    whatsappNumber: '',
    contactEmail: '',
    address: '',
    logoUrl: '',
    heroShowreelUrl: '',
    heroPoster: '',
    heroSubtitle: '',
    bioHeading: '',
    bioText: '',
    bioPhoto: '',
    statsProjectsCompleted: 150,
    statsHappyClients: 60,
    statsExperienceYears: 5,
    beforeAfterTitle: '',
    beforeAfterRaw: '',
    beforeAfterEdited: '',
    seoTitle: '',
    seoDescription: '',
    seoKeywords: '',
    socialLinks: {
      instagram: '',
      youtube: '',
      linkedin: '',
      behance: '',
    },
  });

  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState('');

  const [faviconFile, setFaviconFile] = useState(null);

  const [bioPhotoFile, setBioPhotoFile] = useState(null);
  const [bioPhotoPreview, setBioPhotoPreview] = useState('');

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const res = await settingsApi.get();
      if (res.data.success && res.data.data) {
        const d = res.data.data;
        setFormData((prev) => ({
          ...prev,
          ...d,
          socialLinks: { ...prev.socialLinks, ...(d.socialLinks || {}) },
        }));
        if (d.bioPhoto) setBioPhotoPreview(d.bioPhoto);
        if (d.logoUrl) setLogoPreview(d.logoUrl);
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Failed to load website settings.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handlePhotoFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBioPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setBioPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogoFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setSaving(true);
    setSuccessMsg('');
    setErrorMsg('');

    try {
      const data = new FormData();
      const excludedKeys = ['_id', '__v', 'createdAt', 'updatedAt'];

      Object.keys(formData).forEach((key) => {
        if (excludedKeys.includes(key)) return;

        const val = formData[key];
        if (val === null || val === undefined) return;

        if (typeof val === 'object') {
          data.append(key, JSON.stringify(val));
        } else {
          data.append(key, val);
        }
      });

      if (logoFile) data.append('logo', logoFile);
      if (faviconFile) data.append('favicon', faviconFile);
      if (bioPhotoFile) data.append('bioPhoto', bioPhotoFile);

      const res = await settingsApi.update(data);
      if (res.data.success) {
        setSuccessMsg('Settings and Profile Photo saved successfully!');
        if (res.data.data?.bioPhoto) {
          setBioPhotoPreview(res.data.data.bioPhoto);
        }
        if (res.data.data?.logoUrl) {
          setLogoPreview(res.data.data.logoUrl);
        }
        await refreshSettings();
        setTimeout(() => setSuccessMsg(''), 4500);
      }
    } catch (err) {
      console.error('Settings save error:', err);
      setErrorMsg(
        err.response?.data?.message || 'Failed to save settings. Please verify inputs and try again.'
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading Settings..." />;
  }

  const tabs = [
    { id: 'brand', label: 'Brand & Raj Vekariya Profile' },
    { id: 'hero', label: 'Hero & Showreel' },
    { id: 'about', label: 'About & Bio Details' },
    { id: 'beforeAfter', label: 'Color Grade Demo' },
    { id: 'seo', label: 'SEO & Socials' },
  ];

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header with Save Button */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <h1 className="font-serif text-3xl font-bold text-white">Website & Brand Settings</h1>
          <p className="text-xs text-gray-400 mt-1">
            Update Raj Vekariya's profile photo, brand details, showreel video, and contact numbers.
          </p>
        </div>

        <button
          onClick={handleSubmit}
          disabled={saving}
          type="button"
          className="flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-gold-gradient text-black font-bold text-xs uppercase tracking-wider shadow-gold-sm hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? 'Saving...' : 'Save All Settings'}</span>
        </button>
      </div>

      {/* Notifications */}
      {successMsg && (
        <div className="p-4 rounded-xl bg-gold/15 border border-gold/40 text-gold text-xs flex items-center space-x-2 animate-fadeIn">
          <Check className="w-4 h-4 flex-shrink-0 text-gold" />
          <span className="font-medium">{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 rounded-xl bg-red-500/20 border border-red-500 text-red-300 text-xs flex items-center space-x-2 animate-fadeIn">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex border-b border-white/10 gap-2 overflow-x-auto pb-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            type="button"
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
              activeTab === tab.id
                ? 'bg-gold text-black font-bold shadow-gold-sm'
                : 'text-gray-400 hover:text-white bg-dark-card'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 bg-dark-card p-6 sm:p-8 rounded-2xl border border-white/5">
        {/* TAB 1: BRAND & OWNER PHOTO */}
        {activeTab === 'brand' && (
          <div className="space-y-6 text-xs">
            {/* 📸 SPECIAL SECTION: VEKARIYA RAJ PHOTO CHANGER */}
            <div className="p-6 rounded-2xl bg-black/60 border border-gold/40 shadow-lg">
              <div className="flex items-center space-x-2 mb-4">
                <User className="w-4 h-4 text-gold" />
                <h3 className="font-serif text-lg font-bold text-white">
                  Vekariya Raj — Owner Profile Photo
                </h3>
              </div>

              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                {/* Photo Preview in Luxury Gold Ring */}
                <div className="flex flex-col items-center flex-shrink-0">
                  <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-2xl overflow-hidden p-1 bg-gradient-to-tr from-gold via-gold-light to-gold shadow-gold-md">
                    <img
                      src={bioPhotoPreview || formData.bioPhoto || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80'}
                      alt="Vekariya Raj"
                      className="w-full h-full object-cover rounded-xl bg-black"
                    />
                  </div>
                  <span className="text-[10px] text-gold uppercase tracking-wider font-semibold mt-2">
                    Active Photo
                  </span>
                </div>

                {/* Upload or URL Controls */}
                <div className="flex-1 space-y-3 w-full">
                  <div>
                    <label className="block text-gray-300 font-semibold mb-1">
                      Option 1: Upload Photo from Computer (JPG, PNG, WebP)
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoFileChange}
                      className="w-full text-xs text-gray-400 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-gold-gradient file:text-black cursor-pointer bg-dark/60 p-1.5 rounded-xl border border-white/10"
                    />
                    {bioPhotoFile && (
                      <p className="text-[11px] text-gold mt-1">
                        Ready to upload: {bioPhotoFile.name}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-gray-300 font-semibold mb-1">
                      Option 2: Or Paste Photo Image URL
                    </label>
                    <input
                      type="url"
                      placeholder="https://images.unsplash.com/..."
                      value={formData.bioPhoto}
                      onChange={(e) => {
                        setFormData({ ...formData, bioPhoto: e.target.value });
                        setBioPhotoPreview(e.target.value);
                      }}
                      className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/10 text-white focus:border-gold outline-none text-xs"
                    />
                  </div>
                  <p className="text-[11px] text-gray-400">
                    This photo appears on the public website (About Vekariya Raj section) and in the Admin portal profile.
                  </p>
                </div>
              </div>
            </div>

            {/* Brand Logo Section */}
            <div className="p-6 rounded-2xl bg-black/40 border border-white/5 space-y-4">
              <div className="flex items-center space-x-2">
                <ImageIcon className="w-4 h-4 text-gold" />
                <h3 className="font-serif text-base font-bold text-white">Brand Logo</h3>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-6">
                <div className="w-20 h-20 rounded-full overflow-hidden p-1 bg-gradient-to-tr from-gold to-gold-light shadow-gold-sm flex-shrink-0">
                  <img
                    src={logoPreview || formData.logoUrl || '/Logo.png'}
                    alt="Logo Preview"
                    className="w-full h-full object-cover rounded-full bg-black"
                  />
                </div>
                <div className="flex-1 w-full space-y-2">
                  <label className="block text-gray-300">
                    Replace Brand Logo (Lotus / Custom Logo)
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoFileChange}
                    className="w-full text-xs text-gray-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-gold file:text-black cursor-pointer"
                  />
                  <input
                    type="text"
                    placeholder="Or enter logo URL (e.g. /Logo.png)"
                    value={formData.logoUrl}
                    onChange={(e) => {
                      setFormData({ ...formData, logoUrl: e.target.value });
                      setLogoPreview(e.target.value);
                    }}
                    className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/10 text-white focus:border-gold outline-none text-xs"
                  />
                </div>
              </div>
            </div>

            {/* Basic Brand Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-300 uppercase tracking-wider mb-1">
                  Brand Name
                </label>
                <input
                  type="text"
                  value={formData.brandName}
                  onChange={(e) => setFormData({ ...formData, brandName: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl bg-black/60 border border-white/10 text-white focus:border-gold outline-none"
                />
              </div>

              <div>
                <label className="block text-gray-300 uppercase tracking-wider mb-1">
                  Tagline
                </label>
                <input
                  type="text"
                  value={formData.tagline}
                  onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl bg-black/60 border border-white/10 text-white focus:border-gold outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-300 uppercase tracking-wider mb-1">
                  Owner Name
                </label>
                <input
                  type="text"
                  value={formData.ownerName}
                  onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl bg-black/60 border border-white/10 text-white focus:border-gold outline-none"
                />
              </div>

              <div>
                <label className="block text-gray-300 uppercase tracking-wider mb-1">
                  Professional Title
                </label>
                <input
                  type="text"
                  value={formData.ownerTitle}
                  onChange={(e) => setFormData({ ...formData, ownerTitle: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl bg-black/60 border border-white/10 text-white focus:border-gold outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div>
                <label className="block text-gray-300 uppercase tracking-wider mb-1">
                  Contact Number (Direct Call)
                </label>
                <input
                  type="text"
                  value={formData.contactNumber}
                  onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl bg-black/60 border border-white/10 text-white focus:border-gold outline-none"
                />
              </div>

              <div>
                <label className="block text-gray-300 uppercase tracking-wider mb-1">
                  WhatsApp Number
                </label>
                <input
                  type="text"
                  value={formData.whatsappNumber}
                  onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl bg-black/60 border border-white/10 text-white focus:border-gold outline-none"
                />
              </div>

              <div>
                <label className="block text-gray-300 uppercase tracking-wider mb-1">
                  Contact Email
                </label>
                <input
                  type="email"
                  value={formData.contactEmail}
                  onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl bg-black/60 border border-white/10 text-white focus:border-gold outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-300 uppercase tracking-wider mb-1">
                Location / City
              </label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl bg-black/60 border border-white/10 text-white focus:border-gold outline-none"
              />
            </div>
          </div>
        )}

        {/* TAB 2: HERO & SHOWREEL */}
        {activeTab === 'hero' && (
          <div className="space-y-4 text-xs">
            <h3 className="font-serif text-lg font-bold text-white mb-2">Hero Video & Showreel</h3>

            <div>
              <label className="block text-gray-300 uppercase tracking-wider mb-1">
                Hero Background Video / Showreel URL (Direct MP4 or Stream link)
              </label>
              <input
                type="text"
                value={formData.heroShowreelUrl}
                onChange={(e) => setFormData({ ...formData, heroShowreelUrl: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl bg-black/60 border border-white/10 text-white focus:border-gold outline-none"
              />
            </div>

            <div>
              <label className="block text-gray-300 uppercase tracking-wider mb-1">
                Hero Poster / Fallback Image URL
              </label>
              <input
                type="text"
                value={formData.heroPoster}
                onChange={(e) => setFormData({ ...formData, heroPoster: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl bg-black/60 border border-white/10 text-white focus:border-gold outline-none"
              />
            </div>

            <div>
              <label className="block text-gray-300 uppercase tracking-wider mb-1">
                Hero Subtitle Text
              </label>
              <textarea
                rows="3"
                value={formData.heroSubtitle}
                onChange={(e) => setFormData({ ...formData, heroSubtitle: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl bg-black/60 border border-white/10 text-white focus:border-gold outline-none"
              />
            </div>
          </div>
        )}

        {/* TAB 3: ABOUT & BIO DETAILS */}
        {activeTab === 'about' && (
          <div className="space-y-4 text-xs">
            <h3 className="font-serif text-lg font-bold text-white mb-2">About Vekariya Raj</h3>

            <div>
              <label className="block text-gray-300 uppercase tracking-wider mb-1">
                About Heading
              </label>
              <input
                type="text"
                value={formData.bioHeading}
                onChange={(e) => setFormData({ ...formData, bioHeading: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl bg-black/60 border border-white/10 text-white focus:border-gold outline-none"
              />
            </div>

            <div>
              <label className="block text-gray-300 uppercase tracking-wider mb-1">
                Biography & Story
              </label>
              <textarea
                rows="5"
                value={formData.bioText}
                onChange={(e) => setFormData({ ...formData, bioText: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl bg-black/60 border border-white/10 text-white focus:border-gold outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div>
                <label className="block text-gray-300 uppercase tracking-wider mb-1">
                  Projects Completed Counter
                </label>
                <input
                  type="number"
                  value={formData.statsProjectsCompleted}
                  onChange={(e) => setFormData({ ...formData, statsProjectsCompleted: Number(e.target.value) })}
                  className="w-full px-3 py-2.5 rounded-xl bg-black/60 border border-white/10 text-white focus:border-gold outline-none"
                />
              </div>

              <div>
                <label className="block text-gray-300 uppercase tracking-wider mb-1">
                  Happy Clients Counter
                </label>
                <input
                  type="number"
                  value={formData.statsHappyClients}
                  onChange={(e) => setFormData({ ...formData, statsHappyClients: Number(e.target.value) })}
                  className="w-full px-3 py-2.5 rounded-xl bg-black/60 border border-white/10 text-white focus:border-gold outline-none"
                />
              </div>

              <div>
                <label className="block text-gray-300 uppercase tracking-wider mb-1">
                  Years Experience Counter
                </label>
                <input
                  type="number"
                  value={formData.statsExperienceYears}
                  onChange={(e) => setFormData({ ...formData, statsExperienceYears: Number(e.target.value) })}
                  className="w-full px-3 py-2.5 rounded-xl bg-black/60 border border-white/10 text-white focus:border-gold outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: BEFORE / AFTER COLOR GRADE */}
        {activeTab === 'beforeAfter' && (
          <div className="space-y-4 text-xs">
            <h3 className="font-serif text-lg font-bold text-white mb-2">Before vs After Comparison</h3>

            <div>
              <label className="block text-gray-300 uppercase tracking-wider mb-1">
                Section Title
              </label>
              <input
                type="text"
                value={formData.beforeAfterTitle}
                onChange={(e) => setFormData({ ...formData, beforeAfterTitle: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl bg-black/60 border border-white/10 text-white focus:border-gold outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-300 uppercase tracking-wider mb-1">
                  Raw / Flat LOG Image URL
                </label>
                <input
                  type="text"
                  value={formData.beforeAfterRaw}
                  onChange={(e) => setFormData({ ...formData, beforeAfterRaw: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl bg-black/60 border border-white/10 text-white focus:border-gold outline-none"
                />
              </div>

              <div>
                <label className="block text-gray-300 uppercase tracking-wider mb-1">
                  Color Graded Master Image URL
                </label>
                <input
                  type="text"
                  value={formData.beforeAfterEdited}
                  onChange={(e) => setFormData({ ...formData, beforeAfterEdited: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl bg-black/60 border border-white/10 text-white focus:border-gold outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: SEO & SOCIALS */}
        {activeTab === 'seo' && (
          <div className="space-y-4 text-xs">
            <h3 className="font-serif text-lg font-bold text-white mb-2">SEO & Social Channels</h3>

            <div>
              <label className="block text-gray-300 uppercase tracking-wider mb-1">
                SEO Meta Title
              </label>
              <input
                type="text"
                value={formData.seoTitle}
                onChange={(e) => setFormData({ ...formData, seoTitle: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl bg-black/60 border border-white/10 text-white focus:border-gold outline-none"
              />
            </div>

            <div>
              <label className="block text-gray-300 uppercase tracking-wider mb-1">
                SEO Meta Description
              </label>
              <textarea
                rows="2"
                value={formData.seoDescription}
                onChange={(e) => setFormData({ ...formData, seoDescription: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl bg-black/60 border border-white/10 text-white focus:border-gold outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-gray-300 uppercase tracking-wider mb-1">
                  Instagram Profile URL
                </label>
                <input
                  type="text"
                  value={formData.socialLinks?.instagram || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      socialLinks: { ...formData.socialLinks, instagram: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2.5 rounded-xl bg-black/60 border border-white/10 text-white focus:border-gold outline-none"
                />
              </div>

              <div>
                <label className="block text-gray-300 uppercase tracking-wider mb-1">
                  YouTube Channel URL
                </label>
                <input
                  type="text"
                  value={formData.socialLinks?.youtube || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      socialLinks: { ...formData.socialLinks, youtube: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2.5 rounded-xl bg-black/60 border border-white/10 text-white focus:border-gold outline-none"
                />
              </div>

              <div>
                <label className="block text-gray-300 uppercase tracking-wider mb-1">
                  LinkedIn Profile URL
                </label>
                <input
                  type="text"
                  value={formData.socialLinks?.linkedin || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      socialLinks: { ...formData.socialLinks, linkedin: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2.5 rounded-xl bg-black/60 border border-white/10 text-white focus:border-gold outline-none"
                />
              </div>

              <div>
                <label className="block text-gray-300 uppercase tracking-wider mb-1">
                  Behance Portfolio URL
                </label>
                <input
                  type="text"
                  value={formData.socialLinks?.behance || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      socialLinks: { ...formData.socialLinks, behance: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2.5 rounded-xl bg-black/60 border border-white/10 text-white focus:border-gold outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* Form Bottom Save Button */}
        <div className="pt-6 border-t border-white/10 flex items-center justify-between">
          <p className="text-[11px] text-gray-400">
            Changes apply instantly across the live portfolio.
          </p>

          <button
            type="submit"
            disabled={saving}
            className="flex items-center space-x-2 px-8 py-3 rounded-xl bg-gold-gradient text-black font-bold text-xs uppercase tracking-wider shadow-gold-sm hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving...' : 'Save All Settings'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
