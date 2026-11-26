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
  getTeamDetailsThunk,
  getTeamPlayersThunk,
  clearSelectedTeam,
} from '../../discovery/slices/discoverySlice';
import { toggleFavouriteThunk } from '../../favourites/slices/favouritesSlice';
import { shareTeam } from '../../../services/share';
import { theme, useAppTheme } from '../../../theme';
import { LoadingView, ErrorView } from '../../../components';
import { RootStackParamList } from '../../../navigation/types';
import {
  DetailsActionBar,
  DetailsInfoRow,
  DeepLinkBanner,
} from '../components/DetailsShared';

type TeamDetailsRouteProp = RouteProp<RootStackParamList, 'TeamDetails'>;
type TeamDetailsNavProp = NativeStackNavigationProp<RootStackParamList>;

export const TeamDetailsScreen: React.FC = () => {
  const route = useRoute<TeamDetailsRouteProp>();
  const navigation = useNavigation<TeamDetailsNavProp>();
  const dispatch = useAppDispatch();
  const activeTheme = useAppTheme();
  const { selectedTeam, teamPlayers, isLoadingDetails, detailsError } =
    useAppSelector(state => state.discovery);
  const favourites = useAppSelector(state => state.favourites.items);

  const { id, name } = route.params;
  const isFavourite = favourites.some(f => f.id === id);

  useEffect(() => {
    dispatch(getTeamDetailsThunk(id));
    dispatch(getTeamPlayersThunk(id));
    return () => {
      dispatch(clearSelectedTeam());
    };
  }, [dispatch, id]);

  const handleShare = useCallback(async () => {
    try {
      await shareTeam(id, selectedTeam?.strTeam ?? name ?? 'Team');
    } catch {
      // Share cancelled or failed
    }
  }, [id, selectedTeam, name]);

  const handleToggleFavourite = useCallback(() => {
    dispatch(
      toggleFavouriteThunk({
        id,
        name: selectedTeam?.strTeam ?? name ?? 'Team',
        type: 'team',
        badge: selectedTeam?.strBadge || selectedTeam?.strTeamBadge,
      }),
    );
  }, [dispatch, id, selectedTeam, name]);

  if (isLoadingDetails) {
    return <LoadingView testID="team-details-loading" />;
  }

  if (detailsError) {
    return (
      <ErrorView
        testID="team-details-error"
        message={detailsError}
        onRetry={() => dispatch(getTeamDetailsThunk(id))}
      />
    );
  }

  if (!selectedTeam) {
    return <LoadingView testID="team-details-empty" />;
  }

  const team = selectedTeam;
  const badgeUri = team.strBadge || team.strTeamBadge;

  return (
    <ScrollView
      testID="team-details-screen"
      style={[styles.container, { backgroundColor: activeTheme.colors.background }]}
      contentContainerStyle={styles.content}>
      {badgeUri ? (
        <Image
          testID="team-badge"
          source={{ uri: badgeUri }}
          style={styles.badge}
          resizeMode="contain"
        />
      ) : (
        <View
          testID="team-badge-placeholder"
          style={[
            styles.badgePlaceholder,
            { backgroundColor: activeTheme.colors.surfaceSubtle },
          ]}>
          <Icon name="shield" size={44} color={activeTheme.colors.primary} />
        </View>
      )}

      <Text
        testID="team-name"
        style={[styles.name, { color: activeTheme.colors.textPrimary }]}>
        {team.strTeam}
      </Text>

      <DetailsActionBar
        onShare={handleShare}
        onToggleFavourite={handleToggleFavourite}
        isFavourite={isFavourite}
      />

      <View
        testID="team-info"
        style={[styles.card, { backgroundColor: activeTheme.colors.surface }]}>
        {team.strLeague ? (
          <DetailsInfoRow label="League" value={team.strLeague} testID="team-league" />
        ) : null}
        {team.strSport ? (
          <DetailsInfoRow label="Sport" value={team.strSport} testID="team-sport" />
        ) : null}
        {team.strStadium ? (
          <DetailsInfoRow label="Stadium" value={team.strStadium} testID="team-stadium" />
        ) : null}
        {team.intStadiumCapacity ? (
          <DetailsInfoRow
            label="Capacity"
            value={Number(team.intStadiumCapacity).toLocaleString()}
            testID="team-capacity"
          />
        ) : null}
        {team.strCountry ? (
          <DetailsInfoRow label="Country" value={team.strCountry} testID="team-country" />
        ) : null}
        {team.intFormedYear ? (
          <DetailsInfoRow label="Founded" value={team.intFormedYear} testID="team-founded" />
        ) : null}
      </View>

      {team.strStadiumThumb ? (
        <Image
          testID="team-stadium-image"
          source={{ uri: team.strStadiumThumb }}
          style={styles.stadiumImage}
          resizeMode="cover"
        />
      ) : null}

      {team.strDescriptionEN ? (
        <View style={[styles.card, { backgroundColor: activeTheme.colors.surface }]}>
          <Text
            style={[styles.cardTitle, { color: activeTheme.colors.textPrimary }]}>
            About
          </Text>
          <Text
            testID="team-description"
            style={[styles.description, { color: activeTheme.colors.textSecondary }]}>
            {team.strDescriptionEN}
          </Text>
        </View>
      ) : null}

      {teamPlayers.length > 0 ? (
        <View
          testID="team-roster-card"
          style={[styles.card, { backgroundColor: activeTheme.colors.surface }]}>
          <Text
            style={[styles.cardTitle, { color: activeTheme.colors.textPrimary }]}>
            Squad Roster ({teamPlayers.length})
          </Text>
          {teamPlayers.slice(0, 15).map(player => (
            <TouchableOpacity
              key={player.idPlayer}
              testID={`roster-player-${player.idPlayer}`}
              style={[
                styles.rosterRow,
                { borderBottomColor: activeTheme.colors.border },
              ]}
              onPress={() =>
                navigation.navigate('PlayerDetails', {
                  id: player.idPlayer,
                  name: player.strPlayer,
                })
              }
              activeOpacity={0.7}>
              {player.strThumb ? (
                <Image
                  source={{ uri: player.strThumb }}
                  style={styles.rosterThumb}
                  resizeMode="cover"
                />
              ) : (
                <View
                  style={[
                    styles.rosterThumb,
                    styles.rosterThumbPlaceholder,
                    { backgroundColor: activeTheme.colors.surfaceSubtle },
                  ]}>
                  <Icon name="user" size={16} color={activeTheme.colors.primary} />
                </View>
              )}
              <View style={styles.rosterInfo}>
                <Text
                  style={[
                    styles.rosterName,
                    { color: activeTheme.colors.textPrimary },
                  ]}>
                  {player.strPlayer}
                </Text>
                {player.strPosition ? (
                  <Text
                    style={[
                      styles.rosterMeta,
                      { color: activeTheme.colors.textSecondary },
                    ]}>
                    {player.strPosition}
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

      <DeepLinkBanner uri={`scoreline://team/${id}`} />
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
  stadiumImage: {
    width: '100%',
    height: 180,
    borderRadius: 12,
    marginBottom: theme.spacing.md,
  },
  description: {
    fontSize: 14,
    lineHeight: 22,
  },
  rosterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    minHeight: theme.layout.touchTargets.minHeight,
  },
  rosterThumb: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: theme.spacing.sm,
  },
  rosterThumbPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  rosterInfo: { flex: 1 },
  rosterName: { fontSize: 14, fontWeight: '600' },
  rosterMeta: { fontSize: 12, marginTop: 2 },
});

export default TeamDetailsScreen;
