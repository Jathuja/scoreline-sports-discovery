import React from 'react';
import { Text, TextStyle, StyleSheet, StyleProp } from 'react-native';
import { theme, useAppTheme } from '../../theme';

export type TypographyVariant =
  | 'h1'
  | 'h2'
  | 'h3'
  | 'body'
  | 'bodySmall'
  | 'caption'
  | 'label';

export type TypographyColor =
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'inverse'
  | 'error'
  | 'success';

export interface TypographyProps {
  children: React.ReactNode;
  variant?: TypographyVariant;
  color?: TypographyColor;
  align?: TextStyle['textAlign'];
  style?: StyleProp<TextStyle>;
  numberOfLines?: number;
  testID?: string;
  accessibilityLabel?: string;
}

export const Typography: React.FC<TypographyProps> = ({
  children,
  variant = 'body',
  color = 'primary',
  align = 'left',
  style,
  numberOfLines,
  testID,
  accessibilityLabel,
}) => {
  const activeTheme = useAppTheme();

  const textColorMap: Record<TypographyColor, string> = {
    primary: activeTheme.colors.textPrimary,
    secondary: activeTheme.colors.textSecondary,
    tertiary: activeTheme.colors.textTertiary,
    inverse: activeTheme.colors.textInverse,
    error: activeTheme.colors.error,
    success: activeTheme.colors.success,
  };

  return (
    <Text
      testID={testID}
      accessibilityLabel={accessibilityLabel}
      numberOfLines={numberOfLines}
      style={[
        styles[variant],
        { color: textColorMap[color], textAlign: align },
        style,
      ]}>
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  h1: {
    fontSize: theme.typography.fontSizes.xxxl,
    fontWeight: theme.typography.fontWeights.bold,
    lineHeight: theme.typography.lineHeights.xxxl,
  },
  h2: {
    fontSize: theme.typography.fontSizes.xxl,
    fontWeight: theme.typography.fontWeights.bold,
    lineHeight: theme.typography.lineHeights.xxl,
  },
  h3: {
    fontSize: theme.typography.fontSizes.xl,
    fontWeight: theme.typography.fontWeights.semiBold,
    lineHeight: theme.typography.lineHeights.xl,
  },
  body: {
    fontSize: theme.typography.fontSizes.md,
    fontWeight: theme.typography.fontWeights.regular,
    lineHeight: theme.typography.lineHeights.md,
  },
  bodySmall: {
    fontSize: theme.typography.fontSizes.sm,
    fontWeight: theme.typography.fontWeights.regular,
    lineHeight: theme.typography.lineHeights.sm,
  },
  caption: {
    fontSize: theme.typography.fontSizes.xs,
    fontWeight: theme.typography.fontWeights.regular,
    lineHeight: theme.typography.lineHeights.xs,
  },
  label: {
    fontSize: theme.typography.fontSizes.sm,
    fontWeight: theme.typography.fontWeights.medium,
    lineHeight: theme.typography.lineHeights.sm,
  },
});
