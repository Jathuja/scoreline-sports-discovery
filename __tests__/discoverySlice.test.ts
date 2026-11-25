import { configureStore } from '@reduxjs/toolkit';
import discoveryReducer, {
  searchTeamsThunk,
  searchLeaguesThunk,
  searchPlayersThunk,
  getTeamDetailsThunk,
  getLeagueDetailsThunk,
  getPlayerDetailsThunk,
  getLeagueTeamsThunk,
  getTeamPlayersThunk,
  clearSearchResults,
  clearSelectedTeam,
  clearSelectedLeague,
  clearSelectedPlayer,
} from '../src/features/discovery/slices/discoverySlice';

// Mock sportsApi
jest.mock('../src/api/sportsApi', () => ({
  searchTeamsApi: jest.fn(),
  searchLeaguesApi: jest.fn(),
  searchPlayersApi: jest.fn(),
  getTeamDetailsApi: jest.fn(),
  getLeagueDetailsApi: jest.fn(),
  getPlayerDetailsApi: jest.fn(),
  getAllSportsApi: jest.fn(),
  getLeagueTeamsApi: jest.fn(),
  getTeamPlayersApi: jest.fn(),
  formatSportsErrorMessage: jest.fn((e: any) => e?.message ?? String(e)),
}));

const {
  searchTeamsApi,
  searchLeaguesApi,
  searchPlayersApi,
  getTeamDetailsApi,
  getLeagueDetailsApi,
  getPlayerDetailsApi,
  getLeagueTeamsApi,
  getTeamPlayersApi,
} = require('../src/api/sportsApi');

const makeStore = () =>
  configureStore({
    reducer: { discovery: discoveryReducer },
    middleware: gDM => gDM({ serializableCheck: false }),
  });

describe('discoverySlice', () => {
  let store: ReturnType<typeof makeStore>;

  beforeEach(() => {
    store = makeStore();
    jest.clearAllMocks();
  });

  describe('clearSearchResults', () => {
    it('clears teams, leagues and players', () => {
      store.dispatch(clearSearchResults());
      const state = store.getState().discovery;
      expect(state.searchTeams).toEqual([]);
      expect(state.searchLeagues).toEqual([]);
      expect(state.searchPlayers).toEqual([]);
    });
  });

  describe('searchTeamsThunk', () => {
    it('sets isSearching true while pending', () => {
      searchTeamsApi.mockReturnValue(new Promise(() => {}));
      store.dispatch(searchTeamsThunk('Arsenal'));
      expect(store.getState().discovery.isSearching).toBe(true);
    });

    it('populates searchTeams on fulfilled', async () => {
      const teams = [{ idTeam: '133604', strTeam: 'Arsenal' }];
      searchTeamsApi.mockResolvedValue(teams);
      await store.dispatch(searchTeamsThunk('Arsenal'));
      const state = store.getState().discovery;
      expect(state.isSearching).toBe(false);
      expect(state.searchTeams).toEqual(teams);
    });

    it('sets searchError on rejected', async () => {
      searchTeamsApi.mockRejectedValue(new Error('Network error'));
      await store.dispatch(searchTeamsThunk('x'));
      const state = store.getState().discovery;
      expect(state.isSearching).toBe(false);
      expect(state.searchError).toBeTruthy();
    });
  });

  describe('searchLeaguesThunk', () => {
    it('populates searchLeagues on fulfilled', async () => {
      const leagues = [{ idLeague: '4328', strLeague: 'Premier League' }];
      searchLeaguesApi.mockResolvedValue(leagues);
      await store.dispatch(searchLeaguesThunk('Soccer'));
      expect(store.getState().discovery.searchLeagues).toEqual(leagues);
    });
  });

  describe('searchPlayersThunk', () => {
    it('populates searchPlayers on fulfilled', async () => {
      const players = [{ idPlayer: '1', strPlayer: 'Messi' }];
      searchPlayersApi.mockResolvedValue(players);
      await store.dispatch(searchPlayersThunk('Messi'));
      expect(store.getState().discovery.searchPlayers).toEqual(players);
    });
  });

  describe('getTeamDetailsThunk', () => {
    it('sets selectedTeam on fulfilled', async () => {
      const team = { idTeam: '133604', strTeam: 'Arsenal' };
      getTeamDetailsApi.mockResolvedValue(team);
      await store.dispatch(getTeamDetailsThunk('133604'));
      expect(store.getState().discovery.selectedTeam).toEqual(team);
    });

    it('sets detailsError when team is null', async () => {
      getTeamDetailsApi.mockResolvedValue(null);
      await store.dispatch(getTeamDetailsThunk('999'));
      expect(store.getState().discovery.detailsError).toBeTruthy();
    });
  });

  describe('getLeagueDetailsThunk', () => {
    it('sets selectedLeague on fulfilled', async () => {
      const league = { idLeague: '4328', strLeague: 'Premier League' };
      getLeagueDetailsApi.mockResolvedValue(league);
      await store.dispatch(getLeagueDetailsThunk('4328'));
      expect(store.getState().discovery.selectedLeague).toEqual(league);
    });
  });

  describe('getPlayerDetailsThunk', () => {
    it('sets selectedPlayer on fulfilled', async () => {
      const player = { idPlayer: '1', strPlayer: 'Messi' };
      getPlayerDetailsApi.mockResolvedValue(player);
      await store.dispatch(getPlayerDetailsThunk('1'));
      expect(store.getState().discovery.selectedPlayer).toEqual(player);
    });
  });

  describe('getLeagueTeamsThunk & getTeamPlayersThunk', () => {
    it('populates leagueTeams on fulfilled', async () => {
      const teams = [{ idTeam: '133604', strTeam: 'Arsenal' }];
      getLeagueTeamsApi.mockResolvedValue(teams);
      await store.dispatch(getLeagueTeamsThunk('4328'));
      expect(store.getState().discovery.leagueTeams).toEqual(teams);
    });

    it('populates teamPlayers on fulfilled', async () => {
      const players = [{ idPlayer: '10', strPlayer: 'Bukayo Saka' }];
      getTeamPlayersApi.mockResolvedValue(players);
      await store.dispatch(getTeamPlayersThunk('133604'));
      expect(store.getState().discovery.teamPlayers).toEqual(players);
    });
  });

  describe('clear actions', () => {
    it('clearSelectedTeam resets selectedTeam', () => {
      store.dispatch(clearSelectedTeam());
      expect(store.getState().discovery.selectedTeam).toBeNull();
    });
    it('clearSelectedLeague resets selectedLeague', () => {
      store.dispatch(clearSelectedLeague());
      expect(store.getState().discovery.selectedLeague).toBeNull();
    });
    it('clearSelectedPlayer resets selectedPlayer', () => {
      store.dispatch(clearSelectedPlayer());
      expect(store.getState().discovery.selectedPlayer).toBeNull();
    });
  });
});
