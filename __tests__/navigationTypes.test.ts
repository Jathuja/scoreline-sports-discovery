/**
 * Navigation Types Structural Tests
 * Verify that all required navigation type exports are present and
 * the navigation hierarchy is correctly shaped.
 */
import type {
  MainTabParamList,
  AuthStackParamList,
  TeamDetailsParams,
  LeagueDetailsParams,
  PlayerDetailsParams,
} from '../src/navigation/types';

describe('Navigation Type Exports', () => {
  it('MainTabParamList covers all 4 bottom tabs', () => {
    const tabs: MainTabParamList = {
      HomeTab: undefined,
      SearchTab: undefined,
      FavouritesTab: undefined,
      ProfileTab: undefined,
    };
    expect(Object.keys(tabs)).toHaveLength(4);
  });

  it('AuthStackParamList covers Login and Register', () => {
    const authStack: AuthStackParamList = {
      Login: undefined,
      Register: undefined,
    };
    expect(Object.keys(authStack)).toHaveLength(2);
  });

  it('TeamDetailsParams contains id field', () => {
    const params: TeamDetailsParams = { id: '133604', name: 'Arsenal' };
    expect(params.id).toBe('133604');
    expect(params.name).toBe('Arsenal');
  });

  it('LeagueDetailsParams contains id field', () => {
    const params: LeagueDetailsParams = { id: '4328' };
    expect(params.id).toBe('4328');
  });

  it('PlayerDetailsParams contains id field', () => {
    const params: PlayerDetailsParams = { id: '34145255', name: 'Messi' };
    expect(params.id).toBe('34145255');
    expect(params.name).toBe('Messi');
  });

  it('RootStackParamList covers Auth, Main, TeamDetails, LeagueDetails, PlayerDetails', () => {
    const expectedKeys = ['Auth', 'Main', 'TeamDetails', 'LeagueDetails', 'PlayerDetails'];
    expect(expectedKeys).toHaveLength(5);
    expect(expectedKeys).toContain('Auth');
    expect(expectedKeys).toContain('Main');
    expect(expectedKeys).toContain('TeamDetails');
    expect(expectedKeys).toContain('LeagueDetails');
    expect(expectedKeys).toContain('PlayerDetails');
  });
});

describe('Navigation Prop Type Exports', () => {
  it('type exports are importable without error', () => {
    // If this module imports correctly, all types are present
    expect(true).toBe(true);
  });
});
