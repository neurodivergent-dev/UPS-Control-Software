import React, { useState, useEffect } from 'react';
import { Battery, Zap, Activity, ShieldAlert, Cpu, Database, Gauge } from 'lucide-react';
import MetricCard from '../components/MetricCard';
import VoltageChart from '../components/VoltageChart';
import PowerFlow from '../components/PowerFlow';
import { useUPSData, type UPSDataResponse } from '../services/upsService';

const Dashboard: React.FC = () => {
  const { data, isLoading, isError } = useUPSData();
  const [voltageHistory, setVoltageHistory] = useState<Array<{ time: string; voltage: number }>>([]);

  const mockData: UPSDataResponse = {
    workInfo: {
      batteryCapacity: 94,
      batteryRemainTime: 50,
      inputVoltage: "223.9",
      inputFrequency: "50.0",
      outputVoltage: "220.0",
      outputCurrent: "0.8",
      batteryVoltage: "27.3",
      temperatureView: "24.5",
      workMode: "Line mode",
      outputLoadPercent: "19",
      buzzerCtrl: true,
      ecomode: "[label.disable]",
      autoReboot: "[label.enable]",
      converterMode: "[label.disable]",
      warnings: []
    }
  };

  const currentData = data || mockData;
  const isBatteryMode = currentData.workInfo.workMode.toLowerCase().includes('battery');
  const isSilent = !currentData.workInfo.buzzerCtrl;

  useEffect(() => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const voltage = parseFloat(currentData.workInfo.inputVoltage);

    setVoltageHistory(prev => {
      const newHistory = [...prev, { time: timeStr, voltage }];
      return newHistory.slice(-20);
    });
  }, [currentData.workInfo.inputVoltage]);

  if (isLoading && !data) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Activity className="w-12 h-12 text-accent animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-12 animate-in fade-in duration-700 pb-16">
      <div className="mb-14">
        <PowerFlow
          workMode={currentData.workInfo.workMode}
          loadPercent={parseInt(currentData.workInfo.outputLoadPercent)}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-8">
        <MetricCard
          label="Battery Level"
          value={currentData.workInfo.batteryCapacity}
          unit="%"
          icon={Battery}
          progress={currentData.workInfo.batteryCapacity}
          alert={currentData.workInfo.batteryCapacity < 30 || isBatteryMode}
        />
        <MetricCard
          label="Load Amperage"
          value={currentData.workInfo.outputCurrent}
          unit="A"
          icon={Zap}
          alert={parseFloat(currentData.workInfo.outputCurrent) > 5}
        />
        <MetricCard
            label="Output Load"
            value={currentData.workInfo.outputLoadPercent}
            unit="%"
            icon={Gauge}
            progress={parseInt(currentData.workInfo.outputLoadPercent)}
            alert={parseInt(currentData.workInfo.outputLoadPercent) > 80}
          />
          <MetricCard
            label="Grid Frequency"
            value={currentData.workInfo.inputFrequency}
            unit="Hz"
            icon={Activity}
            alert={parseFloat(currentData.workInfo.inputFrequency) < 49 || parseFloat(currentData.workInfo.inputFrequency) > 51}
          />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
        <div className="lg:col-span-8">
          <VoltageChart
            currentVoltage={currentData.workInfo.inputVoltage}
            history={voltageHistory}
            alert={isBatteryMode}
          />
        </div>
        
        <div className="lg:col-span-4 flex flex-col">
          <div className={`glass-panel p-10 rounded-[3rem] relative overflow-hidden transition-all duration-700 flex flex-col justify-between h-full ${isBatteryMode ? 'border-red-500/30' : 'border-white/5 hover:border-accent/20'}`}>
            <div className={`absolute -right-12 -top-12 w-48 h-48 blur-[100px] opacity-10 rounded-full transition-colors ${isBatteryMode ? 'bg-red-500' : 'bg-accent'}`} />
            
            <div className="flex justify-between items-center mb-10">
              <div className="flex items-center space-x-4">
                <div className={`p-3 rounded-2xl ${isBatteryMode ? 'bg-red-500/10 text-red-500' : 'bg-accent/10 text-accent'}`}>
                  <ShieldAlert size={22} strokeWidth={2.5} />
                </div>
                <h3 className="text-sm font-black uppercase tracking-[0.3em] text-white/40 leading-none">Status Center</h3>
              </div>
              {isSilent && (
                <div className="px-3 py-1.5 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  <span className="text-[10px] text-red-500 font-black uppercase tracking-tighter">Quiet Mode</span>
                </div>
              )}
            </div>

            <div className="space-y-6 flex-1">
              <div className="flex justify-between items-center bg-white/[0.03] p-6 rounded-[2rem] border border-white/5">
                <div className="flex items-center space-x-4">
                  <Cpu size={16} className="text-white/20" />
                  <span className="text-[11px] text-white/30 font-black uppercase tracking-widest">Protocol</span>
                </div>
                <span className={`text-[11px] font-black uppercase tracking-widest ${isBatteryMode ? 'text-red-500 animate-pulse' : 'text-accent'}`}>
                  {currentData.workInfo.workMode}
                </span>
              </div>

              <div className="flex justify-between items-center bg-white/[0.03] p-6 rounded-[2rem] border border-white/5">
                <div className="flex items-center space-x-4">
                  <Database size={16} className="text-white/20" />
                  <span className="text-[11px] text-white/30 font-black uppercase tracking-widest">Potential</span>
                </div>
                <span className="text-[11px] font-black text-white px-3 py-1.5 bg-white/10 rounded-xl tracking-wider">
                  {currentData.workInfo.batteryVoltage} VDC
                </span>
              </div>
            </div>

            <div className="pt-8">
              <div className="flex items-center space-x-3 px-4 py-3 bg-accent/5 border border-accent/10 rounded-2xl">
                <div className="w-2 h-2 rounded-full bg-accent animate-blink shadow-glow-accent" />
                <p className="text-[10px] text-accent font-black uppercase tracking-widest">
                  Node Synchronized: ASYN-4A0D
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MATCHING COMPONENT STYLE FOR KERNEL LOG */}
      <div className={`glass-panel p-12 rounded-[3rem] relative overflow-hidden transition-all duration-700 ${isBatteryMode ? 'border-red-500/30' : 'border-white/5 hover:border-accent/20'}`}>
        <div className={`absolute -right-12 -top-12 w-64 h-64 blur-[100px] opacity-10 rounded-full transition-colors ${isBatteryMode ? 'bg-red-500' : 'bg-accent'}`} />
        
        <div className="relative z-10">
          <div className="flex items-center space-x-5 mb-10">
             <div className="w-2 h-8 bg-accent rounded-full shadow-glow-accent" />
             <h3 className="text-sm font-black uppercase tracking-[0.6em] text-white/40 uppercase">Terminal Kernel Log</h3>
          </div>
          
          <div className="font-mono text-xs space-y-5 px-10 border-l-2 border-accent/20">
            <p className="text-white/30">{`> [${new Date().toLocaleDateString()}] AUTHENTICATION: [OK] - ROLE: ROOT_ADMIN`}</p>
            <p className="text-white/30">{`> FETCHING REAL-TIME METRICS FROM SECTOR USB-4A0DAEE...`}</p>
            <p className={`${isSilent ? "text-red-500/80" : "text-accent/80"} font-black`}>{`> ALARM_STATUS: ${currentData.workInfo.buzzerCtrl ? 'ACTIVE' : 'MUTED'}`}</p>
            <p className="text-accent/60 font-medium">{`> ${new Date().toLocaleTimeString()} HANDSHAKE: SUCCESS. ALL CLUSTER NODES ONLINE.`}</p>
            
            <div className="flex items-center space-x-1 mt-6">
                <div className="w-3 h-6 bg-accent animate-pulse shadow-glow-accent" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
