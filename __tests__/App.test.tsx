import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import App from '../App';

describe('Root Application Component', () => {
  it('should render application branding, index number, and initial state', () => {
    const { getByText, getByTestId } = render(<App />);

    expect(getByText('Scoreline')).toBeTruthy();
    expect(getByText('Sports Discovery Mobile Platform')).toBeTruthy();
    expect(getByText('Index Number: 234089P')).toBeTruthy();
    expect(getByTestId('scoreline-root-container')).toBeTruthy();
  });

  it('should toggle initialization state when button is pressed', () => {
    const { getByTestId, getByText } = render(<App />);

    const button = getByTestId('init-button');
    expect(getByText('Initialize Platform')).toBeTruthy();

    fireEvent.press(button);
    expect(getByText('Platform Initialized')).toBeTruthy();
  });
});
