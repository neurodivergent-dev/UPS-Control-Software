import React from 'react';
import { Shield, Cpu, Activity } from 'lucide-react';
import { useUPSData } from '../services/upsService';

const Footer: React.FC = () => {
  const { data, isError, isLoading } = useUPSData();
  const currentYear = new Date().getFullYear();

  // UPS'ten gelen gerçek teknik veriler
  const version = data?.version || "Syncing...";
  const protocol = data?.protocolType || "Detecting...";
  const port = "USB4A0DAEE"; // Serviste tanımlı olan aktif port
  const status = isError ? "Offline" : (isLoading ? "Connecting..." : "Online");

  return (
    <footer className="mt-auto relative z-20 w-full border-t border-white/5 glass-panel !bg-panel !backdrop-blur-xl transition-all duration-500">
      <div className="max-w-[1800px] mx-auto px-6 xs:px-10 sm:px-12 py-8 xs:py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          
          {/* Real System Identity */}
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-accent/10 rounded-lg border border-accent/20 transition-all duration-500">
                <Activity size={18} className="text-accent" />
              </div>
              <span className="text-lg font-black tracking-tighter text-white uppercase italic">
                UPS-Core <span className="text-accent">X1</span>
              </span>
            </div>
            <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest leading-relaxed">
              Monitoring node on port {port}.
            </p>
          </div>

          {/* Real Registry Data */}
          <div className="flex justify-center space-x-12">
            <div className="space-y-1">
              <span className="text-[9px] font-black text-accent/50 uppercase tracking-[0.3em]">Firmware</span>
              <div className="flex items-center space-x-2 text-white/60">
                <Cpu size={12} />
                <span className="text-[10px] font-mono tracking-tighter uppercase">{version}</span>
              </div>
            </div>
            <div className="space-y-1 text-right md:text-left">
              <span className="text-[9px] font-black text-accent/50 uppercase tracking-[0.3em]">Protocol</span>
              <div className="flex items-center space-x-2 text-white/60">
                <Shield size={12} />
                <span className="text-[10px] font-mono tracking-tighter uppercase">{protocol}</span>
              </div>
            </div>
          </div>

          {/* Real Connection Status */}
          <div className="md:text-right flex flex-col md:items-end justify-center">
             <div className={`inline-flex items-center space-x-3 px-4 py-2 rounded-xl border ${isError ? 'bg-red-500/10 border-red-500/20 text-red-500' : 'bg-green-500/10 border-green-500/20 text-green-500'} transition-all duration-500`}>
                <div className={`w-1.5 h-1.5 rounded-full ${isError ? 'bg-red-500 animate-ping' : 'bg-green-500 animate-pulse'}`} />
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">
                  {status}
                </span>
             </div>
             <p className="mt-3 text-[9px] font-black text-white/20 uppercase tracking-[0.4em]">
               © {currentYear} MELIH // {data?.customer || 'STANDALONE NODE'}
             </p>
          </div>

        </div>
      </div>
    </footer>
  );
};

export default Footer;
