import React from 'react';
import { render } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import { store } from '../src/store';
import { FavouritesScreen } from '../src/features/favourites/screens/FavouritesScreen';

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <Provider store={store}>{children}</Provider>
);

describe('FavouritesScreen', () => {
  it('renders without crashing', () => {
    const { getByTestId } = render(<FavouritesScreen />, { wrapper });
    expect(getByTestId('favourites-screen-container')).toBeTruthy();
  });

  it('shows empty state title', () => {
    const { getByText } = render(<FavouritesScreen />, { wrapper });
    expect(getByText('No Favourites Saved Yet')).toBeTruthy();
  });

  it('shows explore action button', () => {
    const { getByText } = render(<FavouritesScreen />, { wrapper });
    expect(getByText('Explore Sports')).toBeTruthy();
  });

  it('shows informative message about bookmarking', () => {
    const { getByText } = render(<FavouritesScreen />, { wrapper });
    expect(
      getByText(
        'Bookmark your favourite teams and leagues while exploring to access them quickly even when offline.',
      ),
    ).toBeTruthy();
  });
});
