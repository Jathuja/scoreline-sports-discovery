import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { theme, useAppTheme } from '../theme';
import { TabNavigator } from './TabNavigator';
import { TeamDetailsScreen } from '../features/details/screens/TeamDetailsScreen';
import { LeagueDetailsScreen } from '../features/details/screens/LeagueDetailsScreen';
import { PlayerDetailsScreen } from '../features/details/screens/PlayerDetailsScreen';
import type { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const MainNavigator: React.FC = () => {
  const activeTheme = useAppTheme();

  return (
    <Stack.Navigator
      initialRouteName="Main"
      screenOptions={{
        headerStyle: {
          backgroundColor: activeTheme.colors.surface,
        },
        headerTintColor: activeTheme.colors.primary,
        headerTitleStyle: {
          fontWeight: theme.typography.fontWeights.semiBold,
          color: activeTheme.colors.textPrimary,
        },
      }}>
      <Stack.Screen
        name="Main"
        component={TabNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="TeamDetails"
        component={TeamDetailsScreen}
        options={({ route }) => ({
          title: route.params?.name || 'Team Details',
          headerBackTitle: 'Back',
        })}
      />
      <Stack.Screen
        name="LeagueDetails"
        component={LeagueDetailsScreen}
        options={({ route }) => ({
          title: route.params?.name || 'League Details',
          headerBackTitle: 'Back',
        })}
      />
      <Stack.Screen
        name="PlayerDetails"
        component={PlayerDetailsScreen}
        options={({ route }) => ({
          title: route.params?.name || 'Player Details',
          headerBackTitle: 'Back',
        })}
      />
    </Stack.Navigator>
  );
};
