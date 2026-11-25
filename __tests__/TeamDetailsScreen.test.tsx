import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import TeamDetailsScreen from '../src/features/details/screens/TeamDetailsScreen';
import discoveryReducer from '../src/features/discovery/slices/discoverySlice';
import favouritesReducer from '../src/features/favourites/slices/favouritesSlice';

// Mock navigation
jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useRoute: () => ({ params: { id: '133604', name: 'Arsenal' } }),
  useNavigation: () => ({ navigate: jest.fn(), goBack: jest.fn() }),
}));

jest.mock('../src/features/discovery/slices/discoverySlice', () => {
  const actual = jest.requireActual('../src/features/discovery/slices/discoverySlice');
  return {
    __esModule: true,
    ...actual,
    getTeamDetailsThunk: jest.fn(() => ({ type: 'noop', payload: null })),
    getTeamPlayersThunk: jest.fn(() => ({ type: 'noop', payload: [] })),
    clearSelectedTeam: actual.clearSelectedTeam,
  };
});

jest.mock('../src/services/share', () => ({
  shareTeam: jest.fn(() => Promise.resolve()),
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
        selectedTeam: {
          idTeam: '133604',
          strTeam: 'Arsenal',
          strLeague: 'English Premier League',
          strStadium: 'Emirates Stadium',
          strCountry: 'England',
          strDescriptionEN: 'Arsenal Football Club is a professional football club.',
          strTeamBadge: undefined,
        },
        selectedLeague: null,
        selectedPlayer: null,
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

const renderScreen = (discoveryState = {}) => {
  const store = makeStore(discoveryState);
  return { ...render(<Provider store={store}><TeamDetailsScreen /></Provider>), store };
};

describe('TeamDetailsScreen', () => {
  it('shows loading state', () => {
    const { getByTestId } = renderScreen({ isLoadingDetails: true, selectedTeam: null });
    expect(getByTestId('team-details-loading')).toBeTruthy();
  });

  it('shows error state', () => {
    const { getByTestId } = renderScreen({
      detailsError: 'Team not found',
      selectedTeam: null,
      isLoadingDetails: false,
    });
    expect(getByTestId('team-details-error')).toBeTruthy();
  });

  it('renders team details', () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId('team-details-screen')).toBeTruthy();
    expect(getByTestId('team-name')).toBeTruthy();
  });

  it('shows team name', () => {
    const { getByText } = renderScreen();
    expect(getByText('Arsenal')).toBeTruthy();
  });

  it('shows share button', () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId('share-button')).toBeTruthy();
  });

  it('shows favourite button', () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId('favourite-button')).toBeTruthy();
  });

  it('calls shareTeam on share button press', async () => {
    const { shareTeam } = require('../src/services/share');
    const { getByTestId } = renderScreen();
    fireEvent.press(getByTestId('share-button'));
    await waitFor(() => {
      expect(shareTeam).toHaveBeenCalled();
    });
  });

  it('shows stadium info', () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId('team-stadium')).toBeTruthy();
  });

  it('renders squad roster when players are present', () => {
    const { getByTestId, getByText } = renderScreen({
      teamPlayers: [{ idPlayer: '10', strPlayer: 'Bukayo Saka', strPosition: 'Right Wing' }],
    });
    expect(getByTestId('team-roster-card')).toBeTruthy();
    expect(getByText('Bukayo Saka')).toBeTruthy();
  });
});
