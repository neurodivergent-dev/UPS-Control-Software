import React, { useState } from 'react';
import { useUPSData, analyzeUPSWithAI } from '../services/upsService';
import { Brain, Cpu, MessageSquare, Terminal, ShieldAlert, Key, Zap, Power, Activity } from 'lucide-react';

const AIAnalysis: React.FC = () => {
  const { data: upsData, isLoading } = useUPSData();
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('groq-api-key') || '');
  const [model, setModel] = useState(() => localStorage.getItem('groq-model') || 'llama-3.3-70b-versatile');
  const [analysis, setAnalysis] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showKeyInput, setShowKeyInput] = useState(!apiKey);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('groq-api-key', apiKey);
    localStorage.setItem('groq-model', model);
    setShowKeyInput(false);
  };

  const handleAnalysis = async () => {
    if (!apiKey) {
      setShowKeyInput(true);
      return;
    }

    if (!upsData?.workInfo) {
      setError('UPS data unavailable for analysis.');
      return;
    }

    setIsAnalyzing(true);
    setError(null);
    try {
      const result = await analyzeUPSWithAI(apiKey, upsData.workInfo, model);
      setAnalysis(result);
    } catch (err: any) {
      setError(err.message || 'Failure during core intelligence link.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-1000 pb-20 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex items-center space-x-4 sm:space-x-6">
        <div className="p-3 sm:p-4 bg-accent rounded-2xl sm:rounded-3xl text-black shadow-glow-accent flex-shrink-0">
          <Brain size={28} className="sm:w-8 sm:h-8" strokeWidth={2.5} />
        </div>
        <div className="min-w-0">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tighter uppercase text-white break-words">Core Intelligence</h2>
          <p className="text-[10px] sm:text-sm font-bold text-white/40 uppercase tracking-[0.3em] sm:tracking-[0.4em] hidden xs:block">Neural Link & System Diagnostics</p>
        </div>
      </div>

      {/* API Key Modal/Section */}
      {showKeyInput && (
        <section className="space-y-6 sm:space-y-8 animate-in slide-in-from-top-4 duration-500">
          <div className="flex items-center space-x-3 px-2">
            <Key size={16} className="sm:w-[18px] sm:h-[18px] text-accent flex-shrink-0" />
            <h3 className="text-[10px] sm:text-xs font-black uppercase tracking-[0.25em] sm:tracking-[0.3em] text-white/40">Neural Link Authorization</h3>
          </div>

          <div className="glass-panel p-6 sm:p-8 rounded-[2rem] border-0 relative overflow-hidden group">
            <div className="border-beam" />
            <form onSubmit={handleSaveSettings} className="space-y-4">
              <p className="text-xs sm:text-sm text-white/40 leading-relaxed">
                Connect your BYOK (Bring Your Own Key) and specify the model to activate Groq-powered hardware diagnostics.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">API Key</label>
                  <input
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="Enter Groq API Key..."
                    className="w-full px-4 sm:px-6 py-3 sm:py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/20 focus:outline-none focus:border-accent/50 transition-colors text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">AI Model ID</label>
                  <input
                    type="text"
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    placeholder="e.g. llama-3.3-70b-versatile"
                    className="w-full px-4 sm:px-6 py-3 sm:py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/20 focus:outline-none focus:border-accent/50 transition-colors text-sm"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full px-8 py-3 sm:py-4 bg-accent text-black rounded-xl font-black text-[10px] sm:text-sm uppercase tracking-widest hover:bg-accent/80 transition-all flex items-center justify-center space-x-2"
              >
                <Zap size={16} strokeWidth={2.5} />
                <span>Save Configuration</span>
              </button>
            </form>
          </div>
        </section>
      )}

      {/* Analysis Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Left: Hardware Status Summary */}
        <div className="lg:col-span-4 space-y-6">
          <div className="flex items-center space-x-3 px-2">
            <Activity size={16} className="sm:w-[18px] sm:h-[18px] text-accent flex-shrink-0" />
            <h3 className="text-[10px] sm:text-xs font-black uppercase tracking-[0.25em] sm:tracking-[0.3em] text-white/40">Live Telemetry</h3>
          </div>

          <div className="glass-panel p-6 sm:p-8 rounded-[2.5rem] border-0 space-y-6 relative overflow-hidden group">
             <div className="border-beam opacity-40" />
             
             {isLoading ? (
               <div className="flex flex-col items-center justify-center py-12 space-y-4">
                 <div className="w-12 h-12 border-2 border-accent border-t-transparent rounded-full animate-spin" />
                 <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20">Syncing Hardware...</span>
               </div>
             ) : (
               <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 bg-white/5 rounded-2xl">
                    <div className="flex items-center space-x-3">
                      <Cpu size={18} className="text-accent" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Core Health</span>
                    </div>
                    <span className="text-sm font-black text-white">{upsData?.workInfo?.batteryCapacity}%</span>
                  </div>

                  <div className="flex justify-between items-center p-4 bg-white/5 rounded-2xl">
                    <div className="flex items-center space-x-3">
                      <Power size={18} className="text-accent" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Grid Input</span>
                    </div>
                    <span className="text-sm font-black text-white">{upsData?.workInfo?.inputVoltage}</span>
                  </div>

                  <div className="flex justify-between items-center p-4 bg-white/5 rounded-2xl">
                    <div className="flex items-center space-x-3">
                      <Terminal size={18} className="text-accent" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Logic Mode</span>
                    </div>
                    <span className="text-[10px] font-black text-white uppercase tracking-wider">{upsData?.workInfo?.workMode}</span>
                  </div>

                  <button
                    onClick={handleAnalysis}
                    disabled={isAnalyzing || isLoading || !apiKey}
                    className={`w-full py-6 mt-4 rounded-3xl font-black text-sm uppercase tracking-[0.4em] transition-all relative overflow-hidden group
                      ${isAnalyzing ? 'bg-white/5 text-white/20 cursor-wait' : 'bg-accent text-black hover:scale-[1.02] active:scale-95 shadow-glow-accent'}
                    `}
                  >
                    {isAnalyzing ? 'Processing...' : 'Initiate Analysis'}
                    {!isAnalyzing && <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 skew-x-[35deg]" />}
                  </button>
                  
                  {!apiKey && (
                    <p className="text-[9px] font-bold text-center text-accent/50 uppercase tracking-widest">Neural Key Required</p>
                  )}
               </div>
             )}
          </div>
          
          <button 
            onClick={() => setShowKeyInput(!showKeyInput)}
            className="w-full py-4 text-[10px] font-black uppercase tracking-[0.3em] text-white/20 hover:text-white transition-colors"
          >
            Update Authentication Key
          </button>
        </div>

        {/* Right: Terminal Analysis */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center space-x-3 px-2">
            <MessageSquare size={16} className="sm:w-[18px] sm:h-[18px] text-accent flex-shrink-0" />
            <h3 className="text-[10px] sm:text-xs font-black uppercase tracking-[0.25em] sm:tracking-[0.3em] text-white/40">Intelligence Output</h3>
          </div>

          <div className="glass-panel min-h-[400px] p-8 sm:p-10 rounded-[3rem] border-0 relative overflow-hidden flex flex-col">
            <div className={`absolute inset-0 bg-accent/5 transition-opacity duration-1000 ${isAnalyzing ? 'opacity-100' : 'opacity-0'}`} />
            
            <div className="relative z-10 flex flex-col flex-1 h-full">
              {error && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center space-x-4 animate-in fade-in duration-500">
                  <ShieldAlert className="text-red-500 flex-shrink-0" />
                  <p className="text-xs sm:text-sm font-bold text-red-500 uppercase tracking-wider">{error}</p>
                </div>
              )}

              {analysis ? (
                <div className="prose prose-invert max-w-none animate-in fade-in slide-in-from-bottom-4 duration-1000">
                  <div className="flex items-center space-x-2 mb-6">
                    <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-accent">System Brain Active</span>
                  </div>
                  <div className="text-white/80 font-medium text-sm leading-relaxed space-y-6">
                    {analysis.split('\n').map((para, i) => (
                      <p key={i}>{para}</p>
                    ))}
                  </div>
                </div>
              ) : !isAnalyzing ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4 opacity-20">
                   <Brain size={64} strokeWidth={1} />
                   <div className="space-y-1">
                     <p className="text-sm font-black uppercase tracking-[0.4em]">Awaiting Uplink</p>
                     <p className="text-[10px] font-bold uppercase tracking-[0.2em]">Initiate hardware analysis through the core hub</p>
                   </div>
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center space-y-8">
                    <div className="relative">
                      <div className="w-24 h-24 rounded-full border-4 border-accent/10 flex items-center justify-center animate-[ping_3s_infinite]" />
                      <div className="absolute inset-0 w-24 h-24 rounded-full border-4 border-t-accent border-r-transparent border-b-transparent border-l-transparent animate-spin" />
                      <Brain className="absolute inset-0 m-auto text-accent" size={32} />
                    </div>
                    <div className="space-y-2 text-center">
                      <p className="text-xs font-black uppercase tracking-[0.5em] text-accent animate-pulse">Analyzing Core Voltages</p>
                      <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-white/20">Synthesizing Hardware State...</p>
                    </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAnalysis;
