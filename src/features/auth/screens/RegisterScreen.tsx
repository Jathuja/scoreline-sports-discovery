import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useAppDispatch, useAppSelector } from '../../../store';
import { registerThunk, clearAuthError } from '../slices/authSlice';
import { theme, useAppTheme } from '../../../theme';
import { Typography } from '../../../components/common/Typography';
import { Button } from '../../../components/common/Button';
import { Input } from '../../../components/common/Input';

export interface RegisterScreenProps {
  onNavigateToLogin?: () => void;
  onRegistrationSuccess?: () => void;
}

export const RegisterScreen: React.FC<RegisterScreenProps> = ({
  onNavigateToLogin,
  onRegistrationSuccess,
}) => {
  const dispatch = useAppDispatch();
  const activeTheme = useAppTheme();
  const { isLoading, error } = useAppSelector(state => state.auth);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [clientErrors, setClientErrors] = useState<Record<string, string | undefined>>({});
  const [registeredSuccess, setRegisteredSuccess] = useState(false);

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!firstName.trim()) {
      errs.firstName = 'First name is required';
    }
    if (!lastName.trim()) {
      errs.lastName = 'Last name is required';
    }
    if (!username.trim()) {
      errs.username = 'Username is required';
    } else if (username.trim().length < 3) {
      errs.username = 'Username must be at least 3 characters';
    }
    if (!email.trim()) {
      errs.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errs.email = 'Please enter a valid email address';
    }
    if (!password) {
      errs.password = 'Password is required';
    } else if (password.length < 6) {
      errs.password = 'Password must be at least 6 characters';
    }
    setClientErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleRegister = async () => {
    dispatch(clearAuthError());
    if (!validate()) {
      return;
    }

    const action = await dispatch(
      registerThunk({
        firstName,
        lastName,
        username,
        email,
        password,
      }),
    );

    if (registerThunk.fulfilled.match(action)) {
      setRegisteredSuccess(true);
      if (onRegistrationSuccess) {
        onRegistrationSuccess();
      }
    }
  };

  return (
    <ScrollView
      contentContainerStyle={styles.scrollContent}
      keyboardShouldPersistTaps="handled"
      testID="register-screen-scroll">
      <View style={styles.header}>
        <Typography variant="h1" color="primary" align="center">
          Scoreline
        </Typography>
        <Typography
          variant="body"
          color="secondary"
          align="center"
          style={styles.subtitle}>
          Create a new sports discovery account
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
          Create Account
        </Typography>

        {registeredSuccess ? (
          <View style={styles.successBanner} testID="register-success-banner">
            <Typography variant="body" color="success" align="center">
              Account created successfully! You can now sign in.
            </Typography>
          </View>
        ) : null}

        {error ? (
          <View style={styles.errorBanner} testID="register-error-banner">
            <Typography variant="bodySmall" color="error">
              {error}
            </Typography>
          </View>
        ) : null}

        <Input
          testID="register-firstname-input"
          label="First Name"
          placeholder="John"
          value={firstName}
          onChangeText={text => {
            setFirstName(text);
            if (clientErrors.firstName) {
              setClientErrors(prev => ({ ...prev, firstName: undefined }));
            }
          }}
          error={clientErrors.firstName}
        />

        <Input
          testID="register-lastname-input"
          label="Last Name"
          placeholder="Doe"
          value={lastName}
          onChangeText={text => {
            setLastName(text);
            if (clientErrors.lastName) {
              setClientErrors(prev => ({ ...prev, lastName: undefined }));
            }
          }}
          error={clientErrors.lastName}
        />

        <Input
          testID="register-username-input"
          label="Username"
          placeholder="johndoe"
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
          testID="register-email-input"
          label="Email Address"
          placeholder="john.doe@example.com"
          value={email}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          onChangeText={text => {
            setEmail(text);
            if (clientErrors.email) {
              setClientErrors(prev => ({ ...prev, email: undefined }));
            }
          }}
          error={clientErrors.email}
        />

        <Input
          testID="register-password-input"
          label="Password"
          placeholder="Minimum 6 characters"
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
          testID="register-submit-button"
          title={isLoading ? 'Creating Account...' : 'Create Account'}
          onPress={handleRegister}
          loading={isLoading}
          variant="primary"
          style={styles.submitButton}
        />
      </View>

      {onNavigateToLogin ? (
        <View style={styles.footer}>
          <Typography variant="body" color="secondary" align="center">
            Already have an account?{' '}
          </Typography>
          <Button
            testID="switch-to-login-button"
            title="Sign In"
            variant="outline"
            size="sm"
            onPress={onNavigateToLogin}
            style={styles.loginButton}
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
  successBanner: {
    backgroundColor: `${theme.colors.success}15`,
    padding: theme.spacing.md,
    borderRadius: theme.layout.borderRadius.sm,
    marginBottom: theme.spacing.md,
  },
  submitButton: {
    marginTop: theme.spacing.md,
  },
  footer: {
    marginTop: theme.spacing.xl,
    alignItems: 'center',
  },
  loginButton: {
    marginTop: theme.spacing.xs,
    minWidth: 140,
  },
});
