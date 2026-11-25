import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import { store } from '../src/store';
import { SearchScreen } from '../src/features/search/screens/SearchScreen';

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <Provider store={store}>{children}</Provider>
);

describe('SearchScreen', () => {
  it('renders without crashing', () => {
    const { getByTestId } = render(<SearchScreen />, { wrapper });
    expect(getByTestId('search-screen-container')).toBeTruthy();
  });

  it('renders search input', () => {
    const { getByTestId } = render(<SearchScreen />, { wrapper });
    expect(getByTestId('search-query-input')).toBeTruthy();
  });

  it('shows start searching prompt by default', () => {
    const { getByText } = render(<SearchScreen />, { wrapper });
    expect(getByText('Start Searching')).toBeTruthy();
  });

  it('shows no-results message when query is typed', () => {
    const { getByTestId, getByText } = render(<SearchScreen />, { wrapper });
    const input = getByTestId('search-query-input');
    fireEvent.changeText(input, 'XYZ_UNKNOWN_TEAM');
    expect(getByText('No results for "XYZ_UNKNOWN_TEAM"')).toBeTruthy();
  });
});
