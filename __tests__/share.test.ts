import { Share } from 'react-native';
import { shareTeam, shareLeague, sharePlayer } from '../src/services/share';

// Share is mocked in jest.setup.js
const mockShare = Share.share as jest.MockedFunction<typeof Share.share>;

describe('share service', () => {
  beforeEach(() => {
    mockShare.mockClear();
    mockShare.mockResolvedValue({ action: 'sharedAction' });
  });

  describe('shareTeam', () => {
    it('calls Share.share with team deep link', async () => {
      await shareTeam('133604', 'Arsenal');
      expect(mockShare).toHaveBeenCalledWith(
        expect.objectContaining({
          message: expect.stringContaining('scoreline://team/133604'),
        }),
      );
    });

    it('includes team name in message', async () => {
      await shareTeam('133604', 'Arsenal');
      expect(mockShare).toHaveBeenCalledWith(
        expect.objectContaining({
          message: expect.stringContaining('Arsenal'),
        }),
      );
    });
  });

  describe('shareLeague', () => {
    it('calls Share.share with league deep link', async () => {
      await shareLeague('4328', 'Premier League');
      expect(mockShare).toHaveBeenCalledWith(
        expect.objectContaining({
          message: expect.stringContaining('scoreline://league/4328'),
        }),
      );
    });
  });

  describe('sharePlayer', () => {
    it('calls Share.share with player deep link', async () => {
      await sharePlayer('34145361', 'Lionel Messi');
      expect(mockShare).toHaveBeenCalledWith(
        expect.objectContaining({
          message: expect.stringContaining('scoreline://player/34145361'),
        }),
      );
    });

    it('includes player name in message', async () => {
      await sharePlayer('34145361', 'Lionel Messi');
      expect(mockShare).toHaveBeenCalledWith(
        expect.objectContaining({
          message: expect.stringContaining('Lionel Messi'),
        }),
      );
    });
  });
});
