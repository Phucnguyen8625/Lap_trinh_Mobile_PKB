import React, { useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, TextInput,
  StatusBar, ScrollView, FlatList, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Search, Package, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react-native';
import { COLORS, SPACING } from '../../theme/theme';
import { useAuth } from '../../context/AuthContext';
import apiClient from '../../api/apiClient';

const STATUS_CONFIG: Record<string, { color: string; bg: string; Icon: any; label: string }> = {
  // Vietnamese statuses
  'Đang chờ':      { color: COLORS.primary,       bg: '#1D4ED820', Icon: Clock,        label: 'Đang chờ' },
  'Đã xác nhận':   { color: COLORS.success,        bg: '#10B98120', Icon: CheckCircle,  label: 'Đã xác nhận' },
  'Đang sửa':      { color: '#8B5CF6',             bg: '#8B5CF620', Icon: Clock,        label: 'Đang sửa' },
  'Chờ linh kiện': { color: '#EF4444',             bg: '#EF444420', Icon: Clock,        label: 'Chờ linh kiện' },
  'Hoàn thành':    { color: COLORS.success,        bg: '#10B98120', Icon: CheckCircle,  label: 'Hoàn thành' },
  'Đã bàn giao':   { color: COLORS.textSecondary,  bg: COLORS.border + '40', Icon: CheckCircle, label: 'Đã bàn giao' },
  'Đã hủy':        { color: COLORS.danger,         bg: '#EF444420', Icon: XCircle,      label: 'Đã hủy' },
  // English statuses (from admin StatusUpdateScreen)
  'Pending':        { color: COLORS.primary,       bg: '#1D4ED820', Icon: Clock,        label: 'Đang chờ' },
  'Confirmed':      { color: COLORS.success,       bg: '#10B98120', Icon: CheckCircle,  label: 'Đã tiếp nhận' },
  'Checking':       { color: '#06B6D4',            bg: '#06B6D420', Icon: AlertCircle,  label: 'Đang kiểm tra' },
  'Repairing':      { color: '#8B5CF6',            bg: '#8B5CF620', Icon: Clock,        label: 'Đang sửa' },
  'WaitingForParts':{ color: '#EF4444',            bg: '#EF444420', Icon: Clock,        label: 'Chờ linh kiện' },
  'Completed':      { color: COLORS.success,       bg: '#10B98120', Icon: CheckCircle,  label: 'Hoàn thành' },
  'HandedOver':     { color: COLORS.textSecondary, bg: COLORS.border + '40', Icon: CheckCircle, label: 'Đã bàn giao' },
  'Cancelled':      { color: COLORS.danger,        bg: '#EF444420', Icon: XCircle,      label: 'Đã hủy' },
};

function getStatusCfg(status: string) {
  return STATUS_CONFIG[status] || { color: COLORS.primary, bg: '#1D4ED820', Icon: Clock, label: status };
}

function formatTime(dateStr: string): string {
  const d = new Date(dateStr);
  const dd = d.getDate().toString().padStart(2, '0');
  const mm = (d.getMonth() + 1).toString().padStart(2, '0');
  const hh = d.getHours().toString().padStart(2, '0');
  const min = d.getMinutes().toString().padStart(2, '0');
  return `${dd}/${mm} ${hh}:${min}`;
}

function mapApiToOrder(appt: any) {
  const d = new Date(appt.appointmentDate || appt.createdAt);
  const dateStr = `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`;

  let timeline: { status: string; time: string; note?: string }[] = [];
  if (Array.isArray(appt.statusHistory) && appt.statusHistory.length > 0) {
    timeline = appt.statusHistory.map((h: any) => ({
      status: h.status,
      time: formatTime(h.time),
      note: h.note || undefined,
    }));
  } else {
    timeline = [{ status: appt.status || 'Đang chờ', time: formatTime(appt.createdAt || new Date().toISOString()) }];
  }

  return {
    code: appt.bookingCode || `ID-${appt.id}`,
    service: appt.serviceType || 'Dịch vụ sửa chữa',
    device: appt.deviceInfo || 'Thiết bị',
    date: dateStr,
    status: appt.status || 'Đang chờ',
    timeline,
  };
}

const TABS = ['Lịch sử', 'Tra cứu mã'];

export default function TrackingScreen({ navigation }: any) {
  const { user } = useAuth();

  const [history, setHistory] = useState<any[]>([]);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [historyError, setHistoryError] = useState(false);

  const [tab, setTab] = useState(0);
  const [trackCode, setTrackCode] = useState('');
  const [foundOrder, setFoundOrder] = useState<any>(null);
  const [notFound, setNotFound] = useState(false);
  const [searching, setSearching] = useState(false);
  const [expandedCode, setExpandedCode] = useState<string | null>(null);

  useFocusEffect(useCallback(() => {
    if (!user?.customerId) { setHistoryLoading(false); return; }
    setHistoryLoading(true);
    setHistoryError(false);
    apiClient.get(`/api/appointments/customer/${user.customerId}`)
      .then(res => setHistory(res.data.map(mapApiToOrder)))
      .catch(() => setHistoryError(true))
      .finally(() => setHistoryLoading(false));
  }, [user?.customerId]));

  const handleSearch = async () => {
    const code = trackCode.trim().toUpperCase();
    if (!code) return;

    // Tìm trong history trước (nhanh, không cần mạng)
    const localResult = history.find(o => o.code.toUpperCase() === code);
    if (localResult) {
      setFoundOrder(localResult);
      setNotFound(false);
      return;
    }

    setSearching(true);
    try {
      const res = await apiClient.get(`/api/appointments/track/${code}`);
      setFoundOrder(mapApiToOrder(res.data));
      setNotFound(false);
    } catch {
      setFoundOrder(null);
      setNotFound(true);
    } finally {
      setSearching(false);
    }
  };

  const StatusBadge = ({ status }: { status: string }) => {
    const cfg = getStatusCfg(status);
    return (
      <View style={[styles.badge, { backgroundColor: cfg.bg }]}>
        <cfg.Icon size={12} color={cfg.color} />
        <Text style={[styles.badgeText, { color: cfg.color }]}>{cfg.label}</Text>
      </View>
    );
  };

  const OrderCard = ({ item, expanded, onToggle }: any) => {
    const cfg = getStatusCfg(item.status);
    return (
      <TouchableOpacity style={styles.orderCard} onPress={onToggle} activeOpacity={0.85}>
        <View style={styles.orderTop}>
          <View style={[styles.orderIconBox, { backgroundColor: cfg.bg }]}>
            <cfg.Icon size={20} color={cfg.color} />
          </View>
          <View style={{ flex: 1 }}>
            <View style={styles.orderTitleRow}>
              <Text style={styles.orderCode}>{item.code}</Text>
              <StatusBadge status={item.status} />
            </View>
            <Text style={styles.orderService}>{item.service}</Text>
            <Text style={styles.orderDevice}>{item.device} · {item.date}</Text>
          </View>
          <Ionicons
            name={expanded ? 'chevron-up' : 'chevron-down'}
            size={18} color={COLORS.textSecondary}
          />
        </View>

        {expanded && (
          <View style={styles.timeline}>
            {[...item.timeline].reverse().map((step: any, i: number) => {
              const sCfg = getStatusCfg(step.status);
              const isLast = i === item.timeline.length - 1;
              return (
                <View key={i} style={styles.timelineRow}>
                  <View style={styles.timelineLeft}>
                    <View style={[styles.timelineDot, { backgroundColor: sCfg.color }]} />
                    {!isLast && <View style={styles.timelineLine} />}
                  </View>
                  <View style={styles.timelineContent}>
                    <Text style={[styles.timelineStatus, { color: sCfg.color }]}>{sCfg.label}</Text>
                    {!!step.note && <Text style={styles.timelineNote}>{step.note}</Text>}
                    <Text style={styles.timelineTime}>{step.time}</Text>
                  </View>
                </View>
              );
            })}
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Tra cứu đơn hàng</Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        {TABS.map((t, i) => (
          <TouchableOpacity
            key={t}
            style={[styles.tab, tab === i && styles.tabActive]}
            onPress={() => setTab(i)}
          >
            <Text style={[styles.tabText, tab === i && styles.tabTextActive]}>{t}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {tab === 0 ? (
        historyLoading ? (
          <ActivityIndicator size="large" color={COLORS.primary} style={styles.loader} />
        ) : historyError ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="cloud-offline-outline" size={64} color={COLORS.danger} />
            <Text style={[styles.listHint, { color: COLORS.danger, marginTop: 12 }]}>Không kết nối được server</Text>
          </View>
        ) : (
          <FlatList
            data={history}
            keyExtractor={(item) => item.code}
            contentContainerStyle={{ padding: SPACING.md, paddingBottom: 24 }}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <OrderCard
                item={item}
                expanded={expandedCode === item.code}
                onToggle={() => setExpandedCode(expandedCode === item.code ? null : item.code)}
              />
            )}
            ListHeaderComponent={
              <Text style={styles.listHint}>Nhấn vào đơn để xem chi tiết tiến trình</Text>
            }
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Package size={64} color={COLORS.border} />
                <Text style={styles.listHint}>Chưa có đơn hàng nào</Text>
              </View>
            }
          />
        )
      ) : (
        <ScrollView
          contentContainerStyle={{ padding: SPACING.md }}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.trackHint}>
            Nhập mã đặt lịch (VD: TC-001234) để xem tình trạng thiết bị của bạn
          </Text>
          <View style={styles.searchRow}>
            <View style={styles.searchBox}>
              <Search size={18} color={COLORS.textSecondary} />
              <TextInput
                style={styles.searchInput}
                placeholder="Nhập mã đặt lịch..."
                placeholderTextColor={COLORS.textSecondary}
                value={trackCode}
                onChangeText={(t) => {
                  setTrackCode(t);
                  setNotFound(false);
                  setFoundOrder(null);
                }}
                autoCapitalize="characters"
              />
            </View>
            <TouchableOpacity
              style={[styles.searchBtn, searching && { opacity: 0.7 }]}
              onPress={handleSearch}
              activeOpacity={0.85}
              disabled={searching}
            >
              {searching
                ? <ActivityIndicator color="#fff" size="small" />
                : <Text style={styles.searchBtnText}>Tìm</Text>
              }
            </TouchableOpacity>
          </View>

          {notFound && (
            <View style={styles.notFound}>
              <XCircle size={40} color={COLORS.danger} />
              <Text style={styles.notFoundTitle}>Không tìm thấy đơn hàng</Text>
              <Text style={styles.notFoundSub}>Kiểm tra lại mã đặt lịch hoặc liên hệ TechCare để được hỗ trợ</Text>
            </View>
          )}

          {foundOrder && (
            <OrderCard
              item={foundOrder}
              expanded={true}
              onToggle={() => {}}
            />
          )}

          <View style={styles.tipBox}>
            <Text style={styles.tipTitle}>Mẹo tra cứu</Text>
            <Text style={styles.tipText}>• Mã đặt lịch có dạng TC-XXXXXX</Text>
            <Text style={styles.tipText}>• Bạn có thể xem lịch sử trong tab "Lịch sử"</Text>
            <Text style={styles.tipText}>• Liên hệ hotline: 0901 234 567 nếu cần hỗ trợ</Text>
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  header: { paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm },
  headerTitle: { fontSize: 22, fontWeight: '800', color: COLORS.text },
  tabs: {
    flexDirection: 'row', marginHorizontal: SPACING.md,
    backgroundColor: COLORS.surface, borderRadius: 12,
    padding: 4, marginBottom: SPACING.md,
    borderWidth: 1, borderColor: COLORS.border,
  },
  tab: { flex: 1, paddingVertical: 8, alignItems: 'center', borderRadius: 10 },
  tabActive: { backgroundColor: COLORS.primary },
  tabText: { fontSize: 14, fontWeight: '600', color: COLORS.textSecondary },
  tabTextActive: { color: '#fff' },
  loader: { flex: 1 },
  emptyContainer: { alignItems: 'center', marginTop: 80 },
  listHint: { fontSize: 12, color: COLORS.textSecondary, marginBottom: SPACING.sm },
  orderCard: {
    backgroundColor: COLORS.surface, borderRadius: 16,
    padding: SPACING.md, marginBottom: SPACING.sm,
    borderWidth: 1, borderColor: COLORS.border,
  },
  orderTop: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  orderIconBox: {
    width: 44, height: 44, borderRadius: 12,
    alignItems: 'center', justifyContent: 'center',
  },
  orderTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 3 },
  orderCode: { fontSize: 15, fontWeight: '800', color: COLORS.text },
  badge: { flexDirection: 'row', alignItems: 'center', gap: 4, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3 },
  badgeText: { fontSize: 11, fontWeight: '700' },
  orderService: { fontSize: 13, color: COLORS.text, fontWeight: '600' },
  orderDevice: { fontSize: 12, color: COLORS.textSecondary, marginTop: 2 },
  timeline: { marginTop: SPACING.md, paddingLeft: SPACING.sm },
  timelineRow: { flexDirection: 'row', gap: 12, marginBottom: 4 },
  timelineLeft: { alignItems: 'center', width: 12 },
  timelineDot: { width: 12, height: 12, borderRadius: 6 },
  timelineLine: { width: 2, flex: 1, backgroundColor: COLORS.border, marginTop: 2 },
  timelineContent: { flex: 1, paddingBottom: 12 },
  timelineStatus: { fontSize: 13, fontWeight: '700' },
  timelineNote: { fontSize: 12, color: COLORS.textSecondary, fontStyle: 'italic', marginTop: 2 },
  timelineTime: { fontSize: 11, color: COLORS.textSecondary, marginTop: 2 },
  trackHint: {
    fontSize: 13, color: COLORS.textSecondary, lineHeight: 20,
    marginBottom: SPACING.md,
  },
  searchRow: { flexDirection: 'row', gap: SPACING.sm, marginBottom: SPACING.md },
  searchBox: {
    flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: COLORS.surface, borderRadius: 12,
    paddingHorizontal: SPACING.md, height: 48,
    borderWidth: 1, borderColor: COLORS.border,
  },
  searchInput: { flex: 1, color: COLORS.text, fontSize: 14 },
  searchBtn: {
    backgroundColor: COLORS.primary, borderRadius: 12,
    paddingHorizontal: SPACING.md, justifyContent: 'center',
    height: 48, minWidth: 60, alignItems: 'center',
  },
  searchBtnText: { fontSize: 14, fontWeight: '700', color: '#fff' },
  notFound: { alignItems: 'center', paddingVertical: SPACING.xl, gap: 10 },
  notFoundTitle: { fontSize: 16, fontWeight: '700', color: COLORS.text },
  notFoundSub: { fontSize: 13, color: COLORS.textSecondary, textAlign: 'center', maxWidth: 280 },
  tipBox: {
    backgroundColor: COLORS.surface, borderRadius: 16, padding: SPACING.md,
    borderWidth: 1, borderColor: COLORS.border, marginTop: SPACING.md,
  },
  tipTitle: { fontSize: 14, fontWeight: '700', color: COLORS.text, marginBottom: 8 },
  tipText: { fontSize: 13, color: COLORS.textSecondary, lineHeight: 22 },
});
