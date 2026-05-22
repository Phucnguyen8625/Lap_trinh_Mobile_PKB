import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../theme/theme';

import HomeScreen from '../screens/bao/HomeScreen';
import ServiceCatalogScreen from '../screens/bao/ServiceCatalogScreen';
import ServiceDetailScreen from '../screens/bao/ServiceDetailScreen';
import BookingScreen from '../screens/bao/BookingScreen';
import BookingSuccessScreen from '../screens/bao/BookingSuccessScreen';
import TrackingScreen from '../screens/bao/TrackingScreen';
import ProfileScreen from '../screens/bao/ProfileScreen';
import QuotationScreen from '../screens/bao/QuotationScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const HomeStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Home" component={HomeScreen} />
    <Stack.Screen name="ServiceCatalog" component={ServiceCatalogScreen} />
    <Stack.Screen name="ServiceDetail" component={ServiceDetailScreen} />
    <Stack.Screen name="Booking" component={BookingScreen} />
    <Stack.Screen name="BookingSuccess" component={BookingSuccessScreen} />
    <Stack.Screen name="Tracking" component={TrackingScreen} />
  </Stack.Navigator>
);

const BookingStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="BookingMain" component={BookingScreen} />
    <Stack.Screen name="BookingSuccess" component={BookingSuccessScreen} />
  </Stack.Navigator>
);

const QuotationStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="QuotationMain" component={QuotationScreen} />
  </Stack.Navigator>
);

const TrackingStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="TrackingMain" component={TrackingScreen} />
  </Stack.Navigator>
);

const ProfileStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="ProfileMain" component={ProfileScreen} />
    <Stack.Screen name="TrackingFromProfile" component={TrackingScreen} />
  </Stack.Navigator>
);

const UserNavigator = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      headerShown: false,
      tabBarIcon: ({ focused, color, size }) => {
        let iconName: any;
        if (route.name === 'Trang chủ') {
          iconName = focused ? 'home' : 'home-outline';
        } else if (route.name === 'Đặt lịch') {
          iconName = focused ? 'calendar' : 'calendar-outline';
        } else if (route.name === 'Dịch vụ') {
          iconName = focused ? 'receipt' : 'receipt-outline';
        } else if (route.name === 'Tra cứu') {
          iconName = focused ? 'search' : 'search-outline';
        } else if (route.name === 'Hồ sơ') {
          iconName = focused ? 'person' : 'person-outline';
        }
        return <Ionicons name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: COLORS.primary,
      tabBarInactiveTintColor: COLORS.textSecondary,
      tabBarStyle: {
        backgroundColor: COLORS.surface,
        borderTopColor: COLORS.border,
        borderTopWidth: 1,
        paddingBottom: 6,
        paddingTop: 4,
        height: 64,
      },
      tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
    })}
  >
    <Tab.Screen name="Trang chủ" component={HomeStack} />
    <Tab.Screen name="Đặt lịch" component={BookingStack} />
    <Tab.Screen name="Dịch vụ" component={QuotationStack} />
    <Tab.Screen name="Tra cứu" component={TrackingStack} />
    <Tab.Screen name="Hồ sơ" component={ProfileStack} />
  </Tab.Navigator>
);

export default UserNavigator;
