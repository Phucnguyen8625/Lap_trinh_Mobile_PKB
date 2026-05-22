import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  TextInput, StatusBar, Alert, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, SIZES } from '../../theme/theme';
import { useAuth } from '../../context/AuthContext';
import { useBooking } from '../../context/BookingContext';
import apiClient from '../../api/apiClient';

const DEVICE_TYPES = ['Laptop', 'Điện thoại', 'Máy tính bảng', 'Màn hình máy tính', 'Máy tính bàn', 'Khác'];

const SERVICE_BY_DEVICE: Record<string, string[]> = {
  'Laptop': ['Sửa chữa Laptop', 'Vệ sinh Laptop', 'Thay màn hình', 'Thay pin', 'Cài đặt Phần mềm', 'Phục hồi dữ liệu', 'Thay linh kiện', 'Khác'],
  'Điện thoại': ['Sửa chữa Điện thoại', 'Thay màn hình', 'Thay pin', 'Thay linh kiện', 'Phục hồi dữ liệu', 'Khác'],
  'Máy tính bảng': ['Thay màn hình', 'Thay pin', 'Cài đặt Phần mềm', 'Thay linh kiện', 'Phục hồi dữ liệu', 'Khác'],
  'Màn hình máy tính': ['Thay màn hình', 'Thay linh kiện', 'Khác'],
  'Máy tính bàn': ['Cài đặt Phần mềm', 'Phục hồi dữ liệu', 'Thay linh kiện', 'Khác'],
  'Khác': ['Thay linh kiện', 'Cài đặt Phần mềm', 'Phục hồi dữ liệu', 'Khác'],
};
const TIME_SLOTS = ['08:00', '09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00', '17:00'];

// Mã cố định trong mock data để tránh trùng
const RESERVED_CODES = new Set(['TC-001234', 'TC-002567', 'TC-003891']);

function generateUniqueCode(sessionCodes: string[]): string {
  const used = new Set([...RESERVED_CODES, ...sessionCodes]);
  let code: string;
  do {
    const digits = Math.floor(100000 + Math.random() * 900000).toString();
    code = `TC-${digits}`;
  } while (used.has(code));
  return code;
}

function formatDateInput(raw: string): string {
  const digits = raw.replace(/\D/g, '').slice(0, 8);
  if (digits.length <= 2) return digits;
  if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
}

function validateDate(formatted: string): string {
  const parts = formatted.split('/');
  if (parts.length !== 3 || parts[2].length !== 4) return '';
  const [dd, mm, yyyy] = parts.map(Number);
  if (mm < 1 || mm > 12) return 'Tháng không hợp lệ (01–12)';
  const daysInMonth = new Date(yyyy, mm, 0).getDate();
  if (dd < 1 || dd > daysInMonth) return `Ngày không hợp lệ (01–${daysInMonth})`;
  const input = new Date(yyyy, mm - 1, dd);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (input < today) return 'Ngày hẹn phải từ hôm nay trở đi';
  return '';
}

export default function BookingScreen({ navigation, route }: any) {
  const { user } = useAuth();
  const { addBooking, getAllCodes } = useBooking();
  const preService = route?.params?.service;

  const [deviceType, setDeviceType] = useState('');
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [serviceType, setServiceType] = useState(preService?.name || '');

  const availableServices = deviceType ? SERVICE_BY_DEVICE[deviceType] ?? [] : [];

  const handleSelectDevice = (value: string) => {
    setDeviceType(value);
    const services = SERVICE_BY_DEVICE[value] ?? [];
    if (serviceType && !services.includes(serviceType)) setServiceType('');
  };
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [dateError, setDateError] = useState('');
  const [timeSlot, setTimeSlot] = useState('');
  const [loading, setLoading] = useState(false);

  const [showDevicePicker, setShowDevicePicker] = useState(false);
  const [showServicePicker, setShowServicePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const handleDateChange = (text: string) => {
    const formatted = formatDateInput(text);
    setDate(formatted);
    if (formatted.length === 10) {
      setDateError(validateDate(formatted));
    } else if (formatted.length >= 5) {
      const mm = parseInt(formatted.slice(3, 5), 10);
      setDateError(mm < 1 || mm > 12 ? 'Tháng không hợp lệ (01–12)' : '');
    } else {
      setDateError('');
    }
  };

  const isValid = !!(deviceType && brand && serviceType && description && date.length === 10 && !dateError && timeSlot);

  const handleSubmit = async () => {
    if (!isValid) {
      const err = dateError || 'Vui lòng điền đầy đủ các trường bắt buộc (*)';
      Alert.alert('Thiếu thông tin', err);
      return;
    }

    setLoading(true);
    const bookingCode = generateUniqueCode(getAllCodes());
    const deviceInfo = [deviceType, brand, model].filter(Boolean).join(' · ');

    // Lưu vào BookingContext để dùng offline ngay lập tức
    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    const dateStr = `${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')}`;
    addBooking({
      code: bookingCode,
      service: serviceType,
      device: deviceInfo,
      date,
      status: 'Đang chờ',
      timeline: [{ status: 'Đang chờ', time: `${dateStr} ${timeStr}` }],
    });

    // Lưu vào database
    try {
      await apiClient.post('/api/appointments', {
        customerId: user?.customerId || user?.id || 1,
        serviceType,
        appointmentDate: `${date.split('/').reverse().join('-')}T${timeSlot}:00`,
        status: 'Đang chờ',
        description,
        deviceInfo,
        bookingCode,
      });
    } catch {
      // Server chưa chạy — đã lưu local, người dùng vẫn thấy mã
    }

    setLoading(false);
    navigation.navigate('BookingSuccess', {
      bookingCode,
      serviceType,
      date,
      timeSlot,
      deviceType,
      brand,
      model,
    });
  };

  const SectionTitle = ({ title, required }: { title: string; required?: boolean }) => (
    <Text style={styles.sectionTitle}>
      {title}{required && <Text style={{ color: COLORS.danger }}> *</Text>}
    </Text>
  );

  const PickerField = ({
    value, placeholder, onPress,
  }: { value: string; placeholder: string; onPress: () => void }) => (
    <TouchableOpacity style={styles.pickerField} onPress={onPress} activeOpacity={0.8}>
      <Text style={value ? styles.pickerValue : styles.pickerPlaceholder}>
        {value || placeholder}
      </Text>
      <Ionicons name="chevron-down" size={18} color={COLORS.textSecondary} />
    </TouchableOpacity>
  );

  const OptionSheet = ({
    visible, options, onSelect, onClose,
  }: { visible: boolean; options: string[]; onSelect: (v: string) => void; onClose: () => void }) => {
    if (!visible) return null;
    return (
      <View style={styles.sheet}>
        <View style={styles.sheetHeader}>
          <Text style={styles.sheetTitle}>Chọn một tùy chọn</Text>
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="close" size={22} color={COLORS.text} />
          </TouchableOpacity>
        </View>
        {options.map((opt) => (
          <TouchableOpacity
            key={opt}
            style={styles.sheetOption}
            onPress={() => { onSelect(opt); onClose(); }}
          >
            <Text style={styles.sheetOptionText}>{opt}</Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Đặt lịch sửa chữa</Text>
        <View style={{ width: 38 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: SPACING.md, paddingBottom: 32 }}
        keyboardShouldPersistTaps="handled"
      >
        {/* Thông tin thiết bị */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>
            <Ionicons name="hardware-chip-outline" size={16} color={COLORS.primary} />
            {'  '}Thông tin thiết bị
          </Text>

          <SectionTitle title="Loại thiết bị" required />
          <PickerField
            value={deviceType}
            placeholder="Chọn loại thiết bị..."
            onPress={() => setShowDevicePicker(true)}
          />

          <SectionTitle title="Hãng sản xuất" required />
          <TextInput
            style={styles.input}
            placeholder="VD: Apple, Samsung, Dell, HP..."
            placeholderTextColor={COLORS.textSecondary}
            value={brand}
            onChangeText={setBrand}
          />

          <SectionTitle title="Model / Dòng máy" />
          <TextInput
            style={styles.input}
            placeholder="VD: iPhone 13, MacBook Pro 14, Dell XPS..."
            placeholderTextColor={COLORS.textSecondary}
            value={model}
            onChangeText={setModel}
          />
        </View>

        {/* Vấn đề gặp phải */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>
            <Ionicons name="construct-outline" size={16} color={COLORS.primary} />
            {'  '}Vấn đề gặp phải
          </Text>

          <SectionTitle title="Dịch vụ cần" required />
          <PickerField
            value={serviceType}
            placeholder={deviceType ? 'Chọn dịch vụ...' : 'Chọn loại thiết bị trước'}
            onPress={() => { if (deviceType) setShowServicePicker(true); }}
          />

          <SectionTitle title="Mô tả chi tiết lỗi" required />
          <TextInput
            style={[styles.input, styles.textarea]}
            placeholder="Mô tả chi tiết vấn đề bạn đang gặp phải..."
            placeholderTextColor={COLORS.textSecondary}
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        {/* Thời gian hẹn */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>
            <Ionicons name="calendar-outline" size={16} color={COLORS.primary} />
            {'  '}Thời gian hẹn
          </Text>

          <SectionTitle title="Ngày hẹn (DD/MM/YYYY)" required />
          <TextInput
            style={[styles.input, !!dateError && styles.inputError]}
            placeholder="VD: 25/04/2026"
            placeholderTextColor={COLORS.textSecondary}
            value={date}
            onChangeText={handleDateChange}
            keyboardType="numeric"
            maxLength={10}
          />
          {!!dateError && <Text style={styles.errorText}>{dateError}</Text>}

          <SectionTitle title="Giờ hẹn" required />
          <PickerField
            value={timeSlot}
            placeholder="Chọn giờ hẹn..."
            onPress={() => setShowTimePicker(true)}
          />
        </View>

        {/* Note */}
        <View style={styles.noteBox}>
          <Ionicons name="information-circle-outline" size={16} color={COLORS.primary} />
          <Text style={styles.noteText}>
            Sau khi đặt lịch, kỹ thuật viên sẽ gọi xác nhận trong vòng 30 phút. Chi phí cuối cùng phụ thuộc vào tình trạng thực tế của thiết bị.
          </Text>
        </View>

        {/* Submit */}
        <TouchableOpacity onPress={handleSubmit} disabled={loading} activeOpacity={0.85}>
          <LinearGradient
            colors={isValid ? [COLORS.primary, '#1D4ED8'] : [COLORS.border, COLORS.border]}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
            style={styles.submitBtn}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Text style={styles.submitText}>Xác nhận đặt lịch</Text>
                <Ionicons name="checkmark-circle" size={20} color="#fff" />
              </>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>

      {/* Pickers */}
      <OptionSheet
        visible={showDevicePicker}
        options={DEVICE_TYPES}
        onSelect={handleSelectDevice}
        onClose={() => setShowDevicePicker(false)}
      />
      <OptionSheet
        visible={showServicePicker}
        options={availableServices}
        onSelect={setServiceType}
        onClose={() => setShowServicePicker(false)}
      />
      <OptionSheet
        visible={showTimePicker}
        options={TIME_SLOTS}
        onSelect={setTimeSlot}
        onClose={() => setShowTimePicker(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm,
  },
  backBtn: {
    width: 38, height: 38, borderRadius: 12,
    backgroundColor: COLORS.surface, alignItems: 'center', justifyContent: 'center',
  },
  headerTitle: { fontSize: 17, fontWeight: '700', color: COLORS.text },
  card: {
    backgroundColor: COLORS.surface, borderRadius: 16,
    padding: SPACING.md, marginBottom: SPACING.md,
    borderWidth: 1, borderColor: COLORS.border,
  },
  cardTitle: { fontSize: 15, fontWeight: '700', color: COLORS.text, marginBottom: SPACING.md },
  sectionTitle: { fontSize: 13, fontWeight: '600', color: COLORS.textSecondary, marginBottom: 6 },
  input: {
    backgroundColor: COLORS.background, borderRadius: 12, paddingHorizontal: SPACING.md,
    height: 48, color: COLORS.text, fontSize: 14,
    borderWidth: 1, borderColor: COLORS.border, marginBottom: SPACING.md,
  },
  inputError: { borderColor: COLORS.danger, marginBottom: 4 },
  errorText: { fontSize: 12, color: COLORS.danger, marginBottom: SPACING.md, marginLeft: 4 },
  textarea: { height: 100, paddingTop: 12 },
  pickerField: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: COLORS.background, borderRadius: 12, paddingHorizontal: SPACING.md,
    height: 48, borderWidth: 1, borderColor: COLORS.border, marginBottom: SPACING.md,
  },
  pickerValue: { fontSize: 14, color: COLORS.text },
  pickerPlaceholder: { fontSize: 14, color: COLORS.textSecondary },
  noteBox: {
    flexDirection: 'row', gap: 8, alignItems: 'flex-start',
    backgroundColor: '#1D4ED815', borderRadius: 12, padding: SPACING.md,
    marginBottom: SPACING.md, borderWidth: 1, borderColor: COLORS.primary + '30',
  },
  noteText: { fontSize: 12, color: COLORS.textSecondary, lineHeight: 18, flex: 1 },
  submitBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    borderRadius: 14, height: 56,
  },
  submitText: { fontSize: 16, fontWeight: '700', color: '#fff' },
  sheet: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: COLORS.surface, borderTopLeftRadius: 20, borderTopRightRadius: 20,
    padding: SPACING.md, borderTopWidth: 1, borderColor: COLORS.border,
    maxHeight: 400,
  },
  sheetHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    marginBottom: SPACING.md,
  },
  sheetTitle: { fontSize: 16, fontWeight: '700', color: COLORS.text },
  sheetOption: {
    paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: COLORS.border,
  },
  sheetOptionText: { fontSize: 15, color: COLORS.text },
});
