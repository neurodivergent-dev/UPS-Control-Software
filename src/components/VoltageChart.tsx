import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';

interface VoltageChartProps {
  currentVoltage: string;
  history: Array<{ time: string; voltage: number }>;
  alert?: boolean;
}

const VoltageChart: React.FC<VoltageChartProps> = ({
  currentVoltage,
  history,
  alert
}) => {
  // Calculate min/max for display
  const voltages = history.map(h => h.voltage);
  const minVoltage = voltages.length > 0 ? Math.min(...voltages).toFixed(1) : '0';
  const maxVoltage = voltages.length > 0 ? Math.max(...voltages).toFixed(1) : '0';
  const avgVoltage = voltages.length > 0 
    ? (voltages.reduce((a, b) => a + b, 0) / voltages.length).toFixed(1) 
    : '0';

  return (
    <div className={`glass-panel p-10 rounded-[2.5rem] relative overflow-hidden transition-all duration-700 ${alert ? 'border-red-500/30 shadow-red-900/10' : 'hover:border-accent/30 shadow-glow-accent'}`}>
      {/* Animated background glow orbs */}
      <div className={`absolute right-[-10%] top-[-10%] w-[50%] h-[50%] blur-[120px] opacity-[0.08] rounded-full transition-colors duration-1000 animate-pulse ${alert ? 'bg-red-500' : 'bg-accent'}`} />
      <div className={`absolute left-[-10%] bottom-[-10%] w-[40%] h-[40%] blur-[100px] opacity-[0.05] rounded-full transition-colors duration-1000 ${alert ? 'bg-red-500' : 'bg-accent'}`} />

      {/* Header Section */}
      <div className="flex justify-between items-end mb-8 relative z-10">
        <div className="space-y-2">
          <div className="flex items-center space-x-3">
            <div className={`w-3 h-3 rounded-full animate-pulse shadow-lg ${alert ? 'bg-red-500 shadow-[0_0_20px_rgba(239,68,68,0.6)]' : 'bg-accent shadow-glow-accent'}`} />
            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40">Input Voltage</h3>
          </div>
          <div className="flex items-baseline space-x-3">
            <span className={`text-5xl font-black tracking-tighter ${alert ? 'text-red-500 glow-text' : 'text-white'}`}>
              {currentVoltage}
            </span>
            <span className="text-lg font-medium text-white/20 uppercase tracking-widest">V RMS</span>
          </div>
        </div>

        <div className="hidden sm:flex flex-col items-end">
          <div className="flex items-center space-x-2 px-4 py-2 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-md">
            <span className="text-[8px] uppercase tracking-widest font-black text-white/30">FREQ</span>
            <span className="text-lg font-black text-white/60 tracking-tighter">50.0 Hz</span>
          </div>
        </div>
      </div>

      {/* Mobile-only Frequency Badge - Placed naturally below header */}
      <div className="flex sm:hidden items-center justify-between px-6 py-3 bg-white/5 rounded-2xl border border-white/5 mb-6">
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Network Frequency</span>
        <div className="flex items-center space-x-2">
          <span className="text-[8px] uppercase tracking-widest font-black text-white/30">FREQ</span>
          <span className="text-lg font-black text-white/60 tracking-tighter">50.0 Hz</span>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-4 mb-6 relative z-10">
        <div className="glass-panel p-4 rounded-2xl border-white/5 text-center">
          <span className="text-[7px] font-black uppercase tracking-widest text-white/30 block mb-1">Min</span>
          <span className="text-lg font-black text-white/60 tracking-tighter">{minVoltage}V</span>
        </div>
        <div className="glass-panel p-4 rounded-2xl border-white/5 text-center">
          <span className="text-[7px] font-black uppercase tracking-widest text-white/30 block mb-1">Avg</span>
          <span className={`text-lg font-black tracking-tighter ${alert ? 'text-red-500' : 'text-accent'}`}>{avgVoltage}V</span>
        </div>
        <div className="glass-panel p-4 rounded-2xl border-white/5 text-center">
          <span className="text-[7px] font-black uppercase tracking-widest text-white/30 block mb-1">Max</span>
          <span className="text-lg font-black text-white/60 tracking-tighter">{maxVoltage}V</span>
        </div>
      </div>

      {/* Chart */}
      <div className="h-[280px] w-full relative z-10">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={history}>
            <defs>
              <linearGradient id="colorVoltage" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={alert ? "#ef4444" : "var(--color-accent)"} stopOpacity={0.5}/>
                <stop offset="50%" stopColor={alert ? "#ef4444" : "var(--color-accent)"} stopOpacity={0.2}/>
                <stop offset="100%" stopColor={alert ? "#ef4444" : "var(--color-accent)"} stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="glowLine" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={alert ? "#ef4444" : "var(--color-accent)"} stopOpacity={1}/>
                <stop offset="100%" stopColor={alert ? "#ef4444" : "var(--color-accent)"} stopOpacity={0.3}/>
              </linearGradient>
            </defs>
            
            {/* Reference lines for voltage thresholds */}
            <ReferenceLine y={230} stroke="rgba(255,255,255,0.1)" strokeDasharray="3 3" />
            <ReferenceLine y={210} stroke="rgba(255,255,255,0.1)" strokeDasharray="3 3" />
            
            <XAxis
              dataKey="time"
              hide={true}
            />
            <YAxis
              domain={['dataMin - 5', 'dataMax + 5']}
              hide={true}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(0,0,0,0.9)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '1rem',
                fontSize: '10px',
                fontWeight: 'bold',
                textTransform: 'uppercase',
                backdropFilter: 'blur(20px)',
                letterSpacing: '0.15em',
                boxShadow: '0 0 30px rgba(0,0,0,0.5)'
              }}
              itemStyle={{
                color: alert ? '#ef4444' : 'var(--color-accent)',
                textShadow: alert ? '0 0 10px rgba(239,68,68,0.5)' : '0 0 10px rgba(var(--color-accent-rgb),0.5)'
              }}
              labelStyle={{ color: '#fff', marginBottom: '0.5rem' }}
              formatter={(value) => [`${Number(value).toFixed(1)} V`, 'Voltage']}
            />
            <Area
              type="monotone"
              dataKey="voltage"
              stroke="url(#glowLine)"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorVoltage)"
              animationDuration={1000}
              activeDot={{
                r: 6,
                fill: alert ? "#ef4444" : "var(--color-accent)",
                stroke: "#fff",
                strokeWidth: 2,
                filter: `drop-shadow(0 0 10px ${alert ? 'rgba(239,68,68,0.8)' : 'rgba(var(--color-accent-rgb),0.8)'})`
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Bottom status bar */}
      <div className="flex justify-between items-center mt-6 pt-6 border-t border-white/5 relative z-10">
        <div className="flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full ${alert ? 'bg-red-500 animate-pulse' : 'bg-accent'}`} />
          <span className="text-[8px] font-black uppercase tracking-widest text-white/30">Real-time</span>
        </div>
        <span className="text-[8px] font-black uppercase tracking-widest text-white/20">
          {history.length} samples
        </span>
      </div>
    </div>
  );
};

export default VoltageChart;
