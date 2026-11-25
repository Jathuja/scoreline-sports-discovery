import {
  createSlice,
  createAsyncThunk,
  PayloadAction,
} from '@reduxjs/toolkit';
import {
  searchTeamsApi,
  searchLeaguesApi,
  searchPlayersApi,
  getTeamDetailsApi,
  getLeagueDetailsApi,
  getPlayerDetailsApi,
  getAllSportsApi,
  getLeagueTeamsApi,
  getTeamPlayersApi,
  formatSportsErrorMessage,
} from '../../../api/sportsApi';
import { Team, League, Player, Sport } from '../types';

interface DiscoveryState {
  sports: Sport[];
  searchTeams: Team[];
  searchLeagues: League[];
  searchPlayers: Player[];
  selectedTeam: Team | null;
  selectedLeague: League | null;
  selectedPlayer: Player | null;
  leagueTeams: Team[];
  teamPlayers: Player[];
  isSearching: boolean;
  isLoadingDetails: boolean;
  searchError: string | null;
  detailsError: string | null;
}

const initialState: DiscoveryState = {
  sports: [],
  searchTeams: [],
  searchLeagues: [],
  searchPlayers: [],
  selectedTeam: null,
  selectedLeague: null,
  selectedPlayer: null,
  leagueTeams: [],
  teamPlayers: [],
  isSearching: false,
  isLoadingDetails: false,
  searchError: null,
  detailsError: null,
};

export const searchTeamsThunk = createAsyncThunk(
  'discovery/searchTeams',
  async (query: string, { rejectWithValue }) => {
    try {
      return await searchTeamsApi(query);
    } catch (error) {
      return rejectWithValue(formatSportsErrorMessage(error));
    }
  },
);

export const searchLeaguesThunk = createAsyncThunk(
  'discovery/searchLeagues',
  async (query: string, { rejectWithValue }) => {
    try {
      return await searchLeaguesApi(query);
    } catch (error) {
      return rejectWithValue(formatSportsErrorMessage(error));
    }
  },
);

export const searchPlayersThunk = createAsyncThunk(
  'discovery/searchPlayers',
  async (query: string, { rejectWithValue }) => {
    try {
      return await searchPlayersApi(query);
    } catch (error) {
      return rejectWithValue(formatSportsErrorMessage(error));
    }
  },
);

export const getTeamDetailsThunk = createAsyncThunk(
  'discovery/getTeamDetails',
  async (id: string, { rejectWithValue }) => {
    try {
      const team = await getTeamDetailsApi(id);
      if (!team) {
        return rejectWithValue('Team not found');
      }
      return team;
    } catch (error) {
      return rejectWithValue(formatSportsErrorMessage(error));
    }
  },
);

export const getLeagueDetailsThunk = createAsyncThunk(
  'discovery/getLeagueDetails',
  async (id: string, { rejectWithValue }) => {
    try {
      const league = await getLeagueDetailsApi(id);
      if (!league) {
        return rejectWithValue('League not found');
      }
      return league;
    } catch (error) {
      return rejectWithValue(formatSportsErrorMessage(error));
    }
  },
);

export const getPlayerDetailsThunk = createAsyncThunk(
  'discovery/getPlayerDetails',
  async (id: string, { rejectWithValue }) => {
    try {
      const player = await getPlayerDetailsApi(id);
      if (!player) {
        return rejectWithValue('Player not found');
      }
      return player;
    } catch (error) {
      return rejectWithValue(formatSportsErrorMessage(error));
    }
  },
);

export const getAllSportsThunk = createAsyncThunk(
  'discovery/getAllSports',
  async (_, { rejectWithValue }) => {
    try {
      return await getAllSportsApi();
    } catch (error) {
      return rejectWithValue(formatSportsErrorMessage(error));
    }
  },
);

export const getLeagueTeamsThunk = createAsyncThunk(
  'discovery/getLeagueTeams',
  async (leagueId: string, { rejectWithValue }) => {
    try {
      return await getLeagueTeamsApi(leagueId);
    } catch (error) {
      return rejectWithValue(formatSportsErrorMessage(error));
    }
  },
);

export const getTeamPlayersThunk = createAsyncThunk(
  'discovery/getTeamPlayers',
  async (teamId: string, { rejectWithValue }) => {
    try {
      return await getTeamPlayersApi(teamId);
    } catch (error) {
      return rejectWithValue(formatSportsErrorMessage(error));
    }
  },
);

const discoverySlice = createSlice({
  name: 'discovery',
  initialState,
  reducers: {
    clearSearchResults(state) {
      state.searchTeams = [];
      state.searchLeagues = [];
      state.searchPlayers = [];
      state.searchError = null;
    },
    clearSelectedTeam(state) {
      state.selectedTeam = null;
      state.teamPlayers = [];
      state.detailsError = null;
    },
    clearSelectedLeague(state) {
      state.selectedLeague = null;
      state.leagueTeams = [];
      state.detailsError = null;
    },
    clearSelectedPlayer(state) {
      state.selectedPlayer = null;
      state.detailsError = null;
    },
  },
  extraReducers: builder => {
    // Search teams
    builder
      .addCase(searchTeamsThunk.pending, state => {
        state.isSearching = true;
        state.searchError = null;
      })
      .addCase(
        searchTeamsThunk.fulfilled,
        (state, action: PayloadAction<Team[]>) => {
          state.isSearching = false;
          state.searchTeams = action.payload;
        },
      )
      .addCase(searchTeamsThunk.rejected, (state, action) => {
        state.isSearching = false;
        state.searchError = action.payload as string;
      });

    // Search leagues
    builder
      .addCase(searchLeaguesThunk.pending, state => {
        state.isSearching = true;
        state.searchError = null;
      })
      .addCase(
        searchLeaguesThunk.fulfilled,
        (state, action: PayloadAction<League[]>) => {
          state.isSearching = false;
          state.searchLeagues = action.payload;
        },
      )
      .addCase(searchLeaguesThunk.rejected, (state, action) => {
        state.isSearching = false;
        state.searchError = action.payload as string;
      });

    // Search players
    builder
      .addCase(searchPlayersThunk.pending, state => {
        state.isSearching = true;
        state.searchError = null;
      })
      .addCase(
        searchPlayersThunk.fulfilled,
        (state, action: PayloadAction<Player[]>) => {
          state.isSearching = false;
          state.searchPlayers = action.payload;
        },
      )
      .addCase(searchPlayersThunk.rejected, (state, action) => {
        state.isSearching = false;
        state.searchError = action.payload as string;
      });

    // Team details
    builder
      .addCase(getTeamDetailsThunk.pending, state => {
        state.isLoadingDetails = true;
        state.detailsError = null;
        state.selectedTeam = null;
      })
      .addCase(
        getTeamDetailsThunk.fulfilled,
        (state, action: PayloadAction<Team>) => {
          state.isLoadingDetails = false;
          state.selectedTeam = action.payload;
        },
      )
      .addCase(getTeamDetailsThunk.rejected, (state, action) => {
        state.isLoadingDetails = false;
        state.detailsError = action.payload as string;
      });

    // League details
    builder
      .addCase(getLeagueDetailsThunk.pending, state => {
        state.isLoadingDetails = true;
        state.detailsError = null;
        state.selectedLeague = null;
      })
      .addCase(
        getLeagueDetailsThunk.fulfilled,
        (state, action: PayloadAction<League>) => {
          state.isLoadingDetails = false;
          state.selectedLeague = action.payload;
        },
      )
      .addCase(getLeagueDetailsThunk.rejected, (state, action) => {
        state.isLoadingDetails = false;
        state.detailsError = action.payload as string;
      });

    // Player details
    builder
      .addCase(getPlayerDetailsThunk.pending, state => {
        state.isLoadingDetails = true;
        state.detailsError = null;
        state.selectedPlayer = null;
      })
      .addCase(
        getPlayerDetailsThunk.fulfilled,
        (state, action: PayloadAction<Player>) => {
          state.isLoadingDetails = false;
          state.selectedPlayer = action.payload;
        },
      )
      .addCase(getPlayerDetailsThunk.rejected, (state, action) => {
        state.isLoadingDetails = false;
        state.detailsError = action.payload as string;
      });

    // All sports
    builder.addCase(
      getAllSportsThunk.fulfilled,
      (state, action: PayloadAction<Sport[]>) => {
        state.sports = action.payload;
      },
    );

    // League teams
    builder.addCase(
      getLeagueTeamsThunk.fulfilled,
      (state, action: PayloadAction<Team[]>) => {
        state.leagueTeams = action.payload;
      },
    );

    // Team players
    builder.addCase(
      getTeamPlayersThunk.fulfilled,
      (state, action: PayloadAction<Player[]>) => {
        state.teamPlayers = action.payload;
      },
    );
  },
});

export const {
  clearSearchResults,
  clearSelectedTeam,
  clearSelectedLeague,
  clearSelectedPlayer,
} = discoverySlice.actions;

export default discoverySlice.reducer;
