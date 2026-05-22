import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView } from 'react-native';
import { COLORS, SPACING, SIZES } from '../../theme/theme';
import { useData } from '../../context/DataContext';
import { Wrench, ChevronRight, DollarSign } from 'lucide-react-native';

const ServiceListScreen = ({ navigation }) => {
  const { services, getReceptionById } = useData();

  const getStatusColor = (status) => {
    switch (status) {
      case 'Đang sửa': return COLORS.success;
      case 'Chờ duyệt': return '#F59E0B';
      case 'Hoàn thành': return COLORS.primary;
      case 'Chờ linh kiện': return COLORS.error;
      default: return COLORS.textSecondary;
    }
  };

  const renderItem = ({ item }) => {
    const reception = getReceptionById(item.receptionId);
    
    return (
      <TouchableOpacity 
        style={styles.card}
        onPress={() => navigation.navigate('ServiceDetail', { id: item.id })}
      >
        <View style={styles.cardHeader}>
          <View style={styles.idContainer}>
            <Wrench size={16} color={COLORS.accent} />
            <Text style={styles.idText}>{item.id}</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '20' }]}>
            <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
              {item.status}
            </Text>
          </View>
        </View>
        
        <Text style={styles.serviceName}>{item.serviceName}</Text>
        <Text style={styles.deviceInfo}>{reception?.deviceModel || 'Thiết bị không xác định'}</Text>
        
        <View style={styles.middleRow}>
          <View style={styles.priceContainer}>
            <DollarSign size={14} color={COLORS.textSecondary} />
            <Text style={styles.priceText}>{item.estimatedPrice}</Text>
          </View>
          <View style={[styles.approvalBadge, { backgroundColor: item.approvalStatus === 'Đã duyệt' ? COLORS.success + '10' : COLORS.border }]}>
            <Text style={[styles.approvalText, { color: item.approvalStatus === 'Đã duyệt' ? COLORS.success : COLORS.textSecondary }]}>
              {item.approvalStatus}
            </Text>
          </View>
        </View>

        <View style={styles.cardFooter}>
          <Text style={styles.refText}>Mã tiếp nhận: {item.receptionId}</Text>
          <ChevronRight size={20} color={COLORS.textSecondary} />
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Dịch Vụ & Báo Giá</Text>
        <Text style={styles.subtitle}>Danh sách công việc sửa chữa</Text>
      </View>

      <FlatList
        data={services}
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
    color: COLORS.accent,
    fontWeight: 'bold',
    fontSize: 12,
  },
  serviceName: {
    color: COLORS.text,
    fontSize: SIZES.font,
    fontWeight: 'bold',
    marginBottom: 4,
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
  deviceInfo: {
    color: COLORS.textSecondary,
    fontSize: 12,
    marginBottom: SPACING.sm,
  },
  middleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  priceText: {
    color: COLORS.success,
    fontSize: 14,
    fontWeight: 'bold',
  },
  approvalBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  approvalText: {
    fontSize: 11,
    fontWeight: '500',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  refText: {
    color: COLORS.textSecondary,
    fontSize: 12,
  }
});

export default ServiceListScreen;
