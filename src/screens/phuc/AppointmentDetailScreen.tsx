import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Alert,
    TextInput,
    SafeAreaView
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES } from '../../theme/theme';
import apiClient from '../../api/apiClient';

const AppointmentDetailScreen = ({ navigation, route }: any) => {
    const { appointment } = route.params;
    const [status, setStatus] = useState(appointment.status);
    const [quotedPrice, setQuotedPrice] = useState<string>(
        appointment.quotedPrice ? String(appointment.quotedPrice) : ''
    );
    const [quotationStatus, setQuotationStatus] = useState(
        appointment.quotationStatus || 'Chờ báo giá'
    );
    const [customerName, setCustomerName] = useState(
        appointment.Customer?.fullName || `Mã KH: #${appointment.customerId}`
    );
    const [loading, setLoading] = useState(false);
    const [showPriceInput, setShowPriceInput] = useState(false);
    const [priceInput, setPriceInput] = useState('');

    useFocusEffect(
        React.useCallback(() => {
            apiClient.get(`/api/appointments`)
                .then(res => {
                    const latest = res.data.find((a: any) => a.id === appointment.id);
                    if (latest) {
                        setStatus(latest.status);
                        setQuotedPrice(latest.quotedPrice ? String(latest.quotedPrice) : '');
                        setQuotationStatus(latest.quotationStatus || 'Chờ báo giá');
                        setCustomerName(latest.Customer?.fullName || `Mã KH: #${latest.customerId}`);
                    }
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
        if (['completed', 'hoàn thành'].includes(normalized)) return COLORS.success;
        if (['handedover', 'đã bàn giao'].includes(normalized)) return '#6B7280';
        return COLORS.textMuted;
    };

    const getQuotationStyle = (qs: string) => {
        if (qs === 'Chờ khách xác nhận') return '#F59E0B';
        if (qs === 'Đã duyệt') return COLORS.success;
        if (qs === 'Từ chối') return COLORS.danger;
        return COLORS.textMuted;
    };

    const updateStatus = async (newStatus: string) => {
        setLoading(true);
        try {
            await apiClient.patch(`/api/appointments/${appointment.id}/status`, { status: newStatus });
            setStatus(newStatus);
            Alert.alert('Thành công', `Đã chuyển trạng thái sang: ${getStatusLabel(newStatus)}`);
        } catch {
            Alert.alert('Lỗi', 'Không thể cập nhật trạng thái');
        } finally {
            setLoading(false);
        }
    };

    const handleSendQuotation = async () => {
        const price = parseInt(priceInput.replace(/\D/g, ''), 10);
        if (!price || price <= 0) {
            Alert.alert('Lỗi', 'Vui lòng nhập giá báo giá hợp lệ');
            return;
        }
        setLoading(true);
        try {
            await apiClient.patch(`/api/appointments/${appointment.id}/quotation`, { quotedPrice: price });
            setQuotedPrice(String(price));
            setQuotationStatus('Chờ khách xác nhận');
            setShowPriceInput(false);
            setPriceInput('');
            Alert.alert('Thành công', 'Đã gửi báo giá đến khách hàng');
        } catch {
            Alert.alert('Lỗi', 'Không thể gửi báo giá');
        } finally {
            setLoading(false);
        }
    };

    const formatVND = (val: string) => {
        if (!val) return '—';
        return parseInt(val).toLocaleString('vi-VN') + ' VNĐ';
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
                {/* Thông tin chung */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Thông tin chung</Text>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Mã lịch hẹn:</Text>
                        <Text style={styles.infoValue}>#{appointment.id}</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Mã đặt lịch:</Text>
                        <Text style={[styles.infoValue, { color: COLORS.accent, fontWeight: 'bold' }]}>
                            {appointment.bookingCode || '—'}
                        </Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Khách hàng:</Text>
                        <Text style={[styles.infoValue, { color: COLORS.primary, fontWeight: 'bold' }]}>
                            {customerName}
                        </Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Loại dịch vụ:</Text>
                        <Text style={styles.infoValue}>{appointment.serviceType}</Text>
                    </View>
                    {!!appointment.deviceInfo && (
                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>Thiết bị:</Text>
                            <Text style={styles.infoValue}>{appointment.deviceInfo}</Text>
                        </View>
                    )}
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

                {/* Mô tả */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Mô tả từ khách hàng</Text>
                    <Text style={styles.descriptionText}>{appointment.description || 'Không có mô tả'}</Text>
                </View>

                {/* Báo giá */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Báo giá</Text>

                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Giá báo:</Text>
                        <Text style={[styles.infoValue, { color: COLORS.success, fontWeight: 'bold', fontSize: 16 }]}>
                            {formatVND(quotedPrice)}
                        </Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Trạng thái báo giá:</Text>
                        <Text style={[styles.infoValue, { color: getQuotationStyle(quotationStatus), fontWeight: 'bold' }]}>
                            {quotationStatus}
                        </Text>
                    </View>

                    {quotationStatus !== 'Đã duyệt' && quotationStatus !== 'Từ chối' && (
                        <>
                            {showPriceInput ? (
                                <View style={styles.priceInputBox}>
                                    <TextInput
                                        style={styles.priceInput}
                                        placeholder="Nhập giá (VD: 1500000)"
                                        placeholderTextColor={COLORS.textMuted}
                                        keyboardType="numeric"
                                        value={priceInput}
                                        onChangeText={setPriceInput}
                                    />
                                    <View style={styles.priceActions}>
                                        <TouchableOpacity
                                            style={[styles.priceBtn, { backgroundColor: COLORS.success }]}
                                            onPress={handleSendQuotation}
                                            disabled={loading}
                                        >
                                            <Ionicons name="send" size={16} color="#fff" />
                                            <Text style={styles.priceBtnText}>Gửi báo giá</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={[styles.priceBtn, { backgroundColor: COLORS.border }]}
                                            onPress={() => { setShowPriceInput(false); setPriceInput(''); }}
                                        >
                                            <Text style={[styles.priceBtnText, { color: COLORS.text }]}>Hủy</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            ) : (
                                <TouchableOpacity
                                    style={styles.quotationBtn}
                                    onPress={() => setShowPriceInput(true)}
                                    disabled={loading}
                                >
                                    <Ionicons name="cash-outline" size={18} color={COLORS.surface} />
                                    <Text style={styles.quotationBtnText}>
                                        {quotedPrice ? 'Cập nhật báo giá' : 'Đặt báo giá'}
                                    </Text>
                                </TouchableOpacity>
                            )}
                        </>
                    )}
                </View>

                {/* Thao tác Admin */}
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
        alignItems: 'center',
        marginBottom: 8,
    },
    infoLabel: {
        fontSize: 14,
        color: COLORS.textMuted,
        flex: 1,
    },
    infoValue: {
        fontSize: 14,
        color: COLORS.primary,
        fontWeight: '500',
        flex: 1,
        textAlign: 'right',
    },
    descriptionText: { fontSize: 15, color: COLORS.secondary, lineHeight: 22 },
    statusBadgeSmall: {
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
    },
    statusTextSmall: {
        fontSize: 13,
        fontWeight: 'bold',
    },
    priceInputBox: { marginTop: 12 },
    priceInput: {
        backgroundColor: COLORS.background,
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 8,
        paddingHorizontal: 14,
        paddingVertical: 10,
        fontSize: 15,
        color: COLORS.text,
        marginBottom: 10,
    },
    priceActions: { flexDirection: 'row', gap: 10 },
    priceBtn: {
        flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
        gap: 6, paddingVertical: 10, borderRadius: 8,
    },
    priceBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
    quotationBtn: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
        gap: 8, backgroundColor: '#F59E0B',
        paddingVertical: 12, borderRadius: 8, marginTop: 10,
    },
    quotationBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
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
