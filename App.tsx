import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Provider } from 'react-redux';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { store, useAppDispatch, useAppSelector, setInitialized } from './src/store';
import { theme } from './src/theme';
import { Typography } from './src/components/common/Typography';
import { Button } from './src/components/common/Button';
import { ScreenContainer } from './src/components/common/ScreenContainer';
import { ENV } from './src/config/env';

const AppContent: React.FC = () => {
  const dispatch = useAppDispatch();
  const isInitialized = useAppSelector(state => state.app.isInitialized);

  return (
    <ScreenContainer testID="scoreline-root-container">
      <ScrollView contentContainerStyle={styles.scrollContent} testID="app-scroll-view">
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

        <View style={styles.card}>
          <Typography variant="h3" style={styles.cardTitle}>
            Foundation Status
          </Typography>
          <Typography variant="body" color="secondary" style={styles.bodyText}>
            Architecture: Feature-Based Modular System
          </Typography>
          <Typography variant="body" color="secondary" style={styles.bodyText}>
            Environment: {ENV.APP_ENV.toUpperCase()}
          </Typography>
          <Typography variant="body" color="secondary" style={styles.bodyText}>
            Initialized State: {isInitialized ? 'Ready' : 'Pending Initializer'}
          </Typography>

          <View style={styles.buttonContainer}>
            <Button
              testID="init-button"
              title={isInitialized ? 'Platform Initialized' : 'Initialize Platform'}
              onPress={() => dispatch(setInitialized(!isInitialized))}
              variant={isInitialized ? 'secondary' : 'primary'}
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
