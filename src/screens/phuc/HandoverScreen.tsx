import React, { useState } from 'react';
import {
    View, Text, StyleSheet, TouchableOpacity, ScrollView,
    TextInput, Alert, SafeAreaView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES } from '../../theme/theme';
import apiClient from '../../api/apiClient';

const HandoverScreen = ({ navigation, route }: any) => {
    const { appointmentId, customerName } = route.params;
    const [recipientName, setRecipientName] = useState(customerName || '');
    const [deviceCondition, setDeviceCondition] = useState('');
    const [technicianNote, setTechnicianNote] = useState('');
    const [cost, setCost] = useState('');
    const [loading, setLoading] = useState(false);

    const handleHandover = async () => {
        if (!recipientName || !deviceCondition) {
            Alert.alert('Thiếu thông tin', 'Vui lòng điền đầy đủ tên người nhận và tình trạng máy.');
            return;
        }

        setLoading(true);
        try {
            // Cập nhật trạng thái lịch hẹn thành Đã bàn giao
            await apiClient.patch(`/api/appointments/${appointmentId}/status`, {
                status: 'Đã bàn giao',
                note: `Bàn giao cho: ${recipientName}. Tình trạng: ${deviceCondition}. Ghi chú KTV: ${technicianNote}. Chi phí: ${cost} VNĐ.`
            });
            Alert.alert(
                'Bàn giao thành công! ✅',
                `Đã bàn giao máy cho ${recipientName}`,
                [{ text: 'OK', onPress: () => navigation.popToTop() }]
            );
        } catch (error: any) {
            Alert.alert('Lỗi', 'Không thể thực hiện bàn giao: ' + (error.response?.data?.message || error.message));
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
                <Text style={styles.headerTitle}>Bàn giao Thiết bị</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                {/* Thông báo */}
                <View style={styles.alertBox}>
                    <Ionicons name="checkmark-circle" size={28} color={COLORS.success} />
                    <Text style={styles.alertText}>Thiết bị đã sửa xong, sẵn sàng bàn giao cho khách hàng</Text>
                </View>

                {/* Form bàn giao */}
                <View style={styles.formSection}>
                    <Text style={styles.sectionTitle}>Thông tin Bàn giao</Text>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Tên người nhận máy *</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Nhập tên khách hàng hoặc người được uỷ quyền"
                            value={recipientName}
                            onChangeText={setRecipientName}
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Tình trạng máy khi bàn giao *</Text>
                        <View style={styles.conditionRow}>
                            {['Tốt', 'Khá tốt', 'Còn lỗi nhỏ'].map((cond) => (
                                <TouchableOpacity
                                    key={cond}
                                    style={[styles.conditionButton, deviceCondition === cond && styles.conditionActive]}
                                    onPress={() => setDeviceCondition(cond)}
                                >
                                    <Text style={[styles.conditionText, deviceCondition === cond && styles.conditionTextActive]}>
                                        {cond}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Chi phí sửa chữa (VNĐ)</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Ví dụ: 500000"
                            keyboardType="numeric"
                            value={cost}
                            onChangeText={setCost}
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Ghi chú của kỹ thuật viên</Text>
                        <TextInput
                            style={[styles.input, styles.textArea]}
                            placeholder="Ví dụ: Đã thay main mới, bảo hành 3 tháng..."
                            multiline
                            numberOfLines={4}
                            value={technicianNote}
                            onChangeText={setTechnicianNote}
                        />
                    </View>
                </View>

                <TouchableOpacity
                    style={[styles.handoverButton, loading && { opacity: 0.7 }]}
                    onPress={handleHandover}
                    disabled={loading}
                >
                    <Ionicons name="checkmark-done-circle" size={22} color={COLORS.surface} />
                    <Text style={styles.handoverButtonText}>
                        {loading ? 'Đang xử lý...' : 'Xác nhận Bàn giao'}
                    </Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background },
    header: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
        padding: SIZES.padding, backgroundColor: COLORS.surface,
        borderBottomWidth: 1, borderBottomColor: COLORS.border,
    },
    headerTitle: { fontSize: 20, fontWeight: 'bold', color: COLORS.primary },
    content: { padding: SIZES.padding },
    alertBox: {
        flexDirection: 'row', alignItems: 'center',
        backgroundColor: COLORS.success + '15', padding: 16, borderRadius: 12, marginBottom: 24,
        borderWidth: 1, borderColor: COLORS.success + '40',
    },
    alertText: { flex: 1, marginLeft: 12, color: COLORS.success, fontWeight: '600', fontSize: 15, lineHeight: 22 },
    formSection: {
        backgroundColor: COLORS.surface, borderRadius: SIZES.radius, padding: 20, marginBottom: 24, elevation: 2
    },
    sectionTitle: { fontSize: 17, fontWeight: 'bold', color: COLORS.primary, marginBottom: 20 },
    inputGroup: { marginBottom: 20 },
    label: { fontSize: 15, fontWeight: '600', color: COLORS.secondary, marginBottom: 8 },
    input: {
        backgroundColor: COLORS.background, borderWidth: 1, borderColor: COLORS.border,
        borderRadius: 8, padding: 12, fontSize: 15,
    },
    textArea: { height: 100, textAlignVertical: 'top' },
    conditionRow: { flexDirection: 'row', justifyContent: 'space-between' },
    conditionButton: {
        flex: 0.31, paddingVertical: 10, borderRadius: 8, alignItems: 'center',
        backgroundColor: COLORS.background, borderWidth: 1, borderColor: COLORS.border,
    },
    conditionActive: { backgroundColor: COLORS.success, borderColor: COLORS.success },
    conditionText: { fontSize: 13, color: COLORS.textMuted, fontWeight: '600' },
    conditionTextActive: { color: COLORS.surface },
    handoverButton: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
        backgroundColor: COLORS.success, paddingVertical: 16, borderRadius: 12, elevation: 4,
    },
    handoverButtonText: { color: COLORS.surface, fontSize: 18, fontWeight: 'bold', marginLeft: 10 },
});

export default HandoverScreen;
