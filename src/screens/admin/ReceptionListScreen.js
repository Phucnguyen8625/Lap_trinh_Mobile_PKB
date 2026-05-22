import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView } from 'react-native';
import { COLORS, SPACING, SIZES } from '../../theme/theme';
import { useData } from '../../context/DataContext';
import { ChevronRight, ClipboardList, Plus } from 'lucide-react-native';

const ReceptionListScreen = ({ navigation }) => {
  const { receptions } = useData();

  const getStatusColor = (status) => {
    switch (status) {
      case 'Đang chờ': return COLORS.primary;
      case 'Đang sửa': return COLORS.accent;
      case 'Hoàn thành': return COLORS.success;
      case 'Chờ linh kiện': return '#F59E0B';
      default: return COLORS.textSecondary;
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.card}
      onPress={() => navigation.navigate('ReceptionDetail', { id: item.id })}
    >
      <View style={styles.cardHeader}>
        <View style={styles.idContainer}>
          <ClipboardList size={16} color={COLORS.primary} />
          <Text style={styles.idText}>{item.id}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '20' }]}>
          <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
            {item.status}
          </Text>
        </View>
      </View>
      
      <Text style={styles.customerName}>{item.customerName} - {item.phoneNumber}</Text>
      <Text style={styles.deviceInfo}>{item.deviceModel} • {item.serialNumber}</Text>
      
      <View style={styles.extraInfo}>
        <Text style={styles.warrantyText}>{item.warranty}</Text>
      </View>

      <View style={styles.cardFooter}>
        <Text style={styles.dateText}>Ngày nhận: {item.receivedDate}</Text>
        <ChevronRight size={20} color={COLORS.textSecondary} />
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Quản Lý Tiếp Nhận</Text>
          <Text style={styles.subtitle}>Tìm thấy {receptions.length} bản ghi</Text>
        </View>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => navigation.navigate('ReceptionForm')}
        >
          <Plus size={24} color={COLORS.text} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={receptions}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    padding: SPACING.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    color: COLORS.text,
    fontSize: SIZES.h2,
    fontWeight: 'bold',
  },
  subtitle: {
    color: COLORS.textSecondary,
    fontSize: SIZES.font,
  },
  addButton: {
    backgroundColor: COLORS.primary,
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  listContent: {
    padding: SPACING.lg,
    paddingTop: 0,
  },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: SIZES.radius,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  idContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  idText: {
    color: COLORS.primary,
    fontWeight: 'bold',
    fontSize: 12,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  customerName: {
    color: COLORS.text,
    fontSize: SIZES.body,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  deviceInfo: {
    color: COLORS.textSecondary,
    fontSize: 12,
    marginBottom: SPACING.sm,
  },
  extraInfo: {
    marginBottom: SPACING.md,
  },
  warrantyText: {
    color: COLORS.accent,
    fontSize: 12,
    fontWeight: '600',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  dateText: {
    color: COLORS.textSecondary,
    fontSize: 12,
  }
});

export default ReceptionListScreen;
