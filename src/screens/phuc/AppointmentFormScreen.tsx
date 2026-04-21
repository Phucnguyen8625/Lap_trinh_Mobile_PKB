import React, { useState } from 'react';
import { 
    View, 
    Text, 
    StyleSheet, 
    TextInput, 
    TouchableOpacity, 
    ScrollView, 
    Alert,
    SafeAreaView,
    Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES } from '../../theme/theme';
import apiClient from '../../api/apiClient';

const AppointmentFormScreen = ({ navigation }: any) => {
    const [customerId, setCustomerId] = useState('');
    const [serviceType, setServiceType] = useState('Sửa chữa');
    const [description, setDescription] = useState('');
    const [note, setNote] = useState('');
    // Ngày hẹn mặc định là ngày mai
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const [dateStr, setDateStr] = useState(
        tomorrow.toISOString().split('T')[0]  // YYYY-MM-DD
    );
    const [timeStr, setTimeStr] = useState('09:00');
    const [loading, setLoading] = useState(false);

    const handleCreate = async () => {
        if (!customerId || !serviceType) {
            Alert.alert('Lỗi', 'Vui lòng nhập Mã khách hàng và Loại dịch vụ');
            return;
        }
        if (!dateStr.match(/^\d{4}-\d{2}-\d{2}$/)) {
            Alert.alert('Lỗi', 'Ngày hẹn phải đúng định dạng YYYY-MM-DD (ví dụ: 2026-05-01)');
            return;
        }

        const appointmentDate = `${dateStr}T${timeStr}:00.000Z`;

        setLoading(true);
        try {
            await apiClient.post('/api/appointments', {
                customerId: parseInt(customerId),
                serviceType,
                description,
                note,
                appointmentDate,
                status: 'Pending'
            });
            Alert.alert('Thành công', 'Đã tạo lịch hẹn mới');
            navigation.goBack();
        } catch (error: any) {
            Alert.alert('Lỗi', 'Không thể tạo lịch hẹn: ' + (error.response?.data?.message || error.message));
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color={COLORS.primary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Tạo Lịch hẹn mới</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView contentContainerStyle={styles.formContent}>
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Mã Khách hàng (ID) *</Text>
                    <TextInput 
                        style={styles.input}
                        placeholder="Ví dụ: 1"
                        keyboardType="numeric"
                        value={customerId}
                        onChangeText={setCustomerId}
                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Loại dịch vụ *</Text>
                    <View style={styles.typeRow}>
                        {['Sửa chữa', 'Bảo hành', 'Kiểm tra'].map((type) => (
                            <TouchableOpacity 
                                key={type}
                                style={[styles.typeButton, serviceType === type && styles.typeButtonActive]}
                                onPress={() => setServiceType(type)}
                            >
                                <Text style={[styles.typeButtonText, serviceType === type && styles.typeButtonTextActive]}>
                                    {type}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Mô tả tình trạng máy</Text>
                    <TextInput 
                        style={[styles.input, styles.textArea]}
                        placeholder="Ví dụ: Máy không lên nguồn, vỡ màn hình..."
                        multiline
                        numberOfLines={3}
                        value={description}
                        onChangeText={setDescription}
                    />
                </View>

                {/* Trường mới: Ghi chú tiếp nhận */}
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Ghi chú tiếp nhận</Text>
                    <TextInput 
                        style={[styles.input, styles.textArea]}
                        placeholder="Ghi chú nội bộ khi tiếp nhận lịch hẹn..."
                        multiline
                        numberOfLines={2}
                        value={note}
                        onChangeText={setNote}
                    />
                </View>

                {/* Trường mới: Ngày và giờ hẹn */}
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Ngày hẹn (YYYY-MM-DD) *</Text>
                    <TextInput 
                        style={styles.input}
                        placeholder="2026-05-01"
                        value={dateStr}
                        onChangeText={setDateStr}
                        keyboardType="numbers-and-punctuation"
                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Giờ hẹn (HH:MM)</Text>
                    <View style={styles.typeRow}>
                        {['08:00', '09:00', '10:00', '13:00', '14:00', '15:00'].map((t) => (
                            <TouchableOpacity
                                key={t}
                                style={[styles.timeButton, timeStr === t && styles.typeButtonActive]}
                                onPress={() => setTimeStr(t)}
                            >
                                <Text style={[styles.timeButtonText, timeStr === t && styles.typeButtonTextActive]}>{t}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                <TouchableOpacity 
                    style={[styles.submitButton, loading && { opacity: 0.7 }]}
                    onPress={handleCreate}
                    disabled={loading}
                >
                    <Text style={styles.submitButtonText}>
                        {loading ? 'Đang tạo...' : '✓ Xác nhận tạo lịch'}
                    </Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: SIZES.padding, backgroundColor: COLORS.surface },
    headerTitle: { fontSize: 20, fontWeight: 'bold', color: COLORS.primary },
    formContent: { padding: SIZES.padding },
    inputGroup: { marginBottom: 20 },
    label: { fontSize: 16, fontWeight: '600', color: COLORS.secondary, marginBottom: 8 },
    input: { backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border, borderRadius: 8, padding: 12, fontSize: 16 },
    textArea: { height: 80, textAlignVertical: 'top' },
    typeRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
    typeButton: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 8, borderWidth: 1, borderColor: COLORS.border, alignItems: 'center', backgroundColor: COLORS.surface },
    typeButtonActive: { backgroundColor: COLORS.accent, borderColor: COLORS.accent },
    typeButtonText: { color: COLORS.textMuted, fontWeight: '600' },
    typeButtonTextActive: { color: COLORS.surface },
    timeButton: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, borderWidth: 1, borderColor: COLORS.border, backgroundColor: COLORS.surface },
    timeButtonText: { color: COLORS.textMuted, fontSize: 14, fontWeight: '500' },
    submitButton: { backgroundColor: COLORS.accent, paddingVertical: 16, borderRadius: 8, alignItems: 'center', marginTop: 20 },
    submitButtonText: { color: COLORS.surface, fontSize: 18, fontWeight: 'bold' }
});

export default AppointmentFormScreen;
