import React, { useState, useEffect } from 'react';
import { Battery, Zap, Activity, ShieldAlert, Cpu, Database, Gauge } from 'lucide-react';
import MetricCard from '../components/MetricCard';
import VoltageChart from '../components/VoltageChart';
import PowerFlow from '../components/PowerFlow';
import { useUPSData, type UPSDataResponse } from '../services/upsService';

const Dashboard: React.FC = () => {
  const { data, isLoading } = useUPSData();
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
    <div className="space-y-6 xs:space-y-8 sm:space-y-10 lg:space-y-12 animate-in fade-in duration-700 pb-16">
      <div className="mb-8 xs:mb-10 sm:mb-14">
        <PowerFlow
          workMode={currentData.workInfo.workMode}
          loadPercent={parseInt(currentData.workInfo.outputLoadPercent)}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 xs:gap-6 sm:gap-8 items-stretch">
        <MetricCard
          label="Battery Level"
          value={currentData.workInfo.batteryCapacity}
          unit="%"
          icon={Battery}
          progress={currentData.workInfo.batteryCapacity}
          alert={currentData.workInfo.batteryCapacity < 30 || isBatteryMode}
        />
        <MetricCard
          label="Input Voltage"
          value={parseFloat(currentData.workInfo.inputVoltage).toFixed(1)}
          unit="V"
          icon={Zap}
          alert={parseFloat(currentData.workInfo.inputVoltage) < 200 || parseFloat(currentData.workInfo.inputVoltage) > 240}
        />
        <MetricCard
          label="Output Load"
          value={parseInt(currentData.workInfo.outputLoadPercent)}
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

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 xs:gap-8 sm:gap-10 items-stretch">
        <div className="lg:col-span-8 group hover:-translate-y-2 transition-all duration-500 cursor-default">
          <VoltageChart
            currentVoltage={currentData.workInfo.inputVoltage}
            history={voltageHistory}
            alert={isBatteryMode}
          />
        </div>

        <div className="lg:col-span-4 flex flex-col group/status hover:-translate-y-2 transition-all duration-500 cursor-default">
          <div className={`glass-panel p-6 xs:p-8 sm:p-10 rounded-[2rem] xs:rounded-[3rem] relative overflow-hidden transition-all duration-500 flex flex-col justify-between h-full ${isBatteryMode ? 'border-red-500/30' : 'border-white/5 group-hover/status:border-accent/20'}`}>
            <div className={`absolute -right-12 -top-12 w-48 h-48 blur-[100px] opacity-10 rounded-full transition-colors ${isBatteryMode ? 'bg-red-500' : 'bg-accent'}`} />

            <div className="flex justify-between items-center mb-6 xs:mb-8 sm:mb-10">
              <div className="flex items-center space-x-3 xs:space-x-4">
                <div className={`p-2 xs:p-3 rounded-xl xs:rounded-2xl ${isBatteryMode ? 'bg-red-500/10 text-red-500' : 'bg-accent/10 text-accent'}`}>
                  <ShieldAlert size={20} strokeWidth={2.5} />
                </div>
                <h3 className="text-[10px] xs:text-sm font-black uppercase tracking-[0.3em] text-white/40 leading-none">Status Center</h3>
              </div>
              {isSilent && (
                <div className="px-2 xs:px-3 py-1.5 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  <span className="text-[9px] xs:text-[10px] text-red-500 font-black uppercase tracking-tighter">Quiet Mode</span>
                </div>
              )}
            </div>

            <div className="space-y-4 xs:space-y-5 sm:space-y-6 flex-1">
              <div className="flex justify-between items-center bg-white/[0.03] p-4 xs:p-6 rounded-[1.5rem] xs:rounded-[2rem] border border-white/5">
                <div className="flex items-center space-x-3 xs:space-x-4">
                  <Cpu size={16} className="text-white/20" />
                  <span className="text-[9px] xs:text-[11px] text-white/30 font-black uppercase tracking-widest">Protocol</span>
                </div>
                <span className={`text-[9px] xs:text-[11px] font-black uppercase tracking-widest ${isBatteryMode ? 'text-red-500 animate-pulse' : 'text-accent'}`}>
                  {currentData.workInfo.workMode}
                </span>
              </div>

              <div className="flex justify-between items-center bg-white/[0.03] p-4 xs:p-6 rounded-[1.5rem] xs:rounded-[2rem] border border-white/5">
                <div className="flex items-center space-x-3 xs:space-x-4">
                  <Database size={16} className="text-white/20" />
                  <span className="text-[9px] xs:text-[11px] text-white/30 font-black uppercase tracking-widest">Potential</span>
                </div>
                <span className="text-[9px] xs:text-[11px] font-black text-accent px-2 xs:px-3 py-1.5 bg-accent/10 rounded-xl tracking-wider">
                  {parseFloat(currentData.workInfo.batteryVoltage).toFixed(1)} VDC
                </span>
              </div>
            </div>

            <div className="pt-6 xs:pt-8">
              <div className="flex items-center justify-between px-4 py-3 rounded-2xl transition-all duration-300 group cursor-default"
                style={{
                  backgroundColor: 'rgba(var(--color-accent-rgb), 0.08)',
                  border: '1px solid rgba(var(--color-accent-rgb), 0.3)',
                  boxShadow: '0 0 20px rgba(var(--color-accent-rgb), 0.1)'
                }}>
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                    <div className="absolute inset-0 w-1.5 h-1.5 rounded-full bg-accent animate-ping opacity-40" />
                  </div>
                  <p className="text-[7px] xs:text-[9px] text-accent font-black uppercase tracking-[0.2em]">
                    Node Synchronized
                  </p>
                </div>
                <span className="font-mono text-[9px] xs:text-[10px] text-accent font-black tracking-tighter px-2.5 py-1 rounded-lg transition-colors"
                  style={{
                    backgroundColor: 'rgba(var(--color-accent-rgb), 0.15)',
                    border: '1px solid rgba(var(--color-accent-rgb), 0.4)'
                  }}>
                  ASYN-4A0D
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Dashboard;
