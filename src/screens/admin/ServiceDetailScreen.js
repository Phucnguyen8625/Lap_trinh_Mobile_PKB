import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { COLORS, SPACING, SIZES } from '../../theme/theme';
import { useData } from '../../context/DataContext';
import { ArrowLeft, Wrench, DollarSign, FileText, CheckCircle2, History, Edit } from 'lucide-react-native';

const DetailItem = ({ label, value, icon: Icon, color }) => (
  <View style={styles.detailItem}>
    <View style={[styles.iconWrapper, { backgroundColor: (color || COLORS.secondary) + '20' }]}>
      <Icon size={20} color={color || COLORS.textSecondary} />
    </View>
    <View style={styles.itemContent}>
      <Text style={styles.itemLabel}>{label}</Text>
      <Text style={styles.itemValue}>{value}</Text>
    </View>
  </View>
);

const ServiceDetailScreen = ({ route, navigation }) => {
  const { id } = route.params;
  const { getServiceById, getReceptionById } = useData();
  const service = getServiceById(id);
  const reception = service ? getReceptionById(service.receptionId) : null;

  if (!service) return null;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <ArrowLeft size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Chi Tiết Dịch Vụ</Text>
        <TouchableOpacity onPress={() => navigation.navigate('ServiceForm', { id: service.id })} style={styles.editButton}>
          <Edit size={20} color={COLORS.accent} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.statusSection}>
          <View style={styles.idBox}>
            <Wrench size={24} color={COLORS.accent} />
            <Text style={styles.serviceId}>{service.id}</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: COLORS.success + '20' }]}>
            <Text style={[styles.statusText, { color: COLORS.success }]}>{service.status}</Text>
          </View>
        </View>

        <View style={styles.card}>
          <DetailItem label="Tên dịch vụ" value={service.serviceName} icon={Wrench} />
          <DetailItem label="Giá dự kiến" value={service.estimatedPrice} icon={DollarSign} color={COLORS.success} />
          <DetailItem label="Trạng thái duyệt" value={service.approvalStatus} icon={CheckCircle2} color={service.approvalStatus === 'Đã duyệt' ? COLORS.success : '#F59E0B'} />
          <DetailItem label="Mã tiếp nhận" value={service.receptionId} icon={FileText} />
          <DetailItem label="Ngày dự kiến hoàn thành" value={service.completionDate} icon={History} />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ghi chú kỹ thuật</Text>
          <View style={styles.noteBox}>
            <Text style={styles.noteText}>{service.technicianNote}</Text>
          </View>
        </View>

        {reception && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Thiết bị liên quan</Text>
            <TouchableOpacity 
              style={styles.deviceCard}
              onPress={() => navigation.navigate('ReceptionDetail', { id: reception.id })}
            >
              <View style={styles.deviceInfo}>
                <Text style={styles.deviceModel}>{reception.deviceModel}</Text>
                <Text style={styles.deviceSerial}>Số SN: {reception.serialNumber}</Text>
              </View>
              <History size={20} color={COLORS.textSecondary} />
            </TouchableOpacity>
          </View>
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
  },
  idBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  serviceId: {
    color: COLORS.text,
    fontSize: SIZES.h2,
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
  card: {
    backgroundColor: COLORS.card,
    borderRadius: SIZES.radius,
    padding: SPACING.md,
    marginBottom: SPACING.xl,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    gap: SPACING.md,
  },
  iconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemContent: {
    flex: 1,
  },
  itemLabel: {
    color: COLORS.textSecondary,
    fontSize: 12,
  },
  itemValue: {
    color: COLORS.text,
    fontSize: SIZES.body,
    fontWeight: '600',
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
  noteBox: {
    backgroundColor: COLORS.card,
    padding: SPACING.md,
    borderRadius: SIZES.radius,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  noteText: {
    color: COLORS.text,
    fontSize: SIZES.body,
    lineHeight: 22,
  },
  deviceCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    padding: SPACING.md,
    borderRadius: SIZES.radius,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  deviceModel: {
    color: COLORS.text,
    fontSize: SIZES.body,
    fontWeight: 'bold',
  },
  deviceSerial: {
    color: COLORS.textSecondary,
    fontSize: 12,
    marginTop: 2,
  }
});

export default ServiceDetailScreen;
