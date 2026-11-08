import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Film,
  Briefcase,
  Star,
  MessageSquare,
  Settings,
  KeyRound,
  LogOut,
  ExternalLink,
  Menu,
  X,
  User,
  ShieldCheck,
  Activity,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useSettings } from '../../context/SettingsContext';

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const { settings } = useSettings();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'Media Manager', path: '/admin/media', icon: Film },
    { name: 'Services', path: '/admin/services', icon: Briefcase },
    { name: 'Testimonials', path: '/admin/testimonials', icon: Star },
    { name: 'Messages Inbox', path: '/admin/messages', icon: MessageSquare },
    { name: 'Site Settings & Hero', path: '/admin/settings', icon: Settings },
    { name: 'Set Password & Profile', path: '/admin/password', icon: KeyRound },
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-black text-white flex">
      {/* Mobile Sidebar Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-dark-surface border-r border-gold/20 flex flex-col justify-between transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
      >
        <div>
          {/* Logo / Brand */}
          <div className="p-6 border-b border-white/10 flex items-center justify-between">
            <Link to="/" target="_blank" className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full overflow-hidden p-0.5 bg-gradient-to-tr from-gold to-gold-light shadow-gold-sm">
                <img
                  src={settings.logoUrl || '/Logo.png'}
                  alt="Edit Vision"
                  className="w-full h-full object-cover rounded-full bg-black"
                />
              </div>
              <div>
                <h1 className="font-serif text-lg font-bold tracking-wider text-white">
                  EDIT VISION
                </h1>
                <p className="text-[10px] tracking-widest text-gold uppercase">Admin CMS</p>
              </div>
            </Link>

            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1 text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.path === '/admin'
                  ? location.pathname === '/admin'
                  : location.pathname.startsWith(item.path);

              return (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}

                  className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-xs sm:text-sm font-medium transition-all ${isActive
                    ? 'bg-gold-gradient text-black font-bold shadow-gold-sm'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-black' : 'text-gold'}`} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Raj Vekariya Profile & Photo Card */}
        <div className="p-4 border-t border-white/10 space-y-3">
          <Link
            to="/admin/settings"
            title="Click to change your photo and settings"
            className="flex items-center space-x-3 p-2.5 rounded-xl bg-black/60 border border-gold/30 hover:border-gold transition-all group"
          >
            <div className="relative w-10 h-10 rounded-full overflow-hidden p-0.5 bg-gradient-to-tr from-gold to-gold-light shadow-gold-sm flex-shrink-0">
              <img
                src={settings.bioPhoto || user?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80'}
                alt="Vekariya Raj"
                className="w-full h-full object-cover rounded-full bg-black"
              />
            </div>
            <div className="overflow-hidden flex-1">
              <div className="text-xs font-bold text-white group-hover:text-gold truncate transition-colors">
                {settings.ownerName || user?.name || 'Vekariya Raj'}
              </div>
              <div className="text-[10px] text-gold truncate">Change Photo &rarr;</div>
            </div>
          </Link>

          <div className="flex items-center justify-between pt-1">
            <Link
              to="/"
              target="_blank"
              className="flex items-center space-x-1.5 text-xs text-gold hover:text-gold-light"
            >
              <span>View Portfolio</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>

            <button
              onClick={handleLogout}
              className="flex items-center space-x-1 text-xs text-red-400 hover:text-red-300"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="sticky top-0 z-30 h-16 bg-dark-surface/90 backdrop-blur-md border-b border-white/10 px-6 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg text-gold hover:bg-gold/10"
            >
              <Menu className="w-6 h-6" />
            </button>
            <h2 className="text-base font-semibold text-white font-serif tracking-wider">
              Management Console
            </h2>
          </div>

          <div className="flex items-center space-x-4">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full border border-gold/40 text-gold text-xs font-semibold hover:bg-gold hover:text-black transition-all"
            >
              <span>Preview Site</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </header>

        {/* Routed Admin Views */}
        <main className="p-6 sm:p-8 flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
