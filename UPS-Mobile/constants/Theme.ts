export const Theme = {
  light: {
    dark: false,
    colors: {
      background: '#F8FAFC',
      backgroundSecondary: '#FFFFFF',
      surface: '#FFFFFF',
      border: '#E2E8F0',
      text: {
        primary: '#0F172A',
        secondary: '#475569',
        tertiary: '#94A3B8',
        inverse: '#FFFFFF',
      },
      accent: {
        primary: '#BC00FF',
        primaryMuted: '#BC00FF15',
        secondary: '#8A2BE2',
        success: '#10B981',
        successMuted: '#10B98115',
        warning: '#F59E0B',
        warningMuted: '#F59E0B15',
        error: '#EF4444',
        errorMuted: '#EF444415',
      }
    },
    spacing: {
      xs: 4,
      sm: 8,
      md: 16,
      lg: 24,
      xl: 32,
    },
    radii: {
      xs: 4,
      sm: 8,
      md: 12,
      lg: 16,
      xl: 24,
      full: 9999,
    }
  },
  dark: {
    dark: true,
    colors: {
      background: '#020617',
      backgroundSecondary: '#0F172A',
      surface: '#1E293B',
      border: '#334155',
      text: {
        primary: '#F8FAFC',
        secondary: '#94A3B8',
        tertiary: '#475569',
        inverse: '#0F172A',
      },
      accent: {
        primary: '#BC00FF',
        primaryMuted: '#BC00FF25',
        secondary: '#D8B4FE',
        success: '#10B981',
        successMuted: '#10B98125',
        warning: '#F59E0B',
        warningMuted: '#F59E0B25',
        error: '#EF4444',
        errorMuted: '#EF444425',
      }
    },
    spacing: {
      xs: 4,
      sm: 8,
      md: 16,
      lg: 24,
      xl: 32,
    },
    radii: {
      xs: 4,
      sm: 8,
      md: 12,
      lg: 16,
      xl: 24,
      full: 9999,
    }
  }
};

export type AppTheme = typeof Theme.light;
