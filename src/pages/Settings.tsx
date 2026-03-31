import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { Settings as SettingsIcon, Palette, Terminal, ShieldCheck, Sun, Moon, Monitor } from 'lucide-react';

interface SettingsProps {
  setTheme?: (theme: string) => void;
  currentTheme?: string;
}

const Settings: React.FC<SettingsProps> = ({ setTheme, currentTheme }) => {
  const { themeMode, setThemeMode } = useTheme();

  const themes = [
    { id: 'cyan', label: 'Glacier Blue', color: '#00F0FF', desc: 'High-contrast Arctic' },
    { id: 'tokyo', label: 'Tokyo Night', color: '#BC00FF', desc: 'Cyberpunk Neon' },
    { id: 'solar', label: 'Amber Grid', color: '#FF4E00', desc: 'Solar Energy' },
    { id: 'neon', label: 'Matrix Core', color: '#00FF00', desc: 'Classic Tech' },
    { id: 'crimson', label: 'Crimson Flux', color: '#FF003C', desc: 'Aggressive Red' },
    { id: 'gold', label: 'Royal Gold', color: '#FFD700', desc: 'Premium Elite' },
    { id: 'rose', label: 'Neon Rose', color: '#FF66B2', desc: 'Synthwave Pink' },
    { id: 'lime', label: 'Toxic Lime', color: '#BFFF00', desc: 'Radioactive Green' },
  ];

  return (
    <div className="space-y-16 animate-in fade-in duration-1000 pb-20">
      <div className="flex items-center space-x-6">
        <div className="p-4 bg-accent rounded-3xl text-black shadow-glow-accent">
          <SettingsIcon size={32} strokeWidth={2.5} />
        </div>
        <div>
          <h2 className="text-4xl font-black tracking-tighter uppercase text-white">System Control</h2>
          <p className="text-sm font-bold text-white/40 uppercase tracking-[0.4em]">Hardware Logic & Atmospheric Shift</p>
        </div>
      </div>

      {/* Theme Mode Selection - Light/Dark/System */}
      <section className="space-y-8">
        <div className="flex items-center space-x-3 px-2">
          <Monitor size={18} className="text-accent" />
          <h3 className="text-xs font-black uppercase tracking-[0.3em] text-white/40">Theme Mode</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            { id: 'light', label: 'Light', icon: Sun, color: '#F5F5F7' },
            { id: 'dark', label: 'Dark', icon: Moon, color: '#1A1A1A' },
            { id: 'system', label: 'System', icon: Monitor, color: '#0066FF' },
          ].map(({ id, label, icon: Icon, color }) => (
            <button
              key={id}
              onClick={() => setThemeMode(id as 'light' | 'dark' | 'system')}
              className={`
                group relative p-8 rounded-[2.5rem] transition-all duration-500 overflow-hidden border-2
                ${themeMode === id ? 'border-accent bg-accent/[0.05]' : 'border-white/5 bg-white/[0.02] hover:border-white/20'}
              `}
            >
              <div className="absolute -right-8 -top-8 w-24 h-24 blur-3xl opacity-20 rounded-full transition-transform group-hover:scale-150" style={{ backgroundColor: color }} />
              
              <div className="flex flex-col items-center space-y-4 relative z-10">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 ${themeMode === id ? 'bg-accent text-black shadow-glow-accent' : 'bg-white/5 text-white/40'}`}>
                  <Icon size={28} strokeWidth={2.5} />
                </div>
                <span className={`text-[11px] font-black uppercase tracking-[0.2em] ${themeMode === id ? 'text-white' : 'text-white/40'}`}>
                  {label}
                </span>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Theme Selection - Rebuilt for V3.0 */}
      <section className="space-y-8">
        <div className="flex items-center space-x-3 px-2">
          <Palette size={18} className="text-accent" />
          <h3 className="text-xs font-black uppercase tracking-[0.3em] text-white/40">Interface Atmosphere</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-4 gap-8">
          {themes.map(t => (
            <button
              key={t.id}
              onClick={() => setTheme?.(t.id)}
              className={`
                        group relative p-10 rounded-[3rem] transition-all duration-700 overflow-hidden border-2
                        ${currentTheme === t.id ? 'border-accent bg-accent/[0.03]' : 'border-white/5 bg-white/[0.02] hover:border-white/20'}
                    `}
            >
              {/* The Color Orb */}
              <div className="absolute -right-8 -top-8 w-24 h-24 blur-3xl opacity-20 rounded-full transition-transform group-hover:scale-150" style={{ backgroundColor: t.color }} />

              <div className="flex flex-col items-center text-center space-y-6 relative z-10">
                <div className="w-14 h-14 rounded-[1.5rem] shadow-2xl transition-all duration-700 group-hover:rotate-12 group-hover:scale-110 flex items-center justify-center" style={{ backgroundColor: t.color, boxShadow: `0 0 40px ${t.color}66` }}>
                  <Palette className="text-black/40" size={24} strokeWidth={2.5} />
                </div>
                <div className="space-y-1">
                  <span className={`text-[12px] font-black uppercase tracking-[0.2em] block ${currentTheme === t.id ? 'text-white' : 'text-white/40'}`}>
                    {t.label}
                  </span>
                  <span className="text-[9px] font-bold text-white/10 uppercase tracking-widest leading-none">
                    {t.desc}
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Advanced Terminal Footer */}
      <div className="relative group overflow-hidden rounded-[3.5rem] p-12 glass-panel border-white/10 transition-all duration-700 hover:border-accent/20">
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="space-y-6 max-w-xl">
            <div className="flex items-center space-x-3">
              <Terminal className="text-accent" size={20} />
              <h3 className="text-sm font-black uppercase tracking-[0.5em] text-white/60">Security & Kernel</h3>
            </div>
            <p className="text-xs text-white/40 font-bold uppercase tracking-widest leading-relaxed">
              All hardware commands are signed and transmitted via ViewPower /control/realTimeCtrl endpoint. Unauthorized access protocol active.
            </p>
          </div>
          <div className="flex items-center space-x-6">
            <div className="text-right">
              <span className="block text-[10px] font-black text-white/40 uppercase tracking-widest">System Build</span>
              <span className="text-sm font-black text-white italic">VIBRANT-V3.0.PRO</span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-accent text-black flex items-center justify-center shadow-glow-accent">
              <ShieldCheck size={24} strokeWidth={2.5} />
            </div>
          </div>
        </div>
        <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-accent/5 blur-[120px] rounded-full pointer-events-none" />
      </div>
    </div>
  );
};

export default Settings;
