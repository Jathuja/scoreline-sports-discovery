import React, { useCallback, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Image,
  Text,
} from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { useAppDispatch, useAppSelector } from '../../../store';
import {
  getPlayerDetailsThunk,
  clearSelectedPlayer,
} from '../../discovery/slices/discoverySlice';
import { toggleFavouriteThunk } from '../../favourites/slices/favouritesSlice';
import { sharePlayer } from '../../../services/share';
import { theme, useAppTheme } from '../../../theme';
import { LoadingView, ErrorView } from '../../../components';
import { RootStackParamList } from '../../../navigation/types';
import {
  DetailsActionBar,
  DetailsInfoRow,
  DeepLinkBanner,
} from '../components/DetailsShared';

type PlayerDetailsRouteProp = RouteProp<RootStackParamList, 'PlayerDetails'>;

export const PlayerDetailsScreen: React.FC = () => {
  const route = useRoute<PlayerDetailsRouteProp>();
  const dispatch = useAppDispatch();
  const activeTheme = useAppTheme();
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
      style={[styles.container, { backgroundColor: activeTheme.colors.background }]}
      contentContainerStyle={styles.content}>
      {player.strThumb ? (
        <Image
          testID="player-thumb"
          source={{ uri: player.strThumb }}
          style={styles.thumb}
          resizeMode="cover"
        />
      ) : (
        <View
          testID="player-thumb-placeholder"
          style={[
            styles.thumbPlaceholder,
            { backgroundColor: activeTheme.colors.primary },
          ]}>
          <Text style={styles.thumbInitial}>
            {player.strPlayer?.[0]?.toUpperCase() ?? '?'}
          </Text>
        </View>
      )}

      <Text
        testID="player-name"
        style={[styles.name, { color: activeTheme.colors.textPrimary }]}>
        {player.strPlayer}
      </Text>

      <DetailsActionBar
        onShare={handleShare}
        onToggleFavourite={handleToggleFavourite}
        isFavourite={isFavourite}
      />

      <View
        testID="player-info"
        style={[styles.card, { backgroundColor: activeTheme.colors.surface }]}>
        {player.strPosition ? (
          <DetailsInfoRow label="Position" value={player.strPosition} testID="player-position" />
        ) : null}
        {player.strTeam ? (
          <DetailsInfoRow label="Team" value={player.strTeam} testID="player-team" />
        ) : null}
        {player.strNationality ? (
          <DetailsInfoRow
            label="Nationality"
            value={player.strNationality}
            testID="player-nationality"
          />
        ) : null}
        {player.dateBorn ? (
          <DetailsInfoRow label="Born" value={player.dateBorn} testID="player-dob" />
        ) : null}
        {player.strHeight ? (
          <DetailsInfoRow label="Height" value={player.strHeight} testID="player-height" />
        ) : null}
        {player.strWeight ? (
          <DetailsInfoRow label="Weight" value={player.strWeight} testID="player-weight" />
        ) : null}
        {player.strNumber ? (
          <DetailsInfoRow label="Number" value={`#${player.strNumber}`} testID="player-number" />
        ) : null}
      </View>

      {player.strDescriptionEN ? (
        <View style={[styles.card, { backgroundColor: activeTheme.colors.surface }]}>
          <Text
            style={[styles.cardTitle, { color: activeTheme.colors.textPrimary }]}>
            About
          </Text>
          <Text
            testID="player-description"
            style={[styles.description, { color: activeTheme.colors.textSecondary }]}>
            {player.strDescriptionEN}
          </Text>
        </View>
      ) : null}

      <DeepLinkBanner uri={`scoreline://player/${id}`} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
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
    alignSelf: 'center',
    marginBottom: theme.spacing.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  thumbInitial: { fontSize: 48, fontWeight: '700', color: '#fff' },
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
  description: { fontSize: 14, lineHeight: 22 },
});

export default PlayerDetailsScreen;
