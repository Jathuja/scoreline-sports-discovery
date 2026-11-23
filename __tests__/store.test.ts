import { setupStore, setInitialized, setThemeMode, setOnlineStatus, resetAppState } from '../src/store';

describe('Redux Toolkit Base Store', () => {
  it('should initialize with correct default state', () => {
    const store = setupStore();
    const state = store.getState();

    expect(state.app).toEqual({
      isInitialized: false,
      themeMode: 'light',
      isOnline: true,
    });
  });

  it('should handle setInitialized action', () => {
    const store = setupStore();

    store.dispatch(setInitialized(true));
    expect(store.getState().app.isInitialized).toBe(true);

    store.dispatch(setInitialized(false));
    expect(store.getState().app.isInitialized).toBe(false);
  });

  it('should handle setThemeMode action', () => {
    const store = setupStore();

    store.dispatch(setThemeMode('dark'));
    expect(store.getState().app.themeMode).toBe('dark');

    store.dispatch(setThemeMode('system'));
    expect(store.getState().app.themeMode).toBe('system');
  });

  it('should handle setOnlineStatus action', () => {
    const store = setupStore();

    store.dispatch(setOnlineStatus(false));
    expect(store.getState().app.isOnline).toBe(false);
  });

  it('should reset app state to initial values', () => {
    const store = setupStore();

    store.dispatch(setInitialized(true));
    store.dispatch(setThemeMode('dark'));
    store.dispatch(setOnlineStatus(false));

    store.dispatch(resetAppState());

    expect(store.getState().app).toEqual({
      isInitialized: false,
      themeMode: 'light',
      isOnline: true,
    });
  });
});
