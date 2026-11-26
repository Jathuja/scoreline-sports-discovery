import React from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useAppTheme } from '../../theme';
import { Typography } from '../common/Typography';
import { Button } from '../common/Button';
import { StateFeedbackProps } from '../../types/common';

export interface EmptyStateViewProps extends StateFeedbackProps {
  actionText?: string;
  onAction?: () => void;
  icon?: string;
  style?: StyleProp<ViewStyle>;
}

export const EmptyStateView: React.FC<EmptyStateViewProps> = ({
  title = 'No items found',
  message = 'There is currently no sports data available to display.',
  actionText,
  onAction,
  icon = 'inbox',
  style,
  testID = 'empty-state-view',
  children,
}) => {
  const activeTheme = useAppTheme();

  return (
    <View
      style={[styles.container, style]}
      testID={testID}
      accessibilityRole="text"
      accessibilityLabel={`${title}. ${message}`}>
      <View
        style={[
          styles.badge,
          { backgroundColor: activeTheme.colors.surfaceSubtle },
        ]}>
        <Icon
          name={icon}
          size={24}
          color={activeTheme.colors.textSecondary}
          testID={`${testID}-icon`}
        />
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
    padding: 32,
  },
  badge: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    marginBottom: 4,
  },
  message: {
    marginBottom: 24,
  },
  button: {
    minWidth: 140,
  },
});
