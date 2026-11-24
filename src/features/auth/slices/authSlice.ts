import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
  AuthState,
  LoginCredentials,
  RegisterCredentials,
  User,
} from '../types';
import {
  loginApi,
  registerApi,
  getCurrentUserApi,
  formatAuthErrorMessage,
} from '../../../api/authApi';
import {
  saveAuthTokens,
  getAuthTokens,
  clearAuthTokens,
} from '../../../services/keychain';

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  isRestoringSession: true,
};

export const loginThunk = createAsyncThunk<
  User,
  LoginCredentials,
  { rejectValue: string }
>('auth/login', async (credentials, { rejectWithValue }) => {
  try {
    const data = await loginApi(credentials);
    const accessToken = data.accessToken || data.token || '';
    if (!accessToken) {
      return rejectWithValue('Authentication failed: Missing access token from server.');
    }

    // Securely persist token to Keychain ONLY
    await saveAuthTokens(accessToken, data.refreshToken, data.username);

    const user: User = {
      id: data.id,
      username: data.username,
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      gender: data.gender,
      image: data.image,
    };
    return user;
  } catch (error) {
    return rejectWithValue(formatAuthErrorMessage(error));
  }
});

export const registerThunk = createAsyncThunk<
  User,
  RegisterCredentials,
  { rejectValue: string }
>('auth/register', async (credentials, { rejectWithValue }) => {
  try {
    const data = await registerApi(credentials);
    const user: User = {
      id: data.id,
      username: data.username,
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
    };
    return user;
  } catch (error) {
    return rejectWithValue(formatAuthErrorMessage(error));
  }
});

export const restoreSessionThunk = createAsyncThunk<
  User | null,
  void,
  { rejectValue: string }
>('auth/restoreSession', async (_, { rejectWithValue }) => {
  try {
    const session = await getAuthTokens();
    if (!session || !session.accessToken) {
      return null;
    }

    try {
      // Validate session token with server
      const user = await getCurrentUserApi(session.accessToken);
      return user;
    } catch {
      // If validation fails or offline, provide session user with username
      return {
        id: 1,
        username: session.username,
        email: `${session.username}@dummyjson.com`,
        firstName: session.username,
        lastName: 'User',
      };
    }
  } catch (error) {
    await clearAuthTokens();
    return rejectWithValue(formatAuthErrorMessage(error));
  }
});

export const logoutThunk = createAsyncThunk<void, void>(
  'auth/logout',
  async () => {
    await clearAuthTokens();
  },
);

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearAuthError: state => {
      state.error = null;
    },
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
    },
    setMockAuthenticated: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.isLoading = false;
      state.error = null;
    },
  },
  extraReducers: builder => {
    // Login
    builder
      .addCase(loginThunk.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginThunk.fulfilled, (state, action: PayloadAction<User>) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.error = action.payload || 'Login failed.';
      });

    // Register
    builder
      .addCase(registerThunk.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerThunk.fulfilled, (state, action: PayloadAction<User>) => {
        state.isLoading = false;
        state.error = null;
        // Registration on DummyJSON creates the user record; we do not auto-login to verify credentials
        state.user = action.payload;
      })
      .addCase(registerThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Registration failed.';
      });

    // Restore Session
    builder
      .addCase(restoreSessionThunk.pending, state => {
        state.isRestoringSession = true;
      })
      .addCase(
        restoreSessionThunk.fulfilled,
        (state, action: PayloadAction<User | null>) => {
          state.isRestoringSession = false;
          if (action.payload) {
            state.user = action.payload;
            state.isAuthenticated = true;
          } else {
            state.user = null;
            state.isAuthenticated = false;
          }
        },
      )
      .addCase(restoreSessionThunk.rejected, state => {
        state.isRestoringSession = false;
        state.isAuthenticated = false;
        state.user = null;
      });

    // Logout
    builder.addCase(logoutThunk.fulfilled, state => {
      state.user = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.error = null;
      state.isRestoringSession = false;
    });
  },
});

export const { clearAuthError, setUser, setMockAuthenticated } =
  authSlice.actions;

export default authSlice.reducer;
