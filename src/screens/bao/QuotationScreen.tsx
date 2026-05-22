import React, { useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  ActivityIndicator, Alert, StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, SPACING } from '../../theme/theme';
import { useAuth } from '../../context/AuthContext';
import apiClient from '../../api/apiClient';

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  'Đang chờ':      { label: 'Đang chờ',      color: '#F59E0B', bg: '#F59E0B20' },
  'Đã xác nhận':   { label: 'Đã xác nhận',   color: COLORS.success, bg: COLORS.success + '20' },
  'Đang sửa':      { label: 'Đang sửa',      color: '#8B5CF6', bg: '#8B5CF620' },
  'Chờ linh kiện': { label: 'Chờ linh kiện', color: '#EF4444', bg: '#EF444420' },
  'Hoàn thành':    { label: 'Hoàn thành',    color: COLORS.primary, bg: COLORS.primary + '20' },
  'Đã bàn giao':   { label: 'Đã bàn giao',   color: '#6B7280', bg: '#6B728020' },
  'Đã hủy':        { label: 'Đã hủy',        color: COLORS.danger, bg: COLORS.danger + '20' },
};

const QUOTATION_CONFIG: Record<string, { label: string; color: string }> = {
  'Chờ báo giá':         { label: 'Chờ báo giá',         color: '#6B7280' },
  'Chờ khách xác nhận':  { label: 'Chờ khách xác nhận',  color: '#F59E0B' },
  'Đã duyệt':            { label: 'Đã duyệt',            color: COLORS.success },
  'Từ chối':             { label: 'Từ chối',             color: COLORS.danger },
};

function formatVND(amount: number | null): string {
  if (!amount) return '—';
  return amount.toLocaleString('vi-VN') + ' VNĐ';
}

function serviceCode(id: number): string {
  return `DV-${String(id).padStart(3, '0')}`;
}

export default function QuotationScreen({ navigation }: any) {
  const { user } = useAuth();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchData = useCallback(async () => {
    if (!user?.customerId) { setLoading(false); return; }
    setLoading(true);
    setError(false);
    try {
      const res = await apiClient.get(`/api/appointments/customer/${user.customerId}`);
      setItems(res.data);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useFocusEffect(useCallback(() => { fetchData(); }, [fetchData]));

  const handleApprove = (item: any) => {
    Alert.alert(
      'Xác nhận báo giá',
      `Bạn đồng ý với báo giá ${formatVND(item.quotedPrice)} cho đơn ${serviceCode(item.id)}?`,
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Đồng ý', onPress: async () => {
            try {
              await apiClient.patch(`/api/appointments/${item.id}/quotation-response`, { action: 'approve' });
              fetchData();
            } catch {
              Alert.alert('Lỗi', 'Không thể kết nối server');
            }
          },
        },
      ],
    );
  };

  const handleReject = (item: any) => {
    Alert.alert(
      'Từ chối báo giá',
      `Bạn muốn từ chối báo giá ${formatVND(item.quotedPrice)}?`,
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Từ chối', style: 'destructive', onPress: async () => {
            try {
              await apiClient.patch(`/api/appointments/${item.id}/quotation-response`, { action: 'reject' });
              fetchData();
            } catch {
              Alert.alert('Lỗi', 'Không thể kết nối server');
            }
          },
        },
      ],
    );
  };

  const renderItem = ({ item }: any) => {
    const statusCfg = STATUS_CONFIG[item.status] || { label: item.status, color: COLORS.primary, bg: COLORS.primary + '20' };
    const quoteCfg = QUOTATION_CONFIG[item.quotationStatus] || { label: item.quotationStatus, color: COLORS.textSecondary };
    const needsAction = item.quotationStatus === 'Chờ khách xác nhận';

    return (
      <View style={[styles.card, needsAction && styles.cardHighlight]}>
        {/* Header row */}
        <View style={styles.cardHeader}>
          <View style={styles.codeRow}>
            <Ionicons name="construct" size={14} color={COLORS.primary} />
            <Text style={styles.codeText}>{serviceCode(item.id)}</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: statusCfg.bg }]}>
            <Text style={[styles.statusText, { color: statusCfg.color }]}>{statusCfg.label}</Text>
          </View>
        </View>

        {/* Tên dịch vụ + thiết bị */}
        <Text style={styles.serviceName}>{item.serviceType}</Text>
        {!!item.deviceInfo && (
          <Text style={styles.deviceText}>{item.deviceInfo}</Text>
        )}

        {/* Giá + trạng thái báo giá */}
        <View style={styles.priceRow}>
          <View style={styles.priceLeft}>
            <Ionicons name="cash-outline" size={15} color={COLORS.success} />
            <Text style={styles.priceText}>{formatVND(item.quotedPrice)}</Text>
          </View>
          <Text style={[styles.quoteStatus, { color: quoteCfg.color }]}>{quoteCfg.label}</Text>
        </View>

        {/* Nút duyệt / từ chối nếu cần */}
        {needsAction && (
          <View style={styles.actionRow}>
            <TouchableOpacity style={styles.btnApprove} onPress={() => handleApprove(item)}>
              <Ionicons name="checkmark-circle" size={16} color="#fff" />
              <Text style={styles.btnText}>Đồng ý</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btnReject} onPress={() => handleReject(item)}>
              <Ionicons name="close-circle" size={16} color="#fff" />
              <Text style={styles.btnText}>Từ chối</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Divider + mã tiếp nhận */}
        <View style={styles.footer}>
          <Text style={styles.receiptLabel}>
            Mã tiếp nhận: <Text style={styles.receiptCode}>{item.bookingCode || '—'}</Text>
          </Text>
          <Ionicons name="chevron-forward" size={16} color={COLORS.border} />
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Dịch Vụ & Báo Giá</Text>
          <Text style={styles.headerSub}>Danh sách công việc sửa chữa</Text>
        </View>
        <TouchableOpacity onPress={fetchData} style={styles.refreshBtn}>
          <Ionicons name="refresh" size={20} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={COLORS.primary} style={styles.loader} />
      ) : error ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="cloud-offline-outline" size={64} color={COLORS.danger} />
          <Text style={[styles.emptyText, { color: COLORS.danger, marginBottom: 16 }]}>Không kết nối được server</Text>
          <TouchableOpacity style={styles.retryBtn} onPress={fetchData}>
            <Ionicons name="refresh" size={18} color={COLORS.surface} />
            <Text style={styles.retryText}>Thử lại</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="receipt-outline" size={64} color={COLORS.border} />
              <Text style={styles.emptyText}>Chưa có đơn sửa chữa nào</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: SIZES.padding, paddingVertical: 16,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1, borderBottomColor: COLORS.border,
  },
  headerTitle: { fontSize: 22, fontWeight: 'bold', color: COLORS.primary },
  headerSub: { fontSize: 13, color: COLORS.textSecondary, marginTop: 2 },
  refreshBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: COLORS.primary + '15',
    alignItems: 'center', justifyContent: 'center',
  },
  loader: { flex: 1 },
  list: { padding: SIZES.padding },

  card: {
    backgroundColor: COLORS.surface, borderRadius: SIZES.radius,
    padding: SPACING.md, marginBottom: 14,
    borderWidth: 1, borderColor: COLORS.border,
    elevation: 2,
  },
  cardHighlight: {
    borderColor: '#F59E0B', borderWidth: 1.5,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  codeRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  codeText: { fontSize: 14, fontWeight: 'bold', color: COLORS.primary },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  statusText: { fontSize: 12, fontWeight: 'bold' },

  serviceName: { fontSize: 17, fontWeight: 'bold', color: COLORS.text, marginBottom: 2 },
  deviceText: { fontSize: 13, color: COLORS.textSecondary, marginBottom: 10 },

  priceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  priceLeft: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  priceText: { fontSize: 16, fontWeight: 'bold', color: COLORS.success },
  quoteStatus: { fontSize: 13, fontWeight: '600' },

  actionRow: { flexDirection: 'row', gap: 10, marginBottom: 12 },
  btnApprove: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
    backgroundColor: COLORS.success, borderRadius: 10, paddingVertical: 10,
  },
  btnReject: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
    backgroundColor: COLORS.danger, borderRadius: 10, paddingVertical: 10,
  },
  btnText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },

  footer: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    borderTopWidth: 1, borderTopColor: COLORS.border, paddingTop: 10, marginTop: 2,
  },
  receiptLabel: { fontSize: 12, color: COLORS.textSecondary },
  receiptCode: { fontWeight: '700', color: COLORS.text },

  emptyContainer: { alignItems: 'center', marginTop: 100 },
  emptyText: { marginTop: 12, fontSize: 16, color: COLORS.textSecondary },
  retryBtn: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.primary,
    paddingHorizontal: 24, paddingVertical: 12, borderRadius: 24, gap: 8,
  },
  retryText: { color: COLORS.surface, fontWeight: 'bold', fontSize: 15 },
});
