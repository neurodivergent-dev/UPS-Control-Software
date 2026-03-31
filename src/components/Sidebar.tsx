import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  BarChart3,
  Settings as SettingsIcon,
  Info,
  LayoutDashboard,
  Activity,
  X
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen }) => {
  const menuItems = [
    { icon: LayoutDashboard, label: 'Console', path: '/' },
    { icon: BarChart3, label: 'Diagnostics', path: '/diagnostics' },
    { icon: Activity, label: 'Event Log', path: '/events' },
    { icon: Info, label: 'System Info', path: '/info' },
    { icon: SettingsIcon, label: 'Settings', path: '/settings' },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      <div 
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] md:hidden transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsOpen(false)}
      />
      
      <aside className={`fixed left-0 top-0 h-full w-64 glass-panel border-r-0 border-white/5 z-[70] p-8 flex flex-col transform transition-transform duration-300 md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        {/* Mobile Close Button */}
        <button 
          onClick={() => setIsOpen(false)}
          className="absolute top-4 right-4 p-2 md:hidden text-white/60 hover:text-white"
        >
          <X size={20} />
        </button>

        <div className="flex items-center space-x-3 mb-16 group cursor-pointer">
          <div className="p-2 bg-accent/10 rounded-lg border border-accent/20 shadow-glow-accent group-hover:scale-110 transition-all duration-500">
               <Activity size={18} className="text-accent" />
          </div>
          <div className="flex flex-col">
              <h1 className="text-base font-black tracking-tighter text-white uppercase leading-none">UPS-CORE X1</h1>
              <span className="text-[10px] font-black tracking-[0.2em] text-accent uppercase mt-1">Vibrant v3.0</span>
          </div>
        </div>

        <nav className="flex-1 space-y-4">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) => `
                flex items-center space-x-4 px-6 py-4 rounded-2xl transition-all duration-500 group
                ${isActive
                  ? 'bg-accent/10 border border-accent/20 text-accent shadow-glow-accent'
                  : 'text-white/30 hover:bg-white/5 hover:text-white/60'}
              `}
            >
              {({ isActive }) => (
                <>
                  <item.icon size={18} strokeWidth={isActive ? 2.5 : 2} className="group-hover:scale-110 transition-transform" />
                  <span className="text-[11px] font-black uppercase tracking-[0.2em]">{item.label}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto p-6 glass-panel border-white/5 rounded-3xl bg-white/[0.02]">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-2 h-2 bg-accent rounded-full animate-pulse shadow-glow-accent" />
            <span className="text-[9px] font-black uppercase tracking-widest text-white/40">Secure Link</span>
          </div>
          <p className="text-[9px] text-white/30 leading-relaxed font-bold uppercase tracking-tight">
            Authenticated as Root. All hardware nodes synchronized.
          </p>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
