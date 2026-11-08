import React, { useState, useEffect } from 'react';
import { Star, Plus, Edit2, Trash2, X } from 'lucide-react';
import { testimonialsApi } from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';

export default function TestimonialsManager() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    clientName: '',
    clientRole: 'Content Creator',
    clientCompany: '',
    rating: 5,
    comment: '',
    projectTitle: '',
  });

  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      const res = await testimonialsApi.getAllAdmin();
      if (res.data.success) {
        setList(res.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const openAdd = () => {
    setEditing(null);
    setFormData({
      clientName: '',
      clientRole: 'Content Creator',
      clientCompany: '',
      rating: 5,
      comment: '',
      projectTitle: '',
    });
    setShowModal(true);
  };

  const openEdit = (item) => {
    setEditing(item);
    setFormData({
      clientName: item.clientName,
      clientRole: item.clientRole || '',
      clientCompany: item.clientCompany || '',
      rating: item.rating || 5,
      comment: item.comment,
      projectTitle: item.projectTitle || '',
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await testimonialsApi.update(editing._id, formData);
      } else {
        await testimonialsApi.create(formData);
      }
      setShowModal(false);
      setEditing(null);
      await fetchTestimonials();
    } catch (err) {
      alert('Failed to save testimonial.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this client testimonial?')) return;
    try {
      await testimonialsApi.delete(id);
      await fetchTestimonials();
    } catch (err) {
      alert('Failed to delete testimonial.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-white">Client Reviews & Testimonials</h1>
          <p className="text-xs text-gray-400 mt-1">
            Manage feedback, star ratings, and reviews from directors and creators.
          </p>
        </div>

        <button
          onClick={openAdd}
          className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-gold-gradient text-black font-bold text-xs uppercase tracking-wider shadow-gold-sm hover:scale-105 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add Testimonial</span>
        </button>
      </div>

      {loading ? (
        <LoadingSpinner text="Loading Reviews..." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {list.map((item) => (
            <div
              key={item._id}
              className="p-6 rounded-2xl bg-dark-card border border-white/5 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center space-x-1 text-gold mb-3">
                  {[...Array(item.rating || 5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-gold" />
                  ))}
                </div>

                <p className="text-xs text-gray-200 italic mb-4 leading-relaxed font-serif text-sm">
                  "{item.comment}"
                </p>

                <div className="flex items-center space-x-3 pt-3 border-t border-white/5">
                  <img
                    src={item.avatar}
                    alt={item.clientName}
                    className="w-10 h-10 rounded-full object-cover border border-gold"
                    onError={(e) => {
                      e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        item.clientName
                      )}&background=C9A24B&color=000`;
                    }}
                  />
                  <div>
                    <h4 className="text-xs font-bold text-white">{item.clientName}</h4>
                    <p className="text-[11px] text-gold">{item.clientRole}</p>
                    {item.clientCompany && (
                      <p className="text-[10px] text-gray-400">{item.clientCompany}</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-4 border-t border-white/5 mt-4">
                <button
                  onClick={() => openEdit(item)}
                  className="p-1.5 rounded-lg text-gray-300 hover:text-gold hover:bg-gold/10"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(item._id)}
                  className="p-1.5 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/10"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-md bg-dark-card border border-gold/40 rounded-2xl p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
              <h3 className="font-serif text-lg font-bold text-white">
                {editing ? 'Edit Testimonial' : 'New Testimonial'}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-gray-300 mb-1">Client Name *</label>
                <input
                  type="text"
                  required
                  value={formData.clientName}
                  onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/10 text-white focus:border-gold outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-300 mb-1">Role / Profession</label>
                  <input
                    type="text"
                    placeholder="e.g. Creator / Director"
                    value={formData.clientRole}
                    onChange={(e) => setFormData({ ...formData, clientRole: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/10 text-white focus:border-gold outline-none"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-1">Rating (1 - 5 Stars)</label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    value={formData.rating}
                    onChange={(e) => setFormData({ ...formData, rating: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/10 text-white focus:border-gold outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-300 mb-1">Company / Channel Name</label>
                <input
                  type="text"
                  placeholder="e.g. Patel Cinematics or 100K YT Creator"
                  value={formData.clientCompany}
                  onChange={(e) => setFormData({ ...formData, clientCompany: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/10 text-white focus:border-gold outline-none"
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-1">Feedback Quote *</label>
                <textarea
                  required
                  rows="3"
                  value={formData.comment}
                  onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/10 text-white focus:border-gold outline-none"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl text-gray-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gold-gradient text-black font-bold uppercase tracking-wider shadow-gold-sm"
                >
                  Save Testimonial
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

