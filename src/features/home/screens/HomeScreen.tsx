import React, { useCallback, useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { theme } from '../../../theme';
import { Typography } from '../../../components/common/Typography';
import { Button } from '../../../components/common/Button';
import { ScreenContainer } from '../../../components/common/ScreenContainer';
import { useAppDispatch, useAppSelector } from '../../../store';
import {
  getAllSportsThunk,
  searchLeaguesThunk,
} from '../../discovery/slices/discoverySlice';
import type { MainTabNavProp, RootStackNavigationProp } from '../../../navigation/types';

const DEFAULT_SPORTS = ['Soccer', 'Basketball', 'Tennis', 'Cricket', 'Motorsport'];

export const HomeScreen: React.FC = () => {
  const tabNavigation = useNavigation<MainTabNavProp>();
  const rootNavigation = useNavigation<RootStackNavigationProp>();
  const dispatch = useAppDispatch();
  const { sports, searchLeagues, isSearching } = useAppSelector(
    state => state.discovery,
  );
  const [selectedSport, setSelectedSport] = useState<string | null>(null);

  useEffect(() => {
    dispatch(getAllSportsThunk());
  }, [dispatch]);

  const handleSelectSport = useCallback(
    (sportName: string) => {
      setSelectedSport(sportName);
      dispatch(searchLeaguesThunk(sportName));
    },
    [dispatch],
  );

  const sportNames =
    sports.length > 0
      ? sports.slice(0, 8).map(s => s.strSport)
      : DEFAULT_SPORTS;

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

        <View style={styles.card} testID="home-categories-card">
          <Typography variant="h3" style={styles.cardTitle}>
            Browse Sports Categories
          </Typography>
          <Typography variant="caption" color="secondary" style={styles.cardBody}>
            Tap a sport to discover its leagues:
          </Typography>
          <View style={styles.chipContainer}>
            {sportNames.map(sport => {
              const active = selectedSport === sport;
              return (
                <TouchableOpacity
                  key={sport}
                  testID={`sport-chip-${sport}`}
                  style={[styles.chip, active && styles.chipActive]}
                  onPress={() => handleSelectSport(sport)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.chipText, active && styles.chipTextActive]}>
                    {sport}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {selectedSport ? (
            <View testID="home-discovered-leagues" style={styles.discoveredSection}>
              <Typography variant="caption" color="secondary" style={styles.discoveredHeader}>
                {isSearching
                  ? `Loading ${selectedSport} leagues...`
                  : `${selectedSport} Leagues (${searchLeagues.length})`}
              </Typography>
              {!isSearching &&
                searchLeagues.slice(0, 6).map(league => (
                  <TouchableOpacity
                    key={league.idLeague}
                    testID={`home-league-${league.idLeague}`}
                    style={styles.leagueRow}
                    onPress={() =>
                      rootNavigation.navigate('LeagueDetails', {
                        id: league.idLeague,
                        name: league.strLeague,
                      })
                    }
                    activeOpacity={0.7}
                  >
                    <View style={styles.leagueInfo}>
                      <Text style={styles.leagueName} numberOfLines={1}>
                        {league.strLeague}
                      </Text>
                      {league.strCountry ? (
                        <Text style={styles.leagueCountry}>{league.strCountry}</Text>
                      ) : null}
                    </View>
                    <Text style={styles.chevron}>›</Text>
                  </TouchableOpacity>
                ))}
            </View>
          ) : null}
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
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  chip: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surfaceSubtle,
    minHeight: theme.layout.touchTargets.minHeight,
    justifyContent: 'center',
  },
  chipActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.textPrimary,
  },
  chipTextActive: {
    color: theme.colors.textInverse,
  },
  discoveredSection: {
    marginTop: theme.spacing.md,
    paddingTop: theme.spacing.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: theme.colors.border,
  },
  discoveredHeader: {
    marginBottom: theme.spacing.sm,
  },
  leagueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: theme.colors.border,
    minHeight: theme.layout.touchTargets.minHeight,
  },
  leagueInfo: {
    flex: 1,
  },
  leagueName: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.textPrimary,
  },
  leagueCountry: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  chevron: {
    fontSize: 18,
    color: theme.colors.textSecondary,
    marginLeft: theme.spacing.sm,
  },
  quickLinks: {
    gap: theme.spacing.sm,
    marginTop: theme.spacing.xs,
  },
  quickButton: {
    minHeight: theme.layout.touchTargets.minHeight,
  },
});
