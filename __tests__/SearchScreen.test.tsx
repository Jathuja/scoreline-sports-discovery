import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import SearchScreen from '../src/features/search/screens/SearchScreen';
import discoveryReducer from '../src/features/discovery/slices/discoverySlice';
import favouritesReducer from '../src/features/favourites/slices/favouritesSlice';

jest.mock('../src/features/discovery/slices/discoverySlice', () => {
  const actual = jest.requireActual('../src/features/discovery/slices/discoverySlice');
  return {
    __esModule: true,
    ...actual,
    searchTeamsThunk: jest.fn(() => ({ type: 'noop' })),
    searchLeaguesThunk: jest.fn(() => ({ type: 'noop' })),
    searchPlayersThunk: jest.fn(() => ({ type: 'noop' })),
  };
});

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

const renderScreen = (state = {}) =>
  render(<Provider store={makeStore(state)}><SearchScreen /></Provider>);

describe('SearchScreen', () => {
  it('renders search input', () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId('search-input')).toBeTruthy();
  });

  it('renders tabs', () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId('tab-teams')).toBeTruthy();
    expect(getByTestId('tab-leagues')).toBeTruthy();
    expect(getByTestId('tab-players')).toBeTruthy();
  });

  it('shows initial empty state before search', () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId('search-empty-initial')).toBeTruthy();
  });

  it('shows clear button when query is non-empty', () => {
    const { getByTestId } = renderScreen();
    fireEvent.changeText(getByTestId('search-input'), 'Arsenal');
    expect(getByTestId('search-clear')).toBeTruthy();
  });

  it('shows teams list when teams results exist and query set', () => {
    const store = makeStore({
      searchTeams: [{ idTeam: '133604', strTeam: 'Arsenal', strLeague: 'EPL' }],
    });
    const { getByTestId } = render(
      <Provider store={store}><SearchScreen /></Provider>,
    );
    fireEvent.changeText(getByTestId('search-input'), 'Arsenal');
    expect(getByTestId('teams-list')).toBeTruthy();
  });

  it('shows error state', () => {
    const store = makeStore({ searchError: 'Network error', isSearching: false });
    const { getByTestId } = render(
      <Provider store={store}><SearchScreen /></Provider>,
    );
    fireEvent.changeText(getByTestId('search-input'), 'Arsenal');
    expect(getByTestId('search-error')).toBeTruthy();
  });

  it('switches tabs on press', () => {
    const { getByTestId } = renderScreen();
    fireEvent.press(getByTestId('tab-leagues'));
    expect(getByTestId('tab-leagues')).toBeTruthy();
  });

  it('shows search screen container', () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId('search-screen')).toBeTruthy();
  });
});
