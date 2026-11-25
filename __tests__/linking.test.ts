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
});
