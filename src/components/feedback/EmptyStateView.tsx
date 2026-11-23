import React from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { theme } from '../../theme';
import { Typography } from '../common/Typography';
import { Button } from '../common/Button';
import { StateFeedbackProps } from '../../types/common';

export interface EmptyStateViewProps extends StateFeedbackProps {
  actionText?: string;
  onAction?: () => void;
  style?: StyleProp<ViewStyle>;
}

export const EmptyStateView: React.FC<EmptyStateViewProps> = ({
  title = 'No items found',
  message = 'There is currently no sports data available to display.',
  actionText,
  onAction,
  style,
  testID = 'empty-state-view',
  children,
}) => {
  return (
    <View
      style={[styles.container, style]}
      testID={testID}
      accessibilityRole="text"
      accessibilityLabel={`${title}. ${message}`}>
      <View style={styles.badge}>
        <Typography variant="h3" color="secondary" align="center">
          ∅
        </Typography>
      </View>
      <Typography variant="h3" align="center" style={styles.title}>
        {title}
      </Typography>
      {message ? (
        <Typography
          variant="body"
          color="secondary"
          align="center"
          style={styles.message}>
          {message}
        </Typography>
      ) : null}
      {children}
      {actionText && onAction ? (
        <Button
          title={actionText}
          onPress={onAction}
          variant="outline"
          style={styles.button}
          testID={`${testID}-action-button`}
        />
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.xl,
  },
  badge: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.colors.surfaceSubtle,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.md,
  },
  title: {
    marginBottom: theme.spacing.xs,
  },
  message: {
    marginBottom: theme.spacing.lg,
  },
  button: {
    minWidth: 140,
  },
});
