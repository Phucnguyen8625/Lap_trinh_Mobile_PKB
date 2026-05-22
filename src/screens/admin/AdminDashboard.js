import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { COLORS, SPACING, SIZES } from '../../theme/theme';
import { LayoutDashboard, ClipboardList, Wrench, Users, Bell, LogOut } from 'lucide-react-native';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';

const StatCard = ({ title, value, icon: Icon, color, onPress }) => (
  <TouchableOpacity style={styles.statCard} onPress={onPress}>
    <View style={[styles.iconContainer, { backgroundColor: color + '20' }]}>
      <Icon size={24} color={color} />
    </View>
    <View>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statTitle}>{title}</Text>
    </View>
  </TouchableOpacity>
);

const AdminDashboard = ({ navigation }) => {
  const { logout, user } = useAuth();
  const { receptions, services } = useData();

  const pendingReceptions = receptions.filter(r => r.status === 'Đang chờ').length;
  const activeServices = services.filter(s => s.status === 'Đang sửa').length;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Bảng Quản Trị</Text>
            <Text style={styles.adminName}>{user?.name}</Text>
          </View>
          <TouchableOpacity onPress={logout} style={styles.logoutButton}>
            <LogOut size={20} color={COLORS.error} />
          </TouchableOpacity>
        </View>

        <View style={styles.statsGrid}>
          <StatCard 
            title="Tiếp nhận mới" 
            value={pendingReceptions} 
            icon={ClipboardList} 
            color={COLORS.primary} 
            onPress={() => navigation.navigate('ReceptionList')}
          />
          <StatCard 
            title="Đang sửa chữa" 
            value={activeServices} 
            icon={Wrench} 
            color={COLORS.accent} 
            onPress={() => navigation.navigate('ServiceList')}
          />
        </View>

        <Text style={styles.sectionTitle}>Thao tác nhanh</Text>
        <View style={styles.actionGrid}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => navigation.navigate('ReceptionList')}
          >
            <ClipboardList size={32} color={COLORS.primary} />
            <Text style={styles.actionText}>Tiếp nhận</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => navigation.navigate('ServiceList')}
          >
            <Wrench size={32} color={COLORS.accent} />
            <Text style={styles.actionText}>Dịch vụ</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <Users size={32} color={COLORS.success} />
            <Text style={styles.actionText}>Khách hàng</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <Bell size={32} color="#F59E0B" />
            <Text style={styles.actionText}>Thông báo</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.recentActivity}>
          <Text style={styles.sectionTitle}>Hoạt động gần đây</Text>
          {receptions.slice(0, 3).map((item, index) => (
            <View key={index} style={styles.activityItem}>
              <View style={[styles.activityDot, { backgroundColor: item.status === 'Đang chờ' ? COLORS.primary : COLORS.accent }]} />
              <View style={styles.activityInfo}>
                <Text style={styles.activityText}>{item.customerName} - {item.deviceModel}</Text>
                <Text style={styles.activitySubtext}>{item.id} • {item.receivedDate}</Text>
              </View>
              <Text style={[styles.statusText, { color: item.status === 'Đang chờ' ? COLORS.primary : COLORS.accent }]}>{item.status}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    padding: SPACING.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  greeting: {
    color: COLORS.textSecondary,
    fontSize: SIZES.font,
  },
  adminName: {
    color: COLORS.text,
    fontSize: SIZES.h2,
    fontWeight: 'bold',
  },
  logoutButton: {
    padding: SPACING.sm,
    backgroundColor: COLORS.card,
    borderRadius: 12,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginBottom: SPACING.xl,
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.card,
    padding: SPACING.md,
    borderRadius: SIZES.radius,
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statValue: {
    color: COLORS.text,
    fontSize: SIZES.h3,
    fontWeight: 'bold',
  },
  statTitle: {
    color: COLORS.textSecondary,
    fontSize: 12,
  },
  sectionTitle: {
    color: COLORS.text,
    fontSize: SIZES.h3,
    fontWeight: 'bold',
    marginBottom: SPACING.md,
  },
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.md,
    marginBottom: SPACING.xl,
  },
  actionButton: {
    width: '47%',
    backgroundColor: COLORS.card,
    padding: SPACING.lg,
    borderRadius: SIZES.radius,
    alignItems: 'center',
    gap: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  actionText: {
    color: COLORS.text,
    fontSize: SIZES.font,
    fontWeight: '600',
  },
  recentActivity: {
    backgroundColor: COLORS.card,
    padding: SPACING.md,
    borderRadius: SIZES.radius,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  activityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: SPACING.md,
  },
  activityInfo: {
    flex: 1,
  },
  activityText: {
    color: COLORS.text,
    fontSize: SIZES.font,
    fontWeight: '500',
  },
  activitySubtext: {
    color: COLORS.textSecondary,
    fontSize: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
  }
});

export default AdminDashboard;
