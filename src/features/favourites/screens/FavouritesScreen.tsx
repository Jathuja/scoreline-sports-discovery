import React, { useCallback } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Text,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAppDispatch, useAppSelector } from '../../../store';
import { loadFavouritesThunk, removeFavouriteThunk } from '../slices/favouritesSlice';
import { FavouriteItem } from '../../../services/storage';
import { theme } from '../../../theme';
import { LoadingView, EmptyStateView } from '../../../components';
import { RootStackParamList } from '../../../navigation/types';

type FavNavProp = NativeStackNavigationProp<RootStackParamList>;

export const FavouritesScreen: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigation = useNavigation<FavNavProp>();
  const { items, isLoading, isLoaded } = useAppSelector(
    state => state.favourites,
  );

  useFocusEffect(
    useCallback(() => {
      dispatch(loadFavouritesThunk());
    }, [dispatch]),
  );

  const handlePress = useCallback(
    (item: FavouriteItem) => {
      if (item.type === 'team') {
        navigation.navigate('TeamDetails', { id: item.id, name: item.name });
      } else if (item.type === 'league') {
        navigation.navigate('LeagueDetails', { id: item.id, name: item.name });
      } else {
        navigation.navigate('PlayerDetails', { id: item.id, name: item.name });
      }
    },
    [navigation],
  );

  const handleRemove = useCallback(
    (id: string) => {
      dispatch(removeFavouriteThunk(id));
    },
    [dispatch],
  );

  const renderItem = useCallback(
    ({ item }: { item: FavouriteItem }) => (
      <View testID={`favourite-row-${item.id}`} style={styles.row}>
        <TouchableOpacity
          style={styles.rowContent}
          onPress={() => handlePress(item)}
          activeOpacity={0.7}
        >
          {item.badge ? (
            <Image
              testID={`favourite-badge-${item.id}`}
              source={{ uri: item.badge }}
              style={styles.badge}
              resizeMode="contain"
            />
          ) : (
            <View style={[styles.badge, styles.badgePlaceholder]}>
              <Text style={styles.badgeInitial}>
                {item.name[0]?.toUpperCase() ?? '?'}
              </Text>
            </View>
          )}
          <View style={styles.rowText}>
            <Text testID={`favourite-name-${item.id}`} style={styles.rowTitle} numberOfLines={1}>
              {item.name}
            </Text>
            <Text style={styles.rowSubtitle}>
              {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          testID={`remove-favourite-${item.id}`}
          style={styles.removeButton}
          onPress={() => handleRemove(item.id)}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Text style={styles.removeIcon}>✕</Text>
        </TouchableOpacity>
      </View>
    ),
    [handlePress, handleRemove],
  );

  if (isLoading && !isLoaded) {
    return <LoadingView testID="favourites-loading" />;
  }

  return (
    <View testID="favourites-screen" style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Favourites</Text>
        {items.length > 0 && (
          <Text style={styles.headerCount}>{items.length} saved</Text>
        )}
      </View>

      {items.length === 0 ? (
        <EmptyStateView
          testID="favourites-empty"
          title="No Favourites Yet"
          message="No favourites yet. Search for teams, leagues, or players and tap the heart to save them!"
        />
      ) : (
        <FlatList
          testID="favourites-list"
          data={items}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    padding: theme.spacing.md,
    paddingBottom: theme.spacing.sm,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: theme.colors.textPrimary,
  },
  headerCount: {
    fontSize: 13,
    color: theme.colors.textSecondary,
  },
  list: {
    paddingHorizontal: theme.spacing.md,
    paddingBottom: theme.spacing.xl,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: 10,
    marginBottom: theme.spacing.sm,
    minHeight: theme.layout.touchTargets.minHeight,
  },
  rowContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.sm,
  },
  badge: {
    width: 44,
    height: 44,
    borderRadius: 8,
    marginRight: theme.spacing.md,
  },
  badgePlaceholder: {
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeInitial: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
  },
  rowText: { flex: 1 },
  rowTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: theme.colors.textPrimary,
  },
  rowSubtitle: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  removeButton: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    minHeight: theme.layout.touchTargets.minHeight,
    justifyContent: 'center',
  },
  removeIcon: {
    fontSize: 16,
    color: theme.colors.textSecondary,
  },
});

export default FavouritesScreen;
