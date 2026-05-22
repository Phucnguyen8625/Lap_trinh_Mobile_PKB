import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { COLORS, SPACING, SIZES } from '../../theme/theme';
import { useData } from '../../context/DataContext';
import { ArrowLeft, Cpu, User, Calendar, Tag, ShieldCheck, ExternalLink } from 'lucide-react-native';

const InfoRow = ({ label, value, icon: Icon }) => (
  <View style={styles.infoRow}>
    <View style={styles.iconBox}>
      <Icon size={18} color={COLORS.textSecondary} />
    </View>
    <View style={styles.infoContent}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  </View>
);

const ReceptionDetailScreen = ({ route, navigation }) => {
  const { id } = route.params;
  const { getReceptionById, getServiceByReceptionId } = useData();
  const reception = getReceptionById(id);
  const service = getServiceByReceptionId(id);

  if (!reception) return null;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <ArrowLeft size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Chi Tiết Tiếp Nhận</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.statusSection}>
          <Text style={styles.recId}>{reception.id}</Text>
          <View style={[styles.statusBadge, { backgroundColor: COLORS.primary + '20' }]}>
            <Text style={[styles.statusText, { color: COLORS.primary }]}>{reception.status}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Thông tin khách hàng</Text>
          <InfoRow label="Tên khách hàng" value={reception.customerName} icon={User} />
          <InfoRow label="Số điện thoại" value={reception.phoneNumber} icon={User} />
          <InfoRow label="Ngày tiếp nhận" value={reception.receivedDate} icon={Calendar} />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Thông tin thiết bị</Text>
          <InfoRow label="Model máy" value={reception.deviceModel} icon={Cpu} />
          <InfoRow label="Số Serial" value={reception.serialNumber} icon={Tag} />
          <InfoRow label="Phụ kiện đi kèm" value={reception.accessories} icon={ShieldCheck} />
          <InfoRow label="Tình trạng bảo hành" value={reception.warranty} icon={ShieldCheck} />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Mô tả lỗi ban đầu</Text>
          <Text style={styles.descriptionText}>{reception.faultDescription}</Text>
        </View>

        {service && (
          <TouchableOpacity 
            style={styles.linkCard}
            onPress={() => navigation.navigate('ServiceDetail', { id: service.id })}
          >
            <View>
              <Text style={styles.linkLabel}>Dịch vụ liên quan</Text>
              <Text style={styles.linkValue}>{service.id} • {service.status}</Text>
            </View>
            <ExternalLink size={20} color={COLORS.primary} />
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerTitle: {
    color: COLORS.text,
    fontSize: SIZES.body,
    fontWeight: 'bold',
  },
  scrollContent: {
    padding: SPACING.lg,
  },
  statusSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xl,
    backgroundColor: COLORS.card,
    padding: SPACING.md,
    borderRadius: SIZES.radius,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  recId: {
    color: COLORS.text,
    fontSize: SIZES.h3,
    fontWeight: 'bold',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  statusText: {
    fontWeight: 'bold',
    fontSize: 12,
  },
  section: {
    marginBottom: SPACING.xl,
  },
  sectionTitle: {
    color: COLORS.textSecondary,
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: SPACING.md,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
    gap: SPACING.md,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: COLORS.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    color: COLORS.textSecondary,
    fontSize: 12,
  },
  infoValue: {
    color: COLORS.text,
    fontSize: SIZES.body,
    fontWeight: '500',
  },
  descriptionText: {
    color: COLORS.text,
    fontSize: SIZES.body,
    lineHeight: 22,
    backgroundColor: COLORS.card,
    padding: SPACING.md,
    borderRadius: SIZES.radius,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  linkCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.secondary,
    padding: SPACING.md,
    borderRadius: SIZES.radius,
    borderWidth: 1,
    borderColor: COLORS.primary,
    marginTop: SPACING.md,
  },
  linkLabel: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: 'bold',
  },
  linkValue: {
    color: COLORS.text,
    fontSize: SIZES.font,
    marginTop: 2,
  }
});

export default ReceptionDetailScreen;
