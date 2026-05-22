import React, { useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, StatusBar,
  ScrollView, Alert, Modal, TextInput, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import {
  Clock, Bell, Lock, HelpCircle, LogOut, ChevronRight, Star,
} from 'lucide-react-native';
import { COLORS, SPACING } from '../../theme/theme';
import { useAuth } from '../../context/AuthContext';
import apiClient from '../../api/apiClient';

// ─── Modal: Đổi mật khẩu ─────────────────────────────────
function ChangePasswordModal({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const { changePassword } = useAuth();
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNext, setShowNext] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const reset = () => { setCurrent(''); setNext(''); setConfirm(''); };

  const handleSubmit = async () => {
    if (!next || !confirm) { Alert.alert('Lỗi', 'Vui lòng điền đầy đủ thông tin'); return; }
    if (next !== confirm) { Alert.alert('Lỗi', 'Mật khẩu xác nhận không khớp'); return; }
    setLoading(true);
    try {
      const result = await changePassword(current, next);
      if (result.success) {
        Alert.alert('Thành công', result.message, [{ text: 'OK', onPress: () => { reset(); onClose(); } }]);
      } else {
        Alert.alert('Lỗi', result.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={modal.overlay}>
        <View style={modal.sheet}>
          <View style={modal.handle} />
          <Text style={modal.title}>Đổi mật khẩu</Text>
          <Text style={modal.subtitle}>Mật khẩu mới sẽ được áp dụng cho lần đăng nhập tiếp theo</Text>

          {/* Mật khẩu hiện tại */}
          <Text style={modal.label}>Mật khẩu hiện tại</Text>
          <View style={modal.inputRow}>
            <TextInput
              style={modal.input}
              placeholder="Nhập mật khẩu hiện tại"
              placeholderTextColor={COLORS.textSecondary}
              secureTextEntry={!showCurrent}
              value={current}
              onChangeText={setCurrent}
            />
            <TouchableOpacity onPress={() => setShowCurrent(v => !v)} style={modal.eyeBtn}>
              <Ionicons name={showCurrent ? 'eye-off-outline' : 'eye-outline'} size={20} color={COLORS.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* Mật khẩu mới */}
          <Text style={modal.label}>Mật khẩu mới</Text>
          <View style={modal.inputRow}>
            <TextInput
              style={modal.input}
              placeholder="Ít nhất 6 ký tự"
              placeholderTextColor={COLORS.textSecondary}
              secureTextEntry={!showNext}
              value={next}
              onChangeText={setNext}
            />
            <TouchableOpacity onPress={() => setShowNext(v => !v)} style={modal.eyeBtn}>
              <Ionicons name={showNext ? 'eye-off-outline' : 'eye-outline'} size={20} color={COLORS.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* Xác nhận mật khẩu */}
          <Text style={modal.label}>Xác nhận mật khẩu mới</Text>
          <View style={modal.inputRow}>
            <TextInput
              style={modal.input}
              placeholder="Nhập lại mật khẩu mới"
              placeholderTextColor={COLORS.textSecondary}
              secureTextEntry={!showConfirm}
              value={confirm}
              onChangeText={setConfirm}
            />
            <TouchableOpacity onPress={() => setShowConfirm(v => !v)} style={modal.eyeBtn}>
              <Ionicons name={showConfirm ? 'eye-off-outline' : 'eye-outline'} size={20} color={COLORS.textSecondary} />
            </TouchableOpacity>
          </View>

          <View style={modal.btnRow}>
            <TouchableOpacity style={modal.cancelBtn} onPress={() => { reset(); onClose(); }}>
              <Text style={modal.cancelText}>Hủy</Text>
            </TouchableOpacity>
            <TouchableOpacity style={modal.submitBtn} onPress={handleSubmit} disabled={loading}>
              {loading ? <ActivityIndicator size="small" color="#fff" /> : <Text style={modal.submitText}>Cập nhật</Text>}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

// ─── Modal: Đánh giá dịch vụ ─────────────────────────────
function RatingModal({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const SERVICES = ['Sửa chữa Laptop', 'Thay màn hình điện thoại', 'Thay pin', 'Cài đặt phần mềm', 'Kiểm tra tổng quát'];
  const [selectedService, setSelectedService] = useState('');

  const handleSubmit = () => {
    if (!selectedService) { Alert.alert('Lỗi', 'Vui lòng chọn dịch vụ'); return; }
    if (rating === 0) { Alert.alert('Lỗi', 'Vui lòng chọn số sao đánh giá'); return; }
    setSubmitted(true);
  };

  const handleClose = () => { setRating(0); setComment(''); setSelectedService(''); setSubmitted(false); onClose(); };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={handleClose}>
      <View style={modal.overlay}>
        <View style={[modal.sheet, { paddingBottom: 32 }]}>
          <View style={modal.handle} />

          {submitted ? (
            <View style={{ alignItems: 'center', paddingVertical: 24 }}>
              <View style={rating_s.successIcon}>
                <Ionicons name="checkmark-circle" size={56} color={COLORS.success} />
              </View>
              <Text style={rating_s.successTitle}>Cảm ơn bạn!</Text>
              <Text style={rating_s.successSub}>Đánh giá của bạn giúp chúng tôi cải thiện dịch vụ tốt hơn.</Text>
              <TouchableOpacity style={modal.submitBtn} onPress={handleClose}>
                <Text style={modal.submitText}>Đóng</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              <Text style={modal.title}>Đánh giá dịch vụ</Text>
              <Text style={modal.subtitle}>Chia sẻ trải nghiệm của bạn với TechCare</Text>

              {/* Chọn dịch vụ */}
              <Text style={modal.label}>Chọn dịch vụ</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 16 }}>
                {SERVICES.map(s => (
                  <TouchableOpacity
                    key={s}
                    style={[rating_s.chip, selectedService === s && rating_s.chipActive]}
                    onPress={() => setSelectedService(s)}
                  >
                    <Text style={[rating_s.chipText, selectedService === s && rating_s.chipTextActive]}>{s}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              {/* Sao đánh giá */}
              <Text style={modal.label}>Mức độ hài lòng</Text>
              <View style={rating_s.starsRow}>
                {[1, 2, 3, 4, 5].map(i => (
                  <TouchableOpacity key={i} onPress={() => setRating(i)} activeOpacity={0.7}>
                    <Ionicons
                      name={i <= rating ? 'star' : 'star-outline'}
                      size={38}
                      color={i <= rating ? '#F59E0B' : COLORS.textSecondary}
                    />
                  </TouchableOpacity>
                ))}
              </View>
              {rating > 0 && (
                <Text style={rating_s.ratingLabel}>
                  {['', 'Rất tệ', 'Tệ', 'Bình thường', 'Tốt', 'Rất tốt'][rating]}
                </Text>
              )}

              {/* Bình luận */}
              <Text style={modal.label}>Nhận xét (tuỳ chọn)</Text>
              <TextInput
                style={rating_s.commentBox}
                placeholder="Chia sẻ thêm về trải nghiệm của bạn..."
                placeholderTextColor={COLORS.textSecondary}
                multiline
                numberOfLines={3}
                value={comment}
                onChangeText={setComment}
              />

              <View style={modal.btnRow}>
                <TouchableOpacity style={modal.cancelBtn} onPress={handleClose}>
                  <Text style={modal.cancelText}>Hủy</Text>
                </TouchableOpacity>
                <TouchableOpacity style={modal.submitBtn} onPress={handleSubmit}>
                  <Text style={modal.submitText}>Gửi đánh giá</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
}

// ─── Main Screen ──────────────────────────────────────────
export default function ProfileScreen({ navigation }: any) {
  const { user, logout } = useAuth();
  const [showChangePass, setShowChangePass] = useState(false);
  const [showRating, setShowRating] = useState(false);
  const [stats, setStats] = useState([
    { label: 'Tổng đơn', value: 0 },
    { label: 'Đang sửa', value: 0 },
    { label: 'Hoàn thành', value: 0 },
  ]);

  const initials = (user?.name || 'U')
    .split(' ')
    .map((w: string) => w[0])
    .slice(-2)
    .join('')
    .toUpperCase();

  useFocusEffect(useCallback(() => {
    if (!user?.customerId) return;
    apiClient.get(`/api/appointments/customer/${user.customerId}`)
      .then(res => {
        const orders: any[] = res.data;
        const DONE = ['Hoàn thành', 'Đã bàn giao', 'Completed', 'HandedOver'];
        const ENDED = [...DONE, 'Đã hủy', 'Cancelled'];
        const done = orders.filter(o => DONE.includes(o.status)).length;
        const active = orders.filter(o => !ENDED.includes(o.status)).length;
        setStats([
          { label: 'Tổng đơn', value: orders.length },
          { label: 'Đang sửa', value: active },
          { label: 'Hoàn thành', value: done },
        ]);
      })
      .catch(() => {});
  }, [user?.customerId]));

  const handleLogout = () => {
    Alert.alert('Đăng xuất', 'Bạn có chắc muốn đăng xuất không?', [
      { text: 'Hủy', style: 'cancel' },
      { text: 'Đăng xuất', style: 'destructive', onPress: logout },
    ]);
  };

  const MENU_ITEMS = [
    {
      section: 'Đơn hàng',
      items: [
        { icon: Clock, label: 'Lịch sử sửa chữa', onPress: () => navigation.navigate('TrackingFromProfile') },
        { icon: Star, label: 'Đánh giá dịch vụ', onPress: () => setShowRating(true) },
      ],
    },
    {
      section: 'Tài khoản',
      items: [
        { icon: Bell, label: 'Thông báo', onPress: () => Alert.alert('Thông báo', 'Tính năng sẽ sớm ra mắt 🚀') },
        { icon: Lock, label: 'Đổi mật khẩu', onPress: () => setShowChangePass(true) },
      ],
    },
    {
      section: 'Hỗ trợ',
      items: [
        { icon: HelpCircle, label: 'Trung tâm hỗ trợ', onPress: () => Alert.alert('Hỗ trợ', 'Tính năng sẽ sớm ra mắt 🚀') },
      ],
    },
  ];

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 32 }}>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Hồ sơ của tôi</Text>
        </View>

        {/* Avatar + Info (không có nút bút vì chưa có giao diện chỉnh sửa) */}
        <View style={styles.profileCard}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{user?.name || 'Người dùng'}</Text>
            <Text style={styles.profileEmail}>{user?.email || ''}</Text>
            <View style={styles.rolePill}>
              <Text style={styles.roleText}>Khách hàng</Text>
            </View>
          </View>
        </View>

        {/* Stats từ API */}
        <View style={styles.statsRow}>
          {stats.map((s: { label: string; value: number }, i: number) => (
            <View key={i} style={[styles.statCard, i === 1 && styles.statCardMiddle]}>
              <Text style={styles.statValue}>{s.value}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </View>
          ))}
        </View>

        {/* Quick booking CTA */}
        <TouchableOpacity
          style={styles.ctaCard}
          onPress={() => navigation.navigate('Đặt lịch')}
          activeOpacity={0.85}
        >
          <View style={styles.ctaLeft}>
            <View style={styles.ctaIcon}>
              <Ionicons name="calendar-outline" size={22} color={COLORS.primary} />
            </View>
            <View>
              <Text style={styles.ctaTitle}>Đặt lịch sửa chữa</Text>
              <Text style={styles.ctaSub}>Nhanh chóng · Bảo hành · Uy tín</Text>
            </View>
          </View>
          <ChevronRight size={18} color={COLORS.primary} />
        </TouchableOpacity>

        {/* Menu sections */}
        {MENU_ITEMS.map((section) => (
          <View key={section.section} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.section}</Text>
            <View style={styles.menuCard}>
              {section.items.map((item, i) => (
                <TouchableOpacity
                  key={item.label}
                  style={[styles.menuItem, i < section.items.length - 1 && styles.menuItemBorder]}
                  onPress={item.onPress}
                  activeOpacity={0.75}
                >
                  <View style={styles.menuIconBox}>
                    <item.icon size={18} color={COLORS.primary} />
                  </View>
                  <Text style={styles.menuLabel}>{item.label}</Text>
                  <ChevronRight size={16} color={COLORS.textSecondary} />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}

        {/* Contact */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Liên hệ TechCare</Text>
          <View style={styles.menuCard}>
            <View style={styles.contactRow}>
              <Ionicons name="call-outline" size={18} color={COLORS.success} />
              <Text style={styles.contactText}>Hotline: 0901 234 567</Text>
            </View>
            <View style={[styles.contactRow, styles.menuItemBorder]}>
              <Ionicons name="location-outline" size={18} color={COLORS.primary} />
              <Text style={styles.contactText}>123 Nguyễn Văn Linh, Đà Nẵng</Text>
            </View>
            <View style={styles.contactRow}>
              <Ionicons name="time-outline" size={18} color="#F59E0B" />
              <Text style={styles.contactText}>7:30 – 20:00, Tất cả các ngày</Text>
            </View>
          </View>
        </View>

        {/* Logout */}
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout} activeOpacity={0.8}>
          <LogOut size={18} color={COLORS.danger} />
          <Text style={styles.logoutText}>Đăng xuất</Text>
        </TouchableOpacity>

        <Text style={styles.version}>TechCare v1.0.0</Text>
      </ScrollView>

      <ChangePasswordModal visible={showChangePass} onClose={() => setShowChangePass(false)} />
      <RatingModal visible={showRating} onClose={() => setShowRating(false)} />
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  header: { paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm },
  headerTitle: { fontSize: 22, fontWeight: '800', color: COLORS.text },
  profileCard: {
    flexDirection: 'row', alignItems: 'center', gap: 16,
    marginHorizontal: SPACING.md, backgroundColor: COLORS.surface,
    borderRadius: 20, padding: SPACING.md, marginBottom: SPACING.md,
    borderWidth: 1, borderColor: COLORS.border,
  },
  avatarCircle: {
    width: 60, height: 60, borderRadius: 30,
    backgroundColor: COLORS.primary, alignItems: 'center', justifyContent: 'center',
  },
  avatarText: { fontSize: 22, fontWeight: '800', color: '#fff' },
  profileInfo: { flex: 1 },
  profileName: { fontSize: 17, fontWeight: '800', color: COLORS.text, marginBottom: 3 },
  profileEmail: { fontSize: 13, color: COLORS.textSecondary, marginBottom: 6 },
  rolePill: {
    alignSelf: 'flex-start', backgroundColor: '#1D4ED820',
    borderRadius: 8, paddingHorizontal: 10, paddingVertical: 3,
  },
  roleText: { fontSize: 11, color: COLORS.primary, fontWeight: '700' },
  statsRow: {
    flexDirection: 'row', marginHorizontal: SPACING.md,
    backgroundColor: COLORS.surface, borderRadius: 16,
    marginBottom: SPACING.md, borderWidth: 1, borderColor: COLORS.border,
    overflow: 'hidden',
  },
  statCard: { flex: 1, alignItems: 'center', paddingVertical: 16 },
  statCardMiddle: { borderLeftWidth: 1, borderRightWidth: 1, borderColor: COLORS.border },
  statValue: { fontSize: 22, fontWeight: '900', color: COLORS.primary, marginBottom: 4 },
  statLabel: { fontSize: 11, color: COLORS.textSecondary },
  ctaCard: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    marginHorizontal: SPACING.md, backgroundColor: COLORS.surface,
    borderRadius: 16, padding: SPACING.md, marginBottom: SPACING.md,
    borderWidth: 1, borderColor: COLORS.primary + '40',
  },
  ctaLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  ctaIcon: {
    width: 44, height: 44, borderRadius: 12,
    backgroundColor: '#1D4ED820', alignItems: 'center', justifyContent: 'center',
  },
  ctaTitle: { fontSize: 14, fontWeight: '700', color: COLORS.text, marginBottom: 3 },
  ctaSub: { fontSize: 12, color: COLORS.textSecondary },
  section: { marginHorizontal: SPACING.md, marginBottom: SPACING.md },
  sectionTitle: {
    fontSize: 13, fontWeight: '700', color: COLORS.textSecondary,
    marginBottom: SPACING.sm, textTransform: 'uppercase', letterSpacing: 0.5,
  },
  menuCard: {
    backgroundColor: COLORS.surface, borderRadius: 16,
    borderWidth: 1, borderColor: COLORS.border, overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingHorizontal: SPACING.md, paddingVertical: 14,
  },
  menuItemBorder: { borderBottomWidth: 1, borderBottomColor: COLORS.border },
  menuIconBox: {
    width: 36, height: 36, borderRadius: 10,
    backgroundColor: '#1D4ED815', alignItems: 'center', justifyContent: 'center',
  },
  menuLabel: { flex: 1, fontSize: 15, color: COLORS.text, fontWeight: '500' },
  contactRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingHorizontal: SPACING.md, paddingVertical: 13,
    borderBottomWidth: 1, borderBottomColor: COLORS.border,
  },
  contactText: { fontSize: 14, color: COLORS.text },
  logoutBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    marginHorizontal: SPACING.md, height: 52, borderRadius: 14,
    borderWidth: 1, borderColor: COLORS.danger + '50',
    backgroundColor: '#EF444415', marginBottom: SPACING.md,
  },
  logoutText: { fontSize: 15, fontWeight: '700', color: COLORS.danger },
  version: { textAlign: 'center', fontSize: 12, color: COLORS.textSecondary, marginBottom: 8 },
});

const modal = StyleSheet.create({
  overlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: COLORS.surface, borderTopLeftRadius: 24, borderTopRightRadius: 24,
    padding: SPACING.md, paddingTop: 12,
  },
  handle: {
    width: 40, height: 4, borderRadius: 2, backgroundColor: COLORS.border,
    alignSelf: 'center', marginBottom: 16,
  },
  title: { fontSize: 18, fontWeight: '800', color: COLORS.text, marginBottom: 4 },
  subtitle: { fontSize: 13, color: COLORS.textSecondary, marginBottom: 20 },
  label: { fontSize: 13, fontWeight: '600', color: COLORS.textSecondary, marginBottom: 6 },
  inputRow: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: COLORS.background, borderRadius: 12,
    borderWidth: 1, borderColor: COLORS.border, marginBottom: 14,
  },
  input: {
    flex: 1, color: COLORS.text, fontSize: 15,
    paddingHorizontal: SPACING.md, paddingVertical: 12,
  },
  eyeBtn: { paddingHorizontal: 12 },
  btnRow: { flexDirection: 'row', gap: 12, marginTop: 8 },
  cancelBtn: {
    flex: 1, height: 48, borderRadius: 12, borderWidth: 1,
    borderColor: COLORS.border, alignItems: 'center', justifyContent: 'center',
  },
  cancelText: { fontSize: 15, color: COLORS.textSecondary, fontWeight: '600' },
  submitBtn: {
    flex: 2, height: 48, borderRadius: 12,
    backgroundColor: COLORS.primary, alignItems: 'center', justifyContent: 'center',
  },
  submitText: { fontSize: 15, color: '#fff', fontWeight: '700' },
});

const rating_s = StyleSheet.create({
  chip: {
    paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20,
    backgroundColor: COLORS.background, borderWidth: 1, borderColor: COLORS.border,
    marginRight: 8,
  },
  chipActive: { backgroundColor: COLORS.primary + '20', borderColor: COLORS.primary },
  chipText: { fontSize: 13, color: COLORS.textSecondary, fontWeight: '500' },
  chipTextActive: { color: COLORS.primary, fontWeight: '700' },
  starsRow: { flexDirection: 'row', gap: 8, marginBottom: 8 },
  ratingLabel: { fontSize: 14, color: '#F59E0B', fontWeight: '700', marginBottom: 16 },
  commentBox: {
    backgroundColor: COLORS.background, borderRadius: 12,
    borderWidth: 1, borderColor: COLORS.border,
    color: COLORS.text, fontSize: 14, padding: SPACING.md,
    textAlignVertical: 'top', minHeight: 80, marginBottom: 16,
  },
  successIcon: { marginBottom: 12 },
  successTitle: { fontSize: 20, fontWeight: '800', color: COLORS.text, marginBottom: 6 },
  successSub: { fontSize: 14, color: COLORS.textSecondary, textAlign: 'center', marginBottom: 24, lineHeight: 20 },
});
