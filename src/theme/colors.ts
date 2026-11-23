export interface ColorPalette {
  primary: string;
  primaryDark: string;
  primaryLight: string;
  secondary: string;
  secondaryLight: string;
  accent: string;
  background: string;
  surface: string;
  surfaceSubtle: string;
  textPrimary: string;
  textSecondary: string;
  textTertiary: string;
  textInverse: string;
  border: string;
  borderSubtle: string;
  success: string;
  error: string;
  warning: string;
  info: string;
}

export const colors: { light: ColorPalette; dark: ColorPalette } = {
  light: {
    primary: '#0F766E', // Deep Teal / Sports emerald
    primaryDark: '#0D5F58',
    primaryLight: '#2DD4BF',
    secondary: '#1E293B', // Slate
    secondaryLight: '#334155',
    accent: '#F59E0B', // Amber
    background: '#F8FAFC',
    surface: '#FFFFFF',
    surfaceSubtle: '#F1F5F9',
    textPrimary: '#0F172A',
    textSecondary: '#64748B',
    textTertiary: '#94A3B8',
    textInverse: '#FFFFFF',
    border: '#E2E8F0',
    borderSubtle: '#F1F5F9',
    success: '#10B981',
    error: '#EF4444',
    warning: '#F59E0B',
    info: '#3B82F6',
  },
  dark: {
    primary: '#14B8A6',
    primaryDark: '#0F766E',
    primaryLight: '#5EEAD4',
    secondary: '#E2E8F0',
    secondaryLight: '#94A3B8',
    accent: '#FBBF24',
    background: '#0B0F17',
    surface: '#161F2E',
    surfaceSubtle: '#1E293B',
    textPrimary: '#F8FAFC',
    textSecondary: '#94A3B8',
    textTertiary: '#64748B',
    textInverse: '#0F172A',
    border: '#273449',
    borderSubtle: '#1E293B',
    success: '#34D399',
    error: '#F87171',
    warning: '#FBBF24',
    info: '#60A5FA',
  },
};

export type ThemeColors = ColorPalette;
