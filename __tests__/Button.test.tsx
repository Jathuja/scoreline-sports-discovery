import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Button } from '../src/components/common/Button';
import { layout } from '../src/theme';

describe('Common Button Component', () => {
  it('should render the button title correctly', () => {
    const { getByText } = render(
      <Button title="Discover Sports" onPress={jest.fn()} />
    );

    expect(getByText('Discover Sports')).toBeTruthy();
  });

  it('should adhere to the minimum touch target requirement (minHeight >= 48dp)', () => {
    const { getByTestId } = render(
      <Button
        testID="target-button"
        title="Explore"
        size="sm"
        onPress={jest.fn()}
      />
    );

    const buttonElement = getByTestId('target-button');
    const flatStyle = StyleSheetFlatten(buttonElement.props.style);

    expect(flatStyle.minHeight).toBeGreaterThanOrEqual(layout.touchTargets.minHeight);
  });

  it('should trigger onPress callback when tapped', () => {
    const handlePress = jest.fn();
    const { getByText } = render(
      <Button title="Click Me" onPress={handlePress} />
    );

    fireEvent.press(getByText('Click Me'));
    expect(handlePress).toHaveBeenCalledTimes(1);
  });

  it('should not trigger onPress when disabled', () => {
    const handlePress = jest.fn();
    const { getByText } = render(
      <Button title="Disabled" onPress={handlePress} disabled />
    );

    fireEvent.press(getByText('Disabled'));
    expect(handlePress).not.toHaveBeenCalled();
  });

  it('should display loading indicator and disable interaction when loading', () => {
    const handlePress = jest.fn();
    const { getByTestId, queryByText } = render(
      <Button
        testID="loading-btn"
        title="Loading State"
        onPress={handlePress}
        loading
      />
    );

    expect(getByTestId('loading-btn-loading')).toBeTruthy();
    expect(queryByText('Loading State')).toBeNull();

    fireEvent.press(getByTestId('loading-btn'));
    expect(handlePress).not.toHaveBeenCalled();
  });
});

// Helper to flatten styled arrays from React Native
function StyleSheetFlatten(style: any): Record<string, any> {
  if (!style) {
    return {};
  }
  if (!Array.isArray(style)) {
    return style;
  }
  return style.reduce((acc, curr) => ({ ...acc, ...StyleSheetFlatten(curr) }), {});
}
