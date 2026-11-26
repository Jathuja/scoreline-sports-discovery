import React from 'react';
import { View, StyleSheet, StyleProp, ViewStyle, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppTheme } from '../../theme';

export interface ScreenContainerProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

export const ScreenContainer: React.FC<ScreenContainerProps> = ({
  children,
  style,
  testID = 'screen-container',
}) => {
  const activeTheme = useAppTheme();

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: activeTheme.colors.background }]}
      testID={testID}>
      <StatusBar
        barStyle={activeTheme.isDark ? 'light-content' : 'dark-content'}
        backgroundColor={activeTheme.colors.background}
      />
      <View
        style={[
          styles.container,
          {
            paddingHorizontal: activeTheme.spacing.md,
            paddingVertical: activeTheme.spacing.sm,
          },
          style,
        ]}>
        {children}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
});
