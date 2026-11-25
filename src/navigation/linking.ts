import type { LinkingOptions } from '@react-navigation/native';
import type { RootStackParamList } from './types';
import { ENV } from '../config/env';

export const linking: LinkingOptions<RootStackParamList> = {
  prefixes: [
    `${ENV.APP_SCHEME}://`,
    'scoreline://',
    'https://scoreline.app',
  ],
  config: {
    screens: {
      Main: {
        screens: {
          HomeTab: 'home',
          SearchTab: 'search',
          FavouritesTab: 'favourites',
          ProfileTab: 'profile',
        },
      },
      TeamDetails: 'team/:id',
      LeagueDetails: 'league/:id',
      PlayerDetails: 'player/:id',
    },
  },
};
