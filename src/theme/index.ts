import { colors } from './colors';
import { typography } from './typography';
import { spacing } from './spacing';
import { layout } from './layout';
import {
  AppTheme,
  lightTheme,
  darkTheme,
  ThemeContext,
  ThemeProvider,
  useAppTheme,
} from './ThemeContext';

export const theme = lightTheme;

export type { AppTheme };
export {
  colors,
  typography,
  spacing,
  layout,
  lightTheme,
  darkTheme,
  ThemeContext,
  ThemeProvider,
  useAppTheme,
};
