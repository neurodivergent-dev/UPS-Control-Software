import React from 'react';
import { useUPSData } from '../services/upsService';
import { AlertTriangle, CheckCircle, ShieldCheck, History, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

const Events: React.FC = () => {
  const { data } = useUPSData();
  const warnings = data?.workInfo.warnings || [];

  const mockEvents = [
    { id: 1, time: '16:24:55', date: '31 MAR', type: 'info', message: 'Utility Grid: Stable Link Established', node: 'USB-4A0DAEE' },
    { id: 2, time: '15:10:02', date: '31 MAR', type: 'info', message: 'System Node Sync: 200 OK', node: 'KERNEL-ROOT' },
    { id: 3, time: '13:45:12', date: '31 MAR', type: 'info', message: 'Battery Cell Health: 100% Calibrated', node: 'BATT-LAYER-1' },
    { id: 4, time: '09:12:33', date: '31 MAR', type: 'warn', message: 'Buzzer Node: Muted by Admin', node: 'HARDWARE-IO' },
  ];

  return (
    <div className="space-y-12 animate-in fade-in duration-1000 pb-20">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-6">
            <div className="p-4 bg-accent rounded-3xl text-black shadow-glow-accent">
                <History size={32} strokeWidth={2.5} />
            </div>
            <div>
                <h2 className="text-4xl font-black tracking-tighter uppercase text-white">Event Horizon</h2>
                <p className="text-sm font-bold text-white/40 uppercase tracking-[0.4em]">Temporal Node Activity Log</p>
            </div>
        </div>
        <div className="flex items-center space-x-3 px-6 py-2 glass-panel rounded-2xl border-white/10">
            <div className="w-2.5 h-2.5 bg-accent rounded-full animate-pulse shadow-glow-accent" />
            <span className="text-[11px] font-black uppercase tracking-widest text-accent">Real-time Stream</span>
        </div>
      </div>

      {/* Critical Alerts Section */}
      <section className="space-y-6">
        <div className="flex items-center space-x-3 px-2">
            <ShieldCheck size={18} className="text-accent" />
            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-white/40">Critical Vector Analysis</h3>
        </div>
        
        {warnings.length > 0 ? (
          warnings.map((warn, i) => (
            <motion.div 
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              key={i} 
              className="glass-panel p-10 rounded-[2.5rem] border-red-500/30 bg-red-500/[0.03] flex items-center justify-between group overflow-hidden"
            >
               <div className="flex items-center space-x-10 relative z-10">
                  <div className="p-5 bg-red-500 text-black rounded-2xl shadow-[0_0_30px_rgba(239,68,68,0.3)]">
                     <AlertTriangle size={24} strokeWidth={2.5} />
                  </div>
                  <div>
                     <span className="text-[11px] font-black uppercase text-red-500/60 tracking-[0.4em] block mb-2">Hardware Failure Detected</span>
                     <p className="text-xl font-black text-white uppercase tracking-tight">{warn}</p>
                  </div>
               </div>
               <div className="absolute -right-10 -top-10 w-40 h-40 bg-red-500 blur-[100px] opacity-10 rounded-full" />
            </motion.div>
          ))
        ) : (
          <div className="glass-panel p-10 rounded-[3rem] border-accent/20 bg-accent/[0.02] flex items-center justify-between group overflow-hidden relative">
             <div className="flex items-center space-x-10 relative z-10">
                <div className="p-5 bg-accent text-black rounded-2xl shadow-glow-accent">
                   <CheckCircle size={24} strokeWidth={2.5} />
                </div>
                <div>
                   <span className="text-[11px] font-black uppercase text-accent tracking-[0.4em] block mb-2">Shield Status</span>
                   <p className="text-xl font-black text-white/80 uppercase tracking-tight">All systems nominal. No hardware breaches.</p>
                </div>
             </div>
             <div className="absolute -right-10 -top-10 w-40 h-40 bg-accent blur-[100px] opacity-10 rounded-full" />
          </div>
        )}
      </section>

      {/* Historical Stream */}
      <section className="space-y-8">
        <div className="flex items-center space-x-3 px-2">
            <Activity size={18} className="text-accent" />
            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-white/40">Temporal Node History</h3>
        </div>

        <div className="space-y-4">
            {mockEvents.map((event, i) => (
                <motion.div 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: i * 0.1 }}
                    key={event.id} 
                    className="glass-panel p-8 rounded-[2.5rem] flex items-center justify-between group hover:bg-white/[0.03] transition-all duration-500 border-white/5"
                >
                    <div className="flex items-center space-x-12">
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black text-white/20 uppercase tracking-widest leading-none mb-1">{event.date}</span>
                            <span className="text-sm font-black text-white/40 font-mono tracking-tighter">{event.time}</span>
                        </div>
                        <div className="space-y-1">
                             <div className="flex items-center space-x-3">
                                <span className={`w-1.5 h-1.5 rounded-full ${event.type === 'warn' ? 'bg-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.5)]' : 'bg-accent shadow-glow-accent'}`} />
                                <p className="text-xs font-black text-white group-hover:text-accent transition-colors uppercase tracking-widest leading-none">
                                    {event.message}
                                </p>
                             </div>
                             <span className="text-[9px] font-bold text-white/10 uppercase tracking-[0.2em]">{event.node}</span>
                        </div>
                    </div>
                    <div className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all duration-500 ${
                        event.type === 'warn' 
                          ? 'border-yellow-500/20 text-yellow-500 bg-yellow-500/5 group-hover:border-yellow-500/40' 
                          : 'border-white/5 text-white/20 group-hover:border-white/10'
                    }`}>
                        {event.type}
                    </div>
                </motion.div>
            ))}
        </div>
      </section>
      
      {/* Background Atmosphere */}
      <div className="fixed -bottom-40 -left-40 w-96 h-96 bg-accent/5 blur-[150px] rounded-full pointer-events-none" />
    </div>
  );
};

export default Events;
