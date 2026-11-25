import axios from 'axios';
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
} from '../src/api/sportsApi';

jest.mock('axios', () => {
  const mockAxiosInstance = {
    get: jest.fn(),
    post: jest.fn(),
    interceptors: { request: { use: jest.fn() }, response: { use: jest.fn() } },
  };
  return {
    create: jest.fn(() => mockAxiosInstance),
    isAxiosError: jest.fn(),
    default: { create: jest.fn(() => mockAxiosInstance) },
  };
});

let axiosInstance: { get: jest.Mock };

beforeEach(() => {
  jest.clearAllMocks();
  axiosInstance = (axios.create as jest.Mock)();
});

describe('sportsApi', () => {
  describe('searchTeamsApi', () => {
    it('returns teams array on success', async () => {
      axiosInstance.get.mockResolvedValueOnce({
        data: { teams: [{ idTeam: '1', strTeam: 'Arsenal' }] },
      });
      const result = await searchTeamsApi('Arsenal');
      expect(Array.isArray(result)).toBe(true);
      expect(result).toHaveLength(1);
    });

    it('returns empty array when teams is null', async () => {
      axiosInstance.get.mockResolvedValueOnce({ data: { teams: null } });
      const result = await searchTeamsApi('xyz');
      expect(result).toEqual([]);
    });
  });

  describe('searchLeaguesApi', () => {
    it('returns leagues array on success', async () => {
      axiosInstance.get.mockResolvedValueOnce({
        data: { countries: [{ idLeague: '4328', strLeague: 'Premier League' }] },
      });
      const result = await searchLeaguesApi('Soccer');
      expect(Array.isArray(result)).toBe(true);
      expect(result).toHaveLength(1);
    });

    it('returns empty array when leagues and fallback are empty', async () => {
      axiosInstance.get
        .mockResolvedValueOnce({ data: { countries: null } })
        .mockResolvedValueOnce({ data: { leagues: null } });
      const result = await searchLeaguesApi('unknown');
      expect(result).toEqual([]);
    });
  });

  describe('searchPlayersApi', () => {
    it('returns players array on success', async () => {
      axiosInstance.get.mockResolvedValueOnce({
        data: { player: [{ idPlayer: '34145361', strPlayer: 'Lionel Messi' }] },
      });
      const result = await searchPlayersApi('Messi');
      expect(Array.isArray(result)).toBe(true);
      expect(result).toHaveLength(1);
    });

    it('returns empty array when player is null', async () => {
      axiosInstance.get.mockResolvedValueOnce({ data: { player: null } });
      const result = await searchPlayersApi('nobody');
      expect(result).toEqual([]);
    });
  });

  describe('getTeamDetailsApi', () => {
    it('returns first team on success', async () => {
      axiosInstance.get.mockResolvedValueOnce({
        data: { teams: [{ idTeam: '133604', strTeam: 'Arsenal' }] },
      });
      const result = await getTeamDetailsApi('133604');
      expect(result).toBeTruthy();
      expect(result?.strTeam).toBe('Arsenal');
    });

    it('returns null when teams is null', async () => {
      axiosInstance.get.mockResolvedValueOnce({ data: { teams: null } });
      const result = await getTeamDetailsApi('999');
      expect(result).toBeNull();
    });
  });

  describe('getLeagueDetailsApi', () => {
    it('returns first league on success', async () => {
      axiosInstance.get.mockResolvedValueOnce({
        data: { leagues: [{ idLeague: '4328', strLeague: 'Premier League' }] },
      });
      const result = await getLeagueDetailsApi('4328');
      expect(result).toBeTruthy();
      expect(result?.strLeague).toBe('Premier League');
    });

    it('returns null when leagues is null', async () => {
      axiosInstance.get.mockResolvedValueOnce({ data: { leagues: null } });
      const result = await getLeagueDetailsApi('999');
      expect(result).toBeNull();
    });
  });

  describe('getPlayerDetailsApi', () => {
    it('returns first player on success', async () => {
      axiosInstance.get.mockResolvedValueOnce({
        data: { players: [{ idPlayer: '34145361', strPlayer: 'Lionel Messi' }] },
      });
      const result = await getPlayerDetailsApi('34145361');
      expect(result).toBeTruthy();
      expect(result?.strPlayer).toBe('Lionel Messi');
    });

    it('returns null when players is null', async () => {
      axiosInstance.get.mockResolvedValueOnce({ data: { players: null } });
      const result = await getPlayerDetailsApi('999');
      expect(result).toBeNull();
    });
  });

  describe('getAllSportsApi', () => {
    it('returns sports array on success', async () => {
      axiosInstance.get.mockResolvedValueOnce({
        data: { sports: [{ idSport: '1', strSport: 'Soccer' }] },
      });
      const result = await getAllSportsApi();
      expect(Array.isArray(result)).toBe(true);
      expect(result).toHaveLength(1);
    });
  });

  describe('getLeagueTeamsApi', () => {
    it('returns league teams array on success', async () => {
      axiosInstance.get.mockResolvedValueOnce({
        data: { teams: [{ idTeam: '133604', strTeam: 'Arsenal' }] },
      });
      const result = await getLeagueTeamsApi('4328');
      expect(result).toHaveLength(1);
      expect(result[0].strTeam).toBe('Arsenal');
    });
  });

  describe('getTeamPlayersApi', () => {
    it('returns team players array on success', async () => {
      axiosInstance.get.mockResolvedValueOnce({
        data: { player: [{ idPlayer: '1', strPlayer: 'Bukayo Saka' }] },
      });
      const result = await getTeamPlayersApi('133604');
      expect(result).toHaveLength(1);
      expect(result[0].strPlayer).toBe('Bukayo Saka');
    });
  });

  describe('formatSportsErrorMessage', () => {
    it('returns message for Error instance', () => {
      const msg = formatSportsErrorMessage(new Error('test error'));
      expect(msg).toBe('test error');
    });

    it('returns fallback for unknown error', () => {
      const msg = formatSportsErrorMessage('unknown');
      expect(msg).toContain('unexpected');
    });
  });
});
