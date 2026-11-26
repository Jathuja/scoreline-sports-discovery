import React from 'react';
import {
  Pressable,
  Text,
  ActivityIndicator,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { theme, useAppTheme } from '../../theme';
import { BaseButtonProps, ButtonVariant, ButtonSize } from '../../types/common';

export const Button: React.FC<BaseButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  icon,
  iconPosition = 'left',
  style,
  textStyle,
  accessibilityLabel,
  testID,
}) => {
  const activeTheme = useAppTheme();

  const getContainerVariantStyle = (v: ButtonVariant): ViewStyle => {
    switch (v) {
      case 'secondary':
        return { backgroundColor: activeTheme.colors.secondary };
      case 'outline':
        return {
          backgroundColor: 'transparent',
          borderWidth: 1.5,
          borderColor: activeTheme.colors.primary,
        };
      case 'ghost':
        return { backgroundColor: 'transparent' };
      case 'danger':
        return { backgroundColor: activeTheme.colors.error };
      case 'primary':
      default:
        return { backgroundColor: activeTheme.colors.primary };
    }
  };

  const getTextColor = (v: ButtonVariant): string => {
    switch (v) {
      case 'outline':
      case 'ghost':
        return activeTheme.colors.primary;
      case 'primary':
      case 'secondary':
      case 'danger':
      default:
        return activeTheme.colors.textInverse;
    }
  };

  const getTextVariantStyle = (v: ButtonVariant): TextStyle => ({
    color: getTextColor(v),
  });

  const getSizeStyle = (s: ButtonSize): ViewStyle => {
    switch (s) {
      case 'sm':
        return {
          minHeight: activeTheme.layout.touchTargets.minHeight,
          paddingHorizontal: activeTheme.spacing.md,
          paddingVertical: activeTheme.spacing.xs,
        };
      case 'lg':
        return {
          minHeight: 56,
          paddingHorizontal: activeTheme.spacing.xl,
          paddingVertical: activeTheme.spacing.md,
        };
      case 'md':
      default:
        return {
          minHeight: activeTheme.layout.touchTargets.minHeight,
          paddingHorizontal: activeTheme.spacing.lg,
          paddingVertical: activeTheme.spacing.sm,
        };
    }
  };

  const isInteractive = !disabled && !loading;
  const fgColor = disabled ? activeTheme.colors.textTertiary : getTextColor(variant);

  return (
    <Pressable
      testID={testID}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || title}
      accessibilityState={{ disabled: !isInteractive, busy: loading }}
      hitSlop={activeTheme.layout.hitSlop}
      disabled={!isInteractive}
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        getSizeStyle(size),
        getContainerVariantStyle(variant),
        disabled && {
          opacity: 0.5,
          backgroundColor: activeTheme.colors.border,
        },
        pressed && isInteractive && styles.pressed,
        style,
      ]}>
      {loading ? (
        <ActivityIndicator
          size="small"
          color={fgColor}
          testID={`${testID || 'button'}-loading`}
        />
      ) : (
        <>
          {icon && iconPosition === 'left' ? (
            <Icon name={icon} size={16} color={fgColor} style={styles.iconLeft} />
          ) : null}
          <Text
            style={[
              styles.text,
              getTextVariantStyle(variant),
              disabled && { color: activeTheme.colors.textTertiary },
              textStyle,
            ]}>
            {title}
          </Text>
          {icon && iconPosition === 'right' ? (
            <Icon name={icon} size={16} color={fgColor} style={styles.iconRight} />
          ) : null}
        </>
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
    minWidth: theme.layout.touchTargets.minWidth,
  },
  text: {
    fontSize: theme.typography.fontSizes.md,
    fontWeight: theme.typography.fontWeights.semiBold,
    lineHeight: theme.typography.lineHeights.md,
    textAlign: 'center',
  },
  iconLeft: {
    marginRight: 8,
  },
  iconRight: {
    marginLeft: 8,
  },
  pressed: {
    opacity: 0.8,
  },
});
