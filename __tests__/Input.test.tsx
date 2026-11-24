import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Input } from '../src/components/common/Input';

describe('Common Input Component', () => {
  it('should render label and placeholder', () => {
    const { getByText, getByPlaceholderText } = render(
      <Input label="Username" placeholder="Enter username" />
    );

    expect(getByText('Username')).toBeTruthy();
    expect(getByPlaceholderText('Enter username')).toBeTruthy();
  });

  it('should render error message with alert role', () => {
    const { getByTestId, getByText } = render(
      <Input
        testID="test-input"
        label="Password"
        error="Password is too short"
      />
    );

    expect(getByTestId('test-input-error')).toBeTruthy();
    expect(getByText('Password is too short')).toBeTruthy();
  });

  it('should toggle secure text entry when password toggle button is pressed', () => {
    const { getByTestId, getByText } = render(
      <Input
        testID="pwd-input"
        label="Password"
        isPassword
      />
    );

    const toggleButton = getByTestId('pwd-input-toggle-password');
    expect(getByText('SHOW')).toBeTruthy();

    fireEvent.press(toggleButton);
    expect(getByText('HIDE')).toBeTruthy();

    fireEvent.press(toggleButton);
    expect(getByText('SHOW')).toBeTruthy();
  });

  it('should trigger onChangeText callback on text input', () => {
    const handleChangeText = jest.fn();
    const { getByTestId } = render(
      <Input
        testID="text-input"
        onChangeText={handleChangeText}
      />
    );

    fireEvent.changeText(getByTestId('text-input'), 'Hello Sports');
    expect(handleChangeText).toHaveBeenCalledWith('Hello Sports');
  });
});
