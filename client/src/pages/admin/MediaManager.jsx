import React, { useState, useEffect } from 'react';
import {
  Film,
  Image as ImageIcon,
  Plus,
  Trash2,
  Edit2,
  Eye,
  EyeOff,
  MoveUp,
  MoveDown,
  Upload,
  Link as LinkIcon,
  Check,
  X,
  Search,
  AlertTriangle,
} from 'lucide-react';
import { mediaApi } from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';

export default function MediaManager() {
  const [mediaList, setMediaList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterCategory, setFilterCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [deletingItem, setDeletingItem] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'video',
    category: 'Reels',
    videoSource: 'upload',
    url: '',
    clientName: '',
    duration: '',
    featured: false,
    order: 0,
  });
  const [mediaFile, setMediaFile] = useState(null);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState('');

  const categories = ['All', 'Wedding', 'Reels', 'YouTube', 'Ads', 'Corporate', 'Photos', 'Color Grading'];

  const fetchMedia = async () => {
    try {
      setLoading(true);
      const res = await mediaApi.getAllAdmin();
      if (res.data.success) {
        setMediaList(res.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch admin media:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  const openAddModal = () => {
    setFormData({
      title: '',
      description: '',
      type: 'video',
      category: 'Reels',
      videoSource: 'upload',
      url: '',
      clientName: '',
      duration: '',
      featured: false,
      order: mediaList.length,
    });
    setMediaFile(null);
    setThumbnailFile(null);
    setFormError('');
    setShowAddModal(true);
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      description: item.description || '',
      type: item.type,
      category: item.category,
      videoSource: item.videoSource || 'upload',
      url: item.url,
      clientName: item.clientName || '',
      duration: item.duration || '',
      featured: item.featured,
      order: item.order || 0,
    });
    setMediaFile(null);
    setThumbnailFile(null);
    setFormError('');
  };

  const handleSaveMedia = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError('');

    try {
      const data = new FormData();
      data.append('title', formData.title);
      data.append('description', formData.description);
      data.append('type', formData.type);
      data.append('category', formData.category);
      data.append('videoSource', formData.videoSource);
      data.append('url', formData.url);
      data.append('clientName', formData.clientName);
      data.append('duration', formData.duration);
      data.append('featured', formData.featured);
      data.append('order', formData.order);

      if (mediaFile) {
        data.append('media', mediaFile);
      }
      if (thumbnailFile) {
        data.append('thumbnail', thumbnailFile);
      }

      if (editingItem) {
        await mediaApi.update(editingItem._id, data);
      } else {
        await mediaApi.create(data);
      }

      setShowAddModal(false);
      setEditingItem(null);
      await fetchMedia();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to save media item.');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingItem) return;
    try {
      await mediaApi.delete(deletingItem._id);
      setDeletingItem(null);
      await fetchMedia();
    } catch (err) {
      alert('Failed to delete media item.');
    }
  };

  const handleTogglePublish = async (id) => {
    try {
      await mediaApi.togglePublish(id);
      await fetchMedia();
    } catch (err) {
      alert('Failed to update publish state');
    }
  };

  const handleMoveOrder = async (index, direction) => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= mediaList.length) return;

    const updated = [...mediaList];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;

    const payload = updated.map((item, idx) => ({
      id: item._id,
      order: idx,
    }));

    setMediaList(updated);
    try {
      await mediaApi.reorder(payload);
    } catch (err) {
      console.error('Reorder error:', err);
    }
  };

  const filteredMedia = mediaList
    .filter((m) => filterCategory === 'All' || m.category === filterCategory)
    .filter((m) => m.title.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-white">Media Manager</h1>
          <p className="text-xs text-gray-400 mt-1">
            Upload videos, photos, manage categories, thumbnails, and portfolio ordering.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-gold-gradient text-black font-bold text-xs uppercase tracking-wider shadow-gold-sm hover:scale-105 active:scale-95 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Media</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-dark-card border border-white/5">
        {/* Category Pills */}
        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wider transition-colors ${filterCategory === cat
                  ? 'bg-gold text-black font-bold'
                  : 'bg-black/40 text-gray-400 hover:text-white'
                }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-64">
          <input
            type="text"
            placeholder="Search titles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-black/60 border border-white/10 text-xs text-white focus:border-gold outline-none"
          />
          <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      {/* Media Table / List */}
      {loading ? (
        <LoadingSpinner text="Loading Media..." />
      ) : filteredMedia.length === 0 ? (
        <div className="text-center py-16 bg-dark-card rounded-2xl border border-white/5">
          <Film className="w-12 h-12 text-gold/30 mx-auto mb-3" />
          <p className="text-gray-400 text-sm">No media items found. Click "Add New Media" to upload.</p>
        </div>
      ) : (
        <div className="bg-dark-card rounded-2xl border border-white/5 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-black/60 border-b border-white/10 text-gray-400 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3.5 px-4">Order</th>
                  <th className="py-3.5 px-4">Preview</th>
                  <th className="py-3.5 px-4">Title & Details</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Type</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredMedia.map((item, index) => (
                  <tr key={item._id} className="hover:bg-white/5 transition-colors">
                    {/* Reorder Buttons */}
                    <td className="py-3 px-4 font-mono text-gray-400">
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() => handleMoveOrder(index, 'up')}
                          disabled={index === 0}
                          className="p-1 text-gray-400 hover:text-gold disabled:opacity-30"
                          title="Move Up"
                        >
                          <MoveUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleMoveOrder(index, 'down')}
                          disabled={index === filteredMedia.length - 1}
                          className="p-1 text-gray-400 hover:text-gold disabled:opacity-30"
                          title="Move Down"
                        >
                          <MoveDown className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>

                    {/* Thumbnail */}
                    <td className="py-3 px-4">
                      <div className="w-14 h-10 rounded-lg overflow-hidden bg-black border border-white/10 flex-shrink-0">
                        <img
                          src={item.thumbnail || item.url}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </td>

                    {/* Title */}
                    <td className="py-3 px-4">
                      <div className="font-semibold text-white truncate max-w-xs">{item.title}</div>
                      {item.clientName && (
                        <div className="text-[10px] text-gray-400">Client: {item.clientName}</div>
                      )}
                      {item.featured && (
                        <span className="inline-block mt-0.5 text-[9px] font-bold text-gold uppercase">
                          ★ Featured
                        </span>
                      )}
                    </td>

                    {/* Category */}
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-black/60 border border-gold/30 text-gold">
                        {item.category}
                      </span>
                    </td>

                    {/* Type */}
                    <td className="py-3 px-4 uppercase text-[10px] text-gray-300">
                      {item.type}
                    </td>

                    {/* Status */}
                    <td className="py-3 px-4">
                      <button
                        onClick={() => handleTogglePublish(item._id)}
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase flex items-center space-x-1 ${item.published
                            ? 'bg-gold/15 text-gold border border-gold/30 hover:bg-gold/25'
                            : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                          }`}
                      >
                        {item.published ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                        <span>{item.published ? 'Published' : 'Hidden'}</span>
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => openEditModal(item)}
                          className="p-1.5 rounded-lg text-gray-300 hover:text-gold hover:bg-gold/10 transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeletingItem(item)}
                          className="p-1.5 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ADD / EDIT MODAL */}
      {(showAddModal || editingItem) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-xl max-h-[90vh] bg-dark-card border border-gold/40 rounded-2xl overflow-y-auto p-6 sm:p-8 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
              <h3 className="font-serif text-xl font-bold text-white">
                {editingItem ? 'Edit Media Item' : 'Add New Showcase Media'}
              </h3>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setEditingItem(null);
                }}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="mb-4 p-3 rounded-xl bg-red-500/20 border border-red-500 text-red-300 text-xs">
                {formError}
              </div>
            )}

            <form onSubmit={handleSaveMedia} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Royal Udaipur Wedding Film"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-white/10 text-xs text-white focus:border-gold outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-1">
                    Media Type
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-black/60 border border-white/10 text-xs text-white focus:border-gold outline-none"
                  >
                    <option value="video">Video</option>
                    <option value="photo">Photo / Still</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-1">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-black/60 border border-white/10 text-xs text-white focus:border-gold outline-none"
                  >
                    <option value="Wedding">Wedding</option>
                    <option value="Reels">Reels (9:16)</option>
                    <option value="YouTube">YouTube</option>
                    <option value="Ads">Ads / Commercial</option>
                    <option value="Corporate">Corporate</option>
                    <option value="Photos">Photos / Stills</option>
                    <option value="Color Grading">Color Grading</option>
                  </select>
                </div>
              </div>

              {/* URL or Upload option */}
              <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-3">
                <label className="block text-xs font-semibold uppercase tracking-wider text-gold">
                  Media Source
                </label>

                {/* Option 1: File Upload */}
                <div>
                  <label className="block text-[11px] text-gray-400 mb-1">
                    Upload File directly (Video or Image):
                  </label>
                  <input
                    type="file"
                    accept={formData.type === 'video' ? 'video/*' : 'image/*'}
                    onChange={(e) => setMediaFile(e.target.files[0])}
                    className="w-full text-xs text-gray-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-gold file:text-black cursor-pointer"
                  />
                  {mediaFile && (
                    <p className="text-[10px] text-gold mt-1">
                      Selected: {mediaFile.name} ({(mediaFile.size / (1024 * 1024)).toFixed(2)} MB)
                    </p>
                  )}
                </div>

                {/* Option 2: YouTube / Drive / MP4 URL */}
                <div>
                  <label className="block text-[11px] text-gray-400 mb-1">
                    Or Paste Video Link (YouTube, Drive, Vimeo, MP4 URL):
                  </label>
                  <div className="relative">
                    <input
                      type="url"
                      placeholder="https://www.youtube.com/watch?v=..."
                      value={formData.url}
                      onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                      className="w-full pl-9 pr-3 py-2 rounded-xl bg-black/60 border border-white/10 text-xs text-white focus:border-gold outline-none"
                    />
                    <LinkIcon className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  </div>
                </div>
              </div>

              {/* Custom Thumbnail Upload */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-1">
                  Custom Cover / Thumbnail (Optional)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setThumbnailFile(e.target.files[0])}
                  className="w-full text-xs text-gray-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-white/10 file:text-white cursor-pointer"
                />
                <p className="text-[10px] text-gray-500 mt-1">
                  For YouTube links, high-res thumbnail is auto-extracted if left empty.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-1">
                    Client Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Zara or Aarav Patel"
                    value={formData.clientName}
                    onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/10 text-xs text-white focus:border-gold outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-1">
                    Duration (e.g. 0:45)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 1:20"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/10 text-xs text-white focus:border-gold outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-1">
                  Description
                </label>
                <textarea
                  rows="2"
                  placeholder="Notes about color grading, LUT used, cameras..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/10 text-xs text-white focus:border-gold outline-none"
                />
              </div>

              <div className="flex items-center space-x-3 pt-2">
                <input
                  type="checkbox"
                  id="featuredCheck"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="w-4 h-4 rounded accent-gold"
                />
                <label htmlFor="featuredCheck" className="text-xs text-gray-300 cursor-pointer">
                  Feature this on Homepage & Hero highlights
                </label>
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingItem(null);
                  }}
                  className="px-4 py-2 rounded-xl text-xs text-gray-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  className="px-6 py-2.5 rounded-xl bg-gold-gradient text-black font-bold text-xs uppercase tracking-wider shadow-gold-sm hover:scale-105 transition-all disabled:opacity-50"
                >
                  {formLoading ? 'Saving...' : editingItem ? 'Save Changes' : 'Upload Media'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deletingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-md bg-dark-card border border-red-500/40 rounded-2xl p-6 shadow-2xl">
            <div className="flex items-center space-x-3 text-red-400 mb-4">
              <AlertTriangle className="w-6 h-6" />
              <h3 className="font-serif text-lg font-bold text-white">Delete Media Item</h3>
            </div>
            <p className="text-xs text-gray-300 leading-relaxed mb-6">
              Are you sure you want to delete <strong>"{deletingItem.title}"</strong>? This will permanently remove it from your portfolio.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setDeletingItem(null)}
                className="px-4 py-2 rounded-xl text-xs text-gray-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs uppercase tracking-wider transition-colors"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

