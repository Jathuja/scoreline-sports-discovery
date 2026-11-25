import axios, { AxiosError } from 'axios';
import { ENV } from '../config/env';
import { Team, League, Player, Sport } from '../features/discovery/types';

export const sportsApiClient = axios.create({
  baseURL: ENV.API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});

export const formatSportsErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<{ message?: string }>;
    if (axiosError.response?.data?.message) {
      return axiosError.response.data.message;
    }
    if (axiosError.message) {
      return axiosError.message;
    }
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'An unexpected error occurred. Please try again.';
};

/** Search teams by name */
export const searchTeamsApi = async (query: string): Promise<Team[]> => {
  const response = await sportsApiClient.get<{ teams: Team[] | null }>(
    `/searchteams.php?t=${encodeURIComponent(query)}`,
  );
  return response.data.teams ?? [];
};

/** Search leagues by sport or fallback to filtering all leagues by name */
export const searchLeaguesApi = async (query: string): Promise<League[]> => {
  const response = await sportsApiClient.get<{
    countries?: League[] | null;
    leagues?: League[] | null;
  }>(`/search_all_leagues.php?s=${encodeURIComponent(query)}`);
  const bySport = response.data.countries ?? response.data.leagues ?? [];
  if (bySport.length > 0) {
    return bySport;
  }
  const allResp = await sportsApiClient.get<{ leagues: League[] | null }>(
    '/all_leagues.php',
  );
  const lower = query.toLowerCase();
  return (allResp.data.leagues ?? []).filter(
    l =>
      l.strLeague?.toLowerCase().includes(lower) ||
      l.strSport?.toLowerCase().includes(lower),
  );
};

/** Search players by name */
export const searchPlayersApi = async (query: string): Promise<Player[]> => {
  const response = await sportsApiClient.get<{ player: Player[] | null }>(
    `/searchplayers.php?p=${encodeURIComponent(query)}`,
  );
  return response.data.player ?? [];
};

/** Lookup team details by id */
export const getTeamDetailsApi = async (id: string): Promise<Team | null> => {
  const response = await sportsApiClient.get<{ teams: Team[] | null }>(
    `/lookupteam.php?id=${id}`,
  );
  return response.data.teams?.[0] ?? null;
};

/** Lookup league details by id */
export const getLeagueDetailsApi = async (
  id: string,
): Promise<League | null> => {
  const response = await sportsApiClient.get<{ leagues: League[] | null }>(
    `/lookupleague.php?id=${id}`,
  );
  return response.data.leagues?.[0] ?? null;
};

/** Lookup player details by id */
export const getPlayerDetailsApi = async (
  id: string,
): Promise<Player | null> => {
  const response = await sportsApiClient.get<{ players: Player[] | null }>(
    `/lookupplayer.php?id=${id}`,
  );
  return response.data.players?.[0] ?? null;
};

/** Get all sports */
export const getAllSportsApi = async (): Promise<Sport[]> => {
  const response = await sportsApiClient.get<{ sports: Sport[] | null }>(
    '/all_sports.php',
  );
  return response.data.sports ?? [];
};

/** Lookup all teams in a league */
export const getLeagueTeamsApi = async (leagueId: string): Promise<Team[]> => {
  const response = await sportsApiClient.get<{ teams: Team[] | null }>(
    `/lookup_all_teams.php?id=${encodeURIComponent(leagueId)}`,
  );
  return response.data.teams ?? [];
};

/** Lookup all players in a team (roster) */
export const getTeamPlayersApi = async (teamId: string): Promise<Player[]> => {
  const response = await sportsApiClient.get<{ player: Player[] | null }>(
    `/lookup_all_players.php?id=${encodeURIComponent(teamId)}`,
  );
  return response.data.player ?? [];
};
