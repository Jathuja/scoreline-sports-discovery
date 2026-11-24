import * as Keychain from 'react-native-keychain';
import {
  saveAuthTokens,
  getAuthTokens,
  clearAuthTokens,
  hasValidSession,
} from '../src/services/keychain';

describe('Secure Keychain Token Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should securely save access and refresh tokens to Keychain', async () => {
    const success = await saveAuthTokens('access_token_123', 'refresh_token_456', 'testuser');

    expect(success).toBe(true);
    expect(Keychain.setGenericPassword).toHaveBeenCalledWith(
      'testuser',
      JSON.stringify({ accessToken: 'access_token_123', refreshToken: 'refresh_token_456' }),
      expect.objectContaining({
        service: 'scoreline_auth_token_service',
      }),
    );
  });

  it('should retrieve stored authentication session from Keychain', async () => {
    await saveAuthTokens('stored_token_abc', 'refresh_token_xyz', 'emilys');
    const session = await getAuthTokens();

    expect(session).not.toBeNull();
    expect(session?.accessToken).toBe('stored_token_abc');
    expect(session?.refreshToken).toBe('refresh_token_xyz');
    expect(session?.username).toBe('emilys');
  });

  it('should return null when no tokens are stored', async () => {
    (Keychain.getGenericPassword as jest.Mock).mockResolvedValueOnce(false);
    const session = await getAuthTokens();

    expect(session).toBeNull();
  });

  it('should clear stored authentication tokens on logout', async () => {
    await saveAuthTokens('token_to_clear', '', 'user1');
    const clearResult = await clearAuthTokens();

    expect(clearResult).toBe(true);
    expect(Keychain.resetGenericPassword).toHaveBeenCalledWith(
      expect.objectContaining({
        service: 'scoreline_auth_token_service',
      }),
    );
  });

  it('should check for valid session existence', async () => {
    await saveAuthTokens('active_token');
    const isValid = await hasValidSession();
    expect(isValid).toBe(true);

    await clearAuthTokens();
    (Keychain.getGenericPassword as jest.Mock).mockResolvedValueOnce(null);
    const isInvalid = await hasValidSession();
    expect(isInvalid).toBe(false);
  });
});
