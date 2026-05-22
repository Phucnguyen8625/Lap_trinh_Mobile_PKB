import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { COLORS, SPACING, SIZES } from '../../theme/theme';
import { useData } from '../../context/DataContext';
import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';
import { ArrowLeft, User, Phone, Cpu, Tag, ShieldCheck, FileText } from 'lucide-react-native';

const ReceptionFormScreen = ({ navigation }) => {
  const { addReception } = useData();
  const [formData, setFormData] = useState({
    customerName: '',
    phoneNumber: '',
    deviceModel: '',
    serialNumber: '',
    warranty: 'Còn bảo hành',
    accessories: '',
    faultDescription: ''
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    let newErrors = {};
    if (!formData.customerName) newErrors.customerName = 'Vui lòng nhập tên khách hàng';
    if (!formData.phoneNumber) newErrors.phoneNumber = 'Vui lòng nhập số điện thoại';
    if (!formData.deviceModel) newErrors.deviceModel = 'Vui lòng nhập model máy';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) {
      addReception(formData);
      Alert.alert('Thành công', 'Đã thêm phiếu tiếp nhận mới', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <ArrowLeft size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Tiếp Nhận Thiết Bị</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.sectionTitle}>Thông tin khách hàng</Text>
        <CustomInput
          label="Tên khách hàng *"
          placeholder="Ví dụ: Nguyễn Văn A"
          value={formData.customerName}
          onChangeText={(text) => setFormData({...formData, customerName: text})}
          icon={User}
          error={errors.customerName}
        />
        <CustomInput
          label="Số điện thoại *"
          placeholder="Ví dụ: 090xxxxxxx"
          value={formData.phoneNumber}
          onChangeText={(text) => setFormData({...formData, phoneNumber: text})}
          icon={Phone}
          keyboardType="phone-pad"
          error={errors.phoneNumber}
        />

        <Text style={[styles.sectionTitle, { marginTop: SPACING.md }]}>Thông tin thiết bị</Text>
        <CustomInput
          label="Model máy *"
          placeholder="Ví dụ: Dell XPS 13"
          value={formData.deviceModel}
          onChangeText={(text) => setFormData({...formData, deviceModel: text})}
          icon={Cpu}
          error={errors.deviceModel}
        />
        <CustomInput
          label="Số Serial / Service Tag"
          placeholder="Nhập số serial máy"
          value={formData.serialNumber}
          onChangeText={(text) => setFormData({...formData, serialNumber: text})}
          icon={Tag}
        />

        <View style={styles.warrantyContainer}>
          <Text style={styles.fieldLabel}>Tình trạng bảo hành</Text>
          <View style={styles.warrantyButtons}>
            {['Còn bảo hành', 'Hết bảo hành'].map((option) => (
              <TouchableOpacity
                key={option}
                style={[
                  styles.warrantyButton,
                  formData.warranty === option && styles.warrantyButtonActive
                ]}
                onPress={() => setFormData({...formData, warranty: option})}
              >
                <Text style={[
                  styles.warrantyButtonText,
                  formData.warranty === option && styles.warrantyButtonTextActive
                ]}>{option}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <CustomInput
          label="Phụ kiện đi kèm"
          placeholder="Sạc, túi, chuột..."
          value={formData.accessories}
          onChangeText={(text) => setFormData({...formData, accessories: text})}
          icon={ShieldCheck}
        />

        <CustomInput
          label="Mô tả lỗi ban đầu"
          placeholder="Mô tả tình trạng máy khi nhận..."
          value={formData.faultDescription}
          onChangeText={(text) => setFormData({...formData, faultDescription: text})}
          icon={FileText}
          multiline
          numberOfLines={4}
          style={{ height: 100, textAlignVertical: 'top' }}
        />

        <CustomButton
          title="Lưu Phiếu Tiếp Nhận"
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
  sectionTitle: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: SPACING.md,
    textTransform: 'uppercase',
  },
  warrantyContainer: {
    marginBottom: SPACING.lg,
  },
  fieldLabel: {
    color: COLORS.textSecondary,
    fontSize: 12,
    marginBottom: SPACING.sm,
    marginLeft: 4,
  },
  warrantyButtons: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  warrantyButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    backgroundColor: COLORS.card,
  },
  warrantyButtonActive: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary + '10',
  },
  warrantyButtonText: {
    color: COLORS.textSecondary,
    fontSize: 14,
    fontWeight: '600',
  },
  warrantyButtonTextActive: {
    color: COLORS.primary,
  },
  submitButton: {
    marginTop: SPACING.xl,
    marginBottom: SPACING.xl,
  }
});

export default ReceptionFormScreen;
