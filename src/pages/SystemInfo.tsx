import React from 'react';
import { useUPSData } from '../services/upsService';
import { Monitor, Globe, Thermometer, ShieldCheck, Zap, Activity, Battery, Server, Shield, Network } from 'lucide-react';

const SystemInfo: React.FC = () => {
  const { data } = useUPSData();
  const info = data?.workInfo;

  const SpecCard = ({ label, value, icon: Icon }: { label: string, value: string, icon: any }) => (
    <div
      className="glass-panel p-10 rounded-[3rem] relative overflow-hidden group transition-all duration-500 hover:border-accent/30 hover:-translate-y-2 cursor-default"
    >
      <div className="absolute -right-8 -top-8 w-32 h-32 bg-accent blur-[80px] opacity-10 rounded-full" />

      <div className="flex justify-between items-start mb-10">
        <div className="p-4 bg-accent/10 text-accent rounded-2xl group-hover:bg-accent/20 transition-all duration-500 shadow-glow-accent group-hover:-translate-y-1">
          <Icon size={28} strokeWidth={2.5} />
        </div>
        <div className="w-1.5 h-1.5 bg-accent/20 rounded-full" />
      </div>

      <div className="space-y-1">
        <span className="text-[11px] font-black uppercase tracking-[0.4em] text-white/20 block mb-2">{label}</span>
        <span className="text-xl font-black text-white tracking-tighter uppercase leading-none">{value}</span>
      </div>
    </div>
  );

  return (
    <div className="space-y-8 xs:space-y-10 sm:space-y-12 pb-16 xs:pb-20">
      <div className="flex items-center space-x-4 xs:space-x-6">
        <div className="p-3 xs:p-4 bg-accent/10 text-accent rounded-2xl xs:rounded-3xl shadow-glow-accent border border-accent/20 transition-all duration-500 hover:bg-accent/20">
          <Server size={32} strokeWidth={2.5} />
        </div>
        <div>
          <h2 className="text-2xl xs:text-3xl sm:text-4xl font-black tracking-tighter uppercase text-white">Grid Hardware</h2>
          <p className="text-[8px] xs:text-sm font-bold text-white/40 uppercase tracking-[0.4em]">FSP CHAMP 1KVA ONLINE SERIES</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 xs:gap-6 sm:gap-8 lg:gap-10">
        <SpecCard label="Model Identity" value="CHAMP 1K 1/1" icon={Monitor} />
        <SpecCard label="Grid Topology" value="ONLINE TOWER" icon={Globe} />
        <SpecCard label="Thermal Profile" value={`${info?.temperatureView || '0'} °C`} icon={Thermometer} />
        <SpecCard label="System Interface" value="ViewPower V1.0" icon={ShieldCheck} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 xs:gap-8 sm:gap-10">
        <div className="glass-panel p-8 xs:p-10 sm:p-12 rounded-[3rem] xs:rounded-[3.5rem] border-white/5 bg-white/[0.02] relative overflow-hidden group h-full transition-all duration-500 hover:border-accent/30 hover:-translate-y-2 cursor-default">
          <div className="relative z-10 space-y-6 xs:space-y-8">
            <div className="flex items-center space-x-3 xs:space-x-4">
              <div className="w-2 h-2 rounded-full bg-accent shadow-glow-accent animate-pulse" />
              <h3 className="text-[10px] xs:text-sm font-black uppercase tracking-[0.5em] text-white">Hardware Integrity Check</h3>
            </div>
            <p className="text-[11px] xs:text-sm text-white/40 leading-relaxed font-bold uppercase tracking-tight max-w-lg">
              Device: <span className="text-white">FSP CHAMP 1KVA ONLINE.</span> <br />
              Input voltage stabilized at {info?.inputVoltage || '220'}V RMS. Tower-type high-precision online grid protection active.
            </p>
            <div className="flex flex-wrap gap-2 xs:gap-3">
              <span className="px-3 xs:px-4 py-1.5 xs:py-2 bg-accent/10 border border-accent/20 rounded-xl text-[8px] xs:text-[10px] font-black uppercase tracking-widest text-accent italic shadow-[0_0_15px_rgba(var(--color-accent-rgb),0.2)]">1KVA_CHAMP</span>
              <span className="px-3 xs:px-4 py-1.5 xs:py-2 bg-accent/5 border border-accent/20 rounded-xl text-[8px] xs:text-[10px] font-black uppercase tracking-widest text-accent italic shadow-[0_0_15px_rgba(var(--color-accent-rgb),0.1)]">ONLINE_UPS</span>
            </div>
          </div>
          <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-accent/10 blur-[130px] rounded-full" />
        </div>

        <div className="glass-panel p-8 xs:p-10 sm:p-12 rounded-[3rem] xs:rounded-[3.5rem] border-white/5 bg-white/[0.02] relative overflow-hidden h-full flex flex-col justify-center group transition-all duration-500 hover:border-accent/30 hover:-translate-y-2 cursor-default">
          <div className="flex items-center space-x-4 xs:space-x-6 mb-6 xs:mb-8 group/icon">
            <div className="p-3 xs:p-4 bg-accent/10 text-accent rounded-xl xs:rounded-2xl shadow-glow-accent transition-all duration-500 group-hover/icon:bg-accent/20 group-hover/icon:-translate-y-1">
              <Zap size={24} strokeWidth={2.5} />
            </div>
            <div className="flex flex-col">
              <span className="text-[9px] xs:text-[10px] font-black tracking-[0.4em] text-white/20 mb-1">REGULATION STATUS</span>
              <span className="text-lg xs:text-xl font-black text-white uppercase tracking-widest">{info?.workMode || 'STANDBY'}</span>
            </div>
          </div>

          <div className="space-y-4 xs:space-y-6">
            <div className="flex justify-between items-center bg-white/[0.03] p-4 xs:p-5 rounded-xl xs:rounded-2xl border border-white/5">
              <div className="flex items-center space-x-2 xs:space-x-3">
                <Activity size={16} className="text-accent/40" />
                <span className="text-[9px] xs:text-[10px] font-black text-white/30 uppercase tracking-widest">Load Regulation</span>
              </div>
              <span className="text-xs xs:text-sm font-bold text-white tracking-widest">{parseInt(info?.outputLoadPercent || '0')}% LOAD</span>
            </div>

            <div className="flex justify-between items-center bg-white/[0.03] p-4 xs:p-5 rounded-xl xs:rounded-2xl border border-white/5">
              <div className="flex items-center space-x-2 xs:space-x-3">
                <Battery size={16} className="text-accent/40" />
                <span className="text-[9px] xs:text-[10px] font-black text-white/30 uppercase tracking-widest">Battery Sync</span>
              </div>
              <span className="text-xs xs:text-sm font-bold text-white tracking-widest">{parseInt(String(info?.batteryCapacity || '0'))}% SYNC</span>
            </div>
          </div>
        </div>
      </div>

      {/* FINAL CLEAN FOOTER - NO BLACK BOXES/STRIPES EVER AGAIN */}
      <div className="glass-panel p-8 xs:p-10 sm:p-12 rounded-[2.5rem] xs:rounded-[3rem] relative overflow-hidden transition-all duration-500 hover:border-accent/30 hover:-translate-y-2 cursor-default group/footer">
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-accent/5 blur-[100px] rounded-full" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-8 xs:gap-10 relative z-10">
          <div className="flex items-center space-x-8 xs:space-x-10 sm:space-x-12 w-full md:w-auto">
            <div className="relative flex-shrink-0 group-hover/footer:-translate-y-1 transition-transform duration-500">
              <Shield size={46} className="text-accent relative z-30" />
              <div className="absolute inset-0 bg-accent/5 blur-3xl rounded-full scale-110" />
            </div>

            <div className="space-y-2 min-w-0">
              <h4 className="text-lg xs:text-xl font-black uppercase tracking-[0.6em] text-white leading-none truncate">FSP CHAMP SERIES</h4>
              <div className="flex items-center space-x-3 xs:space-x-4">
                <Network size={16} className="text-accent" />
                <span className="text-[9px] xs:text-[11px] font-black uppercase tracking-[0.4em] text-accent/60 italic truncate">Grid Protocol Active</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col xs:flex-row items-center space-y-6 xs:space-y-0 xs:space-x-12 xs:space-x-16 w-full md:w-auto">
            <div className="flex flex-col items-center flex-shrink-0">
              <span className="text-[9px] xs:text-[10px] font-black text-white/10 uppercase tracking-[0.3em] mb-4 leading-none italic">Infrastructure</span>
              <div className="flex space-x-4 xs:space-x-5">
                {[1, 2, 3].map(i => (
                  <div key={i} className="w-3 h-3 rounded-full bg-accent shadow-glow-accent animate-pulse ring-4 ring-accent/5" />
                ))}
              </div>
            </div>
            <div className="flex flex-col border-l border-white/10 pl-12 xs:pl-16 h-12 justify-center flex-shrink-0">
              <span className="text-[9px] xs:text-[10px] font-black text-white/10 uppercase tracking-[0.2em] mb-1 leading-none italic">Sync Velocity</span>
              <span className="text-xl xs:text-2xl font-mono font-black text-accent tracking-tighter">1.0 GBPS</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemInfo;
