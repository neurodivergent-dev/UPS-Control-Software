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
    <div className={`glass-panel py-8 px-12 mb-12 rounded-[3.5rem] flex items-center justify-between select-none overflow-hidden relative group hover:border-accent/30 transition-all duration-700 min-h-[140px]`}>
      
      {/* Matching the Metric Card Glow Pattern */}
      <div className={`absolute -right-16 -top-16 w-80 h-80 blur-[120px] opacity-10 rounded-full transition-colors duration-1000 ${isBatteryMode ? 'bg-red-500' : 'bg-accent'}`} />
      
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.01] to-transparent pointer-events-none" />
      
      {/* Grid Node - FIXED GRADIENT STYLE MATCHING METRIC CARDS */}
      <div className="relative group/node flex items-center space-x-6 p-6 rounded-[2.5rem] border border-white/5 bg-white/[0.02] overflow-hidden transition-all duration-500 hover:border-accent/20">
         {/* Subtle internal gradient bleed for the node card */}
         <div className={`absolute -right-6 -top-6 w-16 h-16 blur-2xl opacity-10 rounded-full ${!isBatteryMode ? 'bg-accent' : 'bg-red-500'}`} />
         
         <div className={`p-4 rounded-2xl transition-all duration-700 ${!isBatteryMode ? 'bg-accent/10 text-accent shadow-glow-accent ring-1 ring-accent/20' : 'bg-white/5 text-white/20'}`}>
            <Zap size={24} strokeWidth={2.5} />
         </div>
         <div className="flex flex-col">
            <span className="text-[11px] uppercase tracking-[0.4em] font-black text-white/20 mb-1">Grid Source</span>
            <div className="flex items-center space-x-2">
                <span className={`text-base font-black uppercase tracking-widest ${!isBatteryMode ? 'text-white' : 'text-white/10'}`}>
                    {isBatteryMode ? 'Offline' : 'Active'}
                </span>
                {!isBatteryMode && <div className="w-2 h-2 rounded-full bg-accent animate-pulse shadow-glow-accent" />}
            </div>
         </div>
      </div>

      {/* Path 1 */}
      <div className="flex-1 h-0.5 bg-white/5 mx-8 relative rounded-full overflow-hidden">
        <AnimatePresence>
          {!isBatteryMode && (
            <motion.div 
              initial={{ left: '-20%', opacity: 0 }}
              animate={{ left: '100%', opacity: [0, 1, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              className="absolute top-0 bottom-0 w-32 bg-gradient-to-r from-transparent via-accent/40 to-transparent"
            />
          )}
        </AnimatePresence>
      </div>

      {/* UPS Core Node - THE PROCESSOR CARD */}
      <div className="flex items-center space-x-5 px-8 py-5 bg-white/[0.03] rounded-[2.5rem] border border-white/5 relative z-10 hover:border-accent/20 transition-all duration-500">
        <div className={`p-3 rounded-xl ${isBatteryMode ? 'bg-red-500/10 text-red-500' : 'bg-accent/10 text-accent'}`}>
          <Cpu size={24} strokeWidth={2.5} />
        </div>
        <div className="flex flex-col">
             <span className="text-[10px] uppercase tracking-[0.3em] font-black text-white/20 mb-1 text-center">Protocol Node</span>
             <span className={`text-[11px] font-black uppercase tracking-[0.4em] ${isBatteryMode ? 'text-red-500 animate-pulse' : 'text-accent'}`}>
                {workMode}
             </span>
        </div>
      </div>

      {/* Path 2 */}
      <div className="flex-1 h-0.5 bg-white/5 mx-8 relative rounded-full overflow-hidden">
        <AnimatePresence>
          {!isFault && (
            <motion.div 
              initial={{ left: '-20%', opacity: 0 }}
              animate={{ left: '100%', opacity: [0, 1, 0] }}
              transition={{ 
                  duration: Math.max(1, 3 - (loadPercent / 40)), 
                  repeat: Infinity, 
                  ease: "linear" 
              }}
              className={`absolute top-0 bottom-0 w-40 bg-gradient-to-r from-transparent via-accent/40 to-transparent shadow-[0_0_30px_rgba(var(--color-accent-rgb),0.3)]`}
            />
          )}
        </AnimatePresence>
      </div>

      {/* Systems Node - THE LOAD CARD */}
      <div className="relative group/load flex items-center space-x-6 p-6 rounded-[2.5rem] border border-white/5 bg-white/[0.02] overflow-hidden transition-all duration-500 hover:border-accent/20">
        <div className="flex flex-col text-right">
          <span className="text-[11px] uppercase tracking-[0.4em] font-black text-white/20 mb-1">Load Cluster</span>
          <span className={`text-base font-black ${loadPercent > 0 ? `text-white font-mono` : 'text-white/20'}`}>
            {loadPercent}% STABLE
          </span>
        </div>
        <div className={`p-4 rounded-2xl border transition-all duration-700 ${loadPercent > 0 ? 'bg-accent/10 border-accent/20 text-accent shadow-glow-accent' : 'border-white/5 text-white/10'}`}>
          <Terminal size={24} strokeWidth={2.5} />
        </div>
      </div>

      {/* Discrete Battery Status */}
      <div className="ml-10 pl-10 border-l border-white/10 flex items-center space-x-5 relative z-10">
        <div className={`p-2.5 rounded-xl transition-all ${isBatteryMode ? 'bg-red-500/20 text-red-500 animate-pulse' : 'bg-white/5 text-white/20'}`}>
            <Battery size={22} strokeWidth={2.5} />
        </div>
        <div className="flex flex-col">
            <span className="text-[9px] font-black uppercase tracking-widest text-white/10">Reservoir</span>
            <span className={`text-[11px] font-black tracking-widest ${isBatteryMode ? 'text-red-500' : 'text-white/20'}`}>OPTIMIZED</span>
        </div>
      </div>
    </div>
  );
};

export default PowerFlow;
