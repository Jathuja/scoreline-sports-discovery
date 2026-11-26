import React from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useAppTheme } from '../../theme';
import { Typography } from '../common/Typography';
import { Button } from '../common/Button';
import { StateFeedbackProps } from '../../types/common';

export interface ErrorViewProps extends StateFeedbackProps {
  style?: StyleProp<ViewStyle>;
}

export const ErrorView: React.FC<ErrorViewProps> = ({
  title = 'Something went wrong',
  message = 'Unable to load content. Please check your network and try again.',
  onRetry,
  retryButtonText = 'Try Again',
  style,
  testID = 'error-view',
  children,
}) => {
  const activeTheme = useAppTheme();

  return (
    <View
      style={[styles.container, style]}
      testID={testID}
      accessibilityRole="alert"
      accessibilityLabel={`${title}. ${message}`}>
      <View
        style={[
          styles.badge,
          { backgroundColor: `${activeTheme.colors.error}15` },
        ]}>
        <Icon
          name="alert-circle"
          size={24}
          color={activeTheme.colors.error}
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
      {onRetry ? (
        <Button
          title={retryButtonText}
          onPress={onRetry}
          variant="primary"
          icon="refresh-cw"
          style={styles.button}
          testID={`${testID}-retry-button`}
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
