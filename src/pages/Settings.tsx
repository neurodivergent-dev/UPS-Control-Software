import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { loginToViewPower, useUPSControlMutation, updateShutdownSettings } from '../services/upsService';
import { Settings as SettingsIcon, Palette, Terminal, ShieldCheck, Sun, Moon, Monitor, LogIn, LogOut, Key, Battery, ShieldAlert, Save, Clock, Power, AlertTriangle, MonitorOff } from 'lucide-react';

interface SettingsProps {
  setTheme?: (theme: string) => void;
  currentTheme?: string;
}

const Settings: React.FC<SettingsProps> = ({ setTheme, currentTheme }) => {
  const { themeMode, setThemeMode } = useTheme();
  const [username, setUsername] = useState('Administrator');
  const [password, setPassword] = useState('administrator');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [loginSuccess, setLoginSuccess] = useState(false);
  
  // Active settings section
  const [activeSection, setActiveSection] = useState<'power' | 'battery' | 'alerts' | 'local'>('power');
  
  // UPS Shutdown settings state
  const [shutdownSettings, setShutdownSettings] = useState({
    batModeShutdownTime: 0,
    batModeShutdownSeconds: 0,
    batModeShutdownTime2: 0,
    batModeShutdownSeconds2: 0,
    modeShutdown: 2,
    batCapacity: 30,
    batModeShutdownUps: true,
    lowBatShutdown: true,
    lowBatShutdownUPS: 2,
    shutdownMode: 0,
    shutdownTime: 2,
    excuteProgram: '',
    excuteProgramTime: 1,
    cancelShutExcute: '',
    beforeAlertTime: 60,
    alertIntervalTime: 30,
  });
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState('');
  
  const controlMutation = useUPSControlMutation();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setLoginSuccess(false);
    
    try {
      await loginToViewPower(username, password);
      setIsLoggedIn(true);
      setLoginSuccess(true);
      setTimeout(() => setLoginSuccess(false), 3000);
    } catch (err: any) {
      setLoginError(err.message || 'Login failed');
    }
  };

  const handleSaveShutdownSettings = async () => {
    setSaveError('');
    setSaveSuccess(false);
    
    try {
      await updateShutdownSettings(shutdownSettings);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: any) {
      setSaveError(err.message || 'Failed to save settings');
    }
  };

  const handleTestCommand = async (type: string) => {
    try {
      // ViewPower control endpoint komutları
      // Çalışan komutlar: test, buzzer, shutdown, restart, battery_test
      const minute = type === 'shutdown' ? 1 : undefined;
      await controlMutation.mutateAsync({ type, minute });
      alert(`Command "${type}" sent successfully! Check UPS status.`);
    } catch (err: any) {
      // Hata mesajını daha açıklayıcı yap
      const errorMsg = err.message || 'Unknown error';
      
      // ViewPower bazen HTML error döndürür
      if (errorMsg.includes('NullPointerException') || errorMsg.includes('error')) {
        alert(`ViewPower control endpoint error.\n\nThis is a ViewPower server issue, not a client issue.\n\nTry:\n1. Restart ViewPower service\n2. Login via web interface first\n3. Check UPS connection`);
      } else {
        alert(`Command failed: ${errorMsg}`);
      }
    }
  };

  const themes = [
    { id: 'cyan', label: 'Glacier Blue', color: '#00F0FF', desc: 'High-contrast Arctic' },
    { id: 'tokyo', label: 'Tokyo Night', color: '#BC00FF', desc: 'Cyberpunk Neon' },
    { id: 'solar', label: 'Amber Grid', color: '#FF4E00', desc: 'Solar Energy' },
    { id: 'neon', label: 'Matrix Core', color: '#00FF00', desc: 'Classic Tech' },
    { id: 'crimson', label: 'Crimson Flux', color: '#FF003C', desc: 'Aggressive Red' },
    { id: 'gold', label: 'Royal Gold', color: '#FFD700', desc: 'Premium Elite' },
    { id: 'rose', label: 'Neon Rose', color: '#FF66B2', desc: 'Synthwave Pink' },
    { id: 'lime', label: 'Toxic Lime', color: '#BFFF00', desc: 'Radioactive Green' },
  ];

  return (
    <div className="space-y-12 sm:space-y-16 animate-in fade-in duration-1000 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="flex items-center space-x-4 sm:space-x-6">
        <div className="p-3 sm:p-4 bg-accent rounded-2xl sm:rounded-3xl text-black shadow-glow-accent flex-shrink-0">
          <SettingsIcon size={28} className="sm:w-8 sm:h-8" strokeWidth={2.5} />
        </div>
        <div className="min-w-0">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tighter uppercase text-white break-words">System Control</h2>
          <p className="text-[10px] sm:text-sm font-bold text-white/40 uppercase tracking-[0.3em] sm:tracking-[0.4em] hidden xs:block">Hardware Logic & Atmospheric Shift</p>
        </div>
      </div>

      {/* ViewPower Authentication */}
      <section className="space-y-6 sm:space-y-8">
        <div className="flex items-center space-x-3 px-2">
          <Key size={16} className="sm:w-[18px] sm:h-[18px] text-accent flex-shrink-0" />
          <h3 className="text-[10px] sm:text-xs font-black uppercase tracking-[0.25em] sm:tracking-[0.3em] text-white/40">UPS Authentication</h3>
        </div>

        <div className="glass-panel p-6 sm:p-8 lg:p-10 rounded-[2rem] sm:rounded-[3rem] border-white/10 relative overflow-hidden">
          <div className="absolute -right-16 sm:-right-20 -top-16 sm:-top-20 w-48 sm:w-64 h-48 sm:h-64 bg-accent/5 blur-[80px] sm:blur-[100px] rounded-full" />

          <div className="relative z-10">
            {!isLoggedIn ? (
              <form onSubmit={handleLogin} className="space-y-5 sm:space-y-6">
                <p className="text-xs sm:text-sm text-white/40 leading-relaxed">
                  ViewPower Administrator credentials required for hardware control commands.
                </p>

                <div className="space-y-4">
                  <div>
                    <label className="block text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-white/60 mb-2">Username</label>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full px-4 sm:px-6 py-3 sm:py-4 bg-white/5 border border-white/10 rounded-xl sm:rounded-2xl text-white placeholder-white/20 focus:outline-none focus:border-accent/50 transition-colors text-sm"
                      placeholder="Administrator"
                    />
                  </div>

                  <div>
                    <label className="block text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-white/60 mb-2">Password</label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-4 sm:px-6 py-3 sm:py-4 bg-white/5 border border-white/10 rounded-xl sm:rounded-2xl text-white placeholder-white/20 focus:outline-none focus:border-accent/50 transition-colors text-sm"
                      placeholder="administrator"
                    />
                  </div>
                </div>

                {loginError && (
                  <div className="px-3 sm:px-4 py-2.5 sm:py-3 bg-red-500/10 border border-red-500/20 rounded-lg sm:rounded-xl flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse flex-shrink-0" />
                    <span className="text-[9px] sm:text-[10px] text-red-500 font-black uppercase tracking-wider break-words">{loginError}</span>
                  </div>
                )}

                {loginSuccess && (
                  <div className="px-3 sm:px-4 py-2.5 sm:py-3 bg-accent/10 border border-accent/20 rounded-lg sm:rounded-xl flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full bg-accent animate-pulse flex-shrink-0" />
                    <span className="text-[9px] sm:text-[10px] text-accent font-black uppercase tracking-wider">Authentication Successful</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={controlMutation.isPending}
                  className="w-full py-3 sm:py-4 bg-accent text-black rounded-xl sm:rounded-2xl font-black text-[10px] sm:text-sm uppercase tracking-widest hover:bg-accent/80 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  <LogIn size={16} className="sm:w-[18px] sm:h-[18px]" strokeWidth={2.5} />
                  <span className="truncate">Authenticate with ViewPower</span>
                </button>
              </form>
            ) : (
              <div className="space-y-5 sm:space-y-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center space-x-3 sm:space-x-4 w-full sm:w-auto">
                    <div className="p-2.5 sm:p-3 bg-accent/10 text-accent rounded-xl sm:rounded-2xl flex-shrink-0">
                      <ShieldCheck size={20} className="sm:w-6 sm:h-6" strokeWidth={2.5} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs sm:text-sm font-black text-white uppercase tracking-wider truncate">Authenticated</p>
                      <p className="text-[9px] sm:text-[10px] text-white/40 uppercase tracking-widest">Session Active</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsLoggedIn(false)}
                    className="w-full sm:w-auto px-5 sm:px-6 py-2.5 sm:py-3 glass-panel border-white/10 rounded-xl sm:rounded-2xl text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-white/60 hover:text-white hover:border-white/20 transition-all flex items-center justify-center space-x-2"
                  >
                    <LogOut size={14} className="sm:w-4 sm:h-4" strokeWidth={2.5} />
                    <span>Logout</span>
                  </button>
                </div>

                <div className="pt-5 sm:pt-6 border-t border-white/10">
                  <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-white/40 mb-4">Test Control Commands</p>
                  <div className="grid grid-cols-2 gap-3 sm:gap-4">
                    <button
                      onClick={() => handleTestCommand('test')}
                      disabled={controlMutation.isPending}
                      className="px-4 sm:px-6 py-3 sm:py-4 bg-accent/10 border border-accent/20 rounded-xl sm:rounded-2xl text-accent font-black text-[9px] sm:text-[10px] uppercase tracking-widest hover:bg-accent/20 transition-all disabled:opacity-50"
                    >
                      Test Alarm
                    </button>
                    <button
                      onClick={() => handleTestCommand('buzzer_on')}
                      disabled={controlMutation.isPending}
                      className="px-4 sm:px-6 py-3 sm:py-4 bg-white/5 border border-white/10 rounded-xl sm:rounded-2xl text-white/60 font-black text-[9px] sm:text-[10px] uppercase tracking-widest hover:bg-white/10 hover:text-white transition-all disabled:opacity-50"
                    >
                      Buzzer ON
                    </button>
                    <button
                      onClick={() => handleTestCommand('buzzer_off')}
                      disabled={controlMutation.isPending}
                      className="px-4 sm:px-6 py-3 sm:py-4 bg-white/5 border border-white/10 rounded-xl sm:rounded-2xl text-white/60 font-black text-[9px] sm:text-[10px] uppercase tracking-widest hover:bg-white/10 hover:text-white transition-all disabled:opacity-50"
                    >
                      Buzzer OFF
                    </button>
                    <button
                      onClick={() => handleTestCommand('shutdown')}
                      disabled={controlMutation.isPending}
                      className="px-4 sm:px-6 py-3 sm:py-4 bg-red-500/10 border border-red-500/20 rounded-xl sm:rounded-2xl text-red-500 font-black text-[9px] sm:text-[10px] uppercase tracking-widest hover:bg-red-500/20 transition-all disabled:opacity-50"
                    >
                      Shutdown UPS
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Theme Mode Selection - Light/Dark/System */}
      <section className="space-y-6 sm:space-y-8">
        <div className="flex items-center space-x-3 px-2">
          <Monitor size={16} className="sm:w-[18px] sm:h-[18px] text-accent flex-shrink-0" />
          <h3 className="text-[10px] sm:text-xs font-black uppercase tracking-[0.25em] sm:tracking-[0.3em] text-white/40">Theme Mode</h3>
        </div>
        <div className="grid grid-cols-1 xs:grid-cols-3 gap-4 sm:gap-6">
          {[
            { id: 'light', label: 'Light', icon: Sun, color: '#F5F5F7' },
            { id: 'dark', label: 'Dark', icon: Moon, color: '#1A1A1A' },
            { id: 'system', label: 'System', icon: Monitor, color: '#0066FF' },
          ].map(({ id, label, icon: Icon, color }) => (
            <button
              key={id}
              onClick={() => setThemeMode(id as 'light' | 'dark' | 'system')}
              className={`
                group relative p-6 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] transition-all duration-500 overflow-hidden border-2
                ${themeMode === id ? 'border-accent bg-accent/[0.05]' : 'border-white/5 bg-white/[0.02] hover:border-white/20'}
              `}
            >
              <div className="absolute -right-6 sm:-right-8 -top-6 sm:-top-8 w-20 sm:w-24 h-20 sm:h-24 blur-2xl sm:blur-3xl opacity-20 rounded-full transition-transform group-hover:scale-150" style={{ backgroundColor: color }} />

              <div className="flex flex-col items-center space-y-3 sm:space-y-4 relative z-10">
                <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl flex items-center justify-center transition-all duration-500 ${themeMode === id ? 'bg-accent text-black shadow-glow-accent' : 'bg-white/5 text-white/40'}`}>
                  <Icon size={24} className="sm:w-7 sm:h-7" strokeWidth={2.5} />
                </div>
                <span className={`text-[10px] sm:text-[11px] font-black uppercase tracking-[0.15em] sm:tracking-[0.2em] ${themeMode === id ? 'text-white' : 'text-white/40'}`}>
                  {label}
                </span>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Theme Selection - Rebuilt for V3.0 */}
      <section className="space-y-6 sm:space-y-8">
        <div className="flex items-center space-x-3 px-2">
          <Palette size={16} className="sm:w-[18px] sm:h-[18px] text-accent flex-shrink-0" />
          <h3 className="text-[10px] sm:text-xs font-black uppercase tracking-[0.25em] sm:tracking-[0.3em] text-white/40">Interface Atmosphere</h3>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {themes.map(t => (
            <button
              key={t.id}
              onClick={() => setTheme?.(t.id)}
              className={`
                group relative p-6 sm:p-8 lg:p-10 rounded-[2rem] sm:rounded-[3rem] transition-all duration-700 overflow-hidden border-2
                ${currentTheme === t.id ? 'border-accent bg-accent/[0.03]' : 'border-white/5 bg-white/[0.02] hover:border-white/20'}
              `}
            >
              {/* The Color Orb */}
              <div className="absolute -right-6 sm:-right-8 -top-6 sm:-top-8 w-20 sm:w-24 h-20 sm:h-24 blur-2xl sm:blur-3xl opacity-20 rounded-full transition-transform group-hover:scale-150" style={{ backgroundColor: t.color }} />

              <div className="flex flex-col items-center text-center space-y-4 sm:space-y-6 relative z-10">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-[1.25rem] sm:rounded-[1.5rem] shadow-2xl transition-all duration-700 group-hover:rotate-12 group-hover:scale-110 flex items-center justify-center" style={{ backgroundColor: t.color, boxShadow: `0 0 40px ${t.color}66` }}>
                  <Palette className="text-black/40 sm:w-6 sm:h-6" size={20} strokeWidth={2.5} />
                </div>
                <div className="space-y-1">
                  <span className={`text-[10px] sm:text-[12px] font-black uppercase tracking-[0.15em] sm:tracking-[0.2em] block ${currentTheme === t.id ? 'text-white' : 'text-white/40'}`}>
                    {t.label}
                  </span>
                  <span className="text-[8px] sm:text-[9px] font-bold text-white/10 uppercase tracking-widest leading-none hidden xs:block">
                    {t.desc}
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* UPS Power Settings - Tabbed Interface like ViewPower */}
      <section className="space-y-6 sm:space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center space-x-3">
            <ShieldCheck size={16} className="sm:w-[18px] sm:h-[18px] text-accent flex-shrink-0" />
            <h3 className="text-[10px] sm:text-xs font-black uppercase tracking-[0.25em] sm:tracking-[0.3em] text-white/40">UPS Settings</h3>
          </div>

          {/* Section Tabs - Like ViewPower top navigation */}
          <div className="flex items-center space-x-1.5 sm:space-x-2 glass-panel p-1.5 sm:p-2 rounded-xl sm:rounded-2xl border-white/10 overflow-x-auto max-w-full">
            {[
              { id: 'power', label: 'Power', icon: Power },
              { id: 'battery', label: 'Battery', icon: Battery },
              { id: 'alerts', label: 'Alerts', icon: ShieldAlert },
              { id: 'local', label: 'Local', icon: MonitorOff },
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveSection(id as typeof activeSection)}
                className={`
                  px-3 sm:px-4 py-2 rounded-lg sm:rounded-xl flex items-center space-x-1.5 sm:space-x-2 transition-all flex-shrink-0
                  ${activeSection === id
                    ? 'bg-accent text-black shadow-glow-accent'
                    : 'text-white/40 hover:text-white hover:bg-white/5'}
                `}
              >
                <Icon size={14} className="sm:w-4 sm:h-4" strokeWidth={2.5} />
                <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-widest whitespace-nowrap">{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Power Section */}
        {activeSection === 'power' && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
            <div className="glass-panel p-6 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] border-white/10">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 bg-accent/10 text-accent rounded-xl flex-shrink-0">
                  <Battery size={18} className="sm:w-5 sm:h-5" strokeWidth={2.5} />
                </div>
                <h4 className="text-xs sm:text-sm font-black uppercase tracking-widest text-white">Battery Shutdown</h4>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-[8px] sm:text-[9px] font-black uppercase tracking-widest text-white/60 mb-2">
                    Shutdown at Battery {shutdownSettings.batCapacity}%
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={shutdownSettings.batCapacity}
                    onChange={(e) => setShutdownSettings({ ...shutdownSettings, batCapacity: parseInt(e.target.value) })}
                    className="w-full h-2 bg-white/5 rounded-lg appearance-none cursor-pointer accent-accent"
                  />
                </div>
                <label className="flex items-center justify-between p-3 sm:p-4 bg-white/5 rounded-xl sm:rounded-2xl cursor-pointer">
                  <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-white/60">Also shutdown UPS</span>
                  <input
                    type="checkbox"
                    checked={shutdownSettings.batModeShutdownUps}
                    onChange={(e) => setShutdownSettings({ ...shutdownSettings, batModeShutdownUps: e.target.checked })}
                    className="w-4 h-4 rounded accent-accent"
                  />
                </label>
              </div>
            </div>

            <div className="glass-panel p-6 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] border-white/10">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 bg-red-500/10 text-red-500 rounded-xl flex-shrink-0">
                  <AlertTriangle size={18} className="sm:w-5 sm:h-5" strokeWidth={2.5} />
                </div>
                <h4 className="text-xs sm:text-sm font-black uppercase tracking-widest text-white">Low Battery</h4>
              </div>
              <div className="space-y-3">
                <label className="flex items-center space-x-3 p-3 sm:p-4 bg-white/5 rounded-xl sm:rounded-2xl cursor-pointer">
                  <input
                    type="checkbox"
                    checked={shutdownSettings.lowBatShutdown}
                    onChange={(e) => setShutdownSettings({ ...shutdownSettings, lowBatShutdown: e.target.checked })}
                    className="w-4 h-4 rounded accent-accent"
                  />
                  <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-white/80">Shut down immediately</span>
                </label>
                <div className="space-y-2 pl-4">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="upsMode"
                      checked={shutdownSettings.lowBatShutdownUPS === 0}
                      onChange={() => setShutdownSettings({ ...shutdownSettings, lowBatShutdownUPS: 0 })}
                      className="w-3 h-3 accent-accent"
                    />
                    <span className="text-[8px] sm:text-[9px] font-black text-white/70">UPS shutdown immediately</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="upsMode"
                      checked={shutdownSettings.lowBatShutdownUPS === 2}
                      onChange={() => setShutdownSettings({ ...shutdownSettings, lowBatShutdownUPS: 2 })}
                      className="w-3 h-3 accent-accent"
                    />
                    <span className="text-[8px] sm:text-[9px] font-black text-white/70">UPS stays on</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="glass-panel p-6 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] border-white/10">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 bg-accent/10 text-accent rounded-xl flex-shrink-0">
                  <Clock size={18} className="sm:w-5 sm:h-5" strokeWidth={2.5} />
                </div>
                <h4 className="text-xs sm:text-sm font-black uppercase tracking-widest text-white">Scheduled Shutdown</h4>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-[8px] sm:text-[9px] font-black uppercase tracking-widest text-white/60 mb-2">Mode</label>
                  <select
                    value={shutdownSettings.modeShutdown}
                    onChange={(e) => setShutdownSettings({ ...shutdownSettings, modeShutdown: parseInt(e.target.value) })}
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white/5 border border-white/10 rounded-lg sm:rounded-xl text-white font-black text-sm focus:outline-none focus:border-accent/50"
                  >
                    <option value="0" className="bg-[var(--color-bg)]">Shutdown</option>
                    <option value="1" className="bg-[var(--color-bg)]">Sleep</option>
                    <option value="2" className="bg-[var(--color-bg)]">Depend on UPS</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[8px] sm:text-[9px] font-black uppercase tracking-widest text-white/60 mb-2">
                    Wait time (min)
                  </label>
                  <input
                    type="number"
                    value={shutdownSettings.shutdownTime}
                    onChange={(e) => setShutdownSettings({ ...shutdownSettings, shutdownTime: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white/5 border border-white/10 rounded-lg sm:rounded-xl text-white text-center font-mono font-black text-sm focus:outline-none focus:border-accent/50"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Battery Section */}
        {activeSection === 'battery' && (
          <div className="space-y-6 sm:space-y-8">
            {/* Battery Mode Delay */}
            <div className="glass-panel p-6 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] border-white/10">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 bg-accent/10 text-accent rounded-xl flex-shrink-0">
                  <Clock size={18} className="sm:w-5 sm:h-5" strokeWidth={2.5} />
                </div>
                <h4 className="text-xs sm:text-sm font-black uppercase tracking-widest text-white">When the UPS Running from the Battery</h4>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <label className="block text-[8px] sm:text-[9px] font-black uppercase tracking-widest text-white/60">
                    Shut down the local system after
                  </label>
                  <div className="flex items-center space-x-3">
                    <div className="flex-1">
                      <input
                        type="number"
                        min="0"
                        value={shutdownSettings.batModeShutdownTime}
                        onChange={(e) => setShutdownSettings({ ...shutdownSettings, batModeShutdownTime: parseInt(e.target.value) || 0 })}
                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white/5 border border-white/10 rounded-lg sm:rounded-xl text-white text-center font-mono font-black text-sm focus:outline-none focus:border-accent/50"
                      />
                      <span className="text-[7px] sm:text-[8px] font-black uppercase tracking-widest text-white/30 block mt-1">Min</span>
                    </div>
                    <span className="text-white/20 font-black text-xl sm:text-2xl">:</span>
                    <div className="flex-1">
                      <input
                        type="number"
                        min="0"
                        value={shutdownSettings.batModeShutdownSeconds}
                        onChange={(e) => setShutdownSettings({ ...shutdownSettings, batModeShutdownSeconds: parseInt(e.target.value) || 0 })}
                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white/5 border border-white/10 rounded-lg sm:rounded-xl text-white text-center font-mono font-black text-sm focus:outline-none focus:border-accent/50"
                      />
                      <span className="text-[7px] sm:text-[8px] font-black uppercase tracking-widest text-white/30 block mt-1">Sec</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="block text-[8px] sm:text-[9px] font-black uppercase tracking-widest text-white/60">
                    The local system is still on but execute file after
                  </label>
                  <div className="flex items-center space-x-3">
                    <div className="flex-1">
                      <input
                        type="number"
                        min="0"
                        value={shutdownSettings.batModeShutdownTime2}
                        onChange={(e) => setShutdownSettings({ ...shutdownSettings, batModeShutdownTime2: parseInt(e.target.value) || 0 })}
                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white/5 border border-white/10 rounded-lg sm:rounded-xl text-white text-center font-mono font-black text-sm focus:outline-none focus:border-accent/50"
                      />
                      <span className="text-[7px] sm:text-[8px] font-black uppercase tracking-widest text-white/30 block mt-1">Min</span>
                    </div>
                    <span className="text-white/20 font-black text-xl sm:text-2xl">:</span>
                    <div className="flex-1">
                      <input
                        type="number"
                        min="0"
                        value={shutdownSettings.batModeShutdownSeconds2}
                        onChange={(e) => setShutdownSettings({ ...shutdownSettings, batModeShutdownSeconds2: parseInt(e.target.value) || 0 })}
                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white/5 border border-white/10 rounded-lg sm:rounded-xl text-white text-center font-mono font-black text-sm focus:outline-none focus:border-accent/50"
                      />
                      <span className="text-[7px] sm:text-[8px] font-black uppercase tracking-widest text-white/30 block mt-1">Sec</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Battery Capacity Shutdown */}
            <div className="glass-panel p-6 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] border-white/10">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 bg-accent/10 text-accent rounded-xl flex-shrink-0">
                  <Battery size={18} className="sm:w-5 sm:h-5" strokeWidth={2.5} />
                </div>
                <h4 className="text-xs sm:text-sm font-black uppercase tracking-widest text-white">Battery Capacity Shutdown</h4>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-[8px] sm:text-[9px] font-black uppercase tracking-widest text-white/60 mb-2">
                    Local shutdown when the capacity of battery down to {shutdownSettings.batCapacity}%
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={shutdownSettings.batCapacity}
                    onChange={(e) => setShutdownSettings({ ...shutdownSettings, batCapacity: parseInt(e.target.value) })}
                    className="w-full h-2 bg-white/5 rounded-lg appearance-none cursor-pointer accent-accent"
                  />
                  <div className="flex justify-between text-[7px] sm:text-[8px] font-black uppercase tracking-widest text-white/30 mt-1">
                    <span>0%</span>
                    <span className="text-accent">{shutdownSettings.batCapacity}%</span>
                    <span>100%</span>
                  </div>
                </div>
                
                <label className="flex items-center space-x-3 p-3 sm:p-4 bg-white/5 rounded-xl sm:rounded-2xl cursor-pointer">
                  <input
                    type="checkbox"
                    checked={shutdownSettings.batModeShutdownUps}
                    onChange={(e) => setShutdownSettings({ ...shutdownSettings, batModeShutdownUps: e.target.checked })}
                    className="w-4 h-4 rounded accent-accent"
                  />
                  <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-white/80">
                    Also shut down the UPS after shutting down the local system
                  </span>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Alerts Section */}
        {activeSection === 'alerts' && (
          <div className="space-y-6 sm:space-y-8">
            {/* Warning Dialog */}
            <div className="glass-panel p-6 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] border-white/10">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 bg-accent/10 text-accent rounded-xl flex-shrink-0">
                  <ShieldAlert size={18} className="sm:w-5 sm:h-5" strokeWidth={2.5} />
                </div>
                <h4 className="text-xs sm:text-sm font-black uppercase tracking-widest text-white">Warning Dialog Settings</h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[8px] sm:text-[9px] font-black uppercase tracking-widest text-white/60 mb-2">
                    Pop-up dialog before shutdown
                  </label>
                  <div className="flex items-center space-x-3">
                    <input
                      type="number"
                      min="0"
                      value={shutdownSettings.beforeAlertTime}
                      onChange={(e) => setShutdownSettings({ ...shutdownSettings, beforeAlertTime: parseInt(e.target.value) || 0 })}
                      className="flex-1 px-3 sm:px-4 py-2.5 sm:py-3 bg-white/5 border border-white/10 rounded-lg sm:rounded-xl text-white text-center font-mono font-black text-sm focus:outline-none focus:border-accent/50"
                    />
                    <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-widest text-white/40">Sec</span>
                  </div>
                </div>

                <div>
                  <label className="block text-[8px] sm:text-[9px] font-black uppercase tracking-widest text-white/60 mb-2">
                    Warn me again every
                  </label>
                  <div className="flex items-center space-x-3">
                    <input
                      type="number"
                      min="0"
                      value={shutdownSettings.alertIntervalTime}
                      onChange={(e) => setShutdownSettings({ ...shutdownSettings, alertIntervalTime: parseInt(e.target.value) || 0 })}
                      className="flex-1 px-3 sm:px-4 py-2.5 sm:py-3 bg-white/5 border border-white/10 rounded-lg sm:rounded-xl text-white text-center font-mono font-black text-sm focus:outline-none focus:border-accent/50"
                    />
                    <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-widest text-white/40">Sec</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Local Shutdown Section - ALL ViewPower Settings */}
        {activeSection === 'local' && (
          <div className="space-y-6 sm:space-y-8">
            {/* UPS Battery Running Low */}
            <div className="glass-panel p-6 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] border-white/10">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 bg-red-500/10 text-red-500 rounded-xl flex-shrink-0">
                  <AlertTriangle size={18} className="sm:w-5 sm:h-5" strokeWidth={2.5} />
                </div>
                <h4 className="text-xs sm:text-sm font-black uppercase tracking-widest text-white">UPS Battery Running Low</h4>
              </div>

              <div className="space-y-4">
                <label className="flex items-center space-x-3 p-3 sm:p-4 bg-white/5 rounded-xl sm:rounded-2xl cursor-pointer">
                  <input
                    type="checkbox"
                    checked={shutdownSettings.lowBatShutdown}
                    onChange={(e) => setShutdownSettings({ ...shutdownSettings, lowBatShutdown: e.target.checked })}
                    className="w-4 h-4 rounded accent-accent"
                  />
                  <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-white/80">
                    Shut down the local system immediately
                  </span>
                </label>

                <div className="p-3 sm:p-4 bg-white/5 rounded-xl sm:rounded-2xl border border-white/5">
                  <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-widest text-white/60 mb-3 block">
                    UPS shut down depend on UPS model
                  </span>
                  <div className="space-y-2">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        name="lowBatUps"
                        checked={shutdownSettings.lowBatShutdownUPS === 0}
                        onChange={() => setShutdownSettings({ ...shutdownSettings, lowBatShutdownUPS: 0 })}
                        className="w-3 h-3 accent-accent"
                      />
                      <span className="text-[8px] sm:text-[9px] font-black text-white/70 uppercase tracking-wide">UPS will shutdown immediately</span>
                    </label>
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        name="lowBatUps"
                        checked={shutdownSettings.lowBatShutdownUPS === 2}
                        onChange={() => setShutdownSettings({ ...shutdownSettings, lowBatShutdownUPS: 2 })}
                        className="w-3 h-3 accent-accent"
                      />
                      <span className="text-[8px] sm:text-[9px] font-black text-white/70 uppercase tracking-wide">UPS is still on</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* When Scheduled Shutdown Triggered */}
            <div className="glass-panel p-6 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] border-white/10">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 bg-accent/10 text-accent rounded-xl flex-shrink-0">
                  <Clock size={18} className="sm:w-5 sm:h-5" strokeWidth={2.5} />
                </div>
                <h4 className="text-xs sm:text-sm font-black uppercase tracking-widest text-white">When a Scheduled Shutdown is Triggered</h4>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-[8px] sm:text-[9px] font-black uppercase tracking-widest text-white/60 mb-2">
                      The local system should
                    </label>
                    <div className="space-y-2">
                      <label className="flex items-center space-x-2 cursor-pointer p-3 bg-white/5 rounded-xl border border-white/5">
                        <input
                          type="radio"
                          name="shutdownMode"
                          checked={shutdownSettings.shutdownMode === 0}
                          onChange={() => setShutdownSettings({ ...shutdownSettings, shutdownMode: 0 })}
                          className="w-3 h-3 accent-accent"
                        />
                        <span className="text-[8px] sm:text-[9px] font-black text-white/70 uppercase tracking-wide">Shutdown</span>
                      </label>
                      <label className="flex items-center space-x-2 cursor-pointer p-3 bg-white/5 rounded-xl border border-white/5">
                        <input
                          type="radio"
                          name="shutdownMode"
                          checked={shutdownSettings.shutdownMode === 1}
                          onChange={() => setShutdownSettings({ ...shutdownSettings, shutdownMode: 1 })}
                          className="w-3 h-3 accent-accent"
                        />
                        <span className="text-[8px] sm:text-[9px] font-black text-white/70 uppercase tracking-wide">Go to sleep</span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[8px] sm:text-[9px] font-black uppercase tracking-widest text-white/60 mb-2">
                      Time to wait before shutting down the local system
                    </label>
                    <div className="flex items-center space-x-3">
                      <input
                        type="number"
                        min="0"
                        value={shutdownSettings.shutdownTime}
                        onChange={(e) => setShutdownSettings({ ...shutdownSettings, shutdownTime: parseInt(e.target.value) || 0 })}
                        className="flex-1 px-3 sm:px-4 py-2.5 sm:py-3 bg-white/5 border border-white/10 rounded-lg sm:rounded-xl text-white text-center font-mono font-black text-sm focus:outline-none focus:border-accent/50"
                      />
                      <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-widest text-white/40">Min</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-[8px] sm:text-[9px] font-black uppercase tracking-widest text-white/60 mb-2">
                      File to execute when shutting down
                    </label>
                    <input
                      type="text"
                      value={shutdownSettings.excuteProgram}
                      onChange={(e) => setShutdownSettings({ ...shutdownSettings, excuteProgram: e.target.value })}
                      placeholder="C:\WINDOWS\notepad.exe"
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white/5 border border-white/10 rounded-lg sm:rounded-xl text-white font-mono text-xs sm:text-sm focus:outline-none focus:border-accent/50 truncate"
                    />
                  </div>

                  <div>
                    <label className="block text-[8px] sm:text-[9px] font-black uppercase tracking-widest text-white/60 mb-2">
                      Maximum file execution time
                    </label>
                    <div className="flex items-center space-x-3">
                      <input
                        type="number"
                        min="0"
                        value={shutdownSettings.excuteProgramTime}
                        onChange={(e) => setShutdownSettings({ ...shutdownSettings, excuteProgramTime: parseInt(e.target.value) || 0 })}
                        className="flex-1 px-3 sm:px-4 py-2.5 sm:py-3 bg-white/5 border border-white/10 rounded-lg sm:rounded-xl text-white text-center font-mono font-black text-sm focus:outline-none focus:border-accent/50"
                      />
                      <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-widest text-white/40">Min</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[8px] sm:text-[9px] font-black uppercase tracking-widest text-white/60 mb-2">
                      Cancel shutdown execute file
                    </label>
                    <input
                      type="text"
                      value={shutdownSettings.cancelShutExcute}
                      onChange={(e) => setShutdownSettings({ ...shutdownSettings, cancelShutExcute: e.target.value })}
                      placeholder="C:\WINDOWS\notepad.exe"
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white/5 border border-white/10 rounded-lg sm:rounded-xl text-white font-mono text-xs sm:text-sm focus:outline-none focus:border-accent/50 truncate"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Save Button */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 sm:p-6 bg-accent/5 border border-accent/10 rounded-xl sm:rounded-2xl">
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 rounded-full bg-accent animate-pulse flex-shrink-0" />
            <p className="text-[9px] sm:text-[10px] text-accent/80 font-black uppercase tracking-wider">
              Settings will be saved to ViewPower
            </p>
          </div>
          <button
            onClick={handleSaveShutdownSettings}
            className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-accent text-black rounded-xl sm:rounded-2xl font-black text-[10px] sm:text-sm uppercase tracking-widest hover:bg-accent/80 transition-all flex items-center justify-center space-x-2"
          >
            <Save size={16} className="sm:w-[18px] sm:h-[18px]" strokeWidth={2.5} />
            <span>Save All Settings</span>
          </button>
        </div>

        {saveSuccess && (
          <div className="px-3 sm:px-4 py-2.5 sm:py-3 bg-accent/10 border border-accent/20 rounded-lg sm:rounded-xl flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-accent animate-pulse flex-shrink-0" />
            <span className="text-[9px] sm:text-[10px] text-accent font-black uppercase tracking-wider">Settings saved successfully!</span>
          </div>
        )}

        {saveError && (
          <div className="px-3 sm:px-4 py-2.5 sm:py-3 bg-red-500/10 border border-red-500/20 rounded-lg sm:rounded-xl flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse flex-shrink-0" />
            <span className="text-[9px] sm:text-[10px] text-red-500 font-black uppercase tracking-wider break-words">{saveError}</span>
          </div>
        )}
      </section>
      <div className="relative group overflow-hidden rounded-[2.5rem] sm:rounded-[3.5rem] p-6 sm:p-8 lg:p-12 glass-panel border-white/10 transition-all duration-700 hover:border-accent/20">
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 sm:gap-8 lg:gap-10">
          <div className="space-y-4 sm:space-y-6 max-w-xl w-full">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <Terminal className="text-accent flex-shrink-0 sm:w-5 sm:h-5" size={16} />
              <h3 className="text-[9px] sm:text-sm font-black uppercase tracking-[0.4em] sm:tracking-[0.5em] text-white/60">Security & Kernel</h3>
            </div>
            <p className="text-[10px] sm:text-xs text-white/40 font-bold uppercase tracking-widest leading-relaxed">
              All hardware commands are signed and transmitted via ViewPower /control/realTimeCtrl endpoint. Unauthorized access protocol active.
            </p>
          </div>
          <div className="flex items-center space-x-4 sm:space-x-6 w-full md:w-auto justify-between md:justify-end">
            <div className="text-right">
              <span className="block text-[8px] sm:text-[10px] font-black text-white/40 uppercase tracking-widest">System Build</span>
              <span className="text-xs sm:text-sm font-black text-white italic">VIBRANT-V3.0.PRO</span>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-accent text-black flex items-center justify-center shadow-glow-accent flex-shrink-0">
              <ShieldCheck size={20} className="sm:w-6 sm:h-6" strokeWidth={2.5} />
            </div>
          </div>
        </div>
        <div className="absolute -left-16 sm:-left-20 -bottom-16 sm:-bottom-20 w-64 sm:w-80 h-64 sm:h-80 bg-accent/5 blur-[100px] sm:blur-[120px] rounded-full pointer-events-none" />
      </div>
    </div>
  );
};

export default Settings;
