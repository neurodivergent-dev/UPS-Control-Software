import React from 'react';
import { useUPSData } from '../services/upsService';
import { Monitor, Globe, Thermometer, ShieldCheck, Zap, Activity, Battery, Server, Shield, Network } from 'lucide-react';

const SystemInfo: React.FC = () => {
  const { data } = useUPSData();
  const info = data?.workInfo;

  const SpecCard = ({ label, value, icon: Icon }: { label: string, value: string, icon: any }) => (
    <div
      className="glass-panel p-10 rounded-[3rem] relative overflow-hidden group transition-all duration-700 hover:border-accent/30"
    >
      <div className="absolute -right-8 -top-8 w-32 h-32 bg-accent blur-[80px] opacity-10 rounded-full" />

      <div className="flex justify-between items-start mb-10">
        <div className="p-4 bg-accent/10 text-accent rounded-2xl group-hover:bg-accent/20 transition-all duration-500 shadow-glow-accent">
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
    <div className="space-y-12 pb-20">
      <div className="flex items-center space-x-6">
        <div className="p-4 bg-accent/10 text-accent rounded-3xl shadow-glow-accent border border-accent/20 transition-all duration-500 hover:bg-accent/20">
          <Server size={32} strokeWidth={2.5} />
        </div>
        <div>
          <h2 className="text-4xl font-black tracking-tighter uppercase text-white">Grid Hardware</h2>
          <p className="text-sm font-bold text-white/40 uppercase tracking-[0.4em]">FSP CHAMP 1KVA ONLINE SERIES</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-10">
        <SpecCard label="Model Identity" value="CHAMP 1K 1/1" icon={Monitor} />
        <SpecCard label="Grid Topology" value="ONLINE TOWER" icon={Globe} />
        <SpecCard label="Thermal Profile" value={`${info?.temperatureView || '0'} °C`} icon={Thermometer} />
        <SpecCard label="System Interface" value="ViewPower V1.0" icon={ShieldCheck} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="glass-panel p-12 rounded-[3.5rem] border-white/5 bg-white/[0.02] relative overflow-hidden group h-full transition-all duration-700 hover:border-accent/30">
          <div className="relative z-10 space-y-8">
            <div className="flex items-center space-x-4">
              <div className="w-2 h-2 rounded-full bg-accent shadow-glow-accent animate-pulse" />
              <h3 className="text-sm font-black uppercase tracking-[0.5em] text-white">Hardware Integrity Check</h3>
            </div>
            <p className="text-sm text-white/40 leading-relaxed font-bold uppercase tracking-tight max-w-lg">
              Device: <span className="text-white">FSP CHAMP 1KVA ONLINE.</span> <br />
              Input voltage stabilized at {info?.inputVoltage || '220'}V RMS. Tower-type high-precision online grid protection active.
            </p>
            <div className="flex space-x-3">
              <span className="px-4 py-2 bg-accent/10 border border-accent/20 rounded-xl text-[10px] font-black uppercase tracking-widest text-accent italic shadow-[0_0_15px_rgba(var(--color-accent-rgb),0.2)]">1KVA_CHAMP</span>
              <span className="px-4 py-2 bg-accent/5 border border-accent/20 rounded-xl text-[10px] font-black uppercase tracking-widest text-accent italic shadow-[0_0_15px_rgba(var(--color-accent-rgb),0.1)]">ONLINE_UPS</span>
            </div>
          </div>
          <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-accent/10 blur-[130px] rounded-full" />
        </div>

        <div className="glass-panel p-12 rounded-[3.5rem] border-white/5 bg-white/[0.02] relative overflow-hidden h-full flex flex-col justify-center transition-all duration-700 hover:border-accent/30">
          <div className="flex items-center space-x-6 mb-8 group hover:translate-x-1 transition-transform">
            <div className="p-4 bg-accent/10 text-accent rounded-2xl shadow-glow-accent transition-all duration-500 group-hover:bg-accent/20">
              <Zap size={24} strokeWidth={2.5} />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-black tracking-[0.4em] text-white/20 mb-1">REGULATION STATUS</span>
              <span className="text-xl font-black text-white uppercase tracking-widest">{info?.workMode || 'STANDBY'}</span>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex justify-between items-center bg-white/[0.03] p-5 rounded-2xl border border-white/5">
              <div className="flex items-center space-x-3">
                <Activity size={16} className="text-accent/40" />
                <span className="text-[10px] font-black text-white/30 uppercase tracking-widest">Load Regulation</span>
              </div>
              <span className="text-sm font-bold text-white tracking-widest">{parseInt(info?.outputLoadPercent || '0')}% LOAD</span>
            </div>

            <div className="flex justify-between items-center bg-white/[0.03] p-5 rounded-2xl border border-white/5">
              <div className="flex items-center space-x-3">
                <Battery size={16} className="text-accent/40" />
                <span className="text-[10px] font-black text-white/30 uppercase tracking-widest">Battery Sync</span>
              </div>
              <span className="text-sm font-bold text-white tracking-widest">{parseInt(String(info?.batteryCapacity || '0'))}% SYNC</span>
            </div>
          </div>
        </div>
      </div>

      {/* FINAL CLEAN FOOTER - NO BLACK BOXES/STRIPES EVER AGAIN */}
      <div className="glass-panel p-12 rounded-[3rem] relative overflow-hidden transition-all duration-700 hover:border-accent/30">
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-accent/5 blur-[100px] rounded-full" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-10 relative z-10">
          <div className="flex items-center space-x-12">
            <div className="relative">
              <Shield size={46} className="text-accent relative z-30" />
              <div className="absolute inset-0 bg-accent/5 blur-3xl rounded-full scale-110" />
            </div>

            <div className="space-y-2">
              <h4 className="text-xl font-black uppercase tracking-[0.6em] text-white leading-none">FSP CHAMP SERIES</h4>
              <div className="flex items-center space-x-4">
                <Network size={16} className="text-accent" />
                <span className="text-[11px] font-black uppercase tracking-[0.4em] text-accent/60 italic">Grid Protocol Active</span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-16">
            <div className="flex flex-col items-center">
              <span className="text-[10px] font-black text-white/10 uppercase tracking-[0.3em] mb-4 leading-none italic">Infrastructure</span>
              <div className="flex space-x-5">
                {[1, 2, 3].map(i => (
                  <div key={i} className="w-3 h-3 rounded-full bg-accent shadow-glow-accent animate-pulse ring-4 ring-accent/5" />
                ))}
              </div>
            </div>
            <div className="flex flex-col border-l border-white/10 pl-16 h-12 justify-center">
              <span className="text-[10px] font-black text-white/10 uppercase tracking-[0.2em] mb-1 leading-none italic">Sync Velocity</span>
              <span className="text-2xl font-mono font-black text-accent tracking-tighter">1.0 GBPS</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemInfo;
