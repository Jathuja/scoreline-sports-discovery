import React from 'react';
import { View, ActivityIndicator, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { useAppTheme } from '../../theme';
import { Typography } from '../common/Typography';
import { StateFeedbackProps } from '../../types/common';

export interface LoadingViewProps extends StateFeedbackProps {
  style?: StyleProp<ViewStyle>;
  size?: 'small' | 'large';
}

export const LoadingView: React.FC<LoadingViewProps> = ({
  message = 'Loading sports data...',
  style,
  size = 'large',
  testID = 'loading-view',
}) => {
  const activeTheme = useAppTheme();

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: activeTheme.colors.background },
        style,
      ]}
      testID={testID}
      accessibilityRole="progressbar"
      accessibilityLabel={message}>
      <ActivityIndicator size={size} color={activeTheme.colors.primary} />
      {message ? (
        <Typography
          variant="body"
          color="secondary"
          align="center"
          style={styles.message}>
          {message}
        </Typography>
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
  message: {
    marginTop: 16,
  },
});
