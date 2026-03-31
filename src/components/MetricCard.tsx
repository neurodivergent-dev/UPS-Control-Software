import React from 'react';

interface MetricCardProps {
  label: string;
  value: string | number;
  unit: string;
  icon: any;
  progress?: number;
  alert?: boolean;
}

const MetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  unit,
  icon: Icon,
  progress,
  alert
}) => {
  return (
    <div
      className={`glass-panel p-6 xs:p-8 rounded-[2rem] relative overflow-hidden group transition-all duration-500 h-full flex flex-col hover:-translate-y-2 cursor-default ${alert ? 'border-red-500/30' : 'border-white/5 hover:border-accent/40'}`}
    >
      {/* Premium Rotating Border Light */}
      <div className={`border-beam transition-opacity duration-500 opacity-0 group-hover:opacity-100 ${alert ? 'border-beam-red' : ''}`} />

      {/* Background radial highlight */}
      <div className={`absolute -right-4 -top-4 w-24 h-24 blur-3xl opacity-10 rounded-full transition-colors duration-700 ${alert ? 'bg-red-500' : 'bg-accent'}`} />

      <div className="flex justify-between items-start mb-4 xs:mb-6">
        <div className={`p-2 xs:p-3 rounded-xl xs:rounded-2xl transition-all duration-500 ${alert ? 'bg-red-500/20 text-red-500' : 'bg-accent/10 text-accent group-hover:bg-accent/20'}`}>
          <Icon size={22} strokeWidth={2.5} />
        </div>
        {alert && (
          <div className="flex items-center space-x-1 px-2 py-1 bg-red-500/10 border border-red-500/20 rounded-lg flex-shrink-0">
            <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
            <span className="text-[9px] xs:text-[10px] font-black uppercase text-red-500 tracking-tighter">Alert</span>
          </div>
        )}
      </div>

      <div className="space-y-1">
        <span className="text-[9px] xs:text-[10px] sm:text-[11px] font-black uppercase tracking-wide xs:tracking-[0.25em] text-white/30 truncate block">
          {label}
        </span>
        <div className="flex items-baseline space-x-1 flex-wrap">
          <span className={`text-2xl xs:text-3xl sm:text-4xl font-black tracking-tighter transition-colors duration-500 ${alert ? 'text-red-500' : 'text-white'}`}>
            {value}
          </span>
          <span className="text-xs xs:text-sm sm:text-xl font-medium text-white/20">{unit}</span>
        </div>
      </div>

      {progress !== undefined && (
        <div className="mt-6 xs:mt-8 space-y-2">
          <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
            <div
              style={{ width: `${progress}%` }}
              className={`h-full rounded-full transition-all duration-1000 ease-out ${alert ? 'bg-red-500' : 'bg-accent'} shadow-glow-accent`}
            />
          </div>
          <div className="flex justify-between text-[8px] xs:text-[9px] font-black uppercase tracking-widest text-white/20">
            <span>Critical</span>
            <span>{progress}% Capacity</span>
            <span>Nominal</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default MetricCard;
