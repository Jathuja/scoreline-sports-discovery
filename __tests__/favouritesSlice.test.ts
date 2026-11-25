import { configureStore } from '@reduxjs/toolkit';
import favouritesReducer, {
  loadFavouritesThunk,
  saveFavouriteThunk,
  removeFavouriteThunk,
  toggleFavouriteThunk,
  addFavourite,
  removeFavourite,
  setFavourites,
  toggleFavourite,
} from '../src/features/favourites/slices/favouritesSlice';

// Mock storage service
jest.mock('../src/services/storage', () => ({
  loadFavourites: jest.fn(),
  saveFavourites: jest.fn(),
  clearFavourites: jest.fn(),
}));

const { loadFavourites, saveFavourites } = require('../src/services/storage');

const makeStore = () =>
  configureStore({
    reducer: { favourites: favouritesReducer },
    middleware: gDM => gDM({ serializableCheck: false }),
  });

describe('favouritesSlice', () => {
  let store: ReturnType<typeof makeStore>;

  const item1 = { id: '133604', name: 'Arsenal', type: 'team' as const, badge: undefined };
  const item2 = { id: '4328', name: 'Premier League', type: 'league' as const, badge: undefined };

  beforeEach(() => {
    store = makeStore();
    jest.clearAllMocks();
  });

  describe('sync actions', () => {
    it('addFavourite adds an item', () => {
      store.dispatch(addFavourite(item1));
      expect(store.getState().favourites.items).toContainEqual(item1);
    });

    it('addFavourite does not duplicate', () => {
      store.dispatch(addFavourite(item1));
      store.dispatch(addFavourite(item1));
      expect(store.getState().favourites.items).toHaveLength(1);
    });

    it('removeFavourite removes item by id', () => {
      store.dispatch(addFavourite(item1));
      store.dispatch(removeFavourite(item1.id));
      expect(store.getState().favourites.items).toHaveLength(0);
    });

    it('setFavourites replaces items', () => {
      store.dispatch(setFavourites([item1, item2]));
      expect(store.getState().favourites.items).toHaveLength(2);
      expect(store.getState().favourites.isLoaded).toBe(true);
    });

    it('toggleFavourite adds when not present', () => {
      store.dispatch(toggleFavourite(item1));
      expect(store.getState().favourites.items).toContainEqual(item1);
    });

    it('toggleFavourite removes when present', () => {
      store.dispatch(addFavourite(item1));
      store.dispatch(toggleFavourite(item1));
      expect(store.getState().favourites.items).toHaveLength(0);
    });
  });

  describe('loadFavouritesThunk', () => {
    it('loads items from storage', async () => {
      loadFavourites.mockResolvedValue([item1]);
      await store.dispatch(loadFavouritesThunk());
      expect(store.getState().favourites.items).toContainEqual(item1);
      expect(store.getState().favourites.isLoaded).toBe(true);
    });

    it('handles empty storage', async () => {
      loadFavourites.mockResolvedValue([]);
      await store.dispatch(loadFavouritesThunk());
      expect(store.getState().favourites.items).toHaveLength(0);
    });
  });

  describe('saveFavouriteThunk', () => {
    it('saves item and updates state', async () => {
      saveFavourites.mockResolvedValue(undefined);
      loadFavourites.mockResolvedValue([]);
      await store.dispatch(saveFavouriteThunk(item1));
      expect(saveFavourites).toHaveBeenCalled();
      expect(store.getState().favourites.items).toContainEqual(item1);
    });

    it('does not duplicate existing item', async () => {
      store.dispatch(addFavourite(item1));
      saveFavourites.mockResolvedValue(undefined);
      await store.dispatch(saveFavouriteThunk(item1));
      expect(store.getState().favourites.items).toHaveLength(1);
    });
  });

  describe('removeFavouriteThunk', () => {
    it('removes item from state and storage', async () => {
      store.dispatch(addFavourite(item1));
      saveFavourites.mockResolvedValue(undefined);
      await store.dispatch(removeFavouriteThunk(item1.id));
      expect(store.getState().favourites.items).toHaveLength(0);
      expect(saveFavourites).toHaveBeenCalledWith([]);
    });
  });

  describe('toggleFavouriteThunk', () => {
    it('adds item when not present', async () => {
      saveFavourites.mockResolvedValue(undefined);
      await store.dispatch(toggleFavouriteThunk(item1));
      expect(store.getState().favourites.items).toContainEqual(item1);
    });

    it('removes item when present', async () => {
      store.dispatch(addFavourite(item1));
      saveFavourites.mockResolvedValue(undefined);
      await store.dispatch(toggleFavouriteThunk(item1));
      expect(store.getState().favourites.items).toHaveLength(0);
    });
  });
});
