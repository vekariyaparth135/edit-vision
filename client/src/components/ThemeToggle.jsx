import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function ThemeToggle({ className = '' }) {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      type="button"
      aria-label="Toggle theme"
      className={`p-2 rounded-full border border-gold/30 hover:border-gold bg-dark-surface/60 dark:bg-dark-card/80 text-gold transition-all duration-300 hover:scale-105 active:scale-95 ${className}`}
    >
      {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4 text-gold-dark" />}
    </button>
  );
}

