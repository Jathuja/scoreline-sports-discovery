import { createSlice, PayloadAction } from '@reduxjs/toolkit';

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
});

export const { setInitialized, setThemeMode, setOnlineStatus, resetAppState } =
  appSlice.actions;

export default appSlice.reducer;
