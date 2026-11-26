import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useAppDispatch, useAppSelector } from '../../../store';
import { loginThunk, clearAuthError } from '../slices/authSlice';
import { theme, useAppTheme } from '../../../theme';
import { Typography } from '../../../components/common/Typography';
import { Button } from '../../../components/common/Button';
import { Input } from '../../../components/common/Input';

export interface LoginScreenProps {
  onNavigateToRegister?: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({
  onNavigateToRegister,
}) => {
  const dispatch = useAppDispatch();
  const activeTheme = useAppTheme();
  const { isLoading, error } = useAppSelector(state => state.auth);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [clientErrors, setClientErrors] = useState<{
    username?: string;
    password?: string;
  }>({});

  const validate = (): boolean => {
    const errs: { username?: string; password?: string } = {};
    if (!username.trim()) {
      errs.username = 'Username is required';
    }
    if (!password) {
      errs.password = 'Password is required';
    } else if (password.length < 4) {
      errs.password = 'Password must be at least 4 characters';
    }
    setClientErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleLogin = async () => {
    dispatch(clearAuthError());
    if (!validate()) {
      return;
    }
    await dispatch(loginThunk({ username, password }));
  };

  // Helper for evaluation / fast testing with official DummyJSON user
  const handleFillDemoCredentials = () => {
    dispatch(clearAuthError());
    setUsername('emilys');
    setPassword('emilyspass');
    setClientErrors({});
  };

  return (
    <ScrollView
      contentContainerStyle={styles.scrollContent}
      keyboardShouldPersistTaps="handled"
      testID="login-screen-scroll">
      <View style={styles.header}>
        <Typography variant="h1" color="primary" align="center">
          Scoreline
        </Typography>
        <Typography
          variant="body"
          color="secondary"
          align="center"
          style={styles.subtitle}>
          Sign in to your sports discovery account
        </Typography>
      </View>

      <View
        style={[
          styles.card,
          {
            backgroundColor: activeTheme.colors.surface,
            borderColor: activeTheme.colors.border,
          },
        ]}>
        <Typography variant="h3" style={styles.cardTitle}>
          Welcome Back
        </Typography>

        {error ? (
          <View style={styles.errorBanner} testID="login-error-banner">
            <Typography variant="bodySmall" color="error">
              {error}
            </Typography>
          </View>
        ) : null}

        <Input
          testID="login-username-input"
          label="Username"
          placeholder="e.g. emilys"
          value={username}
          autoCapitalize="none"
          autoCorrect={false}
          onChangeText={text => {
            setUsername(text);
            if (clientErrors.username) {
              setClientErrors(prev => ({ ...prev, username: undefined }));
            }
          }}
          error={clientErrors.username}
        />

        <Input
          testID="login-password-input"
          label="Password"
          placeholder="••••••••"
          value={password}
          isPassword
          autoCapitalize="none"
          onChangeText={text => {
            setPassword(text);
            if (clientErrors.password) {
              setClientErrors(prev => ({ ...prev, password: undefined }));
            }
          }}
          error={clientErrors.password}
        />

        <Button
          testID="login-submit-button"
          title={isLoading ? 'Signing In...' : 'Sign In'}
          onPress={handleLogin}
          loading={isLoading}
          variant="primary"
          style={styles.submitButton}
        />

        <Button
          testID="demo-credentials-button"
          title="Use Demo Account (emilys)"
          onPress={handleFillDemoCredentials}
          variant="ghost"
          style={styles.demoButton}
        />
      </View>

      {onNavigateToRegister ? (
        <View style={styles.footer}>
          <Typography variant="body" color="secondary" align="center">
            Don't have an account?{' '}
          </Typography>
          <Button
            testID="switch-to-register-button"
            title="Register Here"
            variant="outline"
            size="sm"
            onPress={onNavigateToRegister}
            style={styles.registerButton}
          />
        </View>
      ) : null}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    paddingVertical: theme.spacing.xl,
    paddingHorizontal: theme.spacing.sm,
  },
  header: {
    marginBottom: theme.spacing.xl,
  },
  subtitle: {
    marginTop: theme.spacing.xs,
  },
  card: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.lg,
    borderRadius: theme.layout.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  cardTitle: {
    marginBottom: theme.spacing.lg,
  },
  errorBanner: {
    backgroundColor: `${theme.colors.error}15`,
    padding: theme.spacing.md,
    borderRadius: theme.layout.borderRadius.sm,
    marginBottom: theme.spacing.md,
  },
  submitButton: {
    marginTop: theme.spacing.md,
  },
  demoButton: {
    marginTop: theme.spacing.sm,
  },
  footer: {
    marginTop: theme.spacing.xl,
    alignItems: 'center',
  },
  registerButton: {
    marginTop: theme.spacing.xs,
    minWidth: 160,
  },
});
