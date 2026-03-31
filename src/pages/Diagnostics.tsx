import React from 'react';
import { useUPSData } from '../services/upsService';
import { ShieldCheck, Activity, Cpu, Database, Gauge, Thermometer, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

const Diagnostics: React.FC = () => {
  const { data } = useUPSData();
  const info = data?.workInfo;

  const DiagnosticCard = ({ label, value, status, icon: Icon, subValue }: { 
    label: string, 
    value: string, 
    status: 'ok' | 'warn' | 'error',
    icon: any,
    subValue?: string 
  }) => (
    <motion.div 
      whileHover={{ y: -5 }}
      className={`glass-panel p-10 rounded-[3rem] relative overflow-hidden group transition-all duration-700 ${status === 'error' ? 'border-red-500/30' : 'hover:border-accent/30'}`}
    >
      {/* Background radial glow */}
      <div className={`absolute -right-10 -top-10 w-40 h-40 blur-[100px] opacity-10 rounded-full transition-colors ${status === 'ok' ? 'bg-accent' : status === 'warn' ? 'bg-yellow-500' : 'bg-red-500'}`} />
      
      <div className="flex justify-between items-start mb-10">
        <div className={`p-4 rounded-2xl transition-all duration-700 ${status === 'ok' ? 'bg-accent/10 text-accent' : status === 'warn' ? 'bg-yellow-500/10 text-yellow-500' : 'bg-red-500/10 text-red-500'}`}>
          <Icon size={28} strokeWidth={2.5} />
        </div>
        <div className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border ${
          status === 'ok' ? 'bg-accent/10 border-accent/20 text-accent shadow-glow-accent' : 
          status === 'warn' ? 'bg-yellow-500/10 border-yellow-500/20 text-yellow-500' : 
          'bg-red-500/10 border-red-500/20 text-red-500'
        }`}>
          {status === 'ok' ? 'Nominal' : status === 'warn' ? 'Check' : 'Critical'}
        </div>
      </div>

      <div className="space-y-2">
        <span className="text-[11px] font-black uppercase tracking-[0.4em] text-white/30 truncate block">{label}</span>
        <div className="flex flex-col">
            <span className="text-3xl font-black text-white tracking-tighter uppercase">{value}</span>
            {subValue && <span className="text-xs font-bold text-white/20 uppercase tracking-widest mt-1">{subValue}</span>}
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="space-y-8 xs:space-y-10 sm:space-y-12 animate-in fade-in duration-1000 pb-16 xs:pb-20">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4 xs:space-x-6">
            <div className="p-3 xs:p-4 bg-accent rounded-2xl xs:rounded-3xl text-black shadow-glow-accent">
                <ShieldCheck size={28} strokeWidth={2.5} />
            </div>
            <div>
                <h2 className="text-2xl xs:text-3xl sm:text-4xl font-black tracking-tighter uppercase text-white">Diagnostic Core</h2>
                <p className="text-[8px] xs:text-sm font-bold text-white/40 uppercase tracking-[0.3em]">Sector 7 Integrity Protocol</p>
            </div>
        </div>
        <div className="hidden lg:flex items-center space-x-6">
             <div className="flex flex-col text-right">
                <span className="text-[10px] font-black uppercase text-white/20 tracking-widest leading-none mb-1">Link Strength</span>
                <span className="text-xl font-black text-accent tracking-tighter">100% SECURE</span>
             </div>
             <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map(i => <div key={i} className="w-1.5 h-6 bg-accent/20 rounded-full" />)}
             </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 xs:gap-6 sm:gap-8 lg:gap-10">
        <DiagnosticCard label="Utility Grid Phase" value={`${info?.inputVoltage || '0'} VAC`} subValue={`${info?.inputFrequency || '0'}Hz Grid Sync`} status="ok" icon={Zap} />
        <DiagnosticCard label="Thermal Profile" value={`${info?.temperatureView || '0'} °C`} subValue="Cooling Active" status={parseFloat(String(info?.temperatureView || '0')) > 45 ? 'warn' : 'ok'} icon={Thermometer} />
        <DiagnosticCard label="Load Regulation" value={`${parseInt(String(info?.outputLoadPercent || '0'))}%`} subValue="Processing Task" status={parseInt(String(info?.outputLoadPercent || '0')) > 80 ? 'warn' : 'ok'} icon={Gauge} />
        <DiagnosticCard label="Cell Capacity" value={`${parseInt(String(info?.batteryCapacity || '0'))}%`} subValue={`${info?.batteryVoltage || '0'} VDC Reserve`} status={parseInt(String(info?.batteryCapacity || '0')) < 30 ? 'warn' : 'ok'} icon={Database} />
        <DiagnosticCard label="Back-up Vector" value={`${info?.batteryRemainTime || '0'} Min`} subValue="Estimated Orbit" status="ok" icon={Activity} />
        <DiagnosticCard label="Node Registry" value="Online" subValue="USB-4A0DAEE" status="ok" icon={Cpu} />
      </div>

    </div>
  );
};

export default Diagnostics;
