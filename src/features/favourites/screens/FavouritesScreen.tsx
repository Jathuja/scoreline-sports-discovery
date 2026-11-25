import React from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { theme } from '../../../theme';
import { ScreenContainer } from '../../../components/common/ScreenContainer';
import { EmptyStateView } from '../../../components/feedback/EmptyStateView';
import type { MainTabNavProp } from '../../../navigation/types';

export const FavouritesScreen: React.FC = () => {
  const navigation = useNavigation<MainTabNavProp>();

  return (
    <ScreenContainer testID="favourites-screen-container">
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <EmptyStateView
          title="No Favourites Saved Yet"
          message="Bookmark your favourite teams and leagues while exploring to access them quickly even when offline."
          actionText="Explore Sports"
          onAction={() => navigation.navigate('HomeTab')}
        />
      </ScrollView>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    padding: theme.spacing.md,
    justifyContent: 'center',
  },
});
