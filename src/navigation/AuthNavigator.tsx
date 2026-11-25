import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { LoginScreen } from '../features/auth/screens/LoginScreen';
import { RegisterScreen } from '../features/auth/screens/RegisterScreen';
import type { AuthStackParamList } from './types';

const Stack = createNativeStackNavigator<AuthStackParamList>();

type LoginProps = NativeStackScreenProps<AuthStackParamList, 'Login'>;
type RegisterProps = NativeStackScreenProps<AuthStackParamList, 'Register'>;

const LoginWrapper: React.FC<LoginProps> = ({ navigation }) => (
  <LoginScreen
    onNavigateToRegister={() => navigation.navigate('Register')}
  />
);

const RegisterWrapper: React.FC<RegisterProps> = ({ navigation }) => (
  <RegisterScreen
    onNavigateToLogin={() => navigation.navigate('Login')}
    onRegistrationSuccess={() => navigation.navigate('Login')}
  />
);

export const AuthNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="Login" component={LoginWrapper} />
      <Stack.Screen name="Register" component={RegisterWrapper} />
    </Stack.Navigator>
  );
};
