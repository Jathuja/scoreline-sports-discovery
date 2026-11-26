import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { store, setupStore } from '../src/store';
import { ProfileScreen } from '../src/features/profile/screens/ProfileScreen';

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <Provider store={store}>{children}</Provider>
);

describe('ProfileScreen', () => {
  it('renders without crashing', () => {
    const { getByTestId } = render(<ProfileScreen />, { wrapper });
    expect(getByTestId('profile-screen-container')).toBeTruthy();
  });

  it('renders profile details card', () => {
    const { getByTestId } = render(<ProfileScreen />, { wrapper });
    expect(getByTestId('profile-details-card')).toBeTruthy();
  });

  it('renders sign out button', () => {
    const { getByTestId } = render(<ProfileScreen />, { wrapper });
    expect(getByTestId('profile-sign-out-button')).toBeTruthy();
  });

  it('renders index number 234089P', () => {
    const { getByText } = render(<ProfileScreen />, { wrapper });
    expect(getByText('Index Number: 234089P')).toBeTruthy();
  });

  it('shows keychain security status', () => {
    const { getByText } = render(<ProfileScreen />, { wrapper });
    expect(
      getByText('Security: Hardware Keychain Token Secured (Zero AsyncStorage Leaks)'),
    ).toBeTruthy();
  });

  it('renders sign out button with correct label', () => {
    const { getByText } = render(<ProfileScreen />, { wrapper });
    expect(getByText('Sign Out')).toBeTruthy();
  });

  it('renders remembered dark mode toggle and persists theme choice', async () => {
    const testStore = setupStore();
    const { getByTestId, getByText } = render(
      <Provider store={testStore}>
        <ProfileScreen />
      </Provider>,
    );

    expect(getByText('Dark Mode')).toBeTruthy();
    const toggle = getByTestId('dark-mode-switch');
    expect(toggle.props.value).toBe(false);

    fireEvent(toggle, 'valueChange', true);

    await waitFor(() => {
      expect(testStore.getState().app.themeMode).toBe('dark');
      expect(AsyncStorage.setItem).toHaveBeenCalledWith('@scoreline/theme', 'dark');
    });
  });
});
