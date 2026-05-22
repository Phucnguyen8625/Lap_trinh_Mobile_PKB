import React, { useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  StatusBar, FlatList, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import {
  Laptop, Smartphone, Tablet, Monitor, Settings, Wrench, Shield,
  CalendarPlus, Search, Clock, ChevronRight, Star, Zap,
} from 'lucide-react-native';
import { useFocusEffect } from '@react-navigation/native';
import { COLORS, SPACING, SIZES } from '../../theme/theme';
import { useAuth } from '../../context/AuthContext';
import apiClient from '../../api/apiClient';

const ICON_MAP: Record<string, any> = {
  'laptop': Laptop, 'smartphone': Smartphone, 'tablet': Tablet,
  'monitor': Monitor, 'settings': Settings, 'shield-check': Shield, 'wrench': Wrench,
};

const WHY_US = [
  { Icon: Star,   title: 'Kỹ thuật viên giỏi', desc: 'Được đào tạo chuyên sâu, nhiều năm kinh nghiệm' },
  { Icon: Shield, title: 'Bảo hành rõ ràng',    desc: 'Cam kết bảo hành 3-6 tháng sau sửa chữa' },
  { Icon: Zap,    title: 'Xử lý nhanh',          desc: 'Hầu hết đơn hàng hoàn thành trong ngày' },
];

export default function HomeScreen({ navigation }: any) {
  const { user } = useAuth();
  const firstName = user?.name?.split(' ').pop() || 'bạn';

  const [banners, setBanners] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [featured, setFeatured] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(useCallback(() => {
    Promise.all([
      apiClient.get('/api/banners'),
      apiClient.get('/api/service-categories'),
      apiClient.get('/api/services'),
    ])
      .then(([banRes, catRes, svcRes]) => {
        setBanners(banRes.data);
        setCategories(catRes.data.slice(0, 6));
        setFeatured(svcRes.data.filter((s: any) => s.isFeatured).slice(0, 6));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []));

  const renderCategory = ({ item }: any) => {
    const IconComp = ICON_MAP[item.icon] || Wrench;
    return (
      <TouchableOpacity
        style={styles.categoryItem}
        onPress={() => navigation.navigate('ServiceCatalog', { category: item.name })}
        activeOpacity={0.75}
      >
        <View style={[styles.categoryIcon, { borderColor: item.colorHex + '40' }]}>
          <IconComp size={26} color={item.colorHex || COLORS.primary} />
        </View>
        <Text style={styles.categoryLabel}>{item.name}</Text>
      </TouchableOpacity>
    );
  };

  const renderFeatured = ({ item }: any) => (
    <TouchableOpacity
      style={styles.featuredCard}
      onPress={() => navigation.navigate('ServiceCatalog')}
      activeOpacity={0.8}
    >
      {item.isFeatured && (
        <View style={styles.featuredTag}>
          <Text style={styles.featuredTagText}>Phổ biến</Text>
        </View>
      )}
      <Text style={styles.featuredName}>{item.name}</Text>
      <Text style={styles.featuredPrice}>
        Từ {(item.priceMin / 1000).toFixed(0)}k
      </Text>
    </TouchableOpacity>
  );

  const renderBanner = ({ item }: any) => (
    <LinearGradient
      colors={[item.colorFrom || '#1D4ED8', item.colorTo || '#3B82F6']}
      start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
      style={styles.bannerCard}
    >
      <Text style={styles.heroTitle}>{item.title}</Text>
      <Text style={styles.heroSub}>{item.subtitle}</Text>
      <TouchableOpacity
        style={styles.heroBtn}
        onPress={() => navigation.navigate('Đặt lịch')}
        activeOpacity={0.85}
      >
        <Text style={styles.heroBtnText}>Đặt lịch ngay</Text>
        <Ionicons name="arrow-forward" size={16} color={COLORS.primary} />
      </TouchableOpacity>
    </LinearGradient>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <View style={styles.header}>
          <View>
            <Text style={styles.headerBrand}>TechCare</Text>
            <Text style={styles.headerGreeting}>Xin chào, {firstName}</Text>
          </View>
        </View>
        <ActivityIndicator size="large" color={COLORS.primary} style={{ flex: 1 }} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />

      <View style={styles.header}>
        <View>
          <Text style={styles.headerBrand}>TechCare</Text>
          <Text style={styles.headerGreeting}>Xin chào, {firstName}</Text>
        </View>
        <TouchableOpacity style={styles.headerIcon}>
          <Ionicons name="notifications-outline" size={24} color={COLORS.text} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 32 }}>

        {/* Banners từ DB */}
        {banners.length > 0 ? (
          <FlatList
            data={banners}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderBanner}
            contentContainerStyle={{ paddingHorizontal: SPACING.md, gap: SPACING.md }}
            style={{ marginBottom: SPACING.md }}
          />
        ) : (
          <LinearGradient
            colors={['#1D4ED8', '#3B82F6', '#60A5FA']}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
            style={[styles.bannerCard, { marginHorizontal: SPACING.md }]}
          >
            <Text style={styles.heroTitle}>Sửa chữa thiết bị{'\n'}chuyên nghiệp</Text>
            <Text style={styles.heroSub}>Nhanh chóng · Bảo hành · Uy tín</Text>
            <TouchableOpacity
              style={styles.heroBtn}
              onPress={() => navigation.navigate('Đặt lịch')}
              activeOpacity={0.85}
            >
              <Text style={styles.heroBtnText}>Đặt lịch ngay</Text>
              <Ionicons name="arrow-forward" size={16} color={COLORS.primary} />
            </TouchableOpacity>
          </LinearGradient>
        )}

        {/* Quick Actions */}
        <View style={styles.section}>
          <View style={styles.quickRow}>
            <TouchableOpacity style={styles.quickCard} onPress={() => navigation.navigate('Đặt lịch')} activeOpacity={0.8}>
              <View style={[styles.quickIcon, { backgroundColor: '#1D4ED820' }]}>
                <CalendarPlus size={24} color={COLORS.primary} />
              </View>
              <Text style={styles.quickLabel}>Đặt lịch</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickCard} onPress={() => navigation.navigate('Tra cứu')} activeOpacity={0.8}>
              <View style={[styles.quickIcon, { backgroundColor: '#10B98120' }]}>
                <Search size={24} color={COLORS.success} />
              </View>
              <Text style={styles.quickLabel}>Tra cứu đơn</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickCard} onPress={() => navigation.navigate('Hồ sơ')} activeOpacity={0.8}>
              <View style={[styles.quickIcon, { backgroundColor: '#F59E0B20' }]}>
                <Clock size={24} color="#F59E0B" />
              </View>
              <Text style={styles.quickLabel}>Lịch sử</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Danh mục dịch vụ từ DB */}
        {categories.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Danh mục dịch vụ</Text>
              <TouchableOpacity onPress={() => navigation.navigate('ServiceCatalog')}>
                <Text style={styles.seeAll}>Xem tất cả</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={categories}
              renderItem={renderCategory}
              keyExtractor={(item) => item.id.toString()}
              numColumns={3}
              scrollEnabled={false}
              columnWrapperStyle={styles.categoryRow}
            />
          </View>
        )}

        {/* Dịch vụ nổi bật từ DB */}
        {featured.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Dịch vụ nổi bật</Text>
              <TouchableOpacity onPress={() => navigation.navigate('ServiceCatalog')}>
                <Text style={styles.seeAll}>Xem tất cả</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={featured}
              renderItem={renderFeatured}
              keyExtractor={(item) => item.id.toString()}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: SPACING.md }}
            />
          </View>
        )}

        {/* Tại sao chọn TechCare */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tại sao chọn TechCare?</Text>
          {WHY_US.map(({ Icon, title, desc }, i) => (
            <View key={i} style={styles.whyRow}>
              <View style={styles.whyIcon}>
                <Icon size={20} color={COLORS.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.whyTitle}>{title}</Text>
                <Text style={styles.whyDesc}>{desc}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* CTA Banner */}
        <TouchableOpacity
          style={styles.ctaBanner}
          onPress={() => navigation.navigate('Đặt lịch')}
          activeOpacity={0.85}
        >
          <View>
            <Text style={styles.ctaTitle}>Thiết bị đang gặp sự cố?</Text>
            <Text style={styles.ctaSub}>Đặt lịch ngay, kỹ thuật viên sẽ liên hệ bạn sớm nhất</Text>
          </View>
          <ChevronRight size={20} color={COLORS.primary} />
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm,
  },
  headerBrand: { fontSize: 22, fontWeight: '800', color: COLORS.primary, letterSpacing: 0.5 },
  headerGreeting: { fontSize: 13, color: COLORS.textSecondary, marginTop: 2 },
  headerIcon: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: COLORS.surface, alignItems: 'center', justifyContent: 'center',
  },
  bannerCard: {
    width: 300, borderRadius: 20, padding: SPACING.lg,
    marginBottom: SPACING.md,
  },
  heroTitle: { fontSize: 22, fontWeight: '800', color: '#fff', lineHeight: 30 },
  heroSub: { fontSize: 13, color: 'rgba(255,255,255,0.85)', marginTop: 6, marginBottom: 16 },
  heroBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: '#fff', paddingHorizontal: 20, paddingVertical: 10,
    borderRadius: 10, alignSelf: 'flex-start',
  },
  heroBtnText: { fontSize: 14, fontWeight: '700', color: COLORS.primary },
  section: { marginBottom: SPACING.md },
  sectionHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: SPACING.md, marginBottom: SPACING.sm,
  },
  sectionTitle: { fontSize: 17, fontWeight: '700', color: COLORS.text, paddingHorizontal: SPACING.md, marginBottom: SPACING.sm },
  seeAll: { fontSize: 13, color: COLORS.primary, fontWeight: '600' },
  quickRow: { flexDirection: 'row', justifyContent: 'space-around', paddingHorizontal: SPACING.md },
  quickCard: { alignItems: 'center', gap: 6 },
  quickIcon: { width: 56, height: 56, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  quickLabel: { fontSize: 12, color: COLORS.textSecondary, fontWeight: '600' },
  categoryRow: { justifyContent: 'space-around', paddingHorizontal: SPACING.md, marginBottom: SPACING.sm },
  categoryItem: { alignItems: 'center', width: '30%' },
  categoryIcon: {
    width: 60, height: 60, borderRadius: 16,
    backgroundColor: COLORS.surface, alignItems: 'center', justifyContent: 'center',
    marginBottom: 6, borderWidth: 1,
  },
  categoryLabel: { fontSize: 11, color: COLORS.textSecondary, fontWeight: '600', textAlign: 'center' },
  featuredCard: {
    width: 140, backgroundColor: COLORS.surface, borderRadius: 16,
    padding: SPACING.md, marginRight: SPACING.sm,
    borderWidth: 1, borderColor: COLORS.border,
  },
  featuredTag: {
    backgroundColor: '#1D4ED820', borderRadius: 6, paddingHorizontal: 8,
    paddingVertical: 3, alignSelf: 'flex-start', marginBottom: 8,
  },
  featuredTagText: { fontSize: 10, color: COLORS.primary, fontWeight: '700' },
  featuredName: { fontSize: 13, fontWeight: '700', color: COLORS.text, marginBottom: 4 },
  featuredPrice: { fontSize: 12, color: COLORS.success, fontWeight: '600' },
  whyRow: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 12,
    marginHorizontal: SPACING.md, marginBottom: SPACING.sm,
    backgroundColor: COLORS.surface, borderRadius: 14, padding: SPACING.md,
    borderWidth: 1, borderColor: COLORS.border,
  },
  whyIcon: {
    width: 40, height: 40, borderRadius: 12,
    backgroundColor: '#1D4ED820', alignItems: 'center', justifyContent: 'center',
  },
  whyTitle: { fontSize: 14, fontWeight: '700', color: COLORS.text, marginBottom: 3 },
  whyDesc: { fontSize: 12, color: COLORS.textSecondary, lineHeight: 18 },
  ctaBanner: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    marginHorizontal: SPACING.md, backgroundColor: COLORS.surface,
    borderRadius: 16, padding: SPACING.md,
    borderWidth: 1, borderColor: COLORS.primary + '40',
  },
  ctaTitle: { fontSize: 14, fontWeight: '700', color: COLORS.text, marginBottom: 4 },
  ctaSub: { fontSize: 12, color: COLORS.textSecondary, lineHeight: 18, maxWidth: 260 },
});
