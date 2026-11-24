import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import { setupStore } from '../src/store';
import { RegisterScreen } from '../src/features/auth/screens/RegisterScreen';

describe('RegisterScreen Component', () => {
  it('should render all registration fields and create account button', () => {
    const store = setupStore();
    const { getByTestId, getByText } = render(
      <Provider store={store}>
        <RegisterScreen />
      </Provider>
    );

    expect(getByTestId('register-firstname-input')).toBeTruthy();
    expect(getByTestId('register-lastname-input')).toBeTruthy();
    expect(getByTestId('register-username-input')).toBeTruthy();
    expect(getByTestId('register-email-input')).toBeTruthy();
    expect(getByTestId('register-password-input')).toBeTruthy();
    expect(getByTestId('register-submit-button')).toBeTruthy();
    expect(getByText('Create a new sports discovery account')).toBeTruthy();
  });

  it('should validate email format and password length', () => {
    const store = setupStore();
    const { getByTestId, getByText } = render(
      <Provider store={store}>
        <RegisterScreen />
      </Provider>
    );

    fireEvent.changeText(getByTestId('register-firstname-input'), 'Jane');
    fireEvent.changeText(getByTestId('register-lastname-input'), 'Doe');
    fireEvent.changeText(getByTestId('register-username-input'), 'janedoe');
    fireEvent.changeText(getByTestId('register-email-input'), 'invalid-email');
    fireEvent.changeText(getByTestId('register-password-input'), '123');

    fireEvent.press(getByTestId('register-submit-button'));

    expect(getByText('Please enter a valid email address')).toBeTruthy();
    expect(getByText('Password must be at least 6 characters')).toBeTruthy();
  });

  it('should trigger navigation back to login screen', () => {
    const store = setupStore();
    const handleNavigate = jest.fn();
    const { getByTestId } = render(
      <Provider store={store}>
        <RegisterScreen onNavigateToLogin={handleNavigate} />
      </Provider>
    );

    fireEvent.press(getByTestId('switch-to-login-button'));
    expect(handleNavigate).toHaveBeenCalledTimes(1);
  });
});
