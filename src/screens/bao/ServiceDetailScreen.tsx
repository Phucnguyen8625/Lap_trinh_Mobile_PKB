import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { CheckCircle, Clock, Shield, Star } from 'lucide-react-native';
import { COLORS, SPACING } from '../../theme/theme';

const formatPrice = (n: number) =>
  n.toLocaleString('vi-VN') + 'đ';

export default function ServiceDetailScreen({ navigation, route }: any) {
  const { service } = route.params;

  const features = [
    'Kiểm tra miễn phí trước khi báo giá',
    'Kỹ thuật viên có kinh nghiệm',
    'Bảo hành 3 tháng sau sửa chữa',
    'Linh kiện chính hãng hoặc tương đương',
  ];

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Chi tiết dịch vụ</Text>
        <View style={{ width: 38 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>

        {/* Banner */}
        <LinearGradient
          colors={['#1D4ED8', '#3B82F6']}
          style={styles.banner}
        >
          <View style={styles.bannerIcon}>
            <service.Icon size={48} color="#fff" />
          </View>
          <View style={styles.categoryPill}>
            <Text style={styles.categoryText}>{service.category}</Text>
          </View>
          <Text style={styles.bannerTitle}>{service.name}</Text>
        </LinearGradient>

        {/* Price + Time */}
        <View style={styles.metaRow}>
          <View style={styles.metaCard}>
            <Text style={styles.metaLabel}>Chi phí dự kiến</Text>
            <Text style={styles.metaValue}>{formatPrice(service.priceFrom)}</Text>
            <Text style={styles.metaSub}>đến {formatPrice(service.priceTo)}</Text>
          </View>
          <View style={[styles.metaCard, { borderColor: COLORS.success + '50' }]}>
            <Text style={styles.metaLabel}>Thời gian xử lý</Text>
            <Text style={[styles.metaValue, { color: COLORS.success }]}>{service.time}</Text>
            <Text style={styles.metaSub}>ước tính</Text>
          </View>
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Mô tả dịch vụ</Text>
          <Text style={styles.desc}>{service.desc}</Text>
        </View>

        {/* Features */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Cam kết dịch vụ</Text>
          {features.map((f, i) => (
            <View key={i} style={styles.featureRow}>
              <CheckCircle size={18} color={COLORS.success} />
              <Text style={styles.featureText}>{f}</Text>
            </View>
          ))}
        </View>

        {/* Info cards */}
        <View style={styles.infoRow}>
          <View style={styles.infoCard}>
            <Clock size={20} color={COLORS.primary} />
            <Text style={styles.infoTitle}>Làm việc</Text>
            <Text style={styles.infoSub}>7:30 – 20:00{'\n'}Tất cả các ngày</Text>
          </View>
          <View style={styles.infoCard}>
            <Shield size={20} color={COLORS.success} />
            <Text style={styles.infoTitle}>Bảo hành</Text>
            <Text style={styles.infoSub}>3-6 tháng{'\n'}tùy dịch vụ</Text>
          </View>
          <View style={styles.infoCard}>
            <Star size={20} color="#F59E0B" />
            <Text style={styles.infoTitle}>Đánh giá</Text>
            <Text style={styles.infoSub}>4.8/5 ⭐{'\n'}(200+ đánh giá)</Text>
          </View>
        </View>

      </ScrollView>

      {/* Bottom CTA */}
      <View style={styles.bottomBar}>
        <View style={styles.priceHint}>
          <Text style={styles.priceHintLabel}>Từ</Text>
          <Text style={styles.priceHintValue}>{formatPrice(service.priceFrom)}</Text>
        </View>
        <TouchableOpacity
          style={styles.bookBtn}
          onPress={() => navigation.navigate('Booking', { service })}
          activeOpacity={0.85}
        >
          <LinearGradient
            colors={[COLORS.primary, '#1D4ED8']}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
            style={styles.bookBtnGrad}
          >
            <Text style={styles.bookBtnText}>Đặt lịch ngay</Text>
            <Ionicons name="arrow-forward" size={18} color="#fff" />
          </LinearGradient>
        </TouchableOpacity>
      </View>
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
  banner: {
    margin: SPACING.md, borderRadius: 20, padding: SPACING.xl,
    alignItems: 'center',
  },
  bannerIcon: {
    width: 80, height: 80, borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center',
    marginBottom: SPACING.md,
  },
  categoryPill: {
    backgroundColor: 'rgba(255,255,255,0.25)', borderRadius: 20,
    paddingHorizontal: 12, paddingVertical: 4, marginBottom: 8,
  },
  categoryText: { fontSize: 12, color: '#fff', fontWeight: '600' },
  bannerTitle: { fontSize: 22, fontWeight: '800', color: '#fff', textAlign: 'center' },
  metaRow: { flexDirection: 'row', gap: SPACING.sm, marginHorizontal: SPACING.md, marginBottom: SPACING.md },
  metaCard: {
    flex: 1, backgroundColor: COLORS.surface, borderRadius: 16,
    padding: SPACING.md, alignItems: 'center',
    borderWidth: 1, borderColor: COLORS.primary + '40',
  },
  metaLabel: { fontSize: 11, color: COLORS.textSecondary, marginBottom: 4 },
  metaValue: { fontSize: 18, fontWeight: '800', color: COLORS.primary },
  metaSub: { fontSize: 11, color: COLORS.textSecondary, marginTop: 2, textAlign: 'center' },
  section: { marginHorizontal: SPACING.md, marginBottom: SPACING.md },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: COLORS.text, marginBottom: SPACING.sm },
  desc: { fontSize: 14, color: COLORS.textSecondary, lineHeight: 22 },
  featureRow: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    marginBottom: 10,
  },
  featureText: { fontSize: 14, color: COLORS.text, flex: 1 },
  infoRow: { flexDirection: 'row', gap: SPACING.sm, marginHorizontal: SPACING.md, marginBottom: SPACING.md },
  infoCard: {
    flex: 1, backgroundColor: COLORS.surface, borderRadius: 14,
    padding: SPACING.sm, alignItems: 'center', gap: 6,
    borderWidth: 1, borderColor: COLORS.border,
  },
  infoTitle: { fontSize: 12, fontWeight: '700', color: COLORS.text },
  infoSub: { fontSize: 11, color: COLORS.textSecondary, textAlign: 'center', lineHeight: 16 },
  bottomBar: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    flexDirection: 'row', alignItems: 'center', gap: SPACING.md,
    backgroundColor: COLORS.surface, padding: SPACING.md,
    borderTopWidth: 1, borderTopColor: COLORS.border,
    paddingBottom: 24,
  },
  priceHint: { flex: 1 },
  priceHintLabel: { fontSize: 11, color: COLORS.textSecondary },
  priceHintValue: { fontSize: 18, fontWeight: '800', color: COLORS.primary },
  bookBtn: { flex: 2 },
  bookBtnGrad: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    borderRadius: 14, height: 52,
  },
  bookBtnText: { fontSize: 15, fontWeight: '700', color: '#fff' },
});
