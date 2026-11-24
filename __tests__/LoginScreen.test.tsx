import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import { setupStore } from '../src/store';
import { LoginScreen } from '../src/features/auth/screens/LoginScreen';

describe('LoginScreen Component', () => {
  it('should render login fields and submit button', () => {
    const store = setupStore();
    const { getByTestId, getByText } = render(
      <Provider store={store}>
        <LoginScreen />
      </Provider>
    );

    expect(getByTestId('login-username-input')).toBeTruthy();
    expect(getByTestId('login-password-input')).toBeTruthy();
    expect(getByTestId('login-submit-button')).toBeTruthy();
    expect(getByText('Sign in to your sports discovery account')).toBeTruthy();
  });

  it('should show validation errors when submitted with empty fields', () => {
    const store = setupStore();
    const { getByTestId, getByText } = render(
      <Provider store={store}>
        <LoginScreen />
      </Provider>
    );

    fireEvent.press(getByTestId('login-submit-button'));

    expect(getByText('Username is required')).toBeTruthy();
    expect(getByText('Password is required')).toBeTruthy();
  });

  it('should autofill demo credentials on pressing demo account button', () => {
    const store = setupStore();
    const { getByTestId } = render(
      <Provider store={store}>
        <LoginScreen />
      </Provider>
    );

    fireEvent.press(getByTestId('demo-credentials-button'));

    const usernameInput = getByTestId('login-username-input');
    const passwordInput = getByTestId('login-password-input');

    expect(usernameInput.props.value).toBe('emilys');
    expect(passwordInput.props.value).toBe('emilyspass');
  });

  it('should navigate to register when switch button is pressed', () => {
    const store = setupStore();
    const handleNavigate = jest.fn();
    const { getByTestId } = render(
      <Provider store={store}>
        <LoginScreen onNavigateToRegister={handleNavigate} />
      </Provider>
    );

    fireEvent.press(getByTestId('switch-to-register-button'));
    expect(handleNavigate).toHaveBeenCalledTimes(1);
  });
});
