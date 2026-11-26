import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { loadThemeMode, saveThemeMode } from '../../services/storage';

export type ThemeMode = 'light' | 'dark' | 'system';

export interface AppState {
  isInitialized: boolean;
  themeMode: ThemeMode;
  isOnline: boolean;
}

const initialState: AppState = {
  isInitialized: false,
  themeMode: 'light',
  isOnline: true,
};

export const loadThemeThunk = createAsyncThunk<ThemeMode, void>(
  'app/loadTheme',
  async () => {
    const saved = await loadThemeMode();
    return saved ?? 'light';
  },
);

export const saveThemeModeThunk = createAsyncThunk<ThemeMode, ThemeMode>(
  'app/saveTheme',
  async mode => {
    await saveThemeMode(mode);
    return mode;
  },
);

export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setInitialized: (state, action: PayloadAction<boolean>) => {
      state.isInitialized = action.payload;
    },
    setThemeMode: (state, action: PayloadAction<ThemeMode>) => {
      state.themeMode = action.payload;
    },
    setOnlineStatus: (state, action: PayloadAction<boolean>) => {
      state.isOnline = action.payload;
    },
    resetAppState: () => initialState,
  },
  extraReducers: builder => {
    builder.addCase(loadThemeThunk.fulfilled, (state, action) => {
      state.themeMode = action.payload;
    });
    builder.addCase(saveThemeModeThunk.fulfilled, (state, action) => {
      state.themeMode = action.payload;
    });
  },
});

export const { setInitialized, setThemeMode, setOnlineStatus, resetAppState } =
  appSlice.actions;

export default appSlice.reducer;
