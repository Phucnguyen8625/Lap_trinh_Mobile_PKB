import React, { useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  TextInput, StatusBar, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Laptop, Smartphone, Tablet, Monitor, Settings, Wrench, Search, Shield } from 'lucide-react-native';
import { COLORS, SPACING, SIZES } from '../../theme/theme';
import apiClient from '../../api/apiClient';

const ICON_MAP: Record<string, any> = {
  'laptop': Laptop,
  'smartphone': Smartphone,
  'tablet': Tablet,
  'monitor': Monitor,
  'settings': Settings,
  'shield-check': Shield,
  'wrench': Wrench,
};

function normalizeService(s: any) {
  const iconName = s.ServiceCategory?.icon || 'wrench';
  return {
    id: s.id,
    name: s.name,
    category: s.ServiceCategory?.name || '',
    categoryIcon: iconName,
    Icon: ICON_MAP[iconName] || Wrench,
    priceFrom: s.priceMin,
    priceTo: s.priceMax,
    desc: s.description || '',
    time: s.durationEst || '',
    warranty: s.warranty || '',
    popular: s.isFeatured || false,
  };
}

function formatPrice(n: number) {
  return n >= 1000000
    ? `${(n / 1000000).toFixed(1).replace('.0', '')}tr`
    : `${Math.round(n / 1000)}k`;
}

export default function ServiceCatalogScreen({ navigation, route }: any) {
  const initCategory = route?.params?.category || 'Tất cả';
  const [selectedCategory, setSelectedCategory] = useState(initCategory);
  const [search, setSearch] = useState('');
  const [services, setServices] = useState<any[]>([]);
  const [categories, setCategories] = useState<string[]>(['Tất cả']);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useFocusEffect(useCallback(() => {
    setLoading(true);
    setError(false);
    Promise.all([
      apiClient.get('/api/services'),
      apiClient.get('/api/service-categories'),
    ])
      .then(([svcRes, catRes]) => {
        setServices(svcRes.data.map(normalizeService));
        setCategories(['Tất cả', ...catRes.data.map((c: any) => c.name)]);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []));

  const filtered = services.filter((s) => {
    const matchCat = selectedCategory === 'Tất cả' || s.category === selectedCategory;
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const renderService = ({ item }: any) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('ServiceDetail', { service: item })}
      activeOpacity={0.8}
    >
      <View style={styles.cardLeft}>
        <View style={styles.iconBox}>
          <item.Icon size={24} color={COLORS.primary} />
        </View>
      </View>
      <View style={styles.cardBody}>
        <View style={styles.cardTitleRow}>
          <Text style={styles.cardName}>{item.name}</Text>
          {item.popular && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>Phổ biến</Text>
            </View>
          )}
        </View>
        <Text style={styles.cardDesc} numberOfLines={2}>{item.desc}</Text>
        <View style={styles.cardMeta}>
          <Text style={styles.cardPrice}>
            {formatPrice(item.priceFrom)} – {formatPrice(item.priceTo)}đ
          </Text>
          <View style={styles.timePill}>
            <Ionicons name="time-outline" size={11} color={COLORS.textSecondary} />
            <Text style={styles.timeText}>{item.time}</Text>
          </View>
        </View>
      </View>
      <Ionicons name="chevron-forward" size={18} color={COLORS.textSecondary} />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Dịch vụ sửa chữa</Text>
        <View style={{ width: 38 }} />
      </View>

      <View style={styles.searchBox}>
        <Search size={18} color={COLORS.textSecondary} />
        <TextInput
          style={styles.searchInput}
          placeholder="Tìm dịch vụ..."
          placeholderTextColor={COLORS.textSecondary}
          value={search}
          onChangeText={setSearch}
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => setSearch('')}>
            <Ionicons name="close-circle" size={18} color={COLORS.textSecondary} />
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={categories}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item}
        contentContainerStyle={styles.chips}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.chip, selectedCategory === item && styles.chipActive]}
            onPress={() => setSelectedCategory(item)}
          >
            <Text style={[styles.chipText, selectedCategory === item && styles.chipTextActive]}>
              {item}
            </Text>
          </TouchableOpacity>
        )}
      />

      {loading ? (
        <ActivityIndicator size="large" color={COLORS.primary} style={styles.loader} />
      ) : error ? (
        <View style={styles.empty}>
          <Ionicons name="cloud-offline-outline" size={56} color={COLORS.danger} />
          <Text style={[styles.emptyText, { color: COLORS.danger }]}>Không kết nối được server</Text>
          <TouchableOpacity
            style={styles.retryBtn}
            onPress={() => {
              setLoading(true); setError(false);
              Promise.all([apiClient.get('/api/services'), apiClient.get('/api/service-categories')])
                .then(([s, c]) => { setServices(s.data.map(normalizeService)); setCategories(['Tất cả', ...c.data.map((x: any) => x.name)]); })
                .catch(() => setError(true)).finally(() => setLoading(false));
            }}
          >
            <Ionicons name="refresh" size={16} color="#fff" />
            <Text style={styles.retryText}>Thử lại</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <Text style={styles.resultCount}>{filtered.length} dịch vụ</Text>
          <FlatList
            data={filtered}
            renderItem={renderService}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={{ paddingHorizontal: SPACING.md, paddingBottom: 24 }}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={styles.empty}>
                <Ionicons name="search-outline" size={48} color={COLORS.border} />
                <Text style={styles.emptyText}>Không tìm thấy dịch vụ phù hợp</Text>
              </View>
            }
          />
        </>
      )}
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
  searchBox: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    marginHorizontal: SPACING.md, marginBottom: SPACING.sm,
    backgroundColor: COLORS.surface, borderRadius: 12, paddingHorizontal: SPACING.md,
    height: 46, borderWidth: 1, borderColor: COLORS.border,
  },
  searchInput: { flex: 1, color: COLORS.text, fontSize: 14 },
  chips: { paddingHorizontal: SPACING.md, paddingBottom: SPACING.sm, gap: 8 },
  chip: {
    paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20,
    backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border,
  },
  chipActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  chipText: { fontSize: 13, color: COLORS.textSecondary, fontWeight: '600' },
  chipTextActive: { color: '#fff' },
  loader: { flex: 1 },
  resultCount: { fontSize: 12, color: COLORS.textSecondary, paddingHorizontal: SPACING.md, marginBottom: SPACING.sm },
  card: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: COLORS.surface, borderRadius: 16, padding: SPACING.md,
    marginBottom: SPACING.sm, borderWidth: 1, borderColor: COLORS.border,
  },
  cardLeft: {},
  iconBox: {
    width: 50, height: 50, borderRadius: 14,
    backgroundColor: '#1D4ED820', alignItems: 'center', justifyContent: 'center',
  },
  cardBody: { flex: 1 },
  cardTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
  cardName: { fontSize: 14, fontWeight: '700', color: COLORS.text, flex: 1 },
  badge: { backgroundColor: '#F59E0B20', borderRadius: 6, paddingHorizontal: 7, paddingVertical: 2 },
  badgeText: { fontSize: 10, color: '#F59E0B', fontWeight: '700' },
  cardDesc: { fontSize: 12, color: COLORS.textSecondary, lineHeight: 17, marginBottom: 6 },
  cardMeta: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  cardPrice: { fontSize: 13, color: COLORS.success, fontWeight: '700' },
  timePill: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  timeText: { fontSize: 11, color: COLORS.textSecondary },
  empty: { alignItems: 'center', paddingTop: 60, gap: 12 },
  emptyText: { fontSize: 14, color: COLORS.textSecondary },
  retryBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: COLORS.primary, paddingHorizontal: 20, paddingVertical: 10, borderRadius: 20,
  },
  retryText: { color: '#fff', fontWeight: 'bold' },
});
