import React from 'react';
import { render } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import { store } from '../src/store';
import { HomeScreen } from '../src/features/home/screens/HomeScreen';

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <Provider store={store}>{children}</Provider>
);

describe('HomeScreen', () => {
  it('renders without crashing', () => {
    const { getByTestId } = render(<HomeScreen />, { wrapper });
    expect(getByTestId('home-screen-container')).toBeTruthy();
  });

  it('renders brand name', () => {
    const { getByText } = render(<HomeScreen />, { wrapper });
    expect(getByText('Scoreline')).toBeTruthy();
  });

  it('renders index number 234089P', () => {
    const { getByText } = render(<HomeScreen />, { wrapper });
    expect(getByText('Index Number: 234089P')).toBeTruthy();
  });

  it('renders discovery card', () => {
    const { getByTestId } = render(<HomeScreen />, { wrapper });
    expect(getByTestId('home-overview-card')).toBeTruthy();
  });

  it('renders Search Sports button', () => {
    const { getByTestId } = render(<HomeScreen />, { wrapper });
    expect(getByTestId('home-explore-search-button')).toBeTruthy();
  });

  it('renders Quick Jump card for deep link demo', () => {
    const { getByTestId } = render(<HomeScreen />, { wrapper });
    expect(getByTestId('home-quick-links-card')).toBeTruthy();
  });

  it('renders Arsenal deep link button', () => {
    const { getByTestId } = render(<HomeScreen />, { wrapper });
    expect(getByTestId('quick-team-button')).toBeTruthy();
  });

  it('renders Premier League deep link button', () => {
    const { getByTestId } = render(<HomeScreen />, { wrapper });
    expect(getByTestId('quick-league-button')).toBeTruthy();
  });

  it('renders sports categories section and default Soccer chip', () => {
    const { getByTestId } = render(<HomeScreen />, { wrapper });
    expect(getByTestId('home-categories-card')).toBeTruthy();
    expect(getByTestId('sport-chip-Soccer')).toBeTruthy();
  });
});
