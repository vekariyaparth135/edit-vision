import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import FloatingWhatsApp from './components/FloatingWhatsApp';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/Home';
import NotFound from './pages/NotFound';

import UserLogin from './pages/user/UserLogin';
import UserDashboard from './pages/user/UserDashboard';

import AdminLayout from './pages/admin/AdminLayout';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import UsersManager from './pages/admin/UsersManager';
import MediaManager from './pages/admin/MediaManager';
import ServicesManager from './pages/admin/ServicesManager';
import TestimonialsManager from './pages/admin/TestimonialsManager';
import MessagesManager from './pages/admin/MessagesManager';
import SettingsManager from './pages/admin/SettingsManager';
import PasswordChange from './pages/admin/PasswordChange';

export default function App() {
  return (
    <Routes>
      {/* Public Portfolio Site */}
      <Route
        path="/"
        element={
          <>
            <Navbar />
            <main>
              <Home />
            </main>
            <Footer />
            <FloatingWhatsApp />
          </>
        }
      />

      {/* User Panel Login & Registration */}
      <Route path="/login" element={<UserLogin />} />
      <Route path="/user/login" element={<UserLogin />} />

      {/* Admin Panel Login */}
      <Route path="/admin/login" element={<AdminLogin />} />

      {/* Protected User Panel (for regular users to view/manage their own data) */}
      <Route path="/user" element={<ProtectedRoute requiredRole="user" />}>
        <Route index element={<UserDashboard />} />
        <Route path="dashboard" element={<UserDashboard />} />
      </Route>
      <Route path="/client" element={<Navigate to="/user" replace />} />

      {/* Protected Admin CMS Panel (strictly role === 'admin' for full system control) */}
      <Route path="/admin" element={<ProtectedRoute requiredRole="admin" />}>
        <Route element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<UsersManager />} />
          <Route path="media" element={<MediaManager />} />
          <Route path="services" element={<ServicesManager />} />
          <Route path="testimonials" element={<TestimonialsManager />} />
          <Route path="messages" element={<MessagesManager />} />
          <Route path="settings" element={<SettingsManager />} />
          <Route path="password" element={<PasswordChange />} />
        </Route>
      </Route>

      {/* 404 Route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
