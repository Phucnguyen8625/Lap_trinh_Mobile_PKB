import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../theme/theme';

// Import Screens
import CustomerListScreen from '../screens/phuc/CustomerListScreen';
import CustomerDetailScreen from '../screens/phuc/CustomerDetailScreen';
import CustomerFormScreen from '../screens/phuc/CustomerFormScreen';

import AppointmentListScreen from '../screens/phuc/AppointmentListScreen';
import AppointmentDetailScreen from '../screens/phuc/AppointmentDetailScreen';
import AppointmentFormScreen from '../screens/phuc/AppointmentFormScreen';

import TechnicianListScreen from '../screens/phuc/TechnicianListScreen';
import TechnicianDetailScreen from '../screens/phuc/TechnicianDetailScreen';
import TechnicianAssignmentScreen from '../screens/phuc/TechnicianAssignmentScreen';

import RepairProgressScreen from '../screens/phuc/RepairProgressScreen';
import StatusUpdateScreen from '../screens/phuc/StatusUpdateScreen';
import HandoverScreen from '../screens/phuc/HandoverScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// ─── Tab 1: Khách hàng ───────────────────────────────
const CustomerStack = () => (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="CustomerList" component={CustomerListScreen} />
        <Stack.Screen name="CustomerDetail" component={CustomerDetailScreen} />
        <Stack.Screen name="CustomerForm" component={CustomerFormScreen} />
    </Stack.Navigator>
);

// ─── Tab 2: Lịch hẹn ─────────────────────────────────
const AppointmentStack = () => (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="AppointmentList" component={AppointmentListScreen} />
        <Stack.Screen name="AppointmentDetail" component={AppointmentDetailScreen} />
        <Stack.Screen name="AppointmentForm" component={AppointmentFormScreen} />
        <Stack.Screen name="TechnicianAssignment" component={TechnicianAssignmentScreen} />
        <Stack.Screen name="RepairProgress" component={RepairProgressScreen} />
        <Stack.Screen name="StatusUpdate" component={StatusUpdateScreen} />
        <Stack.Screen name="Handover" component={HandoverScreen} />
    </Stack.Navigator>
);

// ─── Tab 3: Kỹ thuật viên ────────────────────────────
const TechnicianStack = () => (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="TechnicianList" component={TechnicianListScreen} />
        <Stack.Screen name="TechnicianDetail" component={TechnicianDetailScreen} />
        <Stack.Screen name="TechnicianAssignFromList" component={TechnicianAssignmentScreen} />
    </Stack.Navigator>
);

// ─── Main Bottom Tabs ────────────────────────────────
const MainTabs = () => (
    <Tab.Navigator
        screenOptions={({ route }) => ({
            headerShown: false,
            tabBarIcon: ({ focused, color, size }) => {
                let iconName: any;
                if (route.name === 'Khách hàng') {
                    iconName = focused ? 'people' : 'people-outline';
                } else if (route.name === 'Lịch hẹn') {
                    iconName = focused ? 'calendar' : 'calendar-outline';
                } else if (route.name === 'Kỹ thuật viên') {
                    iconName = focused ? 'construct' : 'construct-outline';
                }
                return <Ionicons name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: COLORS.accent,
            tabBarInactiveTintColor: COLORS.textMuted,
            tabBarStyle: {
                paddingBottom: 5,
                height: 62,
                backgroundColor: COLORS.surface,
                borderTopWidth: 1,
                borderTopColor: COLORS.border,
            },
            tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
        })}
    >
        <Tab.Screen name="Khách hàng" component={CustomerStack} />
        <Tab.Screen name="Lịch hẹn" component={AppointmentStack} />
        <Tab.Screen name="Kỹ thuật viên" component={TechnicianStack} />
    </Tab.Navigator>
);

const AppNavigator = () => (
    <MainTabs />
);

export default AppNavigator;
