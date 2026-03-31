import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Battery, Cpu, Terminal } from 'lucide-react';

interface PowerFlowProps {
  workMode: string;
  loadPercent: number;
}

const PowerFlow: React.FC<PowerFlowProps> = ({ workMode, loadPercent }) => {
  const isBatteryMode = workMode.toLowerCase().includes('battery');
  const isFault = workMode.toLowerCase().includes('fault');

  return (
    <div className={`glass-panel p-6 xs:p-8 sm:p-10 lg:p-12 mb-8 xs:mb-10 sm:mb-12 rounded-[2.5rem] xs:rounded-[3rem] select-none overflow-hidden relative group hover:border-accent/30 hover:-translate-y-2 transition-all duration-500 cursor-default`}>
      
      {/* Premium Rotating Border Light */}
      <div className={`border-beam transition-opacity duration-500 opacity-0 group-hover:opacity-100 ${isBatteryMode ? 'border-beam-red' : ''}`} />
      
      {/* Background Glow */}
      <div className={`absolute -right-16 -top-16 w-80 h-80 blur-[120px] opacity-10 rounded-full transition-colors duration-1000 ${isBatteryMode ? 'bg-red-500' : 'bg-accent'}`} />
      
      {/* Cyber Scanning Line */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-20">
        <div className="w-full h-1 bg-gradient-to-r from-transparent via-accent to-transparent animate-cyber-scan" />
      </div>

      {/* Mobile: Stack vertically, Desktop: Row layout */}
      <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 relative z-10">
        
        {/* Grid Node */}
        <div className="w-full sm:w-auto flex items-center justify-between sm:justify-start space-x-4 p-4 rounded-2xl border border-white/5 bg-white/[0.02] hover:border-accent/20 transition-all duration-500">
          <div className={`p-3 rounded-xl transition-all duration-700 ${!isBatteryMode ? 'bg-accent/10 text-accent shadow-glow-accent' : 'bg-white/5 text-white/20'}`}>
            <Zap size={22} strokeWidth={2.5} />
          </div>
          <div className="flex flex-col">
            <span className="text-[9px] uppercase tracking-widest font-black text-white/20">Grid Source</span>
            <div className="flex items-center space-x-2">
              <span className={`text-sm font-black uppercase ${!isBatteryMode ? 'text-white' : 'text-white/10'}`}>
                {isBatteryMode ? 'Offline' : 'Active'}
              </span>
              {!isBatteryMode && <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />}
            </div>
          </div>
        </div>

        {/* Connector Line - Desktop Only */}
        <div className="hidden sm:block flex-1 h-0.5 bg-white/5 relative rounded-full overflow-hidden mx-2">
          <AnimatePresence>
            {!isBatteryMode && (
              <div className="absolute inset-0">
                <motion.div
                  initial={{ left: '-20%', opacity: 0 }}
                  animate={{ left: '100%', opacity: [0, 1, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  className="absolute top-0 bottom-0 w-32 bg-gradient-to-r from-transparent via-accent/40 to-transparent"
                />
                {/* Dynamic Energy Particles */}
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ left: '-10%', opacity: 0 }}
                    animate={{ left: '110%', opacity: [0, 1, 1, 0] }}
                    transition={{ 
                      duration: 2, 
                      repeat: Infinity, 
                      delay: i * 0.6,
                      ease: "easeInOut" 
                    }}
                    className="absolute top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-accent shadow-[0_0_10px_var(--color-accent)]"
                  />
                ))}
              </div>
            )}
          </AnimatePresence>
        </div>

        {/* UPS Core Node - Protocol */}
        <div className="w-full sm:w-auto flex items-center justify-between sm:justify-start space-x-4 p-4 rounded-2xl border border-white/5 bg-white/[0.03] hover:border-accent/20 transition-all duration-500">
          <div className={`p-3 rounded-xl ${isBatteryMode ? 'bg-red-500/10 text-red-500' : 'bg-accent/10 text-accent'}`}>
            <Cpu size={22} strokeWidth={2.5} />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-[8px] uppercase tracking-wider font-black text-white/20">Protocol</span>
            <span className={`text-sm font-black uppercase truncate ${isBatteryMode ? 'text-red-500 animate-pulse' : 'text-accent'}`}>
              {workMode}
            </span>
          </div>
        </div>

        {/* Connector Line - Desktop Only */}
        <div className="hidden sm:block flex-1 h-0.5 bg-white/5 relative rounded-full overflow-hidden mx-2">
          <AnimatePresence>
            {!isFault && (
              <div className="absolute inset-0">
                <motion.div
                  initial={{ left: '-20%', opacity: 0 }}
                  animate={{ left: '100%', opacity: [0, 1, 0] }}
                  transition={{
                    duration: Math.max(1, 3 - (loadPercent / 40)),
                    repeat: Infinity,
                    ease: "linear"
                  }}
                  className="absolute top-0 bottom-0 w-40 bg-gradient-to-r from-transparent via-accent/40 to-transparent"
                />
                {/* Dynamic Data Particles */}
                {[...Array(4)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ left: '-10%', opacity: 0 }}
                    animate={{ left: '110%', opacity: [0, 1, 1, 0] }}
                    transition={{ 
                      duration: Math.max(0.8, 1.5 - (loadPercent / 50)), 
                      repeat: Infinity, 
                      delay: i * 0.4,
                      ease: "linear" 
                    }}
                    className={`absolute top-1/2 -translate-y-1/2 w-1 h-1 rounded-full ${isBatteryMode ? 'bg-red-500 shadow-[0_0_8px_#ef4444]' : 'bg-accent shadow-[0_0_8px_var(--color-accent)]'}`}
                  />
                ))}
              </div>
            )}
          </AnimatePresence>
        </div>


        {/* Load Node */}
        <div className="w-full sm:w-auto flex items-center justify-between sm:justify-start space-x-4 p-4 rounded-2xl border border-white/5 bg-white/[0.02] hover:border-accent/20 transition-all duration-500">
          <div className="flex flex-col text-right min-w-0">
            <span className="text-[9px] uppercase tracking-widest font-black text-white/20">Load</span>
            <span className={`text-sm font-black font-mono ${loadPercent > 0 ? 'text-white' : 'text-white/20'}`}>
              {loadPercent}%
            </span>
          </div>
          <div className={`p-3 rounded-xl border transition-all duration-700 ${loadPercent > 0 ? 'bg-accent/10 border-accent/20 text-accent shadow-glow-accent' : 'border-white/5 text-white/10'}`}>
            <Terminal size={22} strokeWidth={2.5} />
          </div>
        </div>
      </div>

      {/* Battery Status - Bottom Bar */}
      <div className="mt-6 pt-6 border-t border-white/5 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className={`p-2.5 rounded-xl transition-all ${isBatteryMode ? 'bg-red-500/20 text-red-500 animate-pulse' : 'bg-white/5 text-white/20'}`}>
            <Battery size={20} strokeWidth={2.5} />
          </div>
          <div className="flex flex-col">
            <span className="text-[8px] uppercase tracking-widest font-black text-white/20">Battery</span>
            <span className={`text-xs font-black ${isBatteryMode ? 'text-red-500' : 'text-white/40'}`}>OPTIMIZED</span>
          </div>
        </div>
        
        {/* Status Indicator */}
        <div className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-white/[0.02] border border-white/5">
          <div className={`w-2 h-2 rounded-full ${isBatteryMode ? 'bg-red-500 animate-pulse' : 'bg-accent animate-pulse'}`} />
          <span className="text-[9px] uppercase tracking-wider font-black text-white/40">
            {isBatteryMode ? 'Battery Mode' : 'Grid Active'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default PowerFlow;
