import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Text,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import { theme, useAppTheme } from '../../../theme';
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
  const activeTheme = useAppTheme();
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

  const cardStyle = [
    styles.card,
    {
      backgroundColor: activeTheme.colors.surface,
      borderColor: activeTheme.colors.border,
    },
  ];

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

        <View style={cardStyle} testID="home-overview-card">
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
              icon="search"
              variant="primary"
              onPress={() => tabNavigation.navigate('SearchTab')}
              style={styles.actionButton}
            />
          </View>
        </View>

        <View style={cardStyle} testID="home-categories-card">
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
                  style={[
                    styles.chip,
                    {
                      borderColor: active
                        ? activeTheme.colors.primary
                        : activeTheme.colors.border,
                      backgroundColor: active
                        ? activeTheme.colors.primary
                        : activeTheme.colors.surfaceSubtle,
                    },
                  ]}
                  onPress={() => handleSelectSport(sport)}
                  activeOpacity={0.7}>
                  <Text
                    style={[
                      styles.chipText,
                      {
                        color: active
                          ? activeTheme.colors.textInverse
                          : activeTheme.colors.textPrimary,
                      },
                    ]}>
                    {sport}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {selectedSport ? (
            <View
              testID="home-discovered-leagues"
              style={[
                styles.discoveredSection,
                { borderTopColor: activeTheme.colors.border },
              ]}>
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
                    style={[
                      styles.leagueRow,
                      { borderBottomColor: activeTheme.colors.border },
                    ]}
                    onPress={() =>
                      rootNavigation.navigate('LeagueDetails', {
                        id: league.idLeague,
                        name: league.strLeague,
                      })
                    }
                    activeOpacity={0.7}>
                    {league.strBadge ? (
                      <Image
                        source={{ uri: league.strBadge }}
                        style={styles.leagueBadge}
                        resizeMode="contain"
                      />
                    ) : (
                      <View
                        style={[
                          styles.leagueBadge,
                          styles.leagueBadgePlaceholder,
                          { backgroundColor: activeTheme.colors.surfaceSubtle },
                        ]}>
                        <Icon
                          name="award"
                          size={16}
                          color={activeTheme.colors.primary}
                        />
                      </View>
                    )}
                    <View style={styles.leagueInfo}>
                      <Text
                        style={[
                          styles.leagueName,
                          { color: activeTheme.colors.textPrimary },
                        ]}
                        numberOfLines={1}>
                        {league.strLeague}
                      </Text>
                      {league.strCountry ? (
                        <Text
                          style={[
                            styles.leagueCountry,
                            { color: activeTheme.colors.textSecondary },
                          ]}>
                          {league.strCountry}
                        </Text>
                      ) : null}
                    </View>
                    <Icon
                      name="chevron-right"
                      size={18}
                      color={activeTheme.colors.textSecondary}
                    />
                  </TouchableOpacity>
                ))}
            </View>
          ) : null}
        </View>

        <View style={cardStyle} testID="home-quick-links-card">
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
              icon="shield"
              variant="outline"
              size="sm"
              onPress={() =>
                rootNavigation.navigate('TeamDetails', {
                  id: '133604',
                  name: 'Arsenal',
                })
              }
              style={styles.quickButton}
            />
            <Button
              testID="quick-league-button"
              title="English Premier League (#4328)"
              icon="award"
              variant="outline"
              size="sm"
              onPress={() =>
                rootNavigation.navigate('LeagueDetails', {
                  id: '4328',
                  name: 'Premier League',
                })
              }
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
    padding: theme.spacing.lg,
    borderRadius: theme.layout.borderRadius.md,
    borderWidth: 1,
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
    minHeight: theme.layout.touchTargets.minHeight,
    justifyContent: 'center',
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
  },
  discoveredSection: {
    marginTop: theme.spacing.md,
    paddingTop: theme.spacing.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
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
    minHeight: theme.layout.touchTargets.minHeight,
  },
  leagueBadge: {
    width: 32,
    height: 32,
    borderRadius: 6,
    marginRight: theme.spacing.sm,
  },
  leagueBadgePlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  leagueInfo: {
    flex: 1,
  },
  leagueName: {
    fontSize: 14,
    fontWeight: '600',
  },
  leagueCountry: {
    fontSize: 12,
    marginTop: 2,
  },
  quickLinks: {
    gap: theme.spacing.sm,
    marginTop: theme.spacing.xs,
  },
  quickButton: {
    minHeight: theme.layout.touchTargets.minHeight,
  },
});
