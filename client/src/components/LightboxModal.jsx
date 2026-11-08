import React, { useEffect } from 'react';
import { X, ZoomIn } from 'lucide-react';

export default function LightboxModal({ image, onClose }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [onClose]);

  if (!image) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10 bg-black/95 backdrop-blur-md animate-fadeIn">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative max-w-6xl max-h-[90vh] bg-dark-card border border-gold/40 rounded-2xl overflow-hidden shadow-2xl z-10 flex flex-col">
        {/* Top Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-white/10 bg-black/60">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-gold mr-3">
              {image.category || 'Photo'}
            </span>
            <span className="text-sm font-semibold text-white">{image.title}</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/10 hover:bg-gold hover:text-black text-gray-300 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Image Preview */}
        <div className="overflow-auto max-h-[75vh] flex items-center justify-center p-2 bg-black">
          <img
            src={image.url}
            alt={image.title}
            className="max-w-full max-h-[75vh] object-contain rounded-lg"
          />
        </div>

        {/* Footer info */}
        {image.description && (
          <div className="p-4 bg-dark-surface border-t border-white/5 text-xs text-gray-300">
            {image.description}
          </div>
        )}
      </div>
    </div>
  );
}

