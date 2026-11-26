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
import Icon from 'react-native-vector-icons/Feather';
import { useAppDispatch, useAppSelector } from '../../../store';
import { loadFavouritesThunk, removeFavouriteThunk } from '../slices/favouritesSlice';
import { FavouriteItem } from '../../../services/storage';
import { theme, useAppTheme } from '../../../theme';
import { LoadingView, EmptyStateView } from '../../../components';
import { RootStackParamList } from '../../../navigation/types';

type FavNavProp = NativeStackNavigationProp<RootStackParamList>;

export const FavouritesScreen: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigation = useNavigation<FavNavProp>();
  const activeTheme = useAppTheme();
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
      <View
        testID={`favourite-row-${item.id}`}
        style={[
          styles.row,
          {
            backgroundColor: activeTheme.colors.surface,
            borderColor: activeTheme.colors.border,
          },
        ]}>
        <TouchableOpacity
          style={styles.rowContent}
          onPress={() => handlePress(item)}
          activeOpacity={0.7}>
          {item.badge ? (
            <Image
              testID={`favourite-badge-${item.id}`}
              source={{ uri: item.badge }}
              style={styles.badge}
              resizeMode="contain"
            />
          ) : (
            <View
              style={[
                styles.badge,
                styles.badgePlaceholder,
                { backgroundColor: activeTheme.colors.primary },
              ]}>
              <Text style={styles.badgeInitial}>
                {item.name[0]?.toUpperCase() ?? '?'}
              </Text>
            </View>
          )}
          <View style={styles.rowText}>
            <Text
              testID={`favourite-name-${item.id}`}
              style={[styles.rowTitle, { color: activeTheme.colors.textPrimary }]}
              numberOfLines={1}>
              {item.name}
            </Text>
            <Text
              style={[
                styles.rowSubtitle,
                { color: activeTheme.colors.textSecondary },
              ]}>
              {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          testID={`remove-favourite-${item.id}`}
          style={styles.removeButton}
          accessibilityLabel={`Remove ${item.name}`}
          onPress={() => handleRemove(item.id)}
          hitSlop={activeTheme.layout.hitSlop}>
          <Icon name="x" size={18} color={activeTheme.colors.textSecondary} />
        </TouchableOpacity>
      </View>
    ),
    [handlePress, handleRemove, activeTheme],
  );

  if (isLoading && !isLoaded) {
    return <LoadingView testID="favourites-loading" />;
  }

  return (
    <View
      testID="favourites-screen"
      style={[
        styles.container,
        { backgroundColor: activeTheme.colors.background },
      ]}>
      <View style={styles.header}>
        <Text
          style={[styles.headerTitle, { color: activeTheme.colors.textPrimary }]}>
          My Favourites
        </Text>
        {items.length > 0 && (
          <Text
            style={[
              styles.headerCount,
              { color: activeTheme.colors.textSecondary },
            ]}>
            {items.length} saved
          </Text>
        )}
      </View>

      {items.length === 0 ? (
        <EmptyStateView
          testID="favourites-empty"
          title="No Favourites Yet"
          message="No favourites yet. Search for teams, leagues, or players and tap the heart to save them!"
          icon="heart"
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
  },
  headerCount: {
    fontSize: 13,
  },
  list: {
    paddingHorizontal: theme.spacing.md,
    paddingBottom: theme.spacing.xl,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 1,
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
  },
  rowSubtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  removeButton: {
    minWidth: theme.layout.touchTargets.minWidth,
    minHeight: theme.layout.touchTargets.minHeight,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default FavouritesScreen;
