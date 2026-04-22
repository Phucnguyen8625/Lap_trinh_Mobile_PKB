import 'react-native-gesture-handler';
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider } from './src/context/AuthContext';
import { DataProvider } from './src/context/DataContext';
import AuthNavigator from './src/navigation/AuthNavigator';
import { COLORS } from './src/theme/theme';

export default function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <NavigationContainer>
          <StatusBar style="light" backgroundColor={COLORS.background} />
          <AuthNavigator />
        </NavigationContainer>
      </DataProvider>
    </AuthProvider>
  );
}
