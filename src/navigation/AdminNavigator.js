import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import AdminDashboard from '../screens/admin/AdminDashboard';
import ReceptionListScreen from '../screens/admin/ReceptionListScreen';
import ReceptionDetailScreen from '../screens/admin/ReceptionDetailScreen';
import ReceptionFormScreen from '../screens/admin/ReceptionFormScreen';
import ServiceListScreen from '../screens/admin/ServiceListScreen';
import ServiceDetailScreen from '../screens/admin/ServiceDetailScreen';
import ServiceFormScreen from '../screens/admin/ServiceFormScreen';
import { COLORS } from '../theme/theme';

const Stack = createStackNavigator();

const AdminNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: COLORS.background },
      }}
    >
      <Stack.Screen name="AdminDashboard" component={AdminDashboard} />
      <Stack.Screen name="ReceptionList" component={ReceptionListScreen} />
      <Stack.Screen name="ReceptionDetail" component={ReceptionDetailScreen} />
      <Stack.Screen name="ReceptionForm" component={ReceptionFormScreen} />
      <Stack.Screen name="ServiceList" component={ServiceListScreen} />
      <Stack.Screen name="ServiceDetail" component={ServiceDetailScreen} />
      <Stack.Screen name="ServiceForm" component={ServiceFormScreen} />
    </Stack.Navigator>
  );
};

export default AdminNavigator;
