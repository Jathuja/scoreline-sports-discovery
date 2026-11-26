import { getStateFromPath } from '@react-navigation/native';
import { linking } from '../src/navigation/linking';

describe('Deep Link Configuration', () => {
  it('includes scoreline:// scheme as prefix', () => {
    expect(linking.prefixes).toContain('scoreline://');
  });

  it('includes https://scoreline.app as prefix', () => {
    expect(linking.prefixes).toContain('https://scoreline.app');
  });

  it('has at least 2 prefixes configured', () => {
    expect(linking.prefixes.length).toBeGreaterThanOrEqual(2);
  });

  it('has screens configuration', () => {
    expect(linking.config).toBeDefined();
    expect(linking.config?.screens).toBeDefined();
  });

  it('maps TeamDetails to team/:id route', () => {
    const screens = linking.config?.screens as Record<string, unknown>;
    expect(screens.TeamDetails).toBe('team/:id');
  });

  it('maps LeagueDetails to league/:id route', () => {
    const screens = linking.config?.screens as Record<string, unknown>;
    expect(screens.LeagueDetails).toBe('league/:id');
  });

  it('maps PlayerDetails to player/:id route', () => {
    const screens = linking.config?.screens as Record<string, unknown>;
    expect(screens.PlayerDetails).toBe('player/:id');
  });

  it('maps Main tab routes inside Main screen', () => {
    const screens = linking.config?.screens as Record<string, unknown>;
    const main = screens.Main as { screens: Record<string, string> };
    expect(main).toBeDefined();
    expect(main.screens.HomeTab).toBe('home');
    expect(main.screens.SearchTab).toBe('search');
    expect(main.screens.FavouritesTab).toBe('favourites');
    expect(main.screens.ProfileTab).toBe('profile');
  });

  it('resolves team/:id deep link path to TeamDetails with item ID', () => {
    const state = getStateFromPath('team/133604', linking.config);
    expect(state?.routes[0]).toEqual(
      expect.objectContaining({
        name: 'TeamDetails',
        params: { id: '133604' },
      }),
    );
  });

  it('resolves league/:id deep link path to LeagueDetails with item ID', () => {
    const state = getStateFromPath('league/4328', linking.config);
    expect(state?.routes[0]).toEqual(
      expect.objectContaining({
        name: 'LeagueDetails',
        params: { id: '4328' },
      }),
    );
  });

  it('resolves player/:id deep link path to PlayerDetails with item ID', () => {
    const state = getStateFromPath('player/34145361', linking.config);
    expect(state?.routes[0]).toEqual(
      expect.objectContaining({
        name: 'PlayerDetails',
        params: { id: '34145361' },
      }),
    );
  });

  it('returns undefined for unrecognized deep link paths', () => {
    const state = getStateFromPath('unknown/999', linking.config);
    expect(state).toBeUndefined();
  });
});
