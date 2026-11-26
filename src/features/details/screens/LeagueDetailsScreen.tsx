import React, { useCallback, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Image,
  Text,
  TouchableOpacity,
} from 'react-native';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/Feather';
import { useAppDispatch, useAppSelector } from '../../../store';
import {
  getLeagueDetailsThunk,
  getLeagueTeamsThunk,
  clearSelectedLeague,
} from '../../discovery/slices/discoverySlice';
import { toggleFavouriteThunk } from '../../favourites/slices/favouritesSlice';
import { shareLeague } from '../../../services/share';
import { theme, useAppTheme } from '../../../theme';
import { LoadingView, ErrorView } from '../../../components';
import { RootStackParamList } from '../../../navigation/types';
import {
  DetailsActionBar,
  DetailsInfoRow,
  DeepLinkBanner,
} from '../components/DetailsShared';

type LeagueDetailsRouteProp = RouteProp<RootStackParamList, 'LeagueDetails'>;
type LeagueDetailsNavProp = NativeStackNavigationProp<RootStackParamList>;

export const LeagueDetailsScreen: React.FC = () => {
  const route = useRoute<LeagueDetailsRouteProp>();
  const navigation = useNavigation<LeagueDetailsNavProp>();
  const dispatch = useAppDispatch();
  const activeTheme = useAppTheme();
  const { selectedLeague, leagueTeams, isLoadingDetails, detailsError } =
    useAppSelector(state => state.discovery);
  const favourites = useAppSelector(state => state.favourites.items);

  const { id, name } = route.params;
  const isFavourite = favourites.some(f => f.id === id);

  useEffect(() => {
    dispatch(getLeagueDetailsThunk(id));
    dispatch(getLeagueTeamsThunk(id));
    return () => {
      dispatch(clearSelectedLeague());
    };
  }, [dispatch, id]);

  const handleShare = useCallback(async () => {
    try {
      await shareLeague(id, selectedLeague?.strLeague ?? name ?? 'League');
    } catch {
      // cancelled
    }
  }, [id, selectedLeague, name]);

  const handleToggleFavourite = useCallback(() => {
    dispatch(
      toggleFavouriteThunk({
        id,
        name: selectedLeague?.strLeague ?? name ?? 'League',
        type: 'league',
        badge: selectedLeague?.strBadge,
      }),
    );
  }, [dispatch, id, selectedLeague, name]);

  if (isLoadingDetails) {
    return <LoadingView testID="league-details-loading" />;
  }
  if (detailsError) {
    return (
      <ErrorView
        testID="league-details-error"
        message={detailsError}
        onRetry={() => dispatch(getLeagueDetailsThunk(id))}
      />
    );
  }
  if (!selectedLeague) {
    return <LoadingView testID="league-details-empty" />;
  }

  const league = selectedLeague;

  return (
    <ScrollView
      testID="league-details-screen"
      style={[styles.container, { backgroundColor: activeTheme.colors.background }]}
      contentContainerStyle={styles.content}>
      {league.strBadge ? (
        <Image
          testID="league-badge"
          source={{ uri: league.strBadge }}
          style={styles.badge}
          resizeMode="contain"
        />
      ) : (
        <View
          testID="league-badge-placeholder"
          style={[
            styles.badgePlaceholder,
            { backgroundColor: activeTheme.colors.surfaceSubtle },
          ]}>
          <Icon name="award" size={44} color={activeTheme.colors.primary} />
        </View>
      )}

      <Text
        testID="league-name"
        style={[styles.name, { color: activeTheme.colors.textPrimary }]}>
        {league.strLeague}
      </Text>

      <DetailsActionBar
        onShare={handleShare}
        onToggleFavourite={handleToggleFavourite}
        isFavourite={isFavourite}
      />

      <View
        testID="league-info"
        style={[styles.card, { backgroundColor: activeTheme.colors.surface }]}>
        {league.strSport ? (
          <DetailsInfoRow label="Sport" value={league.strSport} testID="league-sport" />
        ) : null}
        {league.strCountry ? (
          <DetailsInfoRow label="Country" value={league.strCountry} testID="league-country" />
        ) : null}
        {league.strCurrentSeason ? (
          <DetailsInfoRow
            label="Season"
            value={league.strCurrentSeason}
            testID="league-season"
          />
        ) : null}
        {league.strGender ? (
          <DetailsInfoRow label="Gender" value={league.strGender} testID="league-gender" />
        ) : null}
        {league.intFormedYear ? (
          <DetailsInfoRow label="Founded" value={league.intFormedYear} testID="league-founded" />
        ) : null}
      </View>

      {league.strBanner ? (
        <Image
          testID="league-banner"
          source={{ uri: league.strBanner }}
          style={styles.banner}
          resizeMode="cover"
        />
      ) : null}

      {league.strDescriptionEN ? (
        <View style={[styles.card, { backgroundColor: activeTheme.colors.surface }]}>
          <Text
            style={[styles.cardTitle, { color: activeTheme.colors.textPrimary }]}>
            About
          </Text>
          <Text
            testID="league-description"
            style={[styles.description, { color: activeTheme.colors.textSecondary }]}>
            {league.strDescriptionEN}
          </Text>
        </View>
      ) : null}

      {leagueTeams.length > 0 ? (
        <View
          testID="league-teams-card"
          style={[styles.card, { backgroundColor: activeTheme.colors.surface }]}>
          <Text
            style={[styles.cardTitle, { color: activeTheme.colors.textPrimary }]}>
            Teams ({leagueTeams.length})
          </Text>
          {leagueTeams.map(team => {
            const teamBadge = team.strBadge || team.strTeamBadge;
            return (
              <TouchableOpacity
                key={team.idTeam}
                testID={`league-team-${team.idTeam}`}
                style={[
                  styles.teamRow,
                  { borderBottomColor: activeTheme.colors.border },
                ]}
                onPress={() =>
                  navigation.navigate('TeamDetails', {
                    id: team.idTeam,
                    name: team.strTeam,
                  })
                }
                activeOpacity={0.7}>
                {teamBadge ? (
                  <Image
                    source={{ uri: teamBadge }}
                    style={styles.teamBadge}
                    resizeMode="contain"
                  />
                ) : (
                  <View
                    style={[
                      styles.teamBadge,
                      styles.teamBadgePlaceholder,
                      { backgroundColor: activeTheme.colors.surfaceSubtle },
                    ]}>
                    <Icon name="shield" size={16} color={activeTheme.colors.primary} />
                  </View>
                )}
                <View style={styles.teamInfo}>
                  <Text
                    style={[
                      styles.teamName,
                      { color: activeTheme.colors.textPrimary },
                    ]}>
                    {team.strTeam}
                  </Text>
                  {team.strStadium ? (
                    <Text
                      style={[
                        styles.teamMeta,
                        { color: activeTheme.colors.textSecondary },
                      ]}>
                      {team.strStadium}
                    </Text>
                  ) : null}
                </View>
                <Icon
                  name="chevron-right"
                  size={18}
                  color={activeTheme.colors.textSecondary}
                />
              </TouchableOpacity>
            );
          })}
        </View>
      ) : null}

      <DeepLinkBanner uri={`scoreline://league/${id}`} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: theme.spacing.md, paddingBottom: 48 },
  badge: {
    width: 120,
    height: 120,
    alignSelf: 'center',
    marginBottom: theme.spacing.md,
  },
  badgePlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignSelf: 'center',
    marginBottom: theme.spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: {
    fontSize: 24,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: theme.spacing.md,
  },
  card: {
    borderRadius: 12,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: theme.spacing.sm,
  },
  banner: {
    width: '100%',
    height: 160,
    borderRadius: 12,
    marginBottom: theme.spacing.md,
  },
  description: { fontSize: 14, lineHeight: 22 },
  teamRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    minHeight: theme.layout.touchTargets.minHeight,
  },
  teamBadge: {
    width: 36,
    height: 36,
    borderRadius: 8,
    marginRight: theme.spacing.sm,
  },
  teamBadgePlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  teamInfo: { flex: 1 },
  teamName: { fontSize: 14, fontWeight: '600' },
  teamMeta: { fontSize: 12, marginTop: 2 },
});

export default LeagueDetailsScreen;
