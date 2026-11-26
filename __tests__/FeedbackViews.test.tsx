import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { LoadingView } from '../src/components/feedback/LoadingView';
import { ErrorView } from '../src/components/feedback/ErrorView';
import { EmptyStateView } from '../src/components/feedback/EmptyStateView';

describe('State Feedback Views', () => {
  describe('LoadingView', () => {
    it('should render loading indicator and default message', () => {
      const { getByTestId, getByText } = render(<LoadingView />);

      expect(getByTestId('loading-view')).toBeTruthy();
      expect(getByText('Loading sports data...')).toBeTruthy();
    });

    it('should render custom loading message', () => {
      const { getByText } = render(
        <LoadingView message="Fetching league table..." />
      );

      expect(getByText('Fetching league table...')).toBeTruthy();
    });
  });

  describe('ErrorView', () => {
    it('should render title and error message with alert role', () => {
      const { getByText, getByTestId } = render(
        <ErrorView
          title="Network Failure"
          message="Could not reach TheSportsDB."
        />
      );

      expect(getByTestId('error-view')).toBeTruthy();
      expect(getByTestId('error-view-icon')).toBeTruthy();
      expect(getByText('Network Failure')).toBeTruthy();
      expect(getByText('Could not reach TheSportsDB.')).toBeTruthy();
    });

    it('should trigger onRetry callback when retry button is pressed', () => {
      const handleRetry = jest.fn();
      const { getByTestId } = render(
        <ErrorView
          testID="custom-error"
          title="Failed"
          onRetry={handleRetry}
          retryButtonText="Retry Fetch"
        />
      );

      fireEvent.press(getByTestId('custom-error-retry-button'));
      expect(handleRetry).toHaveBeenCalledTimes(1);
    });
  });

  describe('EmptyStateView', () => {
    it('should render empty state title and message', () => {
      const { getByTestId, getByText } = render(
        <EmptyStateView
          title="No Teams Found"
          message="No matching teams found in this league."
        />
      );

      expect(getByTestId('empty-state-view')).toBeTruthy();
      expect(getByTestId('empty-state-view-icon')).toBeTruthy();
      expect(getByText('No Teams Found')).toBeTruthy();
      expect(getByText('No matching teams found in this league.')).toBeTruthy();
    });

    it('should trigger onAction callback when action button is pressed', () => {
      const handleAction = jest.fn();
      const { getByTestId } = render(
        <EmptyStateView
          testID="custom-empty"
          title="No Favourites"
          actionText="Browse Leagues"
          onAction={handleAction}
        />
      );

      fireEvent.press(getByTestId('custom-empty-action-button'));
      expect(handleAction).toHaveBeenCalledTimes(1);
    });
  });
});
