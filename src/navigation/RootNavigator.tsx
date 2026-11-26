import React, { useEffect } from 'react';
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from '@react-navigation/native';
import {
  useAppDispatch,
  useAppSelector,
  restoreSessionThunk,
  loadThemeThunk,
} from '../store';
import { AuthNavigator } from './AuthNavigator';
import { MainNavigator } from './MainNavigator';
import { linking } from './linking';
import { ThemeProvider, useAppTheme } from '../theme';
import { ScreenContainer } from '../components/common/ScreenContainer';
import { LoadingView } from '../components/feedback/LoadingView';

const RootNavigatorContent: React.FC = () => {
  const dispatch = useAppDispatch();
  const { isAuthenticated, isRestoringSession } = useAppSelector(
    state => state.auth,
  );
  const activeTheme = useAppTheme();

  useEffect(() => {
    dispatch(loadThemeThunk());
    dispatch(restoreSessionThunk());
  }, [dispatch]);

  if (isRestoringSession) {
    return (
      <ScreenContainer testID="session-restoring-container">
        <LoadingView message="Checking secure authentication session..." />
      </ScreenContainer>
    );
  }

  const navTheme = {
    ...(activeTheme.isDark ? DarkTheme : DefaultTheme),
    colors: {
      ...(activeTheme.isDark ? DarkTheme.colors : DefaultTheme.colors),
      background: activeTheme.colors.background,
      card: activeTheme.colors.surface,
      text: activeTheme.colors.textPrimary,
      border: activeTheme.colors.border,
      primary: activeTheme.colors.primary,
    },
  };

  return (
    <NavigationContainer linking={linking} theme={navTheme}>
      {isAuthenticated ? <MainNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
};

export const RootNavigator: React.FC = () => {
  const themeMode = useAppSelector(state => state.app.themeMode);

  return (
    <ThemeProvider mode={themeMode}>
      <RootNavigatorContent />
    </ThemeProvider>
  );
};
