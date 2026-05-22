import React, { useState, useEffect } from 'react';
import { 
    View, 
    Text, 
    StyleSheet, 
    TouchableOpacity, 
    ScrollView, 
    ActivityIndicator,
    SafeAreaView 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES } from '../../theme/theme';
import apiClient from '../../api/apiClient';

const CustomerDetailScreen = ({ navigation, route }: any) => {
    const { id } = route.params;
    const [customer, setCustomer] = useState<any>(null);
    const [history, setHistory] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [custRes, histRes] = await Promise.all([
                apiClient.get(`/api/customers/${id}`),
                apiClient.get(`/api/appointments?customerId=${id}`)
            ]);
            setCustomer(custRes.data);
            setHistory(histRes.data);
        } catch (error) {
            console.error('Lỗi lấy dữ liệu khách hàng:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <ActivityIndicator size="large" color={COLORS.accent} style={{ flex: 1 }} />;

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color={COLORS.primary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Thông tin Khách hàng</Text>
                <TouchableOpacity onPress={() => navigation.navigate('CustomerForm', { ...customer })}>
                    <Ionicons name="create-outline" size={24} color={COLORS.accent} />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.avatarSection}>
                    <View style={styles.largeAvatar}>
                        <Text style={styles.largeAvatarText}>{customer?.fullName.charAt(0)}</Text>
                    </View>
                    <Text style={styles.nameText}>{customer?.fullName}</Text>
                    <Text style={styles.idText}>ID: #{customer?.id}</Text>
                </View>

                <View style={styles.infoSection}>
                    <View style={styles.infoRow}>
                        <Ionicons name="call-outline" size={20} color={COLORS.textMuted} />
                        <View style={styles.infoTextContainer}>
                            <Text style={styles.infoLabel}>Số điện thoại</Text>
                            <Text style={styles.infoValue}>{customer?.phoneNumber}</Text>
                        </View>
                    </View>

                    <View style={styles.infoRow}>
                        <Ionicons name="mail-outline" size={20} color={COLORS.textMuted} />
                        <View style={styles.infoTextContainer}>
                            <Text style={styles.infoLabel}>Email</Text>
                            <Text style={styles.infoValue}>{customer?.email || 'Chưa cập nhật'}</Text>
                        </View>
                    </View>

                    <View style={styles.infoRow}>
                        <Ionicons name="location-outline" size={20} color={COLORS.textMuted} />
                        <View style={styles.infoTextContainer}>
                            <Text style={styles.infoLabel}>Địa chỉ</Text>
                            <Text style={styles.infoValue}>{customer?.address || 'Chưa cập nhật'}</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.historySection}>
                    <Text style={styles.sectionTitle}>Lịch sử Dịch vụ</Text>
                    {history.length > 0 ? (
                        history.map((item: any) => (
                            <View 
                                key={item.id} 
                                style={styles.historyItem}
                            >
                                <View style={styles.historyIcon}>
                                    <Ionicons name="construct-outline" size={20} color={COLORS.accent} />
                                </View>
                                <View style={styles.historyInfo}>
                                    <Text style={styles.historyType}>{item.serviceType}</Text>
                                    <Text style={styles.historyDate}>{new Date(item.appointmentDate).toLocaleDateString('vi-VN')}</Text>
                                    <Text style={styles.historyStatus}>{item.status}</Text>
                                </View>
                            </View>
                        ))
                    ) : (
                        <Text style={styles.emptyHistory}>Chưa có lịch sử sửa chữa</Text>
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: SIZES.padding,
        backgroundColor: COLORS.surface,
    },
    headerTitle: { fontSize: 20, fontWeight: 'bold', color: COLORS.primary },
    content: { padding: SIZES.padding },
    avatarSection: { alignItems: 'center', marginVertical: 30 },
    largeAvatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: COLORS.accent + '20',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 15,
    },
    largeAvatarText: { fontSize: 40, fontWeight: 'bold', color: COLORS.accent },
    nameText: { fontSize: 24, fontWeight: 'bold', color: COLORS.primary },
    idText: { fontSize: 14, color: COLORS.textMuted, marginTop: 4 },
    infoSection: { backgroundColor: COLORS.surface, borderRadius: SIZES.radius, padding: 20, elevation: 2 },
    infoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
    infoTextContainer: { marginLeft: 15 },
    infoLabel: { fontSize: 12, color: COLORS.textMuted },
    infoValue: { fontSize: 16, color: COLORS.primary, fontWeight: '500', marginTop: 2 },
    historySection: { marginTop: 30, marginBottom: 20 },
    sectionTitle: { fontSize: 18, fontWeight: 'bold', color: COLORS.primary, marginBottom: 15 },
    historyItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.surface,
        padding: 15,
        borderRadius: 12,
        marginBottom: 10,
        elevation: 1,
    },
    historyIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: COLORS.accent + '10',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    historyInfo: { flex: 1 },
    historyType: { fontSize: 16, fontWeight: 'bold', color: COLORS.primary },
    historyDate: { fontSize: 13, color: COLORS.textMuted, marginTop: 2 },
    historyStatus: { fontSize: 12, color: COLORS.accent, fontWeight: '600', marginTop: 2 },
    emptyHistory: { textAlign: 'center', color: COLORS.textMuted, marginTop: 10, fontStyle: 'italic' },
});

export default CustomerDetailScreen;
