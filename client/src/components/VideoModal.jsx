import React, { useEffect } from 'react';
import { X, ExternalLink, Film } from 'lucide-react';

export default function VideoModal({ video, onClose }) {
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

  if (!video) return null;

  // Helpers to format video embeds
  const getEmbedUrl = (url) => {
    if (!url) return null;

    // YouTube
    const ytMatch = url.match(/^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|shorts\/)([^#&?]*).*/);
    if (ytMatch && ytMatch[2].length === 11) {
      return `https://www.youtube.com/embed/${ytMatch[2]}?autoplay=1&rel=0`;
    }

    // Google Drive
    if (url.includes('drive.google.com')) {
      const driveMatch = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
      if (driveMatch && driveMatch[1]) {
        return `https://drive.google.com/file/d/${driveMatch[1]}/preview`;
      }
    }

    // Vimeo
    if (url.includes('vimeo.com')) {
      const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
      if (vimeoMatch && vimeoMatch[1]) {
        return `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1`;
      }
    }

    return null;
  };

  const embedUrl = getEmbedUrl(video.url);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10 bg-black/90 backdrop-blur-md animate-fadeIn">
      {/* Click outside backdrop */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Modal Content */}
      <div className="relative w-full max-w-5xl bg-dark-card border border-gold/40 rounded-2xl overflow-hidden shadow-2xl z-10 flex flex-col">
        {/* Top Bar */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/10 bg-black/60">
          <div className="flex items-center space-x-3">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-gold text-black">
              {video.category || 'Video'}
            </span>
            <h3 className="text-sm sm:text-base font-semibold text-white truncate max-w-md">
              {video.title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/10 hover:bg-gold hover:text-black text-gray-300 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video Player */}
        <div className="relative w-full aspect-video bg-black flex items-center justify-center">
          {embedUrl ? (
            <iframe
              src={embedUrl}
              title={video.title}
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <video
              src={video.url}
              controls
              autoPlay
              playsInline
              className="w-full h-full object-contain"
            >
              Your browser does not support the video tag.
            </video>
          )}
        </div>

        {/* Bottom Details */}
        {(video.description || video.clientName) && (
          <div className="p-5 bg-dark-surface/90 border-t border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs sm:text-sm">
            <div>
              {video.clientName && (
                <p className="text-gold font-medium">
                  Client / Project: <span className="text-white">{video.clientName}</span>
                </p>
              )}
              {video.description && (
                <p className="text-gray-400 mt-1">{video.description}</p>
              )}
            </div>

            <a
              href={`https://wa.me/919723501437?text=${encodeURIComponent(
                `Hi Raj, I liked your video "${video.title}" from your portfolio and want something similar!`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-shrink-0 px-4 py-2 rounded-full bg-gold hover:bg-gold-light text-black font-semibold text-xs tracking-wider uppercase transition-colors"
            >
              Order Similar Edit
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

