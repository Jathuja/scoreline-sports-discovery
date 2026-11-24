/* eslint-disable no-undef */
import React from 'react';

// Mock react-native-safe-area-context
jest.mock('react-native-safe-area-context', () => {
  const inset = { top: 0, right: 0, bottom: 0, left: 0 };
  return {
    SafeAreaProvider: ({ children }: { children: React.ReactNode }) => children,
    SafeAreaConsumer: ({ children }: { children: (insets: typeof inset) => React.ReactNode }) => children(inset),
    SafeAreaView: ({ children, style, ...props }: any) => {
      const { View } = require('react-native');
      return (
        <View style={style} {...props}>
          {children}
        </View>
      );
    },
    useSafeAreaInsets: () => inset,
    useSafeAreaFrame: () => ({ x: 0, y: 0, width: 390, height: 844 }),
  };
});

// Mock react-native-vector-icons/Feather
jest.mock('react-native-vector-icons/Feather', () => 'Icon');

// Mock react-native-keychain
let mockKeychainStorage: { username: string; password: string } | null = null;
jest.mock('react-native-keychain', () => ({
  setGenericPassword: jest.fn().mockImplementation((username, password) => {
    mockKeychainStorage = { username, password };
    return Promise.resolve(true);
  }),
  getGenericPassword: jest.fn().mockImplementation(() => {
    return Promise.resolve(mockKeychainStorage);
  }),
  resetGenericPassword: jest.fn().mockImplementation(() => {
    mockKeychainStorage = null;
    return Promise.resolve(true);
  }),
  ACCESS_CONTROL: {
    BIOMETRY_ANY: 'BIOMETRY_ANY',
  },
  ACCESSIBLE: {
    WHEN_UNLOCKED_THIS_DEVICE_ONLY: 'WHEN_UNLOCKED_THIS_DEVICE_ONLY',
  },
  AUTHENTICATION_TYPE: {
    BIOMETRICS: 'BIOMETRICS',
  },
}));
