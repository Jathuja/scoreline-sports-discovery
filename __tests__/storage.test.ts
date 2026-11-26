import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  saveFavourites,
  loadFavourites,
  clearFavourites,
  saveThemeMode,
  loadThemeMode,
  FavouriteItem,
} from '../src/services/storage';

const mockGetItem = AsyncStorage.getItem as jest.Mock;
const mockSetItem = AsyncStorage.setItem as jest.Mock;
const mockRemoveItem = AsyncStorage.removeItem as jest.Mock;

describe('Storage Service (AsyncStorage)', () => {
  const sampleItems: FavouriteItem[] = [
    { id: '133604', name: 'Arsenal', type: 'team', badge: 'https://example.com/badge.png' },
    { id: '4328', name: 'Premier League', type: 'league' },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('saves favourites JSON under @scoreline/favourites', async () => {
    await saveFavourites(sampleItems);
    expect(mockSetItem).toHaveBeenCalledWith(
      '@scoreline/favourites',
      JSON.stringify(sampleItems),
    );
  });

  it('loads parsed favourites when present', async () => {
    mockGetItem.mockResolvedValueOnce(JSON.stringify(sampleItems));
    const loaded = await loadFavourites();
    expect(loaded).toEqual(sampleItems);
  });

  it('returns empty array when storage key is empty', async () => {
    mockGetItem.mockResolvedValueOnce(null);
    const loaded = await loadFavourites();
    expect(loaded).toEqual([]);
  });

  it('returns empty array safely when stored JSON is corrupted', async () => {
    mockGetItem.mockResolvedValueOnce('{bad-json');
    const loaded = await loadFavourites();
    expect(loaded).toEqual([]);
  });

  it('clears favourites key', async () => {
    await clearFavourites();
    expect(mockRemoveItem).toHaveBeenCalledWith('@scoreline/favourites');
  });

  it('saves and loads persisted dark theme mode', async () => {
    await saveThemeMode('dark');
    expect(mockSetItem).toHaveBeenCalledWith('@scoreline/theme', 'dark');

    mockGetItem.mockResolvedValueOnce('dark');
    const mode = await loadThemeMode();
    expect(mode).toBe('dark');
  });

  it('returns null for unknown theme mode value', async () => {
    mockGetItem.mockResolvedValueOnce('neon');
    const mode = await loadThemeMode();
    expect(mode).toBeNull();
  });
});
