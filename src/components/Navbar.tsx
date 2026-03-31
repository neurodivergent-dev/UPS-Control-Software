import React from 'react';
import { ShieldAlert, Sun, Moon } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const Navbar: React.FC = () => {
  const { isDark, setThemeMode } = useTheme();

  const toggleTheme = () => {
    setThemeMode(isDark ? 'light' : 'dark');
  };

  return (
    <nav className="h-20 border-b border-white/5 flex items-center justify-between px-10 glass-panel sticky top-0 z-[40] ml-64 transition-all duration-700">
      <div className="flex items-center space-x-4 group cursor-pointer">
        <div className="w-10 h-10 rounded-2xl bg-accent/10 flex items-center justify-center border border-accent/20 shadow-glow-accent group-hover:scale-110 transition-transform">
          <ShieldAlert className="text-accent w-6 h-6" />
        </div>
        <div className="flex flex-col">
          <h1 className="text-lg font-black tracking-tighter text-white uppercase leading-none">
            Volt Aurora <span className="text-accent">Protocol</span>
          </h1>
          <span className="text-[9px] font-black tracking-[0.4em] text-white/20 uppercase">Grid Interface v3.0</span>
        </div>
      </div>

      <div className="flex items-center space-x-8">
        <div className="flex items-center space-x-3 bg-white/5 px-4 py-2 rounded-2xl border border-white/5">
          <div className="w-2 h-2 rounded-full bg-accent animate-pulse shadow-glow-accent"></div>
          <span className="text-[10px] font-black uppercase tracking-widest text-white/60">Node: Synchronized</span>
        </div>

        <div className="px-4 py-2 border border-accent/20 rounded-2xl bg-accent/5 transition-all hover:bg-accent/10">
          <span className="text-[10px] text-accent font-mono font-bold uppercase tracking-wider">USB-4A0DAEE</span>
        </div>

        <button
          onClick={toggleTheme}
          className="p-3 rounded-2xl glass-panel border-white/10 hover:bg-accent/10 transition-all duration-300 group"
          aria-label="Toggle theme"
        >
          {isDark ? (
            <Sun className="text-accent w-5 h-5 group-hover:rotate-45 transition-transform" />
          ) : (
            <Moon className="text-accent w-5 h-5 group-hover:-rotate-12 transition-transform" />
          )}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
