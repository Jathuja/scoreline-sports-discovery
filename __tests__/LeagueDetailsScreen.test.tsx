import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import LeagueDetailsScreen from '../src/features/details/screens/LeagueDetailsScreen';
import discoveryReducer from '../src/features/discovery/slices/discoverySlice';
import favouritesReducer from '../src/features/favourites/slices/favouritesSlice';

jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useRoute: () => ({ params: { id: '4328', name: 'Premier League' } }),
  useNavigation: () => ({ navigate: jest.fn(), goBack: jest.fn() }),
}));

jest.mock('../src/features/discovery/slices/discoverySlice', () => {
  const actual = jest.requireActual('../src/features/discovery/slices/discoverySlice');
  return {
    __esModule: true,
    ...actual,
    getLeagueDetailsThunk: jest.fn(() => ({ type: 'noop', payload: null })),
    getLeagueTeamsThunk: jest.fn(() => ({ type: 'noop', payload: [] })),
  };
});

jest.mock('../src/services/share', () => ({
  shareLeague: jest.fn(() => Promise.resolve()),
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
        selectedLeague: {
          idLeague: '4328',
          strLeague: 'English Premier League',
          strSport: 'Soccer',
          strCountry: 'England',
          strCurrentSeason: '2024-2025',
          strDescriptionEN: 'The Premier League is the top tier.',
          strBadge: undefined,
        },
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

describe('LeagueDetailsScreen', () => {
  it('shows loading state', () => {
    const { getByTestId } = render(
      <Provider store={makeStore({ isLoadingDetails: true, selectedLeague: null })}>
        <LeagueDetailsScreen />
      </Provider>,
    );
    expect(getByTestId('league-details-loading')).toBeTruthy();
  });

  it('renders league details', () => {
    const { getByTestId } = render(
      <Provider store={makeStore()}><LeagueDetailsScreen /></Provider>,
    );
    expect(getByTestId('league-details-screen')).toBeTruthy();
    expect(getByTestId('league-name')).toBeTruthy();
  });

  it('shows league name', () => {
    const { getByText } = render(
      <Provider store={makeStore()}><LeagueDetailsScreen /></Provider>,
    );
    expect(getByText('English Premier League')).toBeTruthy();
  });

  it('shows share button', () => {
    const { getByTestId } = render(
      <Provider store={makeStore()}><LeagueDetailsScreen /></Provider>,
    );
    expect(getByTestId('share-button')).toBeTruthy();
  });

  it('shows favourite button', () => {
    const { getByTestId } = render(
      <Provider store={makeStore()}><LeagueDetailsScreen /></Provider>,
    );
    expect(getByTestId('favourite-button')).toBeTruthy();
  });

  it('calls shareLeague on share button press', async () => {
    const { shareLeague } = require('../src/services/share');
    const { getByTestId } = render(
      <Provider store={makeStore()}><LeagueDetailsScreen /></Provider>,
    );
    fireEvent.press(getByTestId('share-button'));
    await waitFor(() => expect(shareLeague).toHaveBeenCalled());
  });

  it('renders teams list when leagueTeams are present', () => {
    const { getByTestId, getByText } = render(
      <Provider
        store={makeStore({
          leagueTeams: [{ idTeam: '133604', strTeam: 'Arsenal', strStadium: 'Emirates Stadium' }],
        })}
      >
        <LeagueDetailsScreen />
      </Provider>,
    );
    expect(getByTestId('league-teams-card')).toBeTruthy();
    expect(getByText('Arsenal')).toBeTruthy();
  });
});
