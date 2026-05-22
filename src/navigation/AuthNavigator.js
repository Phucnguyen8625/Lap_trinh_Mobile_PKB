import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import AdminNavigator from './AdminNavigator';
import UserNavigator from './UserNavigator';
import { useAuth } from '../context/AuthContext';
import { COLORS } from '../theme/theme';

const Stack = createStackNavigator();

const AuthNavigator = () => {
  const { user } = useAuth();

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: COLORS.background },
      }}
    >
      {user ? (
        user.role === 'admin' ? (
          <Stack.Screen name="AdminRoot" component={AdminNavigator} />
        ) : (
          <Stack.Screen name="UserRoot" component={UserNavigator} />
        )
      ) : (
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </>
      )}
    </Stack.Navigator>
  );
};

export default AuthNavigator;
