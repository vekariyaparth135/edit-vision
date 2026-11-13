import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Film,
  Image as ImageIcon,
  MessageSquare,
  Users,
  TrendingUp,
  PlusCircle,
  Clock,
  Play,
  ArrowRight,
  Eye,
  Activity,
  ShieldCheck,
  RefreshCw,
  User,
  CheckCircle,
  AlertTriangle,
  Info,
} from 'lucide-react';
import { statsApi } from '../../services/api';
import { useSettings } from '../../context/SettingsContext';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../../components/LoadingSpinner';

export default function AdminDashboard() {
  const { user } = useAuth();
  const { settings } = useSettings();
  const [stats, setStats] = useState(null);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshingLogs, setRefreshingLogs] = useState(false);

  const fetchStatsAndLogs = async () => {
    try {
      const [dashRes, logsRes] = await Promise.all([
        statsApi.getDashboard(),
        statsApi.getLogs().catch(() => ({ data: { success: false } })),
      ]);

      if (dashRes.data.success) {
        setStats(dashRes.data.data);
      }
      if (logsRes.data?.success) {
        setLogs(logsRes.data.data);
      } else if (dashRes.data.data?.recentLogs) {
        setLogs(dashRes.data.data.recentLogs);
      }
    } catch (err) {
      console.error('Failed to load dashboard statistics', err);
    } finally {
      setLoading(false);
      setRefreshingLogs(false);
    }
  };

  useEffect(() => {
    fetchStatsAndLogs();
  }, []);

  const handleRefreshLogs = () => {
    setRefreshingLogs(true);
    fetchStatsAndLogs();
  };

  if (loading) {
    return <LoadingSpinner size="lg" text="Loading Analytics..." />;
  }

  const summary = stats?.summary || {
    totalVideos: 0,
    totalPhotos: 0,
    totalMedia: 0,
    totalMessages: 0,
    unreadMessages: 0,
    totalVisits: 0,
  };

  const visitsChart = stats?.visitsChart || [];
  const maxVisitCount = Math.max(...visitsChart.map((v) => v.visits), 10);

  return (
    <div className="space-y-8">
      {/* Top Banner & Quick Actions with Raj Vekariya Photo Card */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-6 border-b border-white/10">
        <div className="flex items-center space-x-4">
          {/* Raj Vekariya Photo with Quick Change Badge */}
          <div className="relative group">
            <div className="w-16 h-16 rounded-2xl overflow-hidden p-0.5 bg-gradient-to-tr from-gold via-gold-light to-gold shadow-gold-md">
              <img
                src={settings.bioPhoto || user?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80'}
                alt="Vekariya Raj"
                className="w-full h-full object-cover rounded-xl bg-black"
              />
            </div>
            <Link
              to="/admin/settings"
              className="absolute -bottom-1 -right-1 px-1.5 py-0.5 rounded-md bg-gold text-black text-[9px] font-bold uppercase tracking-wider shadow-sm group-hover:scale-105 transition-transform"
              title="Change your photo"
            >
              Edit
            </Link>
          </div>

          <div>
            <div className="flex items-center space-x-2">
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white">
                {settings.ownerName || 'Vekariya Raj'}
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-gold/20 text-gold border border-gold/40">
                Admin
              </span>
            </div>
            <p className="text-xs text-gray-400 mt-0.5">
              Edit Vision Management Console
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          <Link
            to="/admin/users"
            className="flex items-center space-x-2 px-4 py-2.5 rounded-xl border border-gold/40 text-gold hover:bg-gold/10 text-xs font-semibold transition-colors"
          >
            <Users className="w-4 h-4" />
            <span>Manage Users</span>
          </Link>
          <Link
            to="/admin/settings"
            className="flex items-center space-x-2 px-4 py-2.5 rounded-xl border border-white/10 text-gray-300 hover:border-gold/40 hover:text-white text-xs font-semibold transition-colors"
          >
            <User className="w-4 h-4 text-gold" />
            <span>Change Photo</span>
          </Link>
          <Link
            to="/admin/media"
            className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-gold-gradient text-black font-bold text-xs uppercase tracking-wider shadow-gold-sm hover:scale-105 transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Upload Media</span>
          </Link>
          <Link
            to="/admin/messages"
            className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-dark-card border border-white/10 text-white text-xs font-semibold hover:border-gold/40 transition-colors"
          >
            <MessageSquare className="w-4 h-4 text-gold" />
            <span>Inbox ({summary.unreadMessages})</span>
          </Link>
        </div>
      </div>

      {/* 4 Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="p-6 rounded-2xl bg-dark-card border border-white/5 hover:border-gold/40 transition-colors">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
              Total Videos
            </span>
            <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center text-gold">
              <Film className="w-5 h-5" />
            </div>
          </div>
          <div className="font-serif text-3xl font-bold text-white">{summary.totalVideos}</div>
          <p className="text-[11px] text-gray-400 mt-1">Reels, Weddings, YouTube & Ads</p>
        </div>

        <div className="p-6 rounded-2xl bg-dark-card border border-white/5 hover:border-gold/40 transition-colors">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
              Photos & Stills
            </span>
            <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center text-gold">
              <ImageIcon className="w-5 h-5" />
            </div>
          </div>
          <div className="font-serif text-3xl font-bold text-white">{summary.totalPhotos}</div>
          <p className="text-[11px] text-gray-400 mt-1">Graded frames & photography</p>
        </div>

        <div className="p-6 rounded-2xl bg-dark-card border border-white/5 hover:border-gold/40 transition-colors">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
              Client Enquiries
            </span>
            <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center text-gold relative">
              <MessageSquare className="w-5 h-5" />
              {summary.unreadMessages > 0 && (
                <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-red-500 animate-ping" />
              )}
            </div>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="font-serif text-3xl font-bold text-white">
              {summary.totalMessages}
            </span>
            {summary.unreadMessages > 0 && (
              <span className="text-xs font-bold text-amber-400">
                ({summary.unreadMessages} Unread)
              </span>
            )}
          </div>
          <p className="text-[11px] text-gray-400 mt-1">Contact form leads</p>
        </div>

        <div className="p-6 rounded-2xl bg-dark-card border border-white/5 hover:border-gold/40 transition-colors">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
              Total Page Visits
            </span>
            <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center text-gold">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="font-serif text-3xl font-bold text-white">{summary.totalVisits}</div>
          <p className="text-[11px] text-gold mt-1 flex items-center space-x-1">
            <span>&uarr; Portfolio visitor analytics</span>
          </p>
        </div>
      </div>

      {/* Analytics Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Visitor Traffic Bar Chart */}
        <div className="lg:col-span-8 p-6 rounded-2xl bg-dark-card border border-white/5 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-serif text-lg font-bold text-white">
                Visitor Traffic (Past 7 Days)
              </h3>
              <p className="text-xs text-gray-400">Daily unique portfolio impressions</p>
            </div>
            <span className="text-xs font-mono text-gold">Analytics Overview</span>
          </div>

          <div className="h-56 flex items-end justify-between gap-3 pt-6 border-b border-white/10 px-2">
            {visitsChart.map((item, index) => {
              const heightPercent = Math.max((item.visits / maxVisitCount) * 100, 6);
              return (
                <div key={index} className="flex-1 flex flex-col items-center group h-full justify-end">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-mono text-gold mb-1 bg-black/80 px-1.5 py-0.5 rounded">
                    {item.visits} visits
                  </div>
                  <div
                    className="w-full rounded-t-lg bg-gradient-to-t from-gold/40 to-gold group-hover:from-gold group-hover:to-gold-light transition-all duration-300"
                    style={{ height: `${heightPercent}%` }}
                  />
                  <span className="text-[11px] text-gray-400 font-medium mt-2">
                    {item.day}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="lg:col-span-4 p-6 rounded-2xl bg-dark-card border border-white/5 flex flex-col justify-between">
          <div>
            <h3 className="font-serif text-lg font-bold text-white mb-1">
              Category Distribution
            </h3>
            <p className="text-xs text-gray-400 mb-6">Media distribution by genre</p>

            <div className="space-y-4">
              {stats?.categoryChart?.map((cat, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-xs text-gray-300">
                    <span className="font-semibold">{cat.category}</span>
                    <span className="font-mono text-gold">{cat.count} items</span>
                  </div>
                  <div className="w-full h-2 bg-black/50 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gold-gradient rounded-full"
                      style={{
                        width: `${Math.min((cat.count / (summary.totalMedia || 1)) * 100, 100)}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Link
            to="/admin/media"
            className="mt-6 flex items-center justify-between text-xs text-gold font-semibold pt-4 border-t border-white/5 hover:underline"
          >
            <span>Manage All Portfolio Media</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Recent Uploads & Recent Messages Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Uploads */}
        <div className="p-6 rounded-2xl bg-dark-card border border-white/5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-serif text-lg font-bold text-white">Recent Media Uploads</h3>
            <Link to="/admin/media" className="text-xs text-gold hover:underline">
              View All
            </Link>
          </div>

          <div className="space-y-3">
            {stats?.recentMedia?.slice(0, 5).map((media) => (
              <div
                key={media._id}
                className="flex items-center justify-between p-3 rounded-xl bg-black/40 border border-white/5 hover:border-gold/30 transition-colors"
              >
                <div className="flex items-center space-x-3 overflow-hidden">
                  <div className="w-12 h-10 rounded-lg overflow-hidden bg-black flex-shrink-0">
                    <img
                      src={media.thumbnail || media.url}
                      alt={media.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="overflow-hidden">
                    <h4 className="text-xs font-semibold text-white truncate max-w-[200px]">
                      {media.title}
                    </h4>
                    <span className="text-[10px] text-gold uppercase">{media.category}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-2 text-xs">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-semibold ${media.published ? 'bg-gold/15 text-gold border border-gold/30' : 'bg-gray-800 text-gray-400'
                      }`}
                  >
                    {media.published ? 'Published' : 'Draft'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Client Messages */}
        <div className="p-6 rounded-2xl bg-dark-card border border-white/5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-serif text-lg font-bold text-white">Latest Inquiries</h3>
            <Link to="/admin/messages" className="text-xs text-gold hover:underline">
              Inbox
            </Link>
          </div>

          <div className="space-y-3">
            {stats?.recentMessages?.slice(0, 5).map((msg) => (
              <div
                key={msg._id}
                className="p-3 rounded-xl bg-black/40 border border-white/5 hover:border-gold/30 transition-colors flex items-center justify-between"
              >
                <div>
                  <div className="flex items-center space-x-2">
                    <h4 className="text-xs font-bold text-white">{msg.name}</h4>
                    {msg.status === 'unread' && (
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-500/20 text-amber-400">
                        NEW
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-gold font-mono">{msg.phone}</p>
                  <p className="text-[11px] text-gray-400 line-clamp-1 mt-0.5">{msg.message}</p>
                </div>

                <a
                  href={`https://wa.me/91${msg.phone}?text=${encodeURIComponent(
                    `Hi ${msg.name}, thank you for contacting Edit Vision regarding "${msg.service}". Let's discuss your project!`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-gold/15 hover:bg-gold text-gold hover:text-black text-xs font-semibold transition-colors flex-shrink-0"
                >
                  Reply
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 🛡️ SYSTEM & ACTIVITY AUDIT LOGS SECTION */}
      <div className="p-6 sm:p-8 rounded-2xl bg-dark-card border border-white/5 shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center space-x-2">
            <Activity className="w-5 h-5 text-gold" />
            <h3 className="font-serif text-lg font-bold text-white">System Activity & Audit Logs</h3>
          </div>

          <button
            onClick={handleRefreshLogs}
            disabled={refreshingLogs}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-white/10 hover:border-gold text-xs text-gray-300 hover:text-white transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshingLogs ? 'animate-spin text-gold' : ''}`} />
            <span>Refresh Logs</span>
          </button>
        </div>

        {logs.length === 0 ? (
          <div className="text-center py-8 text-gray-500 text-xs">
            No activity logs recorded yet. System events will appear here in real time.
          </div>
        ) : (
          <div className="divide-y divide-white/5 text-xs">
            {logs.map((log, idx) => (
              <div key={log._id || idx} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-start sm:items-center space-x-3">
                  {log.status === 'success' ? (
                    <CheckCircle className="w-4 h-4 text-gold flex-shrink-0 mt-0.5 sm:mt-0" />
                  ) : log.status === 'warning' ? (
                    <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5 sm:mt-0" />
                  ) : (
                    <Info className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5 sm:mt-0" />
                  )}

                  <div>
                    <span className="font-semibold text-white mr-2">{log.action}</span>
                    <span className="text-gray-400">{log.details}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-3 text-[11px] text-gray-500 sm:flex-shrink-0 pl-7 sm:pl-0">
                  <span className="text-gold font-medium">{log.user || 'Admin'}</span>
                  <span>&bull;</span>
                  <span className="font-mono">
                    {new Date(log.createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
