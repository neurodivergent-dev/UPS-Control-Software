import React from 'react';
import { useUPSData, useUPSControlMutation } from '../services/upsService';
import { Settings as SettingsIcon, Volume2, VolumeX, Power, Zap, RefreshCcw, Palette, Terminal, ShieldCheck, HeartPulse } from 'lucide-react';
import { motion } from 'framer-motion';

interface SettingsProps {
  setTheme?: (theme: string) => void;
  currentTheme?: string;
}

const Settings: React.FC<SettingsProps> = ({ setTheme, currentTheme }) => {
  const { data } = useUPSData();
  const mutation = useUPSControlMutation();
  
  const info = data?.workInfo;
  const isBuzzerOn = info?.buzzerCtrl ?? true;
  const isEcoOn = info?.ecomode === '[label.enable]';
  const isAutoRebootOn = info?.autoReboot === '[label.enable]';
  const isConverterOn = info?.converterMode === '[label.enable]';

  const themes = [
    { id: 'cyan', label: 'Glacier Blue', color: '#00F0FF', desc: 'High-contrast Arctic' },
    { id: 'tokyo', label: 'Tokyo Night', color: '#BC00FF', desc: 'Cyberpunk Neon' },
    { id: 'solar', label: 'Amber Grid', color: '#FF4E00', desc: 'Solar Energy' },
    { id: 'neon', label: 'Matrix Core', color: '#00FF00', desc: 'Classic Tech' },
  ];

  const ControlCard = ({ 
    title, 
    active, 
    onToggle,
    icon: Icon,
    desc
  }: { 
    title: string; 
    active: boolean; 
    onToggle: () => void;
    icon: any;
    desc: string;
  }) => (
    <motion.div 
      whileHover={{ y: -5 }}
      className={`glass-panel p-10 rounded-[3rem] relative overflow-hidden group transition-all duration-700 ${active ? 'border-accent/30' : 'border-white/5'}`}
    >
      <div className={`absolute -right-10 -top-10 w-40 h-40 blur-[100px] opacity-10 rounded-full transition-colors ${active ? 'bg-accent' : 'bg-white/10'}`} />
      
      <div className="flex justify-between items-start mb-10 relative z-10">
        <div className={`p-4 rounded-2xl transition-all duration-700 ${active ? 'bg-accent/10 text-accent' : 'bg-white/5 text-white/20'}`}>
          <Icon size={28} strokeWidth={2.5} />
        </div>
        <div className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border ${
          active ? 'bg-accent/10 border-accent/30 text-accent shadow-glow-accent' : 'bg-white/5 border-white/10 text-white/20'
        }`}>
          {active ? 'Active' : 'Standby'}
        </div>
      </div>

      <div className="space-y-6 relative z-10">
        <div>
            <h3 className="text-xl font-black uppercase tracking-tight text-white mb-1">{title}</h3>
            <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest">{desc}</p>
        </div>

        <button
          onClick={onToggle}
          disabled={mutation.isPending}
          className={`
            w-full py-5 rounded-[2rem] font-black text-xs uppercase tracking-[0.3em] transition-all duration-500
            ${active 
              ? 'bg-white/5 border border-white/10 text-white/60 hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/30' 
              : 'bg-accent text-black hover:scale-[1.02] shadow-glow-accent'}
            disabled:opacity-50
          `}
        >
          {mutation.isPending ? 'Syncing...' : (active ? 'Deactivate' : 'Initialize')}
        </button>
      </div>
    </motion.div>
  );

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

      {/* Theme Selection - Rebuilt for V3.0 */}
      <section className="space-y-8">
        <div className="flex items-center space-x-3 px-2">
            <Palette size={18} className="text-accent" />
            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-white/40">Interface Atmosphere</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-8">
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
      <div className="relative group overflow-hidden rounded-[3.5rem] p-12 bg-black/40 border border-white/5 transition-all duration-700 hover:border-accent/20">
         <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
            <div className="space-y-6 max-w-xl">
                <div className="flex items-center space-x-3">
                    <Terminal className="text-accent" size={20} />
                    <h3 className="text-sm font-black uppercase tracking-[0.5em] text-white">Security & Kernel</h3>
                </div>
                <p className="text-xs text-white/20 font-bold uppercase tracking-widest leading-relaxed">
                    Tüm donanım komutları ViewPower /control/realTimeCtrl endpoint'i üzerinden imzalı olarak gönderilmektedir. Yetkisiz erişim protokolü aktif.
                </p>
            </div>
            <div className="flex items-center space-x-6">
                <div className="text-right">
                    <span className="block text-[10px] font-black text-white/20 uppercase tracking-widest">System Build</span>
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
