import 'react-native-gesture-handler';
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from './src/context/AuthContext';
import { DataProvider } from './src/context/DataContext';
import { BookingProvider } from './src/context/BookingContext';
import AuthNavigator from './src/navigation/AuthNavigator';
import { COLORS } from './src/theme/theme';

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <DataProvider>
          <BookingProvider>
            <NavigationContainer>
              <StatusBar style="light" backgroundColor={COLORS.background} />
              <AuthNavigator />
            </NavigationContainer>
          </BookingProvider>
        </DataProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
