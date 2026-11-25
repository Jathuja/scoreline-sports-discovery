import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { theme } from '../../../theme';
import { Typography } from '../../../components/common/Typography';
import { Button } from '../../../components/common/Button';
import { ScreenContainer } from '../../../components/common/ScreenContainer';
import type { MainTabNavProp, RootStackNavigationProp } from '../../../navigation/types';

export const HomeScreen: React.FC = () => {
  const tabNavigation = useNavigation<MainTabNavProp>();
  const rootNavigation = useNavigation<RootStackNavigationProp>();

  return (
    <ScreenContainer testID="home-screen-container">
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.heroSection}>
          <Typography variant="h1" color="primary">
            Scoreline
          </Typography>
          <Typography variant="body" color="secondary" style={styles.subtitle}>
            Sports Discovery Mobile Platform
          </Typography>
          <Typography variant="caption" color="tertiary" style={styles.indexBadge}>
            Index Number: 234089P
          </Typography>
        </View>

        <View style={styles.card} testID="home-overview-card">
          <Typography variant="h2" style={styles.cardTitle}>
            Discover Sports
          </Typography>
          <Typography variant="body" color="secondary" style={styles.cardBody}>
            Explore professional sports teams, leagues, and athletes from around the world.
          </Typography>
          <View style={styles.buttonRow}>
            <Button
              testID="home-explore-search-button"
              title="Search Sports"
              variant="primary"
              onPress={() => tabNavigation.navigate('SearchTab')}
              style={styles.actionButton}
            />
          </View>
        </View>

        <View style={styles.card} testID="home-quick-links-card">
          <Typography variant="h3" style={styles.cardTitle}>
            Quick Jump (Deep Link Demo)
          </Typography>
          <Typography variant="caption" color="secondary" style={styles.cardBody}>
            Test direct detail navigation targets:
          </Typography>
          <View style={styles.quickLinks}>
            <Button
              testID="quick-team-button"
              title="Arsenal FC (#133604)"
              variant="outline"
              size="sm"
              onPress={() => rootNavigation.navigate('TeamDetails', { id: '133604', name: 'Arsenal' })}
              style={styles.quickButton}
            />
            <Button
              testID="quick-league-button"
              title="English Premier League (#4328)"
              variant="outline"
              size="sm"
              onPress={() => rootNavigation.navigate('LeagueDetails', { id: '4328', name: 'Premier League' })}
              style={styles.quickButton}
            />
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    padding: theme.spacing.md,
  },
  heroSection: {
    marginBottom: theme.spacing.lg,
  },
  subtitle: {
    marginTop: theme.spacing.xs,
  },
  indexBadge: {
    marginTop: theme.spacing.xs,
  },
  card: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.lg,
    borderRadius: theme.layout.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: theme.spacing.md,
  },
  cardTitle: {
    marginBottom: theme.spacing.sm,
  },
  cardBody: {
    marginBottom: theme.spacing.md,
  },
  buttonRow: {
    marginTop: theme.spacing.xs,
  },
  actionButton: {
    minHeight: theme.layout.touchTargets.minHeight,
  },
  quickLinks: {
    gap: theme.spacing.sm,
    marginTop: theme.spacing.xs,
  },
  quickButton: {
    minHeight: theme.layout.touchTargets.minHeight,
  },
});
