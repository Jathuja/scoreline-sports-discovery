import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { theme } from '../../../theme';
import { Typography } from '../../../components/common/Typography';
import { Input } from '../../../components/common/Input';
import { ScreenContainer } from '../../../components/common/ScreenContainer';
import { EmptyStateView } from '../../../components/feedback/EmptyStateView';

export const SearchScreen: React.FC = () => {
  const [query, setQuery] = useState('');

  return (
    <ScreenContainer testID="search-screen-container">
      <View style={styles.header}>
        <Typography variant="h2" color="primary">
          Search Discovery
        </Typography>
        <Typography variant="caption" color="secondary" style={styles.subtitle}>
          Find teams, leagues and players across all sports
        </Typography>
      </View>

      <View style={styles.searchBar}>
        <Input
          testID="search-query-input"
          label=""
          placeholder="Search by team, league or player..."
          value={query}
          onChangeText={setQuery}
          autoCapitalize="none"
        />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <EmptyStateView
          title={query ? `No results for "${query}"` : 'Start Searching'}
          message={
            query
              ? 'Try refining your search keyword or check back once sports discovery is populated.'
              : 'Type a team name (e.g. "Arsenal", "Barcelona"), a league or an athlete name.'
          }
        />
      </ScrollView>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.md,
  },
  subtitle: {
    marginTop: theme.spacing.xs,
  },
  searchBar: {
    paddingHorizontal: theme.spacing.md,
    marginTop: theme.spacing.xs,
  },
  scrollContent: {
    flexGrow: 1,
    padding: theme.spacing.md,
  },
});
