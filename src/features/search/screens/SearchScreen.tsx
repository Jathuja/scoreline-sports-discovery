import React, { useCallback, useMemo, useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  Image,
  Text,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/Feather';
import { useAppDispatch, useAppSelector } from '../../../store';
import {
  searchTeamsThunk,
  searchLeaguesThunk,
  searchPlayersThunk,
  clearSearchResults,
} from '../../discovery/slices/discoverySlice';
import { theme, useAppTheme } from '../../../theme';
import { LoadingView, EmptyStateView, ErrorView } from '../../../components';
import { RootStackParamList } from '../../../navigation/types';
import { Team, League, Player } from '../../discovery/types';

type SearchNavProp = NativeStackNavigationProp<RootStackParamList>;
type SearchTab = 'teams' | 'leagues' | 'players';

const DEBOUNCE_MS = 350;

const BadgeImage: React.FC<{ uri?: string; testID?: string; iconName?: string }> = ({
  uri,
  testID,
  iconName = 'shield',
}) => {
  const activeTheme = useAppTheme();
  if (uri) {
    return (
      <Image
        testID={testID}
        source={{ uri }}
        style={styles.badge}
        resizeMode="contain"
      />
    );
  }
  return (
    <View
      testID={testID}
      style={[
        styles.badge,
        styles.badgePlaceholder,
        { backgroundColor: activeTheme.colors.surfaceSubtle },
      ]}>
      <Icon name={iconName} size={20} color={activeTheme.colors.primary} />
    </View>
  );
};

export const SearchScreen: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigation = useNavigation<SearchNavProp>();
  const activeTheme = useAppTheme();
  const { searchTeams, searchLeagues, searchPlayers, isSearching, searchError } =
    useAppSelector(state => state.discovery);

  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState<SearchTab>('teams');
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const runSearch = useCallback(
    (text: string, tab: SearchTab = activeTab) => {
      const trimmed = text.trim();
      if (!trimmed) {
        dispatch(clearSearchResults());
        return;
      }
      if (tab === 'teams') {
        dispatch(searchTeamsThunk(trimmed));
      } else if (tab === 'leagues') {
        dispatch(searchLeaguesThunk(trimmed));
      } else {
        dispatch(searchPlayersThunk(trimmed));
      }
    },
    [dispatch, activeTab],
  );

  const handleQueryChange = useCallback(
    (text: string) => {
      setQuery(text);
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
      debounceTimer.current = setTimeout(() => {
        runSearch(text, activeTab);
      }, DEBOUNCE_MS);
    },
    [runSearch, activeTab],
  );

  const handleTabChange = useCallback(
    (tab: SearchTab) => {
      setActiveTab(tab);
      if (query.trim()) {
        runSearch(query, tab);
      }
    },
    [query, runSearch],
  );

  const handleClear = useCallback(() => {
    setQuery('');
    dispatch(clearSearchResults());
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
  }, [dispatch]);

  const rowDynamicStyle = useMemo(
    () => ({
      backgroundColor: activeTheme.colors.surface,
      borderColor: activeTheme.colors.border,
    }),
    [activeTheme.colors.surface, activeTheme.colors.border],
  );

  const renderTeamItem = useCallback(
    ({ item }: { item: Team }) => (
      <TouchableOpacity
        testID={`team-row-${item.idTeam}`}
        style={[styles.row, rowDynamicStyle]}
        onPress={() =>
          navigation.navigate('TeamDetails', {
            id: item.idTeam,
            name: item.strTeam,
          })
        }
        activeOpacity={0.7}>
        <BadgeImage
          uri={item.strBadge || item.strTeamBadge}
          testID={`team-badge-${item.idTeam}`}
          iconName="shield"
        />
        <View style={styles.rowText}>
          <Text
            style={[styles.rowTitle, { color: activeTheme.colors.textPrimary }]}
            numberOfLines={1}>
            {item.strTeam}
          </Text>
          {item.strLeague ? (
            <Text
              style={[
                styles.rowSubtitle,
                { color: activeTheme.colors.textSecondary },
              ]}
              numberOfLines={1}>
              {item.strLeague}
            </Text>
          ) : null}
        </View>
        <Icon
          name="chevron-right"
          size={18}
          color={activeTheme.colors.textSecondary}
        />
      </TouchableOpacity>
    ),
    [navigation, activeTheme, rowDynamicStyle],
  );

  const renderLeagueItem = useCallback(
    ({ item }: { item: League }) => (
      <TouchableOpacity
        testID={`league-row-${item.idLeague}`}
        style={[styles.row, rowDynamicStyle]}
        onPress={() =>
          navigation.navigate('LeagueDetails', {
            id: item.idLeague,
            name: item.strLeague,
          })
        }
        activeOpacity={0.7}>
        <BadgeImage
          uri={item.strBadge}
          testID={`league-badge-${item.idLeague}`}
          iconName="award"
        />
        <View style={styles.rowText}>
          <Text
            style={[styles.rowTitle, { color: activeTheme.colors.textPrimary }]}
            numberOfLines={1}>
            {item.strLeague}
          </Text>
          {item.strSport ? (
            <Text
              style={[
                styles.rowSubtitle,
                { color: activeTheme.colors.textSecondary },
              ]}
              numberOfLines={1}>
              {item.strSport}
            </Text>
          ) : null}
        </View>
        <Icon
          name="chevron-right"
          size={18}
          color={activeTheme.colors.textSecondary}
        />
      </TouchableOpacity>
    ),
    [navigation, activeTheme, rowDynamicStyle],
  );

  const renderPlayerItem = useCallback(
    ({ item }: { item: Player }) => (
      <TouchableOpacity
        testID={`player-row-${item.idPlayer}`}
        style={[styles.row, rowDynamicStyle]}
        onPress={() =>
          navigation.navigate('PlayerDetails', {
            id: item.idPlayer,
            name: item.strPlayer,
          })
        }
        activeOpacity={0.7}>
        <BadgeImage
          uri={item.strThumb}
          testID={`player-thumb-${item.idPlayer}`}
          iconName="user"
        />
        <View style={styles.rowText}>
          <Text
            style={[styles.rowTitle, { color: activeTheme.colors.textPrimary }]}
            numberOfLines={1}>
            {item.strPlayer}
          </Text>
          {item.strTeam ? (
            <Text
              style={[
                styles.rowSubtitle,
                { color: activeTheme.colors.textSecondary },
              ]}
              numberOfLines={1}>
              {item.strPosition ? `${item.strPosition} · ${item.strTeam}` : item.strTeam}
            </Text>
          ) : null}
        </View>
        <Icon
          name="chevron-right"
          size={18}
          color={activeTheme.colors.textSecondary}
        />
      </TouchableOpacity>
    ),
    [navigation, activeTheme, rowDynamicStyle],
  );

  const getActiveData = () => {
    if (activeTab === 'teams') {
      return searchTeams;
    }
    if (activeTab === 'leagues') {
      return searchLeagues;
    }
    return searchPlayers;
  };

  const renderContent = () => {
    if (isSearching) {
      return <LoadingView testID="search-loading" />;
    }
    if (searchError) {
      return (
        <ErrorView
          testID="search-error"
          message={searchError}
          onRetry={() => runSearch(query, activeTab)}
        />
      );
    }
    if (!query.trim()) {
      return (
        <EmptyStateView
          testID="search-empty-initial"
          title="Discover Sports"
          message="Search for teams, leagues, or players"
          icon="search"
        />
      );
    }
    const data = getActiveData();
    if (data.length === 0) {
      return (
        <EmptyStateView
          testID="search-empty-results"
          title="No Results"
          message={`No ${activeTab} found for "${query}"`}
          icon="search"
        />
      );
    }
    if (activeTab === 'teams') {
      return (
        <FlatList
          testID="teams-list"
          data={searchTeams}
          keyExtractor={item => item.idTeam}
          renderItem={renderTeamItem}
          contentContainerStyle={styles.list}
          keyboardShouldPersistTaps="handled"
        />
      );
    }
    if (activeTab === 'leagues') {
      return (
        <FlatList
          testID="leagues-list"
          data={searchLeagues}
          keyExtractor={item => item.idLeague}
          renderItem={renderLeagueItem}
          contentContainerStyle={styles.list}
          keyboardShouldPersistTaps="handled"
        />
      );
    }
    return (
      <FlatList
        testID="players-list"
        data={searchPlayers}
        keyExtractor={item => item.idPlayer}
        renderItem={renderPlayerItem}
        contentContainerStyle={styles.list}
        keyboardShouldPersistTaps="handled"
      />
    );
  };

  const tabs: SearchTab[] = ['teams', 'leagues', 'players'];

  return (
    <View
      testID="search-screen"
      style={[
        styles.container,
        { backgroundColor: activeTheme.colors.background },
      ]}>
      <View
        style={[
          styles.searchBar,
          {
            backgroundColor: activeTheme.colors.surface,
            borderColor: activeTheme.colors.border,
          },
        ]}>
        <Icon
          name="search"
          size={18}
          color={activeTheme.colors.textSecondary}
          style={styles.searchIcon}
        />
        <TextInput
          testID="search-input"
          style={[styles.searchInput, { color: activeTheme.colors.textPrimary }]}
          placeholder="Search sports..."
          placeholderTextColor={activeTheme.colors.textSecondary}
          value={query}
          onChangeText={handleQueryChange}
          returnKeyType="search"
          autoCorrect={false}
          autoCapitalize="none"
        />
        {query.length > 0 && (
          <TouchableOpacity
            testID="search-clear"
            onPress={handleClear}
            style={styles.clearButton}
            accessibilityLabel="Clear search"
            hitSlop={activeTheme.layout.hitSlop}>
            <Icon name="x" size={18} color={activeTheme.colors.textSecondary} />
          </TouchableOpacity>
        )}
      </View>

      <View testID="search-tabs" style={styles.tabs}>
        {tabs.map(tab => {
          const isActive = activeTab === tab;
          return (
            <TouchableOpacity
              key={tab}
              testID={`tab-${tab}`}
              style={[
                styles.tab,
                isActive && { borderBottomColor: activeTheme.colors.primary },
              ]}
              onPress={() => handleTabChange(tab)}>
              <Text
                style={[
                  styles.tabText,
                  isActive && styles.tabTextActive,
                  {
                    color: isActive
                      ? activeTheme.colors.primary
                      : activeTheme.colors.textSecondary,
                  },
                ]}>
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                {tab === 'teams' && searchTeams.length > 0
                  ? ` (${searchTeams.length})`
                  : ''}
                {tab === 'leagues' && searchLeagues.length > 0
                  ? ` (${searchLeagues.length})`
                  : ''}
                {tab === 'players' && searchPlayers.length > 0
                  ? ` (${searchPlayers.length})`
                  : ''}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={styles.results}>{renderContent()}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: theme.spacing.md,
    paddingLeft: theme.spacing.md,
    paddingRight: theme.spacing.xs,
    borderRadius: 12,
    borderWidth: 1,
    minHeight: theme.layout.touchTargets.minHeight,
  },
  searchIcon: {
    marginRight: theme.spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    paddingVertical: theme.spacing.sm,
  },
  clearButton: {
    minWidth: theme.layout.touchTargets.minWidth,
    minHeight: theme.layout.touchTargets.minHeight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabs: {
    flexDirection: 'row',
    paddingHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
    minHeight: theme.layout.touchTargets.minHeight,
    justifyContent: 'center',
  },
  tabText: {
    fontSize: 13,
    fontWeight: '500',
  },
  tabTextActive: {
    fontWeight: '700',
  },
  results: {
    flex: 1,
  },
  list: {
    paddingHorizontal: theme.spacing.md,
    paddingBottom: theme.spacing.xl,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: theme.spacing.sm,
    minHeight: theme.layout.touchTargets.minHeight,
  },
  badge: {
    width: 48,
    height: 48,
    borderRadius: 8,
    marginRight: theme.spacing.md,
  },
  badgePlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowText: {
    flex: 1,
  },
  rowTitle: {
    fontSize: 15,
    fontWeight: '600',
  },
  rowSubtitle: {
    fontSize: 13,
    marginTop: 2,
  },
});

export default SearchScreen;
