import React from 'react';
import { Moon, Sun, Zap } from 'lucide-react';

export const Navbar = ({ darkMode, setDarkMode }) => (
  /* 'fixed' use kiya hai taaki ye hamesha wahi rahe, 'w-full' screen cover karne ke liye */
  <nav className="fixed top-0 left-0 w-full border-b border-(--nav-line) backdrop-blur-xl bg-(--bg-primary)/80 z-1000 transition-all duration-300">
    <div className="flex justify-between items-center py-5 px-10 max-w-7xl mx-auto">
      <div className="flex items-center gap-2">
        <Zap className="text-luxe-gold fill-luxe-gold" size={24} />
        <span className="anton text-2xl tracking-tighter uppercase text-(--text-primary)">VEL DOWN</span>
      </div>
      
      <button 
        onClick={() => setDarkMode(!darkMode)}
        className="p-3 rounded-2xl border border-luxe-gold/20 hover:bg-luxe-gold/10 transition-all active:scale-90"
      >
        {darkMode ? <Sun size={20} className="text-luxe-gold" /> : <Moon size={20} className="text-coffee" />}
      </button>
    </div>
  </nav>
);