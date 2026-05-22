import React, { useState, useEffect } from 'react';
import { 
    View, 
    Text, 
    StyleSheet, 
    FlatList, 
    TouchableOpacity, 
    ActivityIndicator, 
    SafeAreaView,
    StatusBar,
    ScrollView
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES } from '../../theme/theme';
import apiClient from '../../api/apiClient';

const AppointmentListScreen = ({ navigation }: any) => {
    const [appointments, setAppointments] = useState([]);
    const [filteredAppointments, setFilteredAppointments] = useState([]);
    const [selectedStatus, setSelectedStatus] = useState('All');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const STATUS_MAP = [
        { label: 'Tất cả', value: 'All' },
        { label: 'Đang chờ', value: 'Pending' },
        { label: 'Tiếp nhận', value: 'Confirmed' },
        { label: 'Kiểm tra', value: 'Checking' },
        { label: 'Đang sửa', value: 'Repairing' },
        { label: 'Chờ linh kiện', value: 'WaitingForParts' },
        { label: 'Hoàn thành', value: 'Completed' },
        { label: 'Đã bàn giao', value: 'HandedOver' },
        { label: 'Đã hủy', value: 'Cancelled' }
    ];

    useFocusEffect(
        React.useCallback(() => {
            fetchAppointments();
        }, [])
    );

    const fetchAppointments = async () => {
        setLoading(true);
        setError(false);
        try {
            const response = await apiClient.get('/api/appointments');
            setAppointments(response.data);
            applyFilter(response.data, selectedStatus);
        } catch (err) {
            console.error('Lỗi lấy danh sách lịch hẹn:', err);
            setError(true);
        } finally {
            setLoading(false);
        }
    };

    const ENGLISH_MAP: any = {
        'Đang chờ': 'Pending', 'Đã xác nhận': 'Confirmed', 'Tiếp nhận': 'Confirmed',
        'Kiểm tra': 'Checking', 'Đang sửa': 'Repairing', 
        'Chờ linh kiện': 'WaitingForParts', 'Hoàn thành': 'Completed',
        'Đã hủy': 'Cancelled', 'Đã bàn giao': 'HandedOver',
    };

    const applyFilter = (data: any, statusValue: string) => {
        if (statusValue === 'All') {
            setFilteredAppointments(data);
        } else {
            setFilteredAppointments(data.filter((a: any) => {
                const dbVal = a.status;
                // Khớp trực tiếp với tiếng Anh
                if (dbVal.toLowerCase() === statusValue.toLowerCase()) return true;
                // Khớp nếu DB lưu tiếng Việt cũ, convert sang tiếng Anh để so sánh
                const englishEquiv = ENGLISH_MAP[dbVal];
                if (englishEquiv && englishEquiv.toLowerCase() === statusValue.toLowerCase()) return true;
                return false;
            }));
        }
    };

    const handleFilterChange = (statusValue: string) => {
        setSelectedStatus(statusValue);
        applyFilter(appointments, statusValue);
    };

    // Ánh xạ tên DB (cả tiếng Anh và tiếng Việt cũ) sang nhãn tiếng Việt hiển thị
    const getStatusLabel = (status: string) => {
        const map: any = {
            'Pending': 'Đang chờ', 'Đang chờ': 'Đang chờ',
            'Confirmed': 'Đã xác nhận', 'Đã xác nhận': 'Đã xác nhận',
            'Repairing': 'Đang sửa', 'Đang sửa': 'Đang sửa',
            'Completed': 'Hoàn thành', 'Hoàn thành': 'Hoàn thành',
            'Cancelled': 'Đã hủy', 'Đã hủy': 'Đã hủy',
            'HandedOver': 'Đã bàn giao', 'Đã bàn giao': 'Đã bàn giao',
            'WaitingForParts': 'Chờ linh kiện',
            'Checking': 'Kiểm tra',
        };
        return map[status] || status;
    };

    const getStatusStyle = (status: string) => {
        const normalized = status?.toLowerCase() || '';
        if (['confirmed', 'đã xác nhận'].includes(normalized))
            return { color: COLORS.success, bg: COLORS.success + '15' };
        if (['cancelled', 'đã hủy'].includes(normalized))
            return { color: COLORS.danger, bg: COLORS.danger + '15' };
        if (['pending', 'đang chờ'].includes(normalized))
            return { color: '#F59E0B', bg: '#F59E0B15' };
        if (['repairing', 'đang sửa'].includes(normalized))
            return { color: '#8B5CF6', bg: '#8B5CF615' };
        if (['waitingforparts', 'chờ linh kiện'].includes(normalized))
            return { color: '#EF4444', bg: '#EF444415' }; // Màu đỏ cảnh báo
        if (['checking', 'kiểm tra'].includes(normalized))
            return { color: '#06B6D4', bg: '#06B6D415' }; // Màu xanh cyan
        if (['completed', 'hoàn thành'].includes(normalized))
            return { color: COLORS.accent, bg: COLORS.accent + '15' };
        if (['handedover', 'đã bàn giao'].includes(normalized))
            return { color: '#6B7280', bg: '#6B728015' };
        return { color: COLORS.primary, bg: COLORS.primary + '15' };
    };

    const renderAppointmentItem = ({ item }: any) => {
        const statusStyle = getStatusStyle(item.status);
        return (
            <TouchableOpacity 
                style={styles.card}
                onPress={() => navigation.navigate('AppointmentDetail', { appointment: item })}
            >
                <View style={styles.cardHeader}>
                    <View style={styles.typeContainer}>
                        <Ionicons name="calendar" size={16} color={COLORS.accent} />
                        <Text style={styles.typeText}>{item.serviceType}</Text>
                    </View>
                    <View style={[styles.statusBadge, { backgroundColor: statusStyle.bg }]}>
                        <Text style={[styles.statusText, { color: statusStyle.color }]}>{getStatusLabel(item.status)}</Text>
                    </View>
                </View>

                <Text style={styles.dateText}>
                    {new Date(item.appointmentDate).toLocaleDateString('vi-VN')} - {new Date(item.appointmentDate).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                </Text>
                
                <Text style={styles.descText} numberOfLines={2}>{item.description || 'Không có mô tả chi tiết'}</Text>

                <View style={styles.footer}>
                    <Text style={styles.customerText}>
                        {item.Customer?.fullName || `Mã KH: #${item.customerId}`}
                    </Text>
                    <Ionicons name="chevron-forward" size={18} color={COLORS.border} />
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" />
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Quản lý Lịch hẹn</Text>
                <TouchableOpacity 
                    style={styles.addButton}
                    onPress={() => navigation.navigate('AppointmentForm')}
                >
                    <Ionicons name="add" size={28} color={COLORS.surface} />
                </TouchableOpacity>
            </View>

            <View style={styles.filterContainer}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {STATUS_MAP.map((status) => (
                        <TouchableOpacity 
                            key={status.value}
                            style={[
                                styles.filterItem, 
                                selectedStatus === status.value && styles.filterItemActive
                            ]}
                            onPress={() => handleFilterChange(status.value)}
                        >
                            <Text style={[
                                styles.filterText, 
                                selectedStatus === status.value && styles.filterTextActive
                            ]}>{status.label}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            {loading ? (
                <ActivityIndicator size="large" color={COLORS.accent} style={styles.loader} />
            ) : error ? (
                <View style={styles.emptyContainer}>
                    <Ionicons name="cloud-offline-outline" size={64} color={COLORS.danger} />
                    <Text style={[styles.emptyText, { color: COLORS.danger, marginBottom: 16 }]}>Không kết nối được server</Text>
                    <TouchableOpacity style={styles.retryBtn} onPress={fetchAppointments}>
                        <Ionicons name="refresh" size={18} color={COLORS.surface} />
                        <Text style={styles.retryText}>Thử lại</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <FlatList
                    data={filteredAppointments}
                    renderItem={renderAppointmentItem}
                    keyExtractor={(item: any) => item.id.toString()}
                    contentContainerStyle={styles.listContent}
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <Ionicons name="calendar-outline" size={64} color={COLORS.border} />
                            <Text style={styles.emptyText}>Chưa có lịch hẹn nào</Text>
                        </View>
                    }
                />
            )}
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
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: COLORS.primary,
    },
    addButton: {
        backgroundColor: COLORS.accent,
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 4,
    },
    filterContainer: {
        paddingVertical: 10,
        backgroundColor: COLORS.surface,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },
    filterItem: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        marginHorizontal: 4,
        borderRadius: 20,
        backgroundColor: COLORS.background,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    filterItemActive: {
        backgroundColor: COLORS.accent,
        borderColor: COLORS.accent,
    },
    filterText: {
        fontSize: 13,
        color: COLORS.textMuted,
        fontWeight: '600',
    },
    filterTextActive: {
        color: COLORS.surface,
    },
    listContent: {
        padding: SIZES.padding,
    },
    card: {
        backgroundColor: COLORS.surface,
        padding: 16,
        borderRadius: SIZES.radius,
        marginBottom: 16,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    typeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    typeText: {
        marginLeft: 6,
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.primary,
    },
    statusBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 20,
    },
    statusText: {
        fontSize: 12,
        fontWeight: 'bold',
    },
    dateText: {
        fontSize: 14,
        color: COLORS.accent,
        fontWeight: '600',
        marginBottom: 6,
    },
    descText: {
        fontSize: 14,
        color: COLORS.textMuted,
        marginBottom: 12,
        lineHeight: 20,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: COLORS.border,
        paddingTop: 10,
    },
    customerText: {
        fontSize: 13,
        color: COLORS.secondary,
        fontWeight: '500',
    },
    loader: {
        flex: 1,
    },
    emptyContainer: {
        alignItems: 'center',
        marginTop: 100,
    },
    emptyText: {
        marginTop: 10,
        color: COLORS.textMuted,
        fontSize: 16,
    },
    retryBtn: {
        flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.accent,
        paddingHorizontal: 24, paddingVertical: 12, borderRadius: 24, gap: 8,
    },
    retryText: { color: COLORS.surface, fontWeight: 'bold', fontSize: 15 },
});

export default AppointmentListScreen;
