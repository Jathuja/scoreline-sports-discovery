import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import PlayerDetailsScreen from '../src/features/details/screens/PlayerDetailsScreen';
import discoveryReducer from '../src/features/discovery/slices/discoverySlice';
import favouritesReducer from '../src/features/favourites/slices/favouritesSlice';

jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useRoute: () => ({ params: { id: '34145361', name: 'Lionel Messi' } }),
  useNavigation: () => ({ navigate: jest.fn(), goBack: jest.fn() }),
}));

jest.mock('../src/features/discovery/slices/discoverySlice', () => {
  const actual = jest.requireActual('../src/features/discovery/slices/discoverySlice');
  return {
    __esModule: true,
    ...actual,
    getPlayerDetailsThunk: jest.fn(() => ({ type: 'noop', payload: null })),
  };
});

jest.mock('../src/services/share', () => ({
  sharePlayer: jest.fn(() => Promise.resolve()),
}));

jest.mock('../src/services/storage', () => ({
  loadFavourites: jest.fn(() => Promise.resolve([])),
  saveFavourites: jest.fn(() => Promise.resolve()),
  clearFavourites: jest.fn(() => Promise.resolve()),
}));

const makeStore = (discoveryState = {}) =>
  configureStore({
    reducer: { discovery: discoveryReducer, favourites: favouritesReducer },
    preloadedState: {
      discovery: {
        sports: [],
        searchTeams: [],
        searchLeagues: [],
        searchPlayers: [],
        selectedTeam: null,
        selectedLeague: null,
        selectedPlayer: {
          idPlayer: '34145361',
          strPlayer: 'Lionel Messi',
          strPosition: 'Forward',
          strTeam: 'Inter Miami',
          strNationality: 'Argentina',
          dateBorn: '1987-06-24',
          strThumb: undefined,
        },
        leagueTeams: [],
        teamPlayers: [],
        isSearching: false,
        isLoadingDetails: false,
        searchError: null,
        detailsError: null,
        ...discoveryState,
      },
      favourites: { items: [], isLoaded: true, isLoading: false, error: null },
    },
    middleware: gDM => gDM({ serializableCheck: false }),
  });

describe('PlayerDetailsScreen', () => {
  it('shows loading state', () => {
    const { getByTestId } = render(
      <Provider store={makeStore({ isLoadingDetails: true, selectedPlayer: null })}>
        <PlayerDetailsScreen />
      </Provider>,
    );
    expect(getByTestId('player-details-loading')).toBeTruthy();
  });

  it('renders player details', () => {
    const { getByTestId } = render(
      <Provider store={makeStore()}><PlayerDetailsScreen /></Provider>,
    );
    expect(getByTestId('player-details-screen')).toBeTruthy();
    expect(getByTestId('player-name')).toBeTruthy();
  });

  it('shows player name', () => {
    const { getByText } = render(
      <Provider store={makeStore()}><PlayerDetailsScreen /></Provider>,
    );
    expect(getByText('Lionel Messi')).toBeTruthy();
  });

  it('shows share and favourite buttons', () => {
    const { getByTestId } = render(
      <Provider store={makeStore()}><PlayerDetailsScreen /></Provider>,
    );
    expect(getByTestId('share-button')).toBeTruthy();
    expect(getByTestId('favourite-button')).toBeTruthy();
  });

  it('calls sharePlayer on share press', async () => {
    const { sharePlayer } = require('../src/services/share');
    const { getByTestId } = render(
      <Provider store={makeStore()}><PlayerDetailsScreen /></Provider>,
    );
    fireEvent.press(getByTestId('share-button'));
    await waitFor(() => expect(sharePlayer).toHaveBeenCalled());
  });

  it('shows player thumb placeholder when no image', () => {
    const { getByTestId } = render(
      <Provider store={makeStore()}><PlayerDetailsScreen /></Provider>,
    );
    expect(getByTestId('player-thumb-placeholder')).toBeTruthy();
  });
});
