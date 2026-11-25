import React from 'react';
import { render } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import FavouritesScreen from '../src/features/favourites/screens/FavouritesScreen';
import favouritesReducer from '../src/features/favourites/slices/favouritesSlice';
import discoveryReducer from '../src/features/discovery/slices/discoverySlice';

jest.mock('../src/features/favourites/slices/favouritesSlice', () => {
  const actual = jest.requireActual('../src/features/favourites/slices/favouritesSlice');
  return {
    __esModule: true,
    ...actual,
    loadFavouritesThunk: jest.fn(() => ({ type: 'noop' })),
    removeFavouriteThunk: jest.fn(() => ({ type: 'noop' })),
  };
});

jest.mock('../src/services/storage', () => ({
  loadFavourites: jest.fn(() => Promise.resolve([])),
  saveFavourites: jest.fn(() => Promise.resolve()),
  clearFavourites: jest.fn(() => Promise.resolve()),
}));

const makeStore = (favouritesState = {}) =>
  configureStore({
    reducer: { favourites: favouritesReducer, discovery: discoveryReducer },
    preloadedState: {
      favourites: {
        items: [],
        isLoaded: true,
        isLoading: false,
        error: null,
        ...favouritesState,
      },
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
      },
    },
    middleware: gDM => gDM({ serializableCheck: false }),
  });

describe('FavouritesScreen', () => {
  it('renders without crashing', () => {
    const { getByTestId } = render(
      <Provider store={makeStore()}><FavouritesScreen /></Provider>,
    );
    expect(getByTestId('favourites-screen')).toBeTruthy();
  });

  it('shows empty state when no favourites', () => {
    const { getByTestId } = render(
      <Provider store={makeStore()}><FavouritesScreen /></Provider>,
    );
    expect(getByTestId('favourites-empty')).toBeTruthy();
  });

  it('shows favourites list when items exist', () => {
    const items = [
      { id: '133604', name: 'Arsenal', type: 'team' as const },
      { id: '4328', name: 'Premier League', type: 'league' as const },
    ];
    const { getByTestId } = render(
      <Provider store={makeStore({ items })}><FavouritesScreen /></Provider>,
    );
    expect(getByTestId('favourites-list')).toBeTruthy();
    expect(getByTestId('favourite-row-133604')).toBeTruthy();
    expect(getByTestId('favourite-row-4328')).toBeTruthy();
  });

  it('shows loading state', () => {
    const { getByTestId } = render(
      <Provider store={makeStore({ isLoaded: false, isLoading: true })}>
        <FavouritesScreen />
      </Provider>,
    );
    expect(getByTestId('favourites-loading')).toBeTruthy();
  });

  it('shows favourite names', () => {
    const items = [{ id: '133604', name: 'Arsenal', type: 'team' as const }];
    const { getByText } = render(
      <Provider store={makeStore({ items })}><FavouritesScreen /></Provider>,
    );
    expect(getByText('Arsenal')).toBeTruthy();
  });

  it('shows remove button for each item', () => {
    const items = [{ id: '133604', name: 'Arsenal', type: 'team' as const }];
    const { getByTestId } = render(
      <Provider store={makeStore({ items })}><FavouritesScreen /></Provider>,
    );
    expect(getByTestId('remove-favourite-133604')).toBeTruthy();
  });
});
