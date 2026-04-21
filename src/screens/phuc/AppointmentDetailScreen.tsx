import React, { useState } from 'react';
import { 
    View, 
    Text, 
    StyleSheet, 
    TouchableOpacity, 
    ScrollView, 
    Alert,
    SafeAreaView 
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES } from '../../theme/theme';
import apiClient from '../../api/apiClient';

const AppointmentDetailScreen = ({ navigation, route }: any) => {
    const { appointment } = route.params;
    const [status, setStatus] = useState(appointment.status);
    const [loading, setLoading] = useState(false);

    // Tự reload trạng thái mới nhất từ API mỗi khi quay về màn hình này
    useFocusEffect(
        React.useCallback(() => {
            apiClient.get(`/api/appointments`)
                .then(res => {
                    const latest = res.data.find((a: any) => a.id === appointment.id);
                    if (latest) setStatus(latest.status);
                })
                .catch(() => {});
        }, [appointment.id])
    );

    const getStatusLabel = (s: string) => {
        const map: any = {
            'Pending': 'Đang chờ', 'Đang chờ': 'Đang chờ',
            'Confirmed': 'Tiếp nhận', 'Đã xác nhận': 'Tiếp nhận',
            'Checking': 'Kiểm tra',
            'Repairing': 'Đang sửa',
            'WaitingForParts': 'Chờ linh kiện',
            'Completed': 'Hoàn thành',
            'Cancelled': 'Đã hủy', 'Đã hủy': 'Đã hủy',
            'HandedOver': 'Đã bàn giao'
        };
        return map[s] || s;
    };

    const getStatusStyle = (s: string) => {
        const normalized = s?.toLowerCase() || '';
        if (['confirmed', 'đã xác nhận', 'tiếp nhận'].includes(normalized)) return COLORS.success;
        if (['cancelled', 'đã hủy'].includes(normalized)) return COLORS.danger;
        if (['waitingforparts', 'chờ linh kiện'].includes(normalized)) return '#EF4444';
        if (['repairing', 'đang sửa', 'checking', 'kiểm tra'].includes(normalized)) return COLORS.accent;
        return COLORS.textMuted;
    };

    const updateStatus = async (newStatus: string) => {
        setLoading(true);
        try {
            await apiClient.patch(`/api/appointments/${appointment.id}/status`, { status: newStatus });
            setStatus(newStatus);
            Alert.alert('Thành công', `Đã chuyển trạng thái sang: ${getStatusLabel(newStatus)}`);
        } catch (error) {
            Alert.alert('Lỗi', 'Không thể cập nhật trạng thái');
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
                <Text style={styles.headerTitle}>Chi tiết Lịch hẹn</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Thông tin chung</Text>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Mã lịch hẹn:</Text>
                        <Text style={styles.infoValue}>#{appointment.id}</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Loại dịch vụ:</Text>
                        <Text style={styles.infoValue}>{appointment.serviceType}</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Thời gian:</Text>
                        <Text style={styles.infoValue}>
                            {new Date(appointment.appointmentDate).toLocaleString('vi-VN')}
                        </Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Trạng thái:</Text>
                        <View style={[styles.statusBadgeSmall, { backgroundColor: getStatusStyle(status) + '15' }]}>
                            <Text style={[styles.statusTextSmall, { color: getStatusStyle(status) }]}>
                                {getStatusLabel(status)}
                            </Text>
                        </View>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Mô tả từ khách hàng</Text>
                    <Text style={styles.descriptionText}>{appointment.description || 'Không có mô tả'}</Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Thao tác Admin</Text>
                    <View style={styles.buttonRow}>
                        <TouchableOpacity 
                            style={[styles.actionButton, { backgroundColor: COLORS.success }]}
                            onPress={() => updateStatus('Confirmed')}
                            disabled={loading}
                        >
                            <Text style={styles.actionButtonText}>Xác nhận</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            style={[styles.actionButton, { backgroundColor: COLORS.danger }]}
                            onPress={() => updateStatus('Cancelled')}
                            disabled={loading}
                        >
                            <Text style={styles.actionButtonText}>Hủy lịch</Text>
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity 
                        style={styles.assignButton}
                        onPress={() => navigation.navigate('TechnicianAssignment', { appointmentId: appointment.id })}
                    >
                        <Ionicons name="person-add" size={20} color={COLORS.surface} />
                        <Text style={styles.assignButtonText}>Phân công Kỹ thuật viên</Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                        style={[styles.assignButton, { backgroundColor: COLORS.highlight, marginTop: 12 }]}
                        onPress={() => navigation.navigate('RepairProgress', { appointmentId: appointment.id })}
                    >
                        <Ionicons name="construct" size={20} color={COLORS.primary} />
                        <Text style={[styles.assignButtonText, { color: COLORS.primary }]}>Xem Tiến độ sửa chữa</Text>
                    </TouchableOpacity>
                </View>
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
        paddingHorizontal: SIZES.padding,
        paddingVertical: 20,
        backgroundColor: COLORS.surface,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: COLORS.primary,
    },
    content: {
        padding: SIZES.padding,
    },
    section: {
        backgroundColor: COLORS.surface,
        borderRadius: SIZES.radius,
        padding: 16,
        marginBottom: 20,
        elevation: 2,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.secondary,
        marginBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
        paddingBottom: 8,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    infoLabel: {
        fontSize: 15,
        color: COLORS.textMuted,
    },
    infoValue: {
        fontSize: 15,
        color: COLORS.primary,
        fontWeight: '500',
    },
    descriptionText: { fontSize: 15, color: COLORS.secondary, lineHeight: 22 },
    statusBadgeSmall: {
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
    },
    statusTextSmall: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 15,
    },
    actionButton: {
        flex: 0.48,
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    actionButtonText: {
        color: COLORS.surface,
        fontWeight: 'bold',
    },
    assignButton: {
        flexDirection: 'row',
        backgroundColor: COLORS.primary,
        paddingVertical: 14,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    assignButtonText: {
        color: COLORS.surface,
        fontWeight: 'bold',
        marginLeft: 8,
    }
});

export default AppointmentDetailScreen;
