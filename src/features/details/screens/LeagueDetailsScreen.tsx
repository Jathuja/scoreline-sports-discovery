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
  getLeagueDetailsThunk,
  getLeagueTeamsThunk,
  clearSelectedLeague,
} from '../../discovery/slices/discoverySlice';
import { toggleFavouriteThunk } from '../../favourites/slices/favouritesSlice';
import { shareLeague } from '../../../services/share';
import { theme } from '../../../theme';
import { LoadingView, ErrorView } from '../../../components';
import { RootStackParamList } from '../../../navigation/types';

type LeagueDetailsRouteProp = RouteProp<RootStackParamList, 'LeagueDetails'>;
type LeagueDetailsNavProp = NativeStackNavigationProp<RootStackParamList>;

export const LeagueDetailsScreen: React.FC = () => {
  const route = useRoute<LeagueDetailsRouteProp>();
  const navigation = useNavigation<LeagueDetailsNavProp>();
  const dispatch = useAppDispatch();
  const { selectedLeague, leagueTeams, isLoadingDetails, detailsError } = useAppSelector(
    state => state.discovery,
  );
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
      style={styles.container}
      contentContainerStyle={styles.content}
    >
      {league.strBadge ? (
        <Image
          testID="league-badge"
          source={{ uri: league.strBadge }}
          style={styles.badge}
          resizeMode="contain"
        />
      ) : (
        <View testID="league-badge-placeholder" style={styles.badgePlaceholder} />
      )}

      <Text testID="league-name" style={styles.name}>
        {league.strLeague}
      </Text>

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

      <View testID="league-info" style={styles.infoCard}>
        {league.strSport ? (
          <InfoRow label="Sport" value={league.strSport} testID="league-sport" />
        ) : null}
        {league.strCountry ? (
          <InfoRow label="Country" value={league.strCountry} testID="league-country" />
        ) : null}
        {league.strCurrentSeason ? (
          <InfoRow
            label="Season"
            value={league.strCurrentSeason}
            testID="league-season"
          />
        ) : null}
        {league.strGender ? (
          <InfoRow label="Gender" value={league.strGender} testID="league-gender" />
        ) : null}
        {league.intFormedYear ? (
          <InfoRow label="Founded" value={league.intFormedYear} testID="league-founded" />
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
        <View style={styles.descriptionCard}>
          <Text style={styles.descriptionTitle}>About</Text>
          <Text testID="league-description" style={styles.description}>
            {league.strDescriptionEN}
          </Text>
        </View>
      ) : null}

      {leagueTeams.length > 0 ? (
        <View testID="league-teams-card" style={styles.descriptionCard}>
          <Text style={styles.descriptionTitle}>
            Teams ({leagueTeams.length})
          </Text>
          {leagueTeams.map(team => (
            <TouchableOpacity
              key={team.idTeam}
              testID={`league-team-${team.idTeam}`}
              style={styles.teamRow}
              onPress={() =>
                navigation.navigate('TeamDetails', {
                  id: team.idTeam,
                  name: team.strTeam,
                })
              }
              activeOpacity={0.7}
            >
              <View style={styles.teamInfo}>
                <Text style={styles.teamName}>{team.strTeam}</Text>
                {team.strStadium ? (
                  <Text style={styles.teamMeta}>{team.strStadium}</Text>
                ) : null}
              </View>
              <Text style={styles.teamChevron}>›</Text>
            </TouchableOpacity>
          ))}
        </View>
      ) : null}

      <View style={styles.deepLinkCard}>
        <Text style={styles.deepLinkText}>🔗 scoreline://league/{id}</Text>
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
  container: { flex: 1, backgroundColor: theme.colors.background },
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
  actionButtonActive: { backgroundColor: theme.colors.primary },
  actionIcon: { fontSize: 18, color: theme.colors.primary },
  actionLabel: { fontSize: 14, fontWeight: '600', color: theme.colors.primary },
  actionLabelActive: { color: theme.colors.background },
  infoCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: theme.colors.border,
  },
  infoLabel: { fontSize: 13, color: theme.colors.textSecondary, fontWeight: '500' },
  infoValue: {
    fontSize: 13,
    color: theme.colors.textPrimary,
    fontWeight: '600',
    flexShrink: 1,
    textAlign: 'right',
    marginLeft: theme.spacing.sm,
  },
  banner: {
    width: '100%',
    height: 160,
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
  description: { fontSize: 14, lineHeight: 22, color: theme.colors.textSecondary },
  deepLinkCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    padding: theme.spacing.md,
    alignItems: 'center',
  },
  deepLinkText: { fontSize: 12, color: theme.colors.primary, fontFamily: 'monospace' },
  teamRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: theme.colors.border,
    minHeight: theme.layout.touchTargets.minHeight,
  },
  teamInfo: { flex: 1 },
  teamName: { fontSize: 14, fontWeight: '600', color: theme.colors.textPrimary },
  teamMeta: { fontSize: 12, color: theme.colors.textSecondary, marginTop: 2 },
  teamChevron: { fontSize: 18, color: theme.colors.textSecondary, marginLeft: theme.spacing.sm },
});

export default LeagueDetailsScreen;
