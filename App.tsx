import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Provider } from 'react-redux';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import {
  store,
  useAppDispatch,
  useAppSelector,
  restoreSessionThunk,
  logoutThunk,
} from './src/store';
import { theme } from './src/theme';
import { Typography } from './src/components/common/Typography';
import { Button } from './src/components/common/Button';
import { ScreenContainer } from './src/components/common/ScreenContainer';
import { LoadingView } from './src/components/feedback/LoadingView';
import { LoginScreen } from './src/features/auth/screens/LoginScreen';
import { RegisterScreen } from './src/features/auth/screens/RegisterScreen';

const AppContent: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user, isAuthenticated, isRestoringSession } = useAppSelector(
    state => state.auth,
  );
  const [authView, setAuthView] = useState<'login' | 'register'>('login');

  useEffect(() => {
    dispatch(restoreSessionThunk());
  }, [dispatch]);

  if (isRestoringSession) {
    return (
      <ScreenContainer testID="session-restoring-container">
        <LoadingView message="Checking secure authentication session..." />
      </ScreenContainer>
    );
  }

  if (!isAuthenticated) {
    return (
      <ScreenContainer testID="auth-flow-container">
        {authView === 'login' ? (
          <LoginScreen onNavigateToRegister={() => setAuthView('register')} />
        ) : (
          <RegisterScreen
            onNavigateToLogin={() => setAuthView('login')}
            onRegistrationSuccess={() => setAuthView('login')}
          />
        )}
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer testID="authenticated-root-container">
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Typography variant="h1" color="primary" align="center">
            Scoreline
          </Typography>
          <Typography
            variant="body"
            color="secondary"
            align="center"
            style={styles.subtitle}>
            Sports Discovery Mobile Platform
          </Typography>
          <Typography
            variant="caption"
            color="tertiary"
            align="center"
            style={styles.indexNumber}>
            Index Number: 234089P
          </Typography>
        </View>

        <View style={styles.card} testID="user-profile-card">
          <Typography variant="h2" style={styles.cardTitle}>
            Welcome, {user?.firstName} {user?.lastName}
          </Typography>
          <Typography variant="body" color="secondary" style={styles.bodyText}>
            Username: @{user?.username}
          </Typography>
          <Typography variant="body" color="secondary" style={styles.bodyText}>
            Email: {user?.email}
          </Typography>
          <Typography variant="body" color="success" style={styles.bodyText}>
            Status: Authenticated (Keychain Token Secured)
          </Typography>

          <View style={styles.buttonContainer}>
            <Button
              testID="logout-button"
              title="Sign Out"
              variant="outline"
              onPress={() => dispatch(logoutThunk())}
            />
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
};

export const App: React.FC = () => {
  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <AppContent />
      </SafeAreaProvider>
    </Provider>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    paddingVertical: theme.spacing.lg,
  },
  header: {
    marginBottom: theme.spacing.xl,
  },
  subtitle: {
    marginTop: theme.spacing.xs,
  },
  indexNumber: {
    marginTop: theme.spacing.xxs,
  },
  card: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.lg,
    borderRadius: theme.layout.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  cardTitle: {
    marginBottom: theme.spacing.md,
  },
  bodyText: {
    marginBottom: theme.spacing.xs,
  },
  buttonContainer: {
    marginTop: theme.spacing.lg,
  },
});

export default App;
