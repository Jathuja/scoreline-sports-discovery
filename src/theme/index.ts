import { colors, ThemeColors } from './colors';
import { typography, TypographyTokens } from './typography';
import { spacing, SpacingTokens } from './spacing';
import { layout, LayoutTokens } from './layout';

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

export const theme = lightTheme;

export { colors, typography, spacing, layout };
