import * as Keychain from 'react-native-keychain';

export interface StoredAuthSession {
  accessToken: string;
  refreshToken?: string;
  username: string;
}

const AUTH_SERVICE_KEY = 'scoreline_auth_token_service';

/**
 * Saves authentication tokens securely using react-native-keychain.
 * Tokens are strictly NEVER saved to AsyncStorage or plain files.
 */
export const saveAuthTokens = async (
  accessToken: string,
  refreshToken?: string,
  username = 'authenticated_user',
): Promise<boolean> => {
  try {
    const payload = JSON.stringify({
      accessToken,
      refreshToken: refreshToken || '',
    });

    const result = await Keychain.setGenericPassword(username, payload, {
      service: AUTH_SERVICE_KEY,
      accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
    });

    return !!result;
  } catch (error) {
    return false;
  }
};

/**
 * Retrieves authentication tokens securely from Keychain.
 */
export const getAuthTokens = async (): Promise<StoredAuthSession | null> => {
  try {
    const credentials = await Keychain.getGenericPassword({
      service: AUTH_SERVICE_KEY,
    });

    if (!credentials || !credentials.password) {
      return null;
    }

    try {
      const parsed = JSON.parse(credentials.password);
      return {
        accessToken: parsed.accessToken,
        refreshToken: parsed.refreshToken,
        username: credentials.username,
      };
    } catch {
      // Fallback if password was stored as plain token string
      return {
        accessToken: credentials.password,
        username: credentials.username,
      };
    }
  } catch (error) {
    return null;
  }
};

/**
 * Clears authentication tokens from Keychain on logout.
 */
export const clearAuthTokens = async (): Promise<boolean> => {
  try {
    const result = await Keychain.resetGenericPassword({
      service: AUTH_SERVICE_KEY,
    });
    return !!result;
  } catch (error) {
    return false;
  }
};

/**
 * Checks whether an active secure session token exists in Keychain.
 */
export const hasValidSession = async (): Promise<boolean> => {
  const session = await getAuthTokens();
  return !!session && !!session.accessToken;
};
