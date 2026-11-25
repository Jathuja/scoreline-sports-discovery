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

// Mock react-native-screens
jest.mock('react-native-screens', () => {
  const { View } = require('react-native');
  return {
    enableScreens: jest.fn(),
    ScreenContainer: View,
    Screen: View,
    NativeScreen: View,
    NativeScreenContainer: View,
    ScreenStack: View,
    ScreenStackItem: View,
    ScreenStackHeaderConfig: View,
    ScreenStackHeaderSubview: View,
    SearchBar: View,
    Tabs: View,
    compatibilityFlags: {},
  };
});

// Mock @react-navigation/native
jest.mock('@react-navigation/native', () => {
  const actual = jest.requireActual('@react-navigation/native');
  return {
    ...actual,
    NavigationContainer: ({ children }) => children,
    useNavigation: () => ({
      navigate: jest.fn(),
      goBack: jest.fn(),
      dispatch: jest.fn(),
      reset: jest.fn(),
      canGoBack: jest.fn(() => false),
    }),
    useRoute: () => ({ params: { id: '133604', name: 'Arsenal' } }),
    useFocusEffect: jest.fn(),
    useIsFocused: jest.fn(() => true),
  };
});

// Mock @react-navigation/native-stack
jest.mock('@react-navigation/native-stack', () => {
  return {
    createNativeStackNavigator: () => ({
      Navigator: ({ children }) => children,
      Screen: ({ children, component: Component }) => {
        const mockNav = {
          navigate: jest.fn(),
          goBack: jest.fn(),
          dispatch: jest.fn(),
          reset: jest.fn(),
          canGoBack: jest.fn(() => false),
        };
        const mockRoute = { params: { id: '133604', name: 'Arsenal' } };
        if (Component) {
          return require('react').createElement(Component, {
            navigation: mockNav,
            route: mockRoute,
          });
        }
        if (typeof children === 'function') {
          return children({ navigation: mockNav, route: mockRoute });
        }
        return require('react').createElement(require('react-native').View, null);
      },
    }),
  };
});

// Mock @react-navigation/bottom-tabs
jest.mock('@react-navigation/bottom-tabs', () => {
  return {
    createBottomTabNavigator: () => ({
      Navigator: ({ children }) => children,
      Screen: ({ component: Component }) => {
        const mockNav = { navigate: jest.fn(), goBack: jest.fn() };
        if (Component) {
          return require('react').createElement(Component, {
            navigation: mockNav,
            route: { params: {} },
          });
        }
        return require('react').createElement(require('react-native').View, null);
      },
    }),
  };
});

// Mock @react-native-async-storage/async-storage
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(() => Promise.resolve(null)),
  setItem: jest.fn(() => Promise.resolve()),
  removeItem: jest.fn(() => Promise.resolve()),
  clear: jest.fn(() => Promise.resolve()),
  getAllKeys: jest.fn(() => Promise.resolve([])),
  multiGet: jest.fn(() => Promise.resolve([])),
  multiSet: jest.fn(() => Promise.resolve()),
  mergeItem: jest.fn(() => Promise.resolve()),
  flushGetRequests: jest.fn(),
}));

// Mock react-native Share
jest.mock('react-native/Libraries/Share/Share', () => ({
  share: jest.fn(() => Promise.resolve({ action: 'sharedAction' })),
}));

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
