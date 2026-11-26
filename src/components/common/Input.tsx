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
import Icon from 'react-native-vector-icons/Feather';
import { theme, useAppTheme } from '../../theme';

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
  const activeTheme = useAppTheme();
  const [isSecure, setIsSecure] = useState(isPassword || !!secureTextEntry);
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={[styles.container, containerStyle]}>
      {label ? (
        <Text
          style={[
            styles.label,
            { color: activeTheme.colors.textPrimary },
            labelStyle,
          ]}>
          {label}
        </Text>
      ) : null}

      <View
        style={[
          styles.inputContainer,
          {
            backgroundColor: activeTheme.colors.surface,
            borderColor: activeTheme.colors.border,
          },
          isFocused && { borderColor: activeTheme.colors.primary },
          !!error && { borderColor: activeTheme.colors.error },
        ]}>
        <TextInput
          testID={testID}
          accessibilityLabel={accessibilityLabel || label}
          placeholderTextColor={activeTheme.colors.textTertiary}
          secureTextEntry={isPassword ? isSecure : false}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          style={[
            styles.input,
            { color: activeTheme.colors.textPrimary },
            inputStyle,
          ]}
          {...restProps}
        />

        {isPassword ? (
          <Pressable
            testID={`${testID || 'input'}-toggle-password`}
            accessibilityRole="button"
            accessibilityLabel={isSecure ? 'Show password' : 'Hide password'}
            hitSlop={activeTheme.layout.hitSlop}
            style={styles.eyeButton}
            onPress={() => setIsSecure(!isSecure)}>
            <Icon
              name={isSecure ? 'eye' : 'eye-off'}
              size={14}
              color={activeTheme.colors.primary}
              style={styles.eyeIcon}
            />
            <Text style={[styles.eyeText, { color: activeTheme.colors.primary }]}>
              {isSecure ? 'SHOW' : 'HIDE'}
            </Text>
          </Pressable>
        ) : null}
      </View>

      {error ? (
        <Text
          testID={`${testID || 'input'}-error`}
          accessibilityRole="alert"
          style={[styles.errorText, { color: activeTheme.colors.error }]}>
          {error}
        </Text>
      ) : hint ? (
        <Text style={[styles.hintText, { color: activeTheme.colors.textSecondary }]}>
          {hint}
        </Text>
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
    marginBottom: theme.spacing.xs,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderRadius: theme.layout.borderRadius.sm,
    minHeight: theme.layout.touchTargets.minHeight,
    paddingHorizontal: theme.spacing.md,
  },
  input: {
    flex: 1,
    minHeight: theme.layout.touchTargets.minHeight,
    fontSize: theme.typography.fontSizes.md,
    paddingVertical: theme.spacing.xs,
  },
  eyeButton: {
    flexDirection: 'row',
    minHeight: theme.layout.touchTargets.minHeight,
    minWidth: 48,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.xs,
  },
  eyeIcon: {
    marginRight: 4,
  },
  eyeText: {
    fontSize: theme.typography.fontSizes.xs,
    fontWeight: theme.typography.fontWeights.semiBold,
  },
  errorText: {
    fontSize: theme.typography.fontSizes.xs,
    marginTop: theme.spacing.xxs,
  },
  hintText: {
    fontSize: theme.typography.fontSizes.xs,
    marginTop: theme.spacing.xxs,
  },
});
