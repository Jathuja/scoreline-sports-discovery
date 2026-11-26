import AsyncStorage from '@react-native-async-storage/async-storage';

const FAVOURITES_KEY = '@scoreline/favourites';
const THEME_KEY = '@scoreline/theme';

export type StoredThemeMode = 'light' | 'dark' | 'system';

export interface FavouriteItem {
  id: string;
  name: string;
  type: 'team' | 'league' | 'player';
  badge?: string;
}

export const saveFavourites = async (
  items: FavouriteItem[],
): Promise<void> => {
  await AsyncStorage.setItem(FAVOURITES_KEY, JSON.stringify(items));
};

export const loadFavourites = async (): Promise<FavouriteItem[]> => {
  const raw = await AsyncStorage.getItem(FAVOURITES_KEY);
  if (!raw) {
    return [];
  }
  try {
    return JSON.parse(raw) as FavouriteItem[];
  } catch {
    return [];
  }
};

export const clearFavourites = async (): Promise<void> => {
  await AsyncStorage.removeItem(FAVOURITES_KEY);
};

export const saveThemeMode = async (mode: StoredThemeMode): Promise<void> => {
  await AsyncStorage.setItem(THEME_KEY, mode);
};

export const loadThemeMode = async (): Promise<StoredThemeMode | null> => {
  const raw = await AsyncStorage.getItem(THEME_KEY);
  if (raw === 'light' || raw === 'dark' || raw === 'system') {
    return raw;
  }
  return null;
};
