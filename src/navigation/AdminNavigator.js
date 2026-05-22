import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../theme/theme';

// Khánh's screens
import AdminDashboard from '../screens/admin/AdminDashboard';
import ReceptionListScreen from '../screens/admin/ReceptionListScreen';
import ReceptionDetailScreen from '../screens/admin/ReceptionDetailScreen';
import ReceptionFormScreen from '../screens/admin/ReceptionFormScreen';
import ServiceListScreen from '../screens/admin/ServiceListScreen';
import ServiceDetailScreen from '../screens/admin/ServiceDetailScreen';
import ServiceFormScreen from '../screens/admin/ServiceFormScreen';

// Phúc's screens
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

// ─── Khánh: Dashboard + Tiếp nhận + Dịch vụ ─────────────
const DashboardStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false, cardStyle: { backgroundColor: COLORS.background } }}>
    <Stack.Screen name="AdminDashboard" component={AdminDashboard} />
    <Stack.Screen name="ReceptionList" component={ReceptionListScreen} />
    <Stack.Screen name="ReceptionDetail" component={ReceptionDetailScreen} />
    <Stack.Screen name="ReceptionForm" component={ReceptionFormScreen} />
    <Stack.Screen name="ServiceList" component={ServiceListScreen} />
    <Stack.Screen name="ServiceDetail" component={ServiceDetailScreen} />
    <Stack.Screen name="ServiceForm" component={ServiceFormScreen} />
  </Stack.Navigator>
);

// ─── Phúc: Khách hàng ────────────────────────────────────
const CustomerStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false, cardStyle: { backgroundColor: COLORS.background } }}>
    <Stack.Screen name="CustomerList" component={CustomerListScreen} />
    <Stack.Screen name="CustomerDetail" component={CustomerDetailScreen} />
    <Stack.Screen name="CustomerForm" component={CustomerFormScreen} />
  </Stack.Navigator>
);

// ─── Phúc: Lịch hẹn + Phân công + Tiến độ ───────────────
const AppointmentStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false, cardStyle: { backgroundColor: COLORS.background } }}>
    <Stack.Screen name="AppointmentList" component={AppointmentListScreen} />
    <Stack.Screen name="AppointmentDetail" component={AppointmentDetailScreen} />
    <Stack.Screen name="AppointmentForm" component={AppointmentFormScreen} />
    <Stack.Screen name="TechnicianAssignment" component={TechnicianAssignmentScreen} />
    <Stack.Screen name="RepairProgress" component={RepairProgressScreen} />
    <Stack.Screen name="StatusUpdate" component={StatusUpdateScreen} />
    <Stack.Screen name="Handover" component={HandoverScreen} />
  </Stack.Navigator>
);

// ─── Phúc: Kỹ thuật viên ─────────────────────────────────
const TechnicianStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false, cardStyle: { backgroundColor: COLORS.background } }}>
    <Stack.Screen name="TechnicianList" component={TechnicianListScreen} />
    <Stack.Screen name="TechnicianDetail" component={TechnicianDetailScreen} />
    <Stack.Screen name="TechnicianAssignFromList" component={TechnicianAssignmentScreen} />
  </Stack.Navigator>
);

// ─── Admin Bottom Tabs ────────────────────────────────────
const AdminNavigator = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      headerShown: false,
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;
        if (route.name === 'Dashboard') {
          iconName = focused ? 'grid' : 'grid-outline';
        } else if (route.name === 'Khách hàng') {
          iconName = focused ? 'people' : 'people-outline';
        } else if (route.name === 'Lịch hẹn') {
          iconName = focused ? 'calendar' : 'calendar-outline';
        } else if (route.name === 'Kỹ thuật viên') {
          iconName = focused ? 'construct' : 'construct-outline';
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
    <Tab.Screen name="Dashboard" component={DashboardStack} />
    <Tab.Screen name="Khách hàng" component={CustomerStack} />
    <Tab.Screen name="Lịch hẹn" component={AppointmentStack} />
    <Tab.Screen name="Kỹ thuật viên" component={TechnicianStack} />
  </Tab.Navigator>
);

export default AdminNavigator;
