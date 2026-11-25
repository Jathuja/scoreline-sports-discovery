import {
  createSlice,
  createAsyncThunk,
  PayloadAction,
} from '@reduxjs/toolkit';
import {
  loadFavourites,
  saveFavourites,
  FavouriteItem,
} from '../../../services/storage';

interface FavouritesState {
  items: FavouriteItem[];
  isLoaded: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: FavouritesState = {
  items: [],
  isLoaded: false,
  isLoading: false,
  error: null,
};

export const loadFavouritesThunk = createAsyncThunk(
  'favourites/load',
  async (_, { rejectWithValue }) => {
    try {
      return await loadFavourites();
    } catch (error) {
      return rejectWithValue('Failed to load favourites');
    }
  },
);

export const saveFavouriteThunk = createAsyncThunk(
  'favourites/save',
  async (item: FavouriteItem, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { favourites: FavouritesState };
      const existing = state.favourites.items.find(f => f.id === item.id);
      if (existing) {
        return state.favourites.items;
      }
      const updated = [...state.favourites.items, item];
      await saveFavourites(updated);
      return updated;
    } catch (error) {
      return rejectWithValue('Failed to save favourite');
    }
  },
);

export const removeFavouriteThunk = createAsyncThunk(
  'favourites/remove',
  async (id: string, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { favourites: FavouritesState };
      const updated = state.favourites.items.filter(f => f.id !== id);
      await saveFavourites(updated);
      return updated;
    } catch (error) {
      return rejectWithValue('Failed to remove favourite');
    }
  },
);

export const toggleFavouriteThunk = createAsyncThunk(
  'favourites/toggle',
  async (item: FavouriteItem, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { favourites: FavouritesState };
      const exists = state.favourites.items.some(f => f.id === item.id);
      let updated: FavouriteItem[];
      if (exists) {
        updated = state.favourites.items.filter(f => f.id !== item.id);
      } else {
        updated = [...state.favourites.items, item];
      }
      await saveFavourites(updated);
      return updated;
    } catch (error) {
      return rejectWithValue('Failed to toggle favourite');
    }
  },
);

const favouritesSlice = createSlice({
  name: 'favourites',
  initialState,
  reducers: {
    addFavourite(state, action: PayloadAction<FavouriteItem>) {
      if (!state.items.find(f => f.id === action.payload.id)) {
        state.items.push(action.payload);
      }
    },
    removeFavourite(state, action: PayloadAction<string>) {
      state.items = state.items.filter(f => f.id !== action.payload);
    },
    setFavourites(state, action: PayloadAction<FavouriteItem[]>) {
      state.items = action.payload;
      state.isLoaded = true;
    },
    toggleFavourite(state, action: PayloadAction<FavouriteItem>) {
      const index = state.items.findIndex(f => f.id === action.payload.id);
      if (index >= 0) {
        state.items.splice(index, 1);
      } else {
        state.items.push(action.payload);
      }
    },
  },
  extraReducers: builder => {
    builder
      .addCase(loadFavouritesThunk.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        loadFavouritesThunk.fulfilled,
        (state, action: PayloadAction<FavouriteItem[]>) => {
          state.isLoading = false;
          state.items = action.payload;
          state.isLoaded = true;
        },
      )
      .addCase(loadFavouritesThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.isLoaded = true;
      });

    builder
      .addCase(
        saveFavouriteThunk.fulfilled,
        (state, action: PayloadAction<FavouriteItem[]>) => {
          state.items = action.payload;
        },
      )
      .addCase(saveFavouriteThunk.rejected, (state, action) => {
        state.error = action.payload as string;
      });

    builder
      .addCase(
        removeFavouriteThunk.fulfilled,
        (state, action: PayloadAction<FavouriteItem[]>) => {
          state.items = action.payload;
        },
      )
      .addCase(removeFavouriteThunk.rejected, (state, action) => {
        state.error = action.payload as string;
      });

    builder
      .addCase(
        toggleFavouriteThunk.fulfilled,
        (state, action: PayloadAction<FavouriteItem[]>) => {
          state.items = action.payload;
        },
      )
      .addCase(toggleFavouriteThunk.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const { addFavourite, removeFavourite, setFavourites, toggleFavourite } =
  favouritesSlice.actions;

export default favouritesSlice.reducer;
