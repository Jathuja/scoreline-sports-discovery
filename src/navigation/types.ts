import type { NavigatorScreenParams } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { RouteProp } from '@react-navigation/native';

/**
 * Bottom Tab Navigation param list
 */
export type MainTabParamList = {
  HomeTab: undefined;
  SearchTab: undefined;
  FavouritesTab: undefined;
  ProfileTab: undefined;
};

/**
 * Authentication Stack param list
 */
export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

/**
 * Details screens route parameters (ready for features 4, 5, 6, 7)
 */
export type TeamDetailsParams = {
  id: string;
  name?: string;
};

export type LeagueDetailsParams = {
  id: string;
  name?: string;
};

export type PlayerDetailsParams = {
  id: string;
  name?: string;
};

/**
 * Root Stack param list
 */
export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  Main: NavigatorScreenParams<MainTabParamList>;
  TeamDetails: TeamDetailsParams;
  LeagueDetails: LeagueDetailsParams;
  PlayerDetails: PlayerDetailsParams;
};

/**
 * Navigation Prop Types
 */
export type RootStackNavigationProp = NativeStackNavigationProp<RootStackParamList>;
export type MainTabNavProp = BottomTabNavigationProp<MainTabParamList>;
export type AuthStackNavProp = NativeStackNavigationProp<AuthStackParamList>;

/**
 * Route Prop Types
 */
export type TeamDetailsRouteProp = RouteProp<RootStackParamList, 'TeamDetails'>;
export type LeagueDetailsRouteProp = RouteProp<RootStackParamList, 'LeagueDetails'>;
export type PlayerDetailsRouteProp = RouteProp<RootStackParamList, 'PlayerDetails'>;
