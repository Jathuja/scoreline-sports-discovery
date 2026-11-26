import React from 'react';
import { StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Feather';
import { theme, useAppTheme } from '../theme';
import { HomeScreen } from '../features/home/screens/HomeScreen';
import { SearchScreen } from '../features/search/screens/SearchScreen';
import { FavouritesScreen } from '../features/favourites/screens/FavouritesScreen';
import { ProfileScreen } from '../features/profile/screens/ProfileScreen';
import type { MainTabParamList } from './types';

const Tab = createBottomTabNavigator<MainTabParamList>();

const renderHomeIcon = ({ color, size }: { color: string; size: number }) => (
  <Icon name="home" color={color} size={size} />
);

const renderSearchIcon = ({ color, size }: { color: string; size: number }) => (
  <Icon name="search" color={color} size={size} />
);

const renderFavouritesIcon = ({ color, size }: { color: string; size: number }) => (
  <Icon name="heart" color={color} size={size} />
);

const renderProfileIcon = ({ color, size }: { color: string; size: number }) => (
  <Icon name="user" color={color} size={size} />
);

export const TabNavigator: React.FC = () => {
  const activeTheme = useAppTheme();

  return (
    <Tab.Navigator
      initialRouteName="HomeTab"
      screenOptions={{
        headerStyle: [
          styles.header,
          {
            backgroundColor: activeTheme.colors.surface,
            borderBottomColor: activeTheme.colors.border,
          },
        ],
        headerTintColor: activeTheme.colors.textPrimary,
        headerTitleStyle: [
          styles.headerTitle,
          { color: activeTheme.colors.textPrimary },
        ],
        tabBarActiveTintColor: activeTheme.colors.primary,
        tabBarInactiveTintColor: activeTheme.colors.textTertiary,
        tabBarStyle: [
          styles.tabBar,
          {
            backgroundColor: activeTheme.colors.surface,
            borderTopColor: activeTheme.colors.border,
          },
        ],
        tabBarItemStyle: styles.tabBarItem,
        tabBarLabelStyle: styles.tabBarLabel,
      }}>
      <Tab.Screen
        name="HomeTab"
        component={HomeScreen}
        options={{
          title: 'Discover',
          headerTitle: 'Scoreline Discover',
          tabBarButtonTestID: 'tab-home',
          tabBarIcon: renderHomeIcon,
        }}
      />
      <Tab.Screen
        name="SearchTab"
        component={SearchScreen}
        options={{
          title: 'Search',
          headerTitle: 'Search Sports',
          tabBarButtonTestID: 'tab-search',
          tabBarIcon: renderSearchIcon,
        }}
      />
      <Tab.Screen
        name="FavouritesTab"
        component={FavouritesScreen}
        options={{
          title: 'Favourites',
          headerTitle: 'My Favourites',
          tabBarButtonTestID: 'tab-favourites',
          tabBarIcon: renderFavouritesIcon,
        }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileScreen}
        options={{
          title: 'Profile',
          headerTitle: 'User Profile',
          tabBarButtonTestID: 'tab-profile',
          tabBarIcon: renderProfileIcon,
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  header: {
    elevation: 0,
    shadowOpacity: 0,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontWeight: theme.typography.fontWeights.semiBold,
    fontSize: theme.typography.fontSizes.lg,
  },
  tabBar: {
    borderTopWidth: 1,
    height: 64,
    paddingBottom: theme.spacing.xs,
    paddingTop: theme.spacing.xs,
  },
  tabBarItem: {
    minHeight: theme.layout.touchTargets.minHeight,
  },
  tabBarLabel: {
    fontSize: theme.typography.fontSizes.xs,
    fontWeight: theme.typography.fontWeights.medium,
  },
});
