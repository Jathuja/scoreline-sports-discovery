import {
  loginApi,
  registerApi,
  getCurrentUserApi,
  formatAuthErrorMessage,
  authApiClient,
} from '../src/api/authApi';

jest.mock('axios', () => {
  const actualAxios = jest.requireActual('axios');
  const mockAxiosInstance = {
    post: jest.fn(),
    get: jest.fn(),
  };
  return {
    ...actualAxios,
    create: jest.fn(() => mockAxiosInstance),
    isAxiosError: actualAxios.isAxiosError,
  };
});

describe('DummyJSON Auth API Client', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should execute login POST request to /auth/login', async () => {
    const mockResponse = {
      data: {
        id: 1,
        username: 'emilys',
        email: 'emilys@dummyjson.com',
        firstName: 'Emily',
        lastName: 'Smith',
        accessToken: 'mock_access_token',
      },
    };
    (authApiClient.post as jest.Mock).mockResolvedValueOnce(mockResponse);

    const result = await loginApi({ username: 'emilys', password: 'emilyspass' });

    expect(authApiClient.post).toHaveBeenCalledWith('/auth/login', {
      username: 'emilys',
      password: 'emilyspass',
    });
    expect(result.username).toBe('emilys');
    expect(result.accessToken).toBe('mock_access_token');
  });

  it('should execute registration POST request to /users/add', async () => {
    const mockResponse = {
      data: {
        id: 101,
        username: 'alexm',
        email: 'alex@example.com',
        firstName: 'Alex',
        lastName: 'Morgan',
      },
    };
    (authApiClient.post as jest.Mock).mockResolvedValueOnce(mockResponse);

    const result = await registerApi({
      username: 'alexm',
      email: 'alex@example.com',
      password: 'password123',
      firstName: 'Alex',
      lastName: 'Morgan',
    });

    expect(authApiClient.post).toHaveBeenCalledWith('/users/add', {
      username: 'alexm',
      email: 'alex@example.com',
      password: 'password123',
      firstName: 'Alex',
      lastName: 'Morgan',
    });
    expect(result.id).toBe(101);
    expect(result.firstName).toBe('Alex');
  });

  it('should execute get current user GET request to /auth/me with bearer header', async () => {
    const mockResponse = {
      data: {
        id: 1,
        username: 'emilys',
        email: 'emilys@dummyjson.com',
        firstName: 'Emily',
        lastName: 'Smith',
      },
    };
    (authApiClient.get as jest.Mock).mockResolvedValueOnce(mockResponse);

    const result = await getCurrentUserApi('test_bearer_token');

    expect(authApiClient.get).toHaveBeenCalledWith('/auth/me', {
      headers: {
        Authorization: 'Bearer test_bearer_token',
      },
    });
    expect(result.email).toBe('emilys@dummyjson.com');
  });

  it('should format error message from server response or fallback', () => {
    const standardError = new Error('Network timeout');
    expect(formatAuthErrorMessage(standardError)).toBe('Network timeout');

    const unknownError = 'string error';
    expect(formatAuthErrorMessage(unknownError)).toBe(
      'An unexpected authentication error occurred. Please try again.',
    );
  });
});
