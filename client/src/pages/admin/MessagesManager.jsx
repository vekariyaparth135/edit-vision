import React, { useState, useEffect } from 'react';
import {
  MessageSquare,
  Phone,
  Mail,
  Trash2,
  CheckCircle2,
  Clock,
  ExternalLink,
  MessageCircle,
  Download,
} from 'lucide-react';
import { messagesApi } from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';

export default function MessagesManager() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const res = await messagesApi.getAllAdmin({ status: filter });
      if (res.data.success) {
        setMessages(res.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [filter]);

  const toggleStatus = async (id, currentStatus) => {
    const nextStatus = currentStatus === 'unread' ? 'read' : 'unread';
    try {
      await messagesApi.updateStatus(id, { status: nextStatus });
      await fetchMessages();
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this inquiry message?')) return;
    try {
      await messagesApi.delete(id);
      await fetchMessages();
    } catch (err) {
      alert('Failed to delete message');
    }
  };

  const handleExportCSV = () => {
    if (!messages.length) {
      alert('No inquiries to export');
      return;
    }

    const headers = ['Name', 'Phone', 'Email', 'Service', 'Message', 'Status', 'Date'];
    const rows = messages.map((m) => [
      `"${m.name.replace(/"/g, '""')}"`,
      `"${m.phone || ''}"`,
      `"${m.email || ''}"`,
      `"${m.service || ''}"`,
      `"${(m.message || '').replace(/"/g, '""').replace(/\n/g, ' ')}"`,
      `"${m.status || ''}"`,
      `"${new Date(m.createdAt).toLocaleDateString()}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `edit-vision-inquiries-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-white">Client Inquiries Inbox</h1>
          <p className="text-xs text-gray-400 mt-1">
            Review contact form submissions, call leads, and reply via WhatsApp.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          {/* Export to CSV Button */}
          <button
            onClick={handleExportCSV}
            title="Download Inquiries as CSV spreadsheet"
            className="flex items-center space-x-1.5 px-3 py-2 rounded-xl border border-gold/40 text-gold hover:bg-gold hover:text-black transition-all text-xs font-semibold"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>

          {/* Filter Tabs */}
          <div className="flex items-center space-x-2 bg-dark-card p-1 rounded-xl border border-white/5">
            {['all', 'unread', 'read'].map((st) => (
              <button
                key={st}
                onClick={() => setFilter(st)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-colors ${
                  filter === st ? 'bg-gold text-black font-bold' : 'text-gray-400 hover:text-white'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>
      </div>

      {loading ? (
        <LoadingSpinner text="Fetching Inbox..." />
      ) : messages.length === 0 ? (
        <div className="text-center py-16 bg-dark-card rounded-2xl border border-white/5">
          <MessageSquare className="w-12 h-12 text-gold/30 mx-auto mb-3" />
          <p className="text-gray-400 text-sm">No messages found in this filter.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {messages.map((msg) => (
            <div
              key={msg._id}
              className={`p-6 rounded-2xl bg-dark-card border transition-all ${
                msg.status === 'unread'
                  ? 'border-gold/50 shadow-gold-sm bg-dark-card/90'
                  : 'border-white/5'
              }`}
            >
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-white/5">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center text-gold font-bold font-serif text-lg">
                    {msg.name[0]?.toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="font-bold text-white text-base">{msg.name}</h3>
                      {msg.status === 'unread' && (
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-gold text-black">
                          New Unread
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-gold font-medium">{msg.service}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-2 text-xs text-gray-400">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{new Date(msg.createdAt).toLocaleDateString()} at {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              </div>

              {/* Message Body */}
              <div className="py-4 text-xs sm:text-sm text-gray-200 leading-relaxed font-light">
                {msg.message}
              </div>

              {/* Contact Details & Quick Reply Actions */}
              <div className="pt-4 border-t border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-4 text-xs text-gray-400">
                  <a
                    href={`tel:${msg.phone}`}
                    className="flex items-center space-x-1.5 text-white hover:text-gold font-mono"
                  >
                    <Phone className="w-3.5 h-3.5 text-gold" />
                    <span>+91 {msg.phone}</span>
                  </a>

                  {msg.email && (
                    <a
                      href={`mailto:${msg.email}`}
                      className="flex items-center space-x-1.5 hover:text-gold"
                    >
                      <Mail className="w-3.5 h-3.5 text-gold" />
                      <span>{msg.email}</span>
                    </a>
                  )}

                  {msg.budget && (
                    <span className="text-gold font-semibold">Budget: {msg.budget}</span>
                  )}
                </div>

                <div className="flex items-center space-x-3 w-full sm:w-auto justify-end">
                  {/* WhatsApp Quick Reply */}
                  <a
                    href={`https://wa.me/91${msg.phone}?text=${encodeURIComponent(
                      `Hi ${msg.name}, thank you for reaching out to Edit Vision regarding "${msg.service}". Let's discuss your project requirements!`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-gold hover:bg-gold-light text-black text-xs font-bold transition-colors shadow-gold-sm"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>Reply on WhatsApp</span>
                  </a>

                  {/* Toggle Read */}
                  <button
                    onClick={() => toggleStatus(msg._id, msg.status)}
                    className="px-3 py-1.5 rounded-lg border border-white/10 hover:border-gold text-xs text-gray-300 hover:text-white transition-colors"
                  >
                    {msg.status === 'unread' ? 'Mark Read' : 'Mark Unread'}
                  </button>

                  {/* Delete */}
                  <button
                    onClick={() => handleDelete(msg._id)}
                    className="p-1.5 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
                    title="Delete Message"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

