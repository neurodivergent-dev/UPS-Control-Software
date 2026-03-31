import React from 'react';
import { Activity, Sun, Moon, Menu } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

interface NavbarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const Navbar: React.FC<NavbarProps> = ({ sidebarOpen, setSidebarOpen }) => {
  const { isDark, setThemeMode } = useTheme();

  const toggleTheme = () => {
    setThemeMode(isDark ? 'light' : 'dark');
  };

  return (
    <nav className="h-20 border-b border-white/5 flex items-center justify-between px-4 xs:px-6 sm:px-8 lg:px-10 glass-panel sticky top-0 z-[40] md:ml-64 transition-all duration-700">
      <div className="flex items-center space-x-3 sm:space-x-4">
        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="md:hidden p-2 rounded-xl glass-panel border-white/10 hover:bg-accent/10 transition-all duration-300"
        >
          <Menu className="text-accent w-5 h-5" />
        </button>
        
        <div className="flex items-center space-x-3 sm:space-x-4 group cursor-pointer">
          <div className="p-2 bg-accent/10 rounded-lg border border-accent/20 shadow-glow-accent group-hover:scale-110 transition-all duration-500">
            <Activity size={18} className="text-accent" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-base sm:text-lg font-black tracking-tighter text-white uppercase leading-none">
              UPS-CORE <span className="text-accent inline">X1</span>
            </h1>
            <span className="text-[8px] sm:text-[9px] font-black tracking-[0.4em] text-white/20 uppercase">Grid Interface v3.0</span>
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-3 sm:space-x-6 lg:space-x-8">
        <div className="hidden xs:flex items-center space-x-3 bg-white/5 px-3 sm:px-4 py-2 rounded-2xl border border-white/5">
          <div className="w-2 h-2 rounded-full bg-accent animate-pulse shadow-glow-accent"></div>
          <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-white/60">Node: Sync</span>
        </div>

        <div className="hidden sm:block px-3 lg:px-4 py-2 border border-accent/20 rounded-2xl bg-accent/5 transition-all hover:bg-accent/10">
          <span className="text-[9px] lg:text-[10px] text-accent font-mono font-bold uppercase tracking-wider">USB-4A0DAEE</span>
        </div>

        <button
          onClick={toggleTheme}
          className="p-2 sm:p-3 rounded-2xl glass-panel border-white/10 hover:bg-accent/10 transition-all duration-300 group"
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
