import React, { useState, useEffect } from 'react';
import { Briefcase, Plus, Edit2, Trash2, CheckCircle, X, Clock } from 'lucide-react';
import { servicesApi } from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';

export default function ServicesManager() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingService, setEditingService] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    icon: 'Film',
    startingPrice: '₹1,999',
    features: '',
    turnaround: '24-48 Hours',
    popular: false,
    order: 0,
  });

  const fetchServices = async () => {
    try {
      setLoading(true);
      const res = await servicesApi.getAllAdmin();
      if (res.data.success) {
        setServices(res.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const openAdd = () => {
    setEditingService(null);
    setFormData({
      title: '',
      description: '',
      icon: 'Film',
      startingPrice: '₹1,999',
      features: '4K Ultra HD Export\nColor Grading Included\n2 Revisions',
      turnaround: '24-48 Hours',
      popular: false,
      order: services.length,
    });
    setShowModal(true);
  };

  const openEdit = (srv) => {
    setEditingService(srv);
    setFormData({
      title: srv.title,
      description: srv.description,
      icon: srv.icon || 'Film',
      startingPrice: srv.startingPrice,
      features: Array.isArray(srv.features) ? srv.features.join('\n') : '',
      turnaround: srv.turnaround || '24-48 Hours',
      popular: srv.popular,
      order: srv.order || 0,
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        features: formData.features
          .split('\n')
          .map((f) => f.trim())
          .filter(Boolean),
      };

      if (editingService) {
        await servicesApi.update(editingService._id, payload);
      } else {
        await servicesApi.create(payload);
      }

      setShowModal(false);
      setEditingService(null);
      await fetchServices();
    } catch (err) {
      alert('Error saving service.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this service package?')) return;
    try {
      await servicesApi.delete(id);
      await fetchServices();
    } catch (err) {
      alert('Error deleting service.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-white">Services & Pricing Manager</h1>
          <p className="text-xs text-gray-400 mt-1">
            Configure editing offerings, starting rates, deliverables, and features.
          </p>
        </div>

        <button
          onClick={openAdd}
          className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-gold-gradient text-black font-bold text-xs uppercase tracking-wider shadow-gold-sm hover:scale-105 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Service</span>
        </button>
      </div>

      {loading ? (
        <LoadingSpinner text="Loading Services..." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((srv) => (
            <div
              key={srv._id}
              className={`p-6 rounded-2xl bg-dark-card border transition-all flex flex-col justify-between ${
                srv.popular ? 'border-gold shadow-gold-sm' : 'border-white/5'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-gold">
                    {srv.icon}
                  </span>
                  {srv.popular && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-gold text-black">
                      Popular
                    </span>
                  )}
                </div>

                <h3 className="font-serif text-xl font-bold text-white mb-1">{srv.title}</h3>
                <p className="text-xs text-gray-400 mb-4">{srv.description}</p>

                <div className="font-serif text-2xl font-bold text-gold mb-1">
                  {srv.startingPrice}
                </div>
                <div className="text-[11px] text-gray-400 flex items-center space-x-1 mb-4">
                  <Clock className="w-3.5 h-3.5 text-gold" />
                  <span>Turnaround: {srv.turnaround}</span>
                </div>

                <ul className="space-y-1.5 text-xs text-gray-300 border-t border-white/5 pt-3 mb-6">
                  {srv.features?.map((f, i) => (
                    <li key={i} className="flex items-center space-x-2">
                      <CheckCircle className="w-3.5 h-3.5 text-gold flex-shrink-0" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-4 border-t border-white/5">
                <button
                  onClick={() => openEdit(srv)}
                  className="p-2 rounded-lg text-gray-300 hover:text-gold hover:bg-gold/10 transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(srv._id)}
                  className="p-2 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
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
          <div className="relative w-full max-w-lg bg-dark-card border border-gold/40 rounded-2xl p-6 sm:p-8 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
              <h3 className="font-serif text-xl font-bold text-white">
                {editingService ? 'Edit Service' : 'Add New Service'}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-gray-300 uppercase tracking-wider mb-1">
                  Service Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/10 text-white focus:border-gold outline-none"
                />
              </div>

              <div>
                <label className="block text-gray-300 uppercase tracking-wider mb-1">
                  Description *
                </label>
                <textarea
                  required
                  rows="2"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/10 text-white focus:border-gold outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 uppercase tracking-wider mb-1">
                    Starting Price *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. ₹2,999"
                    value={formData.startingPrice}
                    onChange={(e) => setFormData({ ...formData, startingPrice: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/10 text-white focus:border-gold outline-none"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 uppercase tracking-wider mb-1">
                    Turnaround Time
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 24 - 48 Hours"
                    value={formData.turnaround}
                    onChange={(e) => setFormData({ ...formData, turnaround: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/10 text-white focus:border-gold outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-300 uppercase tracking-wider mb-1">
                  Features Checklist (one per line)
                </label>
                <textarea
                  rows="4"
                  placeholder="4K Ultra HD Export&#10;Full Color Grade&#10;Audio Mastering"
                  value={formData.features}
                  onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/10 text-white focus:border-gold outline-none"
                />
              </div>

              <div className="flex items-center space-x-3 pt-2">
                <input
                  type="checkbox"
                  id="popCheck"
                  checked={formData.popular}
                  onChange={(e) => setFormData({ ...formData, popular: e.target.checked })}
                  className="w-4 h-4 rounded accent-gold"
                />
                <label htmlFor="popCheck" className="text-gray-300 cursor-pointer">
                  Mark as "Most Popular"
                </label>
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-white/10">
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
                  Save Service
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

