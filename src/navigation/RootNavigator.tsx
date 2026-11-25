import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useAppDispatch, useAppSelector, restoreSessionThunk } from '../store';
import { AuthNavigator } from './AuthNavigator';
import { MainNavigator } from './MainNavigator';
import { linking } from './linking';
import { ScreenContainer } from '../components/common/ScreenContainer';
import { LoadingView } from '../components/feedback/LoadingView';

export const RootNavigator: React.FC = () => {
  const dispatch = useAppDispatch();
  const { isAuthenticated, isRestoringSession } = useAppSelector(
    state => state.auth,
  );

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

  return (
    <NavigationContainer linking={linking}>
      {isAuthenticated ? <MainNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
};
