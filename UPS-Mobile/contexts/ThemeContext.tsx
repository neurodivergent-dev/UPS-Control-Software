import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Theme, AppTheme } from '../constants/Theme';

export type ThemeMode = 'light' | 'dark' | 'system';
export type AccentColor = 'purple' | 'blue' | 'emerald' | 'amber' | 'rose' | 'industrial' | 'orange' | 'crimson' | 'teal' | 'indigo' | 'slate' | 'gold' | 'mint' | 'cyan' | 'violet' | 'forest' | 'coffee' | 'frost';

export interface PaletteColors {
  primary: string;
  secondary: string;
  gradient: [string, string];
  muted: string;
}

export const Palettes: Record<AccentColor, PaletteColors> = {
  purple: { primary: '#BC00FF', secondary: '#8A2BE2', gradient: ['#BC00FF', '#8A2BE2'], muted: '#BC00FF20' },
  blue: { primary: '#3b82f6', secondary: '#1d4ed8', gradient: ['#3b82f6', '#1d4ed8'], muted: '#3b82f620' },
  emerald: { primary: '#10b981', secondary: '#059669', gradient: ['#10b981', '#059669'], muted: '#10b98120' },
  amber: { primary: '#f59e0b', secondary: '#d97706', gradient: ['#f59e0b', '#d97706'], muted: '#f59e0b20' },
  rose: { primary: '#f43f5e', secondary: '#e11d48', gradient: ['#f43f5e', '#e11d48'], muted: '#f43f5e20' },
  industrial: { primary: '#64748b', secondary: '#334155', gradient: ['#64748b', '#334155'], muted: '#64748b20' },
  orange: { primary: '#ff7e5f', secondary: '#feb47b', gradient: ['#ff7e5f', '#feb47b'], muted: '#ff7e5f20' },
  crimson: { primary: '#e91e63', secondary: '#c2185b', gradient: ['#e91e63', '#c2185b'], muted: '#e91e6320' },
  teal: { primary: '#00ced1', secondary: '#20b2aa', gradient: ['#00ced1', '#20b2aa'], muted: '#00ced120' },
  indigo: { primary: '#4b0082', secondary: '#6a5acd', gradient: ['#4b0082', '#6a5acd'], muted: '#4b008220' },
  slate: { primary: '#475569', secondary: '#1e293b', gradient: ['#475569', '#1e293b'], muted: '#47556920' },
  gold: { primary: '#ffd700', secondary: '#b8860b', gradient: ['#ffd700', '#b8860b'], muted: '#ffd70020' },
  mint: { primary: '#98ff98', secondary: '#3cb371', gradient: ['#98ff98', '#3cb371'], muted: '#98ff9820' },
  cyan: { primary: '#00ffff', secondary: '#00ced1', gradient: ['#00ffff', '#00ced1'], muted: '#00ffff20' },
  violet: { primary: '#ee82ee', secondary: '#9400d3', gradient: ['#ee82ee', '#9400d3'], muted: '#ee82ee20' },
  forest: { primary: '#228b22', secondary: '#006400', gradient: ['#228b22', '#006400'], muted: '#228b2220' },
  coffee: { primary: '#6f4e37', secondary: '#3c2a21', gradient: ['#6f4e37', '#3c2a21'], muted: '#6f4e3720' },
  frost: { primary: '#ffffff', secondary: '#e2e8f0', gradient: ['#ffffff', '#cbd5e1'], muted: '#ffffff40' },
};

interface ThemeContextType {
  theme: AppTheme;
  isDark: boolean;
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  accent: AccentColor;
  setAccent: (color: AccentColor) => void;
  palette: PaletteColors;
  apiKey: string;
  setApiKey: (key: string) => void;
  modelId: string;
  setModelId: (id: string) => void;
  serverIp: string;
  setServerIp: (ip: string) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<ThemeMode>('system');
  const [accent, setAccent] = useState<AccentColor>('purple');
  const [apiKey, setApiKey] = useState<string>('');
  const [modelId, setModelId] = useState<string>('llama-3.3-70b-versatile');
  const [serverIp, setServerIp] = useState<string>('192.168.1.203');
  const [isLoaded, setIsLoaded] = useState(false);
  const systemColorScheme = useColorScheme();

  // Load configuration from device storage on startup
  useEffect(() => {
    const loadConfig = async () => {
      try {
        const saved = await AsyncStorage.getItem('UPS_CORE_CONFIG');
        if (saved) {
          const config = JSON.parse(saved);
          if (config.mode) setMode(config.mode);
          if (config.accent) setAccent(config.accent);
          if (config.apiKey) setApiKey(config.apiKey);
          if (config.modelId) setModelId(config.modelId);
          if (config.serverIp) setServerIp(config.serverIp);
        }
      } catch (e) {
        console.error('Failed to load system config:', e);
      } finally {
        setIsLoaded(true);
      }
    };
    loadConfig();
  }, []);

  // Save configuration to device storage whenever states change
  useEffect(() => {
    if (isLoaded) {
      const saveConfig = async () => {
        try {
          await AsyncStorage.setItem('UPS_CORE_CONFIG', JSON.stringify({
            mode, accent, apiKey, modelId, serverIp
          }));
        } catch (e) {
          console.error('Failed to save system config:', e);
        }
      };
      saveConfig();
    }
  }, [mode, accent, apiKey, modelId, serverIp, isLoaded]);

  const isDark = useMemo(() => {
    if (mode === 'system') return systemColorScheme === 'dark';
    return mode === 'dark';
  }, [mode, systemColorScheme]);

  const palette = useMemo(() => {
    const basePalette = Palettes[accent];
    // Special Case: Frost (White) on Light mode should be dark for readability
    if (accent === 'frost' && !isDark) {
      return {
        ...basePalette,
        primary: '#0f172a', // Deep Slate/Black
        secondary: '#334155',
        muted: '#0f172a20'
      };
    }
    return basePalette;
  }, [accent, isDark]);

  const contextValue = useMemo(() => {
    const baseTheme = isDark ? Theme.dark : Theme.light;
    return {
      theme: {
        ...baseTheme,
        colors: {
          ...baseTheme.colors,
          accent: {
            ...baseTheme.colors.accent,
            primary: palette.primary,
            secondary: palette.secondary,
            primaryMuted: palette.muted,
          }
        }
      },
      isDark,
      mode,
      setMode,
      accent,
      setAccent,
      palette,
      apiKey,
      setApiKey,
      modelId,
      setModelId,
      serverIp,
      setServerIp
    };
  }, [isDark, mode, accent, palette, apiKey, modelId, serverIp]);

  if (!isLoaded) return null; // Wait for config hydration

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) throw new Error('useTheme must be used within a ThemeProvider');
  return context;
}
