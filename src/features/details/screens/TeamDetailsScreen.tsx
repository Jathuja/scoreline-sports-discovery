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
import { useAppDispatch, useAppSelector } from '../../../store';
import {
  getTeamDetailsThunk,
  getTeamPlayersThunk,
  clearSelectedTeam,
} from '../../discovery/slices/discoverySlice';
import {
  toggleFavouriteThunk,
} from '../../favourites/slices/favouritesSlice';
import { shareTeam } from '../../../services/share';
import { theme } from '../../../theme';
import { LoadingView, ErrorView } from '../../../components';
import { RootStackParamList } from '../../../navigation/types';

type TeamDetailsRouteProp = RouteProp<RootStackParamList, 'TeamDetails'>;
type TeamDetailsNavProp = NativeStackNavigationProp<RootStackParamList>;

export const TeamDetailsScreen: React.FC = () => {
  const route = useRoute<TeamDetailsRouteProp>();
  const navigation = useNavigation<TeamDetailsNavProp>();
  const dispatch = useAppDispatch();
  const { selectedTeam, teamPlayers, isLoadingDetails, detailsError } = useAppSelector(
    state => state.discovery,
  );
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
      // Share cancelled or failed — no-op
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

  return (
    <ScrollView
      testID="team-details-screen"
      style={styles.container}
      contentContainerStyle={styles.content}
    >
      {/* Badge */}
      {team.strBadge || team.strTeamBadge ? (
        <Image
          testID="team-badge"
          source={{ uri: team.strBadge || team.strTeamBadge }}
          style={styles.badge}
          resizeMode="contain"
        />
      ) : (
        <View testID="team-badge-placeholder" style={styles.badgePlaceholder} />
      )}

      {/* Name */}
      <Text testID="team-name" style={styles.name}>
        {team.strTeam}
      </Text>

      {/* Action buttons */}
      <View style={styles.actions}>
        <TouchableOpacity
          testID="share-button"
          style={styles.actionButton}
          onPress={handleShare}
          activeOpacity={0.8}
        >
          <Text style={styles.actionIcon}>↗</Text>
          <Text style={styles.actionLabel}>Share</Text>
        </TouchableOpacity>

        <TouchableOpacity
          testID="favourite-button"
          style={[styles.actionButton, isFavourite && styles.actionButtonActive]}
          onPress={handleToggleFavourite}
          activeOpacity={0.8}
        >
          <Text style={styles.actionIcon}>{isFavourite ? '♥' : '♡'}</Text>
          <Text style={[styles.actionLabel, isFavourite && styles.actionLabelActive]}>
            {isFavourite ? 'Saved' : 'Favourite'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Info rows */}
      <View testID="team-info" style={styles.infoCard}>
        {team.strLeague ? (
          <InfoRow label="League" value={team.strLeague} testID="team-league" />
        ) : null}
        {team.strSport ? (
          <InfoRow label="Sport" value={team.strSport} testID="team-sport" />
        ) : null}
        {team.strStadium ? (
          <InfoRow label="Stadium" value={team.strStadium} testID="team-stadium" />
        ) : null}
        {team.intStadiumCapacity ? (
          <InfoRow
            label="Capacity"
            value={Number(team.intStadiumCapacity).toLocaleString()}
            testID="team-capacity"
          />
        ) : null}
        {team.strCountry ? (
          <InfoRow label="Country" value={team.strCountry} testID="team-country" />
        ) : null}
        {team.intFormedYear ? (
          <InfoRow label="Founded" value={team.intFormedYear} testID="team-founded" />
        ) : null}
      </View>

      {/* Stadium thumb */}
      {team.strStadiumThumb ? (
        <Image
          testID="team-stadium-image"
          source={{ uri: team.strStadiumThumb }}
          style={styles.stadiumImage}
          resizeMode="cover"
        />
      ) : null}

      {/* Description */}
      {team.strDescriptionEN ? (
        <View style={styles.descriptionCard}>
          <Text style={styles.descriptionTitle}>About</Text>
          <Text testID="team-description" style={styles.description}>
            {team.strDescriptionEN}
          </Text>
        </View>
      ) : null}

      {/* Team Roster */}
      {teamPlayers.length > 0 ? (
        <View testID="team-roster-card" style={styles.descriptionCard}>
          <Text style={styles.descriptionTitle}>
            Squad Roster ({teamPlayers.length})
          </Text>
          {teamPlayers.slice(0, 15).map(player => (
            <TouchableOpacity
              key={player.idPlayer}
              testID={`roster-player-${player.idPlayer}`}
              style={styles.rosterRow}
              onPress={() =>
                navigation.navigate('PlayerDetails', {
                  id: player.idPlayer,
                  name: player.strPlayer,
                })
              }
              activeOpacity={0.7}
            >
              <View style={styles.rosterInfo}>
                <Text style={styles.rosterName}>{player.strPlayer}</Text>
                {player.strPosition ? (
                  <Text style={styles.rosterMeta}>{player.strPosition}</Text>
                ) : null}
              </View>
              <Text style={styles.rosterChevron}>›</Text>
            </TouchableOpacity>
          ))}
        </View>
      ) : null}

      {/* Deep link note */}
      <View style={styles.deepLinkCard}>
        <Text style={styles.deepLinkText}>
          🔗 scoreline://team/{id}
        </Text>
      </View>
    </ScrollView>
  );
};

interface InfoRowProps {
  label: string;
  value: string;
  testID?: string;
}

const InfoRow: React.FC<InfoRowProps> = ({ label, value, testID }) => (
  <View testID={testID} style={styles.infoRow}>
    <Text style={styles.infoLabel}>{label}</Text>
    <Text style={styles.infoValue}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    padding: theme.spacing.md,
    paddingBottom: theme.spacing.xxl ?? 48,
  },
  badge: {
    width: 120,
    height: 120,
    alignSelf: 'center',
    marginBottom: theme.spacing.md,
  },
  badgePlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 12,
    backgroundColor: theme.colors.border,
    alignSelf: 'center',
    marginBottom: theme.spacing.md,
  },
  name: {
    fontSize: 24,
    fontWeight: '800',
    color: theme.colors.textPrimary,
    textAlign: 'center',
    marginBottom: theme.spacing.md,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: theme.colors.primary,
    minHeight: theme.layout.touchTargets.minHeight,
    gap: 6,
  },
  actionButtonActive: {
    backgroundColor: theme.colors.primary,
  },
  actionIcon: {
    fontSize: 18,
    color: theme.colors.primary,
  },
  actionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.primary,
  },
  actionLabelActive: {
    color: theme.colors.background,
  },
  infoCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: theme.spacing.xs ?? 6,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: theme.colors.border,
  },
  infoLabel: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 13,
    color: theme.colors.textPrimary,
    fontWeight: '600',
    flexShrink: 1,
    textAlign: 'right',
    marginLeft: theme.spacing.sm,
  },
  stadiumImage: {
    width: '100%',
    height: 180,
    borderRadius: 12,
    marginBottom: theme.spacing.md,
  },
  descriptionCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  descriptionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.sm,
  },
  description: {
    fontSize: 14,
    lineHeight: 22,
    color: theme.colors.textSecondary,
  },
  deepLinkCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    padding: theme.spacing.md,
    alignItems: 'center',
  },
  deepLinkText: {
    fontSize: 12,
    color: theme.colors.primary,
    fontFamily: 'monospace',
  },
  rosterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: theme.colors.border,
    minHeight: theme.layout.touchTargets.minHeight,
  },
  rosterInfo: {
    flex: 1,
  },
  rosterName: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.textPrimary,
  },
  rosterMeta: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  rosterChevron: {
    fontSize: 18,
    color: theme.colors.textSecondary,
    marginLeft: theme.spacing.sm,
  },
});

export default TeamDetailsScreen;
