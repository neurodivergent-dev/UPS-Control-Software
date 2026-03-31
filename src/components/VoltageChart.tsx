import React from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer 
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
  return (
    <div className={`glass-panel p-10 rounded-[2.5rem] relative overflow-hidden transition-all duration-700 ${alert ? 'border-red-500/30 shadow-red-900/10' : 'hover:border-accent/30'}`}>
      {/* Background glow orb */}
      <div className={`absolute right-[-10%] top-[-10%] w-[40%] h-[40%] blur-[100px] opacity-[0.05] rounded-full transition-colors duration-1000 ${alert ? 'bg-red-500' : 'bg-accent'}`} />
      
      <div className="flex justify-between items-end mb-10">
        <div className="space-y-1">
          <div className="flex items-center space-x-3 mb-2">
            <div className={`w-3 h-3 rounded-full animate-pulse ${alert ? 'bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.5)]' : 'bg-accent shadow-glow-accent'}`} />
            <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-white/30">Node Telemetry</h3>
          </div>
          <div className="flex items-baseline space-x-3 text-4xl font-black tracking-tightest">
            <span className={alert ? 'text-red-500 glow-text-alert' : 'text-white'}>
                {currentVoltage}
            </span>
            <span className="text-xl font-medium text-white/10 uppercase tracking-widest">V RMS</span>
          </div>
        </div>
        
        <div className="flex flex-col text-right">
             <span className="text-[9px] uppercase tracking-widest font-black text-white/20">Frequency Scan</span>
             <span className="text-xl font-medium text-white/40 tracking-tighter">50.0Hz</span>
        </div>
      </div>

      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={history}>
            <defs>
              <linearGradient id="colorVoltage" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={alert ? "#ef4444" : "var(--color-accent)"} stopOpacity={0.4}/>
                <stop offset="95%" stopColor={alert ? "#ef4444" : "var(--color-accent)"} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis 
              dataKey="time" 
              hide={true}
            />
            <YAxis 
              domain={['dataMin - 10', 'dataMax + 10']}
              hide={true}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(0,0,0,0.85)', 
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '1.5rem',
                fontSize: '11px',
                fontWeight: 'bold',
                textTransform: 'uppercase',
                backdropFilter: 'blur(20px)',
                letterSpacing: '0.1em'
              }}
              itemStyle={{ color: alert ? '#ef4444' : 'var(--color-accent)' }}
            />
            <Area 
              type="monotone" 
              dataKey="voltage" 
              stroke={alert ? "#ef4444" : "var(--color-accent)"} 
              strokeWidth={4}
              fillOpacity={1} 
              fill="url(#colorVoltage)" 
              animationDuration={800}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default VoltageChart;
