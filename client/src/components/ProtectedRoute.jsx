import React from 'react';
import { Navigate, Outlet, Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft, User, LogOut, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from './LoadingSpinner';

export default function ProtectedRoute({ requiredRole = 'admin' }) {
  const { isAuthenticated, user, loading, logout } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <LoadingSpinner size="lg" text="Authenticating..." />
      </div>
    );
  }

  // Not logged in -> redirect to login
  if (!isAuthenticated) {
    return <Navigate to={requiredRole === 'admin' ? '/admin/login' : '/login'} replace />;
  }

  // If route requires admin, but logged in user is client
  if (requiredRole === 'admin' && user?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-dark-card border border-red-500/30 rounded-3xl p-8 text-center shadow-2xl relative overflow-hidden">
          {/* Subtle warning glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-red-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center mx-auto mb-5 text-red-400">
            <ShieldAlert className="w-8 h-8" />
          </div>

          <span className="text-[11px] font-bold tracking-widest uppercase px-3 py-1 rounded-full bg-red-500/10 text-red-400 border border-red-500/20 inline-block mb-3">
            Access Restricted
          </span>

          <h2 className="font-serif text-2xl font-bold text-white mb-2">
            Admin Panel is for Vekariya Raj Only
          </h2>

          <p className="text-gray-400 text-xs leading-relaxed mb-6">
            You are logged in as a Client (<span className="text-white font-medium">{user?.email}</span>). 
            Clients do not have permission to open the Admin CMS. Please use your Client Portal instead.
          </p>

          <div className="flex flex-col space-y-3">
            <Link
              to="/client"
              className="w-full py-3 px-4 rounded-xl bg-gold text-black font-bold text-xs uppercase tracking-wider hover:bg-gold-light transition-all flex items-center justify-center space-x-2 shadow-gold-sm"
            >
              <User className="w-4 h-4" />
              <span>Go to Client Portal</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/"
              className="w-full py-2.5 px-4 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 text-xs font-semibold tracking-wider transition-all flex items-center justify-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Return to Portfolio</span>
            </Link>

            <button
              onClick={logout}
              className="text-xs text-gray-500 hover:text-red-400 transition-colors flex items-center justify-center space-x-1.5 pt-2"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign out and switch account</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return <Outlet />;
}
