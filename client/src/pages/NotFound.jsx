import React from 'react';
import { Link } from 'react-router-dom';
import { Film, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 text-center">
      <div className="w-20 h-20 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center text-gold mb-6 animate-pulse">
        <Film className="w-10 h-10" />
      </div>
      <h1 className="font-serif text-5xl sm:text-7xl font-bold text-white mb-2">404</h1>
      <p className="font-serif text-xl sm:text-2xl text-gold italic mb-6">
        Frame Not Found
      </p>
      <p className="text-xs sm:text-sm text-gray-400 max-w-md mb-8">
        The scene you are looking for has been cut from the final reel or does not exist.
      </p>
      <Link
        to="/"
        className="flex items-center space-x-2 px-6 py-3 rounded-full bg-gold-gradient text-black font-bold uppercase tracking-wider text-xs shadow-gold-sm hover:scale-105 transition-all"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Portfolio</span>
      </Link>
    </div>
  );
}

