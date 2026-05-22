import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { COLORS, SPACING, SIZES } from '../../theme/theme';
import { useData } from '../../context/DataContext';
import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';
import { ArrowLeft, Wrench, DollarSign, FileText, CheckCircle2 } from 'lucide-react-native';

const ServiceFormScreen = ({ route, navigation }) => {
  const { id } = route.params;
  const { getServiceById, updateService } = useData();
  const service = getServiceById(id);

  const [formData, setFormData] = useState({
    serviceName: service?.serviceName || '',
    estimatedPrice: service?.estimatedPrice || '',
    status: service?.status || 'Chờ duyệt',
    approvalStatus: service?.approvalStatus || 'Chờ báo giá',
    technicianNote: service?.technicianNote || ''
  });

  const handleSubmit = () => {
    updateService(id, formData);
    Alert.alert('Thành công', 'Đã cập nhật thông tin dịch vụ', [
      { text: 'OK', onPress: () => navigation.goBack() }
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <ArrowLeft size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Cập Nhật Dịch Vụ</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.idSection}>
          <Text style={styles.idLabel}>Mã dịch vụ:</Text>
          <Text style={styles.idValue}>{id}</Text>
        </View>

        <CustomInput
          label="Tên dịch vụ / Công việc"
          placeholder="Ví dụ: Thay màn hình, Cài Win..."
          value={formData.serviceName}
          onChangeText={(text) => setFormData({...formData, serviceName: text})}
          icon={Wrench}
        />

        <CustomInput
          label="Báo giá (VNĐ)"
          placeholder="Ví dụ: 500.000 VNĐ"
          value={formData.estimatedPrice}
          onChangeText={(text) => setFormData({...formData, estimatedPrice: text})}
          icon={DollarSign}
        />

        <View style={styles.selectionSection}>
          <Text style={styles.fieldLabel}>Trạng thái sửa chữa</Text>
          <View style={styles.buttonGroup}>
            {['Chờ duyệt', 'Đang sửa', 'Hoàn thành', 'Chờ linh kiện'].map((s) => (
              <TouchableOpacity
                key={s}
                style={[styles.smallButton, formData.status === s && styles.buttonActive]}
                onPress={() => setFormData({...formData, status: s})}
              >
                <Text style={[styles.buttonText, formData.status === s && styles.buttonTextActive]}>{s}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.selectionSection}>
          <Text style={styles.fieldLabel}>Trạng thái báo giá</Text>
          <View style={styles.buttonGroup}>
            {['Chờ báo giá', 'Chờ khách xác nhận', 'Đã duyệt', 'Từ chối'].map((s) => (
              <TouchableOpacity
                key={s}
                style={[styles.smallButton, formData.approvalStatus === s && styles.buttonActive]}
                onPress={() => setFormData({...formData, approvalStatus: s})}
              >
                <Text style={[styles.buttonText, formData.approvalStatus === s && styles.buttonTextActive]}>{s}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <CustomInput
          label="Ghi chú kỹ thuật"
          placeholder="Mô tả chi tiết tình trạng sửa chữa..."
          value={formData.technicianNote}
          onChangeText={(text) => setFormData({...formData, technicianNote: text})}
          icon={FileText}
          multiline
          numberOfLines={4}
          style={{ height: 100, textAlignVertical: 'top' }}
        />

        <CustomButton
          title="Cập Nhật Thông Tin"
          onPress={handleSubmit}
          style={styles.submitButton}
        />
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
  idSection: {
    flexDirection: 'row',
    marginBottom: SPACING.lg,
    alignItems: 'center',
    gap: SPACING.sm,
  },
  idLabel: {
    color: COLORS.textSecondary,
    fontSize: 14,
  },
  idValue: {
    color: COLORS.accent,
    fontSize: 16,
    fontWeight: 'bold',
  },
  selectionSection: {
    marginBottom: SPACING.lg,
  },
  fieldLabel: {
    color: COLORS.textSecondary,
    fontSize: 12,
    marginBottom: SPACING.sm,
    marginLeft: 4,
  },
  buttonGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  smallButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.card,
  },
  buttonActive: {
    borderColor: COLORS.accent,
    backgroundColor: COLORS.accent + '10',
  },
  buttonText: {
    color: COLORS.textSecondary,
    fontSize: 12,
    fontWeight: '600',
  },
  buttonTextActive: {
    color: COLORS.accent,
  },
  submitButton: {
    marginTop: SPACING.md,
    marginBottom: SPACING.xl,
  }
});

export default ServiceFormScreen;
