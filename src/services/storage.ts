import AsyncStorage from '@react-native-async-storage/async-storage';

const FAVOURITES_KEY = '@scoreline/favourites';

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
