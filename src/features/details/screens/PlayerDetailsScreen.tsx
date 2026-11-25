import React, { useCallback, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Image,
  Text,
  TouchableOpacity,
} from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { useAppDispatch, useAppSelector } from '../../../store';
import {
  getPlayerDetailsThunk,
  clearSelectedPlayer,
} from '../../discovery/slices/discoverySlice';
import { toggleFavouriteThunk } from '../../favourites/slices/favouritesSlice';
import { sharePlayer } from '../../../services/share';
import { theme } from '../../../theme';
import { LoadingView, ErrorView } from '../../../components';
import { RootStackParamList } from '../../../navigation/types';

type PlayerDetailsRouteProp = RouteProp<RootStackParamList, 'PlayerDetails'>;

export const PlayerDetailsScreen: React.FC = () => {
  const route = useRoute<PlayerDetailsRouteProp>();
  const dispatch = useAppDispatch();
  const { selectedPlayer, isLoadingDetails, detailsError } = useAppSelector(
    state => state.discovery,
  );
  const favourites = useAppSelector(state => state.favourites.items);

  const { id, name } = route.params;
  const isFavourite = favourites.some(f => f.id === id);

  useEffect(() => {
    dispatch(getPlayerDetailsThunk(id));
    return () => {
      dispatch(clearSelectedPlayer());
    };
  }, [dispatch, id]);

  const handleShare = useCallback(async () => {
    try {
      await sharePlayer(id, selectedPlayer?.strPlayer ?? name ?? 'Player');
    } catch {
      // cancelled
    }
  }, [id, selectedPlayer, name]);

  const handleToggleFavourite = useCallback(() => {
    dispatch(
      toggleFavouriteThunk({
        id,
        name: selectedPlayer?.strPlayer ?? name ?? 'Player',
        type: 'player',
        badge: selectedPlayer?.strThumb,
      }),
    );
  }, [dispatch, id, selectedPlayer, name]);

  if (isLoadingDetails) {
    return <LoadingView testID="player-details-loading" />;
  }
  if (detailsError) {
    return (
      <ErrorView
        testID="player-details-error"
        message={detailsError}
        onRetry={() => dispatch(getPlayerDetailsThunk(id))}
      />
    );
  }
  if (!selectedPlayer) {
    return <LoadingView testID="player-details-empty" />;
  }

  const player = selectedPlayer;

  return (
    <ScrollView
      testID="player-details-screen"
      style={styles.container}
      contentContainerStyle={styles.content}
    >
      {player.strThumb ? (
        <Image
          testID="player-thumb"
          source={{ uri: player.strThumb }}
          style={styles.thumb}
          resizeMode="cover"
        />
      ) : (
        <View testID="player-thumb-placeholder" style={styles.thumbPlaceholder}>
          <Text style={styles.thumbInitial}>
            {player.strPlayer?.[0]?.toUpperCase() ?? '?'}
          </Text>
        </View>
      )}

      <Text testID="player-name" style={styles.name}>
        {player.strPlayer}
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

      <View testID="player-info" style={styles.infoCard}>
        {player.strPosition ? (
          <InfoRow label="Position" value={player.strPosition} testID="player-position" />
        ) : null}
        {player.strTeam ? (
          <InfoRow label="Team" value={player.strTeam} testID="player-team" />
        ) : null}
        {player.strNationality ? (
          <InfoRow
            label="Nationality"
            value={player.strNationality}
            testID="player-nationality"
          />
        ) : null}
        {player.dateBorn ? (
          <InfoRow label="Born" value={player.dateBorn} testID="player-dob" />
        ) : null}
        {player.strHeight ? (
          <InfoRow label="Height" value={player.strHeight} testID="player-height" />
        ) : null}
        {player.strWeight ? (
          <InfoRow label="Weight" value={player.strWeight} testID="player-weight" />
        ) : null}
        {player.strNumber ? (
          <InfoRow label="Number" value={`#${player.strNumber}`} testID="player-number" />
        ) : null}
      </View>

      {player.strDescriptionEN ? (
        <View style={styles.descriptionCard}>
          <Text style={styles.descriptionTitle}>About</Text>
          <Text testID="player-description" style={styles.description}>
            {player.strDescriptionEN}
          </Text>
        </View>
      ) : null}

      <View style={styles.deepLinkCard}>
        <Text style={styles.deepLinkText}>🔗 scoreline://player/{id}</Text>
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
  thumb: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignSelf: 'center',
    marginBottom: theme.spacing.md,
  },
  thumbPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: theme.colors.primary,
    alignSelf: 'center',
    marginBottom: theme.spacing.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  thumbInitial: { fontSize: 48, fontWeight: '700', color: '#fff' },
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
});

export default PlayerDetailsScreen;
