import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import FloatingWhatsApp from './components/FloatingWhatsApp';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/Home';
import NotFound from './pages/NotFound';

import ClientLogin from './pages/client/ClientLogin';
import ClientPortal from './pages/client/ClientPortal';

import AdminLayout from './pages/admin/AdminLayout';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import MediaManager from './pages/admin/MediaManager';
import ServicesManager from './pages/admin/ServicesManager';
import TestimonialsManager from './pages/admin/TestimonialsManager';
import MessagesManager from './pages/admin/MessagesManager';
import SettingsManager from './pages/admin/SettingsManager';
import PasswordChange from './pages/admin/PasswordChange';

export default function App() {
  return (
    <Routes>
      {/* Public Client Site */}
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

      {/* Client Sign In & Register */}
      <Route path="/login" element={<ClientLogin />} />

      {/* Protected Client Portal (for any registered Client) */}
      <Route path="/client" element={<ProtectedRoute requiredRole="client" />}>
        <Route index element={<ClientPortal />} />
      </Route>

      {/* Admin Login Route (strictly for Vekariya Raj) */}
      <Route path="/admin/login" element={<AdminLogin />} />

      {/* Protected Admin CMS Routes (strictly Vekariya Raj, role === 'admin') */}
      <Route path="/admin" element={<ProtectedRoute requiredRole="admin" />}>
        <Route element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
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
