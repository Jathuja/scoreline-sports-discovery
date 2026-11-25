import {
  setupStore,
  clearAuthError,
  loginThunk,
  registerThunk,
  logoutThunk,
  restoreSessionThunk,
} from '../src/store';
import * as authApi from '../src/api/authApi';
import * as keychain from '../src/services/keychain';

jest.mock('../src/api/authApi', () => ({
  ...jest.requireActual('../src/api/authApi'),
  loginApi: jest.fn(),
  registerApi: jest.fn(),
  getCurrentUserApi: jest.fn(),
}));

jest.mock('../src/services/keychain');

describe('Redux Toolkit Auth Slice & Thunks', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should have correct initial state', () => {
    const store = setupStore();
    expect(store.getState().auth).toEqual({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      isRestoringSession: true,
    });
  });

  it('should handle clearAuthError action', () => {
    const store = setupStore({
      auth: {
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: 'Invalid credentials',
        isRestoringSession: false,
      },
    });

    store.dispatch(clearAuthError());
    expect(store.getState().auth.error).toBeNull();
  });

  it('should handle successful loginThunk and persist token via Keychain', async () => {
    const mockUser = {
      id: 1,
      username: 'emilys',
      email: 'emilys@dummyjson.com',
      firstName: 'Emily',
      lastName: 'Smith',
      accessToken: 'dummy_token_123',
    };
    (authApi.loginApi as jest.Mock).mockResolvedValueOnce(mockUser);
    (keychain.saveAuthTokens as jest.Mock).mockResolvedValueOnce(true);

    const store = setupStore();
    await store.dispatch(loginThunk({ username: 'emilys', password: 'emilyspass' }));

    const authState = store.getState().auth;
    expect(authState.isAuthenticated).toBe(true);
    expect(authState.user?.username).toBe('emilys');
    expect(authState.isLoading).toBe(false);
    expect(authState.error).toBeNull();
    expect(keychain.saveAuthTokens).toHaveBeenCalledWith(
      'dummy_token_123',
      undefined,
      'emilys',
    );
  });

  it('should handle failed loginThunk and set error message', async () => {
    (authApi.loginApi as jest.Mock).mockRejectedValueOnce(new Error('Invalid username or password'));

    const store = setupStore();
    await store.dispatch(loginThunk({ username: 'wrong', password: 'bad' }));

    const authState = store.getState().auth;
    expect(authState.isAuthenticated).toBe(false);
    expect(authState.user).toBeNull();
    expect(authState.isLoading).toBe(false);
    expect(authState.error).toContain('Invalid username or password');
  });

  it('should fallback to offline demo user when loginApi fails for demo credentials', async () => {
    (authApi.loginApi as jest.Mock).mockRejectedValueOnce(new Error('Network Error'));
    (keychain.saveAuthTokens as jest.Mock).mockResolvedValueOnce(true);

    const store = setupStore();
    await store.dispatch(loginThunk({ username: ' emilys ', password: 'emilyspass' }));

    const authState = store.getState().auth;
    expect(authState.isAuthenticated).toBe(true);
    expect(authState.user?.username).toBe('emilys');
    expect(keychain.saveAuthTokens).toHaveBeenCalledWith(
      'mock-demo-jwt-token-emilys',
      'mock-refresh-token',
      'emilys',
    );
  });

  it('should handle registerThunk fulfilled', async () => {
    const mockCreatedUser = {
      id: 105,
      username: 'newbie',
      email: 'newbie@example.com',
      firstName: 'New',
      lastName: 'User',
    };
    (authApi.registerApi as jest.Mock).mockResolvedValueOnce(mockCreatedUser);

    const store = setupStore();
    await store.dispatch(
      registerThunk({
        firstName: 'New',
        lastName: 'User',
        username: 'newbie',
        email: 'newbie@example.com',
        password: 'password123',
      }),
    );

    const authState = store.getState().auth;
    expect(authState.user?.id).toBe(105);
    expect(authState.isLoading).toBe(false);
    expect(authState.error).toBeNull();
  });

  it('should handle restoreSessionThunk when token is present', async () => {
    (keychain.getAuthTokens as jest.Mock).mockResolvedValueOnce({
      accessToken: 'saved_token_123',
      username: 'emilys',
    });
    (authApi.getCurrentUserApi as jest.Mock).mockResolvedValueOnce({
      id: 1,
      username: 'emilys',
      email: 'emilys@dummyjson.com',
      firstName: 'Emily',
      lastName: 'Smith',
    });

    const store = setupStore();
    await store.dispatch(restoreSessionThunk());

    const authState = store.getState().auth;
    expect(authState.isAuthenticated).toBe(true);
    expect(authState.user?.username).toBe('emilys');
    expect(authState.isRestoringSession).toBe(false);
  });

  it('should handle logoutThunk by clearing Keychain tokens and resetting state', async () => {
    (keychain.clearAuthTokens as jest.Mock).mockResolvedValueOnce(true);

    const store = setupStore({
      auth: {
        user: {
          id: 1,
          username: 'emilys',
          email: 'emilys@dummyjson.com',
          firstName: 'Emily',
          lastName: 'Smith',
        },
        isAuthenticated: true,
        isLoading: false,
        error: null,
        isRestoringSession: false,
      },
    });

    await store.dispatch(logoutThunk());

    const authState = store.getState().auth;
    expect(authState.isAuthenticated).toBe(false);
    expect(authState.user).toBeNull();
    expect(keychain.clearAuthTokens).toHaveBeenCalled();
  });
});
