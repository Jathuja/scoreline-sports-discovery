import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import App from '../App';

describe('Root Application & Auth State Integration', () => {
  it('should render authentication flow when session is unauthenticated', async () => {
    const { getByTestId, getByText } = render(<App />);

    await waitFor(() => {
      expect(getByTestId('auth-flow-container')).toBeTruthy();
    });

    expect(getByText('Scoreline')).toBeTruthy();
    expect(getByText('Sign in to your sports discovery account')).toBeTruthy();
  });
});
