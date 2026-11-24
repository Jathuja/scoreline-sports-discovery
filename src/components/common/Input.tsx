import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  Pressable,
  StyleSheet,
  StyleProp,
  ViewStyle,
  TextStyle,
  TextInputProps,
} from 'react-native';
import { theme } from '../../theme';

export interface InputProps extends TextInputProps {
  label?: string;
  error?: string | null;
  hint?: string;
  isPassword?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
  labelStyle?: StyleProp<TextStyle>;
  testID?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  hint,
  isPassword = false,
  containerStyle,
  inputStyle,
  labelStyle,
  testID,
  secureTextEntry,
  accessibilityLabel,
  ...restProps
}) => {
  const [isSecure, setIsSecure] = useState(isPassword || !!secureTextEntry);
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={[styles.container, containerStyle]}>
      {label ? (
        <Text style={[styles.label, labelStyle]}>
          {label}
        </Text>
      ) : null}

      <View
        style={[
          styles.inputContainer,
          isFocused && styles.inputFocused,
          !!error && styles.inputError,
        ]}>
        <TextInput
          testID={testID}
          accessibilityLabel={accessibilityLabel || label}
          placeholderTextColor={theme.colors.textTertiary}
          secureTextEntry={isPassword ? isSecure : false}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          style={[styles.input, inputStyle]}
          {...restProps}
        />

        {isPassword ? (
          <Pressable
            testID={`${testID || 'input'}-toggle-password`}
            accessibilityRole="button"
            accessibilityLabel={isSecure ? 'Show password' : 'Hide password'}
            hitSlop={theme.layout.hitSlop}
            style={styles.eyeButton}
            onPress={() => setIsSecure(!isSecure)}>
            <Text style={styles.eyeText}>{isSecure ? 'SHOW' : 'HIDE'}</Text>
          </Pressable>
        ) : null}
      </View>

      {error ? (
        <Text
          testID={`${testID || 'input'}-error`}
          accessibilityRole="alert"
          style={styles.errorText}>
          {error}
        </Text>
      ) : hint ? (
        <Text style={styles.hintText}>{hint}</Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: theme.spacing.md,
    width: '100%',
  },
  label: {
    fontSize: theme.typography.fontSizes.sm,
    fontWeight: theme.typography.fontWeights.medium,
    lineHeight: theme.typography.lineHeights.sm,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.xs,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderWidth: 1.5,
    borderColor: theme.colors.border,
    borderRadius: theme.layout.borderRadius.sm,
    minHeight: theme.layout.touchTargets.minHeight, // Strict 48dp touch target
    paddingHorizontal: theme.spacing.md,
  },
  inputFocused: {
    borderColor: theme.colors.primary,
  },
  inputError: {
    borderColor: theme.colors.error,
  },
  input: {
    flex: 1,
    minHeight: theme.layout.touchTargets.minHeight, // 48dp
    fontSize: theme.typography.fontSizes.md,
    color: theme.colors.textPrimary,
    paddingVertical: theme.spacing.xs,
  },
  eyeButton: {
    minHeight: theme.layout.touchTargets.minHeight, // 48dp touch target
    minWidth: 48,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.xs,
  },
  eyeText: {
    fontSize: theme.typography.fontSizes.xs,
    fontWeight: theme.typography.fontWeights.semiBold,
    color: theme.colors.primary,
  },
  errorText: {
    fontSize: theme.typography.fontSizes.xs,
    color: theme.colors.error,
    marginTop: theme.spacing.xxs,
  },
  hintText: {
    fontSize: theme.typography.fontSizes.xs,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xxs,
  },
});
