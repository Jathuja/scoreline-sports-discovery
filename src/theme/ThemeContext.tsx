import React, { createContext, useContext } from 'react';
import { useColorScheme } from 'react-native';
import { colors, ThemeColors } from './colors';
import { typography, TypographyTokens } from './typography';
import { spacing, SpacingTokens } from './spacing';
import { layout, LayoutTokens } from './layout';
import type { ThemeMode } from '../store/slices/appSlice';

export interface AppTheme {
  colors: ThemeColors;
  typography: TypographyTokens;
  spacing: SpacingTokens;
  layout: LayoutTokens;
  isDark: boolean;
}

export const lightTheme: AppTheme = {
  colors: colors.light,
  typography,
  spacing,
  layout,
  isDark: false,
};

export const darkTheme: AppTheme = {
  colors: colors.dark,
  typography,
  spacing,
  layout,
  isDark: true,
};

export const ThemeContext = createContext<AppTheme>(lightTheme);

export interface ThemeProviderProps {
  mode?: ThemeMode;
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  mode = 'light',
  children,
}) => {
  const systemScheme = useColorScheme();
  const isDark =
    mode === 'dark' || (mode === 'system' && systemScheme === 'dark');
  const activeTheme = isDark ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={activeTheme}>{children}</ThemeContext.Provider>
  );
};

export const useAppTheme = (): AppTheme => useContext(ThemeContext) ?? lightTheme;
