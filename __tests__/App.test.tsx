import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import App from '../App';

describe('Root Application & Navigation Integration', () => {
  it('renders authentication flow when session is unauthenticated', async () => {
    const { getByText } = render(<App />);

    await waitFor(
      () => {
        expect(getByText('Welcome Back')).toBeTruthy();
      },
      { timeout: 3000 },
    );
  });

  it('renders sign-in prompt text', async () => {
    const { getByText } = render(<App />);

    await waitFor(
      () => {
        expect(
          getByText('Sign in to your sports discovery account'),
        ).toBeTruthy();
      },
      { timeout: 3000 },
    );
  });

  it('renders Scoreline brand name on auth or home screen', async () => {
    const { getAllByText } = render(<App />);

    await waitFor(
      () => {
        const elements = getAllByText('Scoreline');
        expect(elements.length).toBeGreaterThanOrEqual(1);
      },
      { timeout: 3000 },
    );
  });
});
