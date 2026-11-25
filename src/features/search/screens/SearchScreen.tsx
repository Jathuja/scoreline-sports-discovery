import React, { useCallback, useRef, useState } from 'react';
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
import { useAppDispatch, useAppSelector } from '../../../store';
import {
  searchTeamsThunk,
  searchLeaguesThunk,
  searchPlayersThunk,
  clearSearchResults,
} from '../../discovery/slices/discoverySlice';
import { theme } from '../../../theme';
import { LoadingView, EmptyStateView, ErrorView } from '../../../components';
import { RootStackParamList } from '../../../navigation/types';
import { Team, League, Player } from '../../discovery/types';

type SearchNavProp = NativeStackNavigationProp<RootStackParamList>;
type SearchTab = 'teams' | 'leagues' | 'players';

const DEBOUNCE_MS = 300;

const BadgeImage: React.FC<{ uri?: string; testID?: string }> = ({
  uri,
  testID,
}) => {
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
  return <View testID={testID} style={[styles.badge, styles.badgePlaceholder]} />;
};

export const SearchScreen: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigation = useNavigation<SearchNavProp>();
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

  const renderTeamItem = useCallback(
    ({ item }: { item: Team }) => (
      <TouchableOpacity
        testID={`team-row-${item.idTeam}`}
        style={styles.row}
        onPress={() =>
          navigation.navigate('TeamDetails', {
            id: item.idTeam,
            name: item.strTeam,
          })
        }
        activeOpacity={0.7}
      >
        <BadgeImage
          uri={item.strBadge || item.strTeamBadge}
          testID={`team-badge-${item.idTeam}`}
        />
        <View style={styles.rowText}>
          <Text style={styles.rowTitle} numberOfLines={1}>
            {item.strTeam}
          </Text>
          {item.strLeague ? (
            <Text style={styles.rowSubtitle} numberOfLines={1}>
              {item.strLeague}
            </Text>
          ) : null}
        </View>
      </TouchableOpacity>
    ),
    [navigation],
  );

  const renderLeagueItem = useCallback(
    ({ item }: { item: League }) => (
      <TouchableOpacity
        testID={`league-row-${item.idLeague}`}
        style={styles.row}
        onPress={() =>
          navigation.navigate('LeagueDetails', {
            id: item.idLeague,
            name: item.strLeague,
          })
        }
        activeOpacity={0.7}
      >
        <BadgeImage uri={item.strBadge} testID={`league-badge-${item.idLeague}`} />
        <View style={styles.rowText}>
          <Text style={styles.rowTitle} numberOfLines={1}>
            {item.strLeague}
          </Text>
          {item.strSport ? (
            <Text style={styles.rowSubtitle} numberOfLines={1}>
              {item.strSport}
            </Text>
          ) : null}
        </View>
      </TouchableOpacity>
    ),
    [navigation],
  );

  const renderPlayerItem = useCallback(
    ({ item }: { item: Player }) => (
      <TouchableOpacity
        testID={`player-row-${item.idPlayer}`}
        style={styles.row}
        onPress={() =>
          navigation.navigate('PlayerDetails', {
            id: item.idPlayer,
            name: item.strPlayer,
          })
        }
        activeOpacity={0.7}
      >
        <BadgeImage uri={item.strThumb} testID={`player-thumb-${item.idPlayer}`} />
        <View style={styles.rowText}>
          <Text style={styles.rowTitle} numberOfLines={1}>
            {item.strPlayer}
          </Text>
          {item.strTeam ? (
            <Text style={styles.rowSubtitle} numberOfLines={1}>
              {item.strPosition ? `${item.strPosition} · ${item.strTeam}` : item.strTeam}
            </Text>
          ) : null}
        </View>
      </TouchableOpacity>
    ),
    [navigation],
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
          onRetry={() => runSearch(query)}
        />
      );
    }
    if (!query.trim()) {
      return (
        <EmptyStateView
          testID="search-empty-initial"
          title="Discover Sports"
          message="Search for teams, leagues, or players"
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
    <View testID="search-screen" style={styles.container}>
      {/* Search bar */}
      <View style={styles.searchBar}>
        <TextInput
          testID="search-input"
          style={styles.searchInput}
          placeholder="Search sports..."
          placeholderTextColor={theme.colors.textSecondary}
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
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Text style={styles.clearText}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Tabs */}
      <View testID="search-tabs" style={styles.tabs}>
        {tabs.map(tab => (
          <TouchableOpacity
            key={tab}
            testID={`tab-${tab}`}
            style={[styles.tab, activeTab === tab && styles.tabActive]}
            onPress={() => handleTabChange(tab)}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === tab && styles.tabTextActive,
              ]}
            >
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
        ))}
      </View>

      {/* Results */}
      <View style={styles.results}>{renderContent()}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.border,
    minHeight: theme.layout.touchTargets.minHeight,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: theme.colors.textPrimary,
    paddingVertical: theme.spacing.sm,
  },
  clearButton: {
    paddingLeft: theme.spacing.sm,
  },
  clearText: {
    color: theme.colors.textSecondary,
    fontSize: 16,
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
  tabActive: {
    borderBottomColor: theme.colors.primary,
  },
  tabText: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    fontWeight: '500',
  },
  tabTextActive: {
    color: theme.colors.primary,
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
    backgroundColor: theme.colors.surface,
    borderRadius: 10,
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
    backgroundColor: theme.colors.border,
  },
  rowText: {
    flex: 1,
  },
  rowTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: theme.colors.textPrimary,
  },
  rowSubtitle: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
});

export default SearchScreen;
