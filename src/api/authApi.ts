import axios, { AxiosError } from 'axios';
import { ENV } from '../config/env';
import {
  LoginCredentials,
  LoginResponse,
  RegisterCredentials,
  RegisterResponse,
  User,
} from '../features/auth/types';

export const authApiClient = axios.create({
  baseURL: ENV.AUTH_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

export const formatAuthErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<{ message?: string }>;
    if (axiosError.response?.data?.message) {
      return axiosError.response.data.message;
    }
    if (axiosError.message) {
      return axiosError.message;
    }
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'An unexpected authentication error occurred. Please try again.';
};

/**
 * Log in user via DummyJSON /auth/login
 */
export const loginApi = async (
  credentials: LoginCredentials,
): Promise<LoginResponse> => {
  const response = await authApiClient.post<LoginResponse>(
    '/auth/login',
    {
      username: credentials.username.trim(),
      password: credentials.password,
    },
  );
  return response.data;
};

/**
 * Register user via DummyJSON /users/add
 */
export const registerApi = async (
  credentials: RegisterCredentials,
): Promise<RegisterResponse> => {
  const response = await authApiClient.post<RegisterResponse>(
    '/users/add',
    {
      username: credentials.username.trim(),
      email: credentials.email.trim(),
      password: credentials.password,
      firstName: credentials.firstName.trim(),
      lastName: credentials.lastName.trim(),
    },
  );
  return response.data;
};

/**
 * Fetch authenticated user profile via /auth/me
 */
export const getCurrentUserApi = async (token: string): Promise<User> => {
  const response = await authApiClient.get<User>('/auth/me', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
