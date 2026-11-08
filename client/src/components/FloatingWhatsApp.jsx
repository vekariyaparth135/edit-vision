import React from 'react';
import { MessageCircle, Phone } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

export default function FloatingWhatsApp() {
  const { settings } = useSettings();
  const phone = settings.contactNumber || '9723501437';
  const whatsapp = settings.whatsappNumber || '9723501437';

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col space-y-3 items-end">
      {/* Click-to-Call Floating Button (visible on mobile / desktop) */}
      <a
        href={`tel:${phone}`}
        className="flex items-center space-x-2 px-3 py-2.5 rounded-full bg-black/90 text-gold border border-gold shadow-lg hover:scale-105 active:scale-95 transition-all text-xs font-semibold backdrop-blur-md group"
        title="Call Vekariya Raj"
      >
        <Phone className="w-4 h-4 text-gold group-hover:rotate-12 transition-transform" />
        <span className="hidden sm:inline font-mono">9723501437</span>
      </a>

      {/* WhatsApp Floating Button in Brand Gold */}
      <a
        href={`https://wa.me/91${whatsapp}?text=${encodeURIComponent(
          'Hi Vekariya Raj, I checked out Edit Vision portfolio and would like to talk about a video editing project.'
        )}`}
        target="_blank"
        rel="noopener noreferrer"
        className="relative flex items-center justify-center w-14 h-14 rounded-full bg-gold-gradient text-black shadow-gold-lg hover:shadow-gold-xl hover:scale-110 active:scale-95 transition-all group"
        title="Chat on WhatsApp"
        aria-label="WhatsApp"
      >
        {/* Glow Ping Effect */}
        <span className="absolute -inset-1 rounded-full bg-gold opacity-30 animate-ping" />
        <MessageCircle className="w-7 h-7 relative z-10 text-black" />
      </a>
    </div>
  );
}

