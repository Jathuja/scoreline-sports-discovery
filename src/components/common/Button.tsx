import React from 'react';
import {
  Pressable,
  Text,
  ActivityIndicator,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { theme } from '../../theme';
import { BaseButtonProps, ButtonVariant, ButtonSize } from '../../types/common';

export const Button: React.FC<BaseButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  style,
  textStyle,
  accessibilityLabel,
  testID,
}) => {
  const getContainerVariantStyle = (v: ButtonVariant): ViewStyle => {
    switch (v) {
      case 'secondary':
        return { backgroundColor: theme.colors.secondary };
      case 'outline':
        return {
          backgroundColor: 'transparent',
          borderWidth: 1.5,
          borderColor: theme.colors.primary,
        };
      case 'ghost':
        return { backgroundColor: 'transparent' };
      case 'danger':
        return { backgroundColor: theme.colors.error };
      case 'primary':
      default:
        return { backgroundColor: theme.colors.primary };
    }
  };

  const getTextVariantStyle = (v: ButtonVariant): TextStyle => {
    switch (v) {
      case 'outline':
      case 'ghost':
        return { color: theme.colors.primary };
      case 'primary':
      case 'secondary':
      case 'danger':
      default:
        return { color: theme.colors.textInverse };
    }
  };

  const getSizeStyle = (s: ButtonSize): ViewStyle => {
    // Guarantees compliance with minimum 44pt / 48dp touch targets across all sizes
    switch (s) {
      case 'sm':
        return {
          minHeight: theme.layout.touchTargets.minHeight, // 48
          paddingHorizontal: theme.spacing.md,
          paddingVertical: theme.spacing.xs,
        };
      case 'lg':
        return {
          minHeight: 56,
          paddingHorizontal: theme.spacing.xl,
          paddingVertical: theme.spacing.md,
        };
      case 'md':
      default:
        return {
          minHeight: theme.layout.touchTargets.minHeight, // 48
          paddingHorizontal: theme.spacing.lg,
          paddingVertical: theme.spacing.sm,
        };
    }
  };

  const isInteractive = !disabled && !loading;

  return (
    <Pressable
      testID={testID}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || title}
      accessibilityState={{ disabled: !isInteractive, busy: loading }}
      hitSlop={theme.layout.hitSlop}
      disabled={!isInteractive}
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        getSizeStyle(size),
        getContainerVariantStyle(variant),
        disabled && styles.disabled,
        pressed && isInteractive && styles.pressed,
        style,
      ]}>
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'outline' || variant === 'ghost' ? theme.colors.primary : theme.colors.textInverse}
          testID={`${testID || 'button'}-loading`}
        />
      ) : (
        <Text
          style={[
            styles.text,
            getTextVariantStyle(variant),
            disabled && styles.disabledText,
            textStyle,
          ]}>
          {title}
        </Text>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.layout.borderRadius.sm,
    minWidth: theme.layout.touchTargets.minWidth, // 48
  },
  text: {
    fontSize: theme.typography.fontSizes.md,
    fontWeight: theme.typography.fontWeights.semiBold,
    lineHeight: theme.typography.lineHeights.md,
    textAlign: 'center',
  },
  pressed: {
    opacity: 0.8,
  },
  disabled: {
    opacity: 0.5,
    backgroundColor: theme.colors.border,
  },
  disabledText: {
    color: theme.colors.textTertiary,
  },
});
