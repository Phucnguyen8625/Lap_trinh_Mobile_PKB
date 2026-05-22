import React, { useState, useEffect } from 'react';
import {
    View, Text, StyleSheet, FlatList, TouchableOpacity,
    ActivityIndicator, SafeAreaView, StatusBar
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES } from '../../theme/theme';
import apiClient from '../../api/apiClient';

const STATUS_COLOR = (status: string) => {
    switch (status) {
        case 'Sẵn sàng': return COLORS.success;
        case 'Đang bận': return '#F59E0B';
        case 'Nghỉ phép': return COLORS.danger;
        default: return COLORS.textMuted;
    }
};

const TechnicianListScreen = ({ navigation }: any) => {
    const [technicians, setTechnicians] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useFocusEffect(
        React.useCallback(() => {
            fetchTechnicians();
        }, [])
    );

    const fetchTechnicians = async () => {
        setLoading(true);
        setError(false);
        try {
            const response = await apiClient.get('/api/technicians');
            setTechnicians(response.data);
        } catch (err) {
            console.error('Lỗi lấy danh sách KTV:', err);
            setError(true);
        } finally {
            setLoading(false);
        }
    };

    const renderItem = ({ item }: any) => (
        <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('TechnicianDetail', { technician: item })}
        >
            <View style={styles.avatarContainer}>
                <Text style={styles.avatarText}>{item.fullName?.charAt(0) || 'K'}</Text>
            </View>
            <View style={styles.info}>
                <Text style={styles.nameText}>{item.fullName}</Text>
                <Text style={styles.specialtyText}>{item.specialty || 'Kỹ thuật viên'}</Text>
                <View style={styles.taskRow}>
                    <Ionicons name="briefcase-outline" size={13} color={COLORS.textMuted} />
                    <Text style={styles.taskText}> {item.currentTasks ?? 0} việc đang xử lý</Text>
                </View>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: STATUS_COLOR(item.status) + '20' }]}>
                <Text style={[styles.statusText, { color: STATUS_COLOR(item.status) }]}>{item.status || 'N/A'}</Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" />
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Danh sách Kỹ thuật viên</Text>
                <View style={styles.countBadge}>
                    <Text style={styles.countText}>{technicians.length} KTV</Text>
                </View>
            </View>

            {loading ? (
                <ActivityIndicator size="large" color={COLORS.accent} style={styles.loader} />
            ) : error ? (
                <View style={styles.emptyContainer}>
                    <Ionicons name="cloud-offline-outline" size={64} color={COLORS.danger} />
                    <Text style={[styles.emptyText, { color: COLORS.danger, marginBottom: 16 }]}>Không kết nối được server</Text>
                    <TouchableOpacity style={styles.retryBtn} onPress={fetchTechnicians}>
                        <Ionicons name="refresh" size={18} color={COLORS.surface} />
                        <Text style={styles.retryText}>Thử lại</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <FlatList
                    data={technicians}
                    renderItem={renderItem}
                    keyExtractor={(item: any) => item.id.toString()}
                    contentContainerStyle={styles.listContent}
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <Ionicons name="people-outline" size={64} color={COLORS.border} />
                            <Text style={styles.emptyText}>Chưa có kỹ thuật viên nào</Text>
                        </View>
                    }
                />
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background },
    header: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
        paddingHorizontal: SIZES.padding, paddingVertical: 20,
        backgroundColor: COLORS.surface, borderBottomWidth: 1, borderBottomColor: COLORS.border,
    },
    headerTitle: { fontSize: 22, fontWeight: 'bold', color: COLORS.primary },
    countBadge: {
        backgroundColor: COLORS.accent + '20', paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20
    },
    countText: { color: COLORS.accent, fontWeight: 'bold', fontSize: 13 },
    listContent: { padding: SIZES.padding },
    card: {
        flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.surface,
        padding: 16, borderRadius: SIZES.radius, marginBottom: 12, elevation: 2,
    },
    avatarContainer: {
        width: 52, height: 52, borderRadius: 26,
        backgroundColor: COLORS.accent + '20', justifyContent: 'center', alignItems: 'center', marginRight: 14,
    },
    avatarText: { fontSize: 22, fontWeight: 'bold', color: COLORS.accent },
    info: { flex: 1 },
    nameText: { fontSize: 17, fontWeight: 'bold', color: COLORS.primary, marginBottom: 3 },
    specialtyText: { fontSize: 14, color: COLORS.secondary, marginBottom: 4 },
    taskRow: { flexDirection: 'row', alignItems: 'center' },
    taskText: { fontSize: 12, color: COLORS.textMuted },
    statusBadge: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 20 },
    statusText: { fontSize: 12, fontWeight: 'bold' },
    loader: { flex: 1 },
    emptyContainer: { alignItems: 'center', marginTop: 100 },
    emptyText: { marginTop: 12, fontSize: 16, color: COLORS.textMuted },
    retryBtn: {
        flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.accent,
        paddingHorizontal: 24, paddingVertical: 12, borderRadius: 24, gap: 8,
    },
    retryText: { color: COLORS.surface, fontWeight: 'bold', fontSize: 15 },
});

export default TechnicianListScreen;
