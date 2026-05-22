import React, { useState } from 'react';
import { 
    View, 
    Text, 
    StyleSheet, 
    TouchableOpacity, 
    ScrollView, 
    TextInput,
    Alert,
    SafeAreaView 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES } from '../../theme/theme';
import apiClient from '../../api/apiClient';

const STATUS_LIST = [
    { id: 'Confirmed', label: 'Tiếp nhận', color: '#3B82F6' },
    { id: 'Checking', label: 'Kiểm tra', color: '#8B5CF6' },
    { id: 'Repairing', label: 'Đang sửa', color: '#F59E0B' },
    { id: 'WaitingForParts', label: 'Chờ linh kiện', color: '#EF4444' },
    { id: 'Completed', label: 'Hoàn thành', color: '#10B981' },
    { id: 'HandedOver', label: 'Đã bàn giao', color: '#6B7280' }
];

const StatusUpdateScreen = ({ navigation, route }: any) => {
    const { appointmentId, assignmentId, currentStatus } = route.params;
    const [selectedStatus, setSelectedStatus] = useState(currentStatus);
    const [note, setNote] = useState('');
    const [loading, setLoading] = useState(false);

    const handleUpdate = async () => {
        setLoading(true);
        try {
            // 1. Cập nhật progressStatus + statusHistory trong Assignment
            if (assignmentId) {
                await apiClient.patch(`/api/technicians/progress/${assignmentId}`, {
                    status: selectedStatus,
                    note: note
                });
            }
            // 2. Đồng bộ trạng thái lên Appointment để hiển thị nhất quán
            await apiClient.patch(`/api/appointments/${appointmentId}/status`, {
                status: selectedStatus,
                note: note
            });
            Alert.alert('Thành công', 'Đã cập nhật trạng thái mới');
            navigation.goBack();
        } catch (error: any) {
            Alert.alert('Lỗi', 'Không thể cập nhật trạng thái: ' + (error.response?.data?.message || error.message));
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
                <Text style={styles.headerTitle}>Cập nhật Tiến độ</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <Text style={styles.sectionTitle}>Chọn trạng thái mới</Text>
                <View style={styles.statusGrid}>
                    {STATUS_LIST.map((status) => (
                        <TouchableOpacity 
                            key={status.id}
                            style={[
                                styles.statusItem, 
                                selectedStatus === status.id && { borderColor: status.color, backgroundColor: status.color + '10' }
                            ]}
                            onPress={() => setSelectedStatus(status.id)}
                        >
                            <Ionicons 
                                name={selectedStatus === status.id ? "radio-button-on" : "radio-button-off"} 
                                size={20} 
                                color={selectedStatus === status.id ? status.color : COLORS.textMuted} 
                            />
                            <Text style={[
                                styles.statusLabel, 
                                selectedStatus === status.id && { color: status.color, fontWeight: 'bold' }
                            ]}>
                                {status.label}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <View style={styles.noteSection}>
                    <Text style={styles.sectionTitle}>Ghi chú nội bộ</Text>
                    <TextInput 
                        style={styles.noteInput}
                        placeholder="Nhập ghi chú chi tiết về tình trạng hiện tại..."
                        multiline
                        numberOfLines={4}
                        value={note}
                        onChangeText={setNote}
                    />
                </View>

                <TouchableOpacity 
                    style={[styles.submitButton, loading && { opacity: 0.7 }]}
                    onPress={handleUpdate}
                    disabled={loading}
                >
                    <Text style={styles.submitButtonText}>
                        {loading ? 'Đang cập nhật...' : 'Xác nhận Cập nhật'}
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
    content: { padding: SIZES.padding },
    sectionTitle: { fontSize: 16, fontWeight: 'bold', color: COLORS.secondary, marginBottom: 15, marginTop: 10 },
    statusGrid: { backgroundColor: COLORS.surface, borderRadius: 12, padding: 10, marginBottom: 20 },
    statusItem: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        padding: 15, 
        borderWidth: 1, 
        borderColor: 'transparent', 
        borderRadius: 8,
        marginVertical: 4
    },
    statusLabel: { marginLeft: 12, fontSize: 16, color: COLORS.text },
    noteSection: { marginBottom: 30 },
    noteInput: { 
        backgroundColor: COLORS.surface, 
        borderWidth: 1, 
        borderColor: COLORS.border, 
        borderRadius: 8, 
        padding: 12, 
        fontSize: 16,
        height: 120,
        textAlignVertical: 'top'
    },
    submitButton: { backgroundColor: COLORS.accent, paddingVertical: 16, borderRadius: 8, alignItems: 'center' },
    submitButtonText: { color: COLORS.surface, fontSize: 18, fontWeight: 'bold' }
});

export default StatusUpdateScreen;
