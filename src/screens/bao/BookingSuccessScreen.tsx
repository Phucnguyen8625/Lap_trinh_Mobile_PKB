import React from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { CheckCircle, Calendar, Clock, Wrench } from 'lucide-react-native';
import { COLORS, SPACING } from '../../theme/theme';

export default function BookingSuccessScreen({ navigation, route }: any) {
  const { bookingCode, serviceType, date, timeSlot, deviceType, brand, model } = route.params || {};

  const steps = [
    { icon: 'checkmark-circle-outline', label: 'Đặt lịch thành công', done: true },
    { icon: 'call-outline', label: 'KTV sẽ gọi xác nhận (30 phút)', done: false },
    { icon: 'construct-outline', label: 'Tiến hành sửa chữa', done: false },
    { icon: 'gift-outline', label: 'Nhận lại thiết bị', done: false },
  ];

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />

      <View style={styles.container}>
        {/* Success icon */}
        <LinearGradient
          colors={['#10B98120', '#10B98108']}
          style={styles.iconCircle}
        >
          <CheckCircle size={64} color={COLORS.success} />
        </LinearGradient>

        <Text style={styles.title}>Đặt lịch thành công!</Text>
        <Text style={styles.subtitle}>
          Chúng tôi đã nhận yêu cầu của bạn. Kỹ thuật viên sẽ liên hệ xác nhận sớm nhất.
        </Text>

        {/* Booking code */}
        <View style={styles.codeBox}>
          <Text style={styles.codeLabel}>Mã đặt lịch của bạn</Text>
          <Text style={styles.code}>{bookingCode}</Text>
          <Text style={styles.codeSub}>Lưu mã này để tra cứu tình trạng sửa chữa</Text>
        </View>

        {/* Summary */}
        <View style={styles.summary}>
          {serviceType && (
            <View style={styles.summaryRow}>
              <Wrench size={16} color={COLORS.primary} />
              <Text style={styles.summaryLabel}>Dịch vụ</Text>
              <Text style={styles.summaryValue}>{serviceType}</Text>
            </View>
          )}
          {(deviceType || brand) && (
            <View style={styles.summaryRow}>
              <Ionicons name="hardware-chip-outline" size={16} color={COLORS.primary} />
              <Text style={styles.summaryLabel}>Thiết bị</Text>
              <Text style={styles.summaryValue}>{[deviceType, brand, model].filter(Boolean).join(' · ')}</Text>
            </View>
          )}
          {date && (
            <View style={styles.summaryRow}>
              <Calendar size={16} color={COLORS.primary} />
              <Text style={styles.summaryLabel}>Ngày hẹn</Text>
              <Text style={styles.summaryValue}>{date}</Text>
            </View>
          )}
          {timeSlot && (
            <View style={styles.summaryRow}>
              <Clock size={16} color={COLORS.primary} />
              <Text style={styles.summaryLabel}>Giờ hẹn</Text>
              <Text style={styles.summaryValue}>{timeSlot}</Text>
            </View>
          )}
        </View>

        {/* Steps */}
        <View style={styles.steps}>
          {steps.map((step, i) => (
            <View key={i} style={styles.stepRow}>
              <View style={[styles.stepDot, step.done && styles.stepDotDone]}>
                <Ionicons
                  name={step.icon as any}
                  size={14}
                  color={step.done ? '#fff' : COLORS.textSecondary}
                />
              </View>
              {i < steps.length - 1 && (
                <View style={[styles.stepLine, step.done && styles.stepLineDone]} />
              )}
              <Text style={[styles.stepLabel, step.done && styles.stepLabelDone]}>
                {step.label}
              </Text>
            </View>
          ))}
        </View>

        {/* Buttons */}
        <View style={styles.btnRow}>
          <TouchableOpacity
            style={styles.btnSecondary}
            onPress={() => navigation.navigate('Tra cứu')}
            activeOpacity={0.8}
          >
            <Ionicons name="search-outline" size={18} color={COLORS.primary} />
            <Text style={styles.btnSecondaryText}>Tra cứu đơn</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate('Trang chủ')}
            activeOpacity={0.85}
            style={{ flex: 1 }}
          >
            <LinearGradient
              colors={[COLORS.primary, '#1D4ED8']}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
              style={styles.btnPrimary}
            >
              <Ionicons name="home-outline" size={18} color="#fff" />
              <Text style={styles.btnPrimaryText}>Về trang chủ</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  container: {
    flex: 1, alignItems: 'center', paddingHorizontal: SPACING.md,
    paddingTop: SPACING.xl,
  },
  iconCircle: {
    width: 120, height: 120, borderRadius: 60,
    alignItems: 'center', justifyContent: 'center', marginBottom: SPACING.md,
  },
  title: { fontSize: 26, fontWeight: '800', color: COLORS.text, marginBottom: 8 },
  subtitle: {
    fontSize: 14, color: COLORS.textSecondary, textAlign: 'center',
    lineHeight: 20, marginBottom: SPACING.lg, maxWidth: 300,
  },
  codeBox: {
    width: '100%', backgroundColor: COLORS.surface, borderRadius: 16,
    padding: SPACING.md, alignItems: 'center', marginBottom: SPACING.md,
    borderWidth: 2, borderColor: COLORS.success + '50',
    borderStyle: 'dashed',
  },
  codeLabel: { fontSize: 12, color: COLORS.textSecondary, marginBottom: 6 },
  code: { fontSize: 28, fontWeight: '900', color: COLORS.success, letterSpacing: 3 },
  codeSub: { fontSize: 11, color: COLORS.textSecondary, marginTop: 6, textAlign: 'center' },
  summary: {
    width: '100%', backgroundColor: COLORS.surface, borderRadius: 16,
    padding: SPACING.md, marginBottom: SPACING.md,
    borderWidth: 1, borderColor: COLORS.border,
  },
  summaryRow: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: COLORS.border,
  },
  summaryLabel: { fontSize: 13, color: COLORS.textSecondary, width: 70 },
  summaryValue: { fontSize: 13, color: COLORS.text, fontWeight: '600', flex: 1 },
  steps: {
    width: '100%', marginBottom: SPACING.lg,
  },
  stepRow: {
    flexDirection: 'row', alignItems: 'center', marginBottom: 4,
  },
  stepDot: {
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border,
    alignItems: 'center', justifyContent: 'center', marginRight: 12, zIndex: 1,
  },
  stepDotDone: { backgroundColor: COLORS.success, borderColor: COLORS.success },
  stepLine: {
    position: 'absolute', left: 13, top: 28,
    width: 2, height: 20, backgroundColor: COLORS.border,
  },
  stepLineDone: { backgroundColor: COLORS.success },
  stepLabel: { fontSize: 13, color: COLORS.textSecondary },
  stepLabelDone: { color: COLORS.text, fontWeight: '600' },
  btnRow: { flexDirection: 'row', gap: SPACING.sm, width: '100%' },
  btnSecondary: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
    height: 52, borderRadius: 14, borderWidth: 1, borderColor: COLORS.primary,
  },
  btnSecondaryText: { fontSize: 14, fontWeight: '700', color: COLORS.primary },
  btnPrimary: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
    height: 52, borderRadius: 14,
  },
  btnPrimaryText: { fontSize: 14, fontWeight: '700', color: '#fff' },
});
