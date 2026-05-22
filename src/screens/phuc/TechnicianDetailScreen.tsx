import React, { useState, useEffect } from 'react';
import {
    View, Text, StyleSheet, TouchableOpacity, ScrollView,
    Alert, SafeAreaView, ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES } from '../../theme/theme';
import apiClient from '../../api/apiClient';

const TechnicianDetailScreen = ({ navigation, route }: any) => {
    const { technician } = route.params;
    const [assignments, setAssignments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAssignments();
    }, []);

    const fetchAssignments = async () => {
        try {
            const response = await apiClient.get(`/api/technicians/${technician.id}/assignments`);
            setAssignments(response.data);
        } catch (error) {
            console.error('Lỗi lấy phân công:', error);
        } finally {
            setLoading(false);
        }
    };

    const priorityColor = (p: string) => {
        switch (p) {
            case 'Cao': return COLORS.danger;
            case 'Trung bình': return '#F59E0B';
            case 'Thấp': return COLORS.success;
            default: return COLORS.textMuted;
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color={COLORS.primary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Chi tiết KTV</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                {/* Profile Card */}
                <View style={styles.profileCard}>
                    <View style={styles.avatarContainer}>
                        <Text style={styles.avatarText}>{technician.fullName?.charAt(0) || 'K'}</Text>
                    </View>
                    <Text style={styles.nameText}>{technician.fullName}</Text>
                    <Text style={styles.specialtyText}>{technician.specialty || 'Kỹ thuật viên'}</Text>
                    <View style={[styles.statusBadge, {
                        backgroundColor: technician.status === 'Sẵn sàng'
                            ? COLORS.success + '20' : '#F59E0B20'
                    }]}>
                        <Text style={[styles.statusText, {
                            color: technician.status === 'Sẵn sàng' ? COLORS.success : '#F59E0B'
                        }]}>
                            {technician.status || 'Không rõ'}
                        </Text>
                    </View>
                </View>

                {/* Stats */}
                <View style={styles.statsRow}>
                    <View style={styles.statBox}>
                        <Text style={styles.statValue}>{technician.currentTasks ?? 0}</Text>
                        <Text style={styles.statLabel}>Việc đang làm</Text>
                    </View>
                    <View style={styles.statBox}>
                        <Text style={[styles.statValue, { color: COLORS.success }]}>{assignments.filter((a: any) => a.progressStatus === 'Completed').length}</Text>
                        <Text style={styles.statLabel}>Đã hoàn thành</Text>
                    </View>
                    <View style={styles.statBox}>
                        <Text style={[styles.statValue, { color: COLORS.danger }]}>{assignments.filter((a: any) => a.priority === 'Cao').length}</Text>
                        <Text style={styles.statLabel}>Ưu tiên Cao</Text>
                    </View>
                </View>

                {/* Assignments List */}
                <Text style={styles.sectionTitle}>Danh sách phân công</Text>
                {loading ? (
                    <ActivityIndicator size="large" color={COLORS.accent} />
                ) : assignments.length > 0 ? (
                    assignments.map((item: any) => (
                        <View key={item.id} style={styles.assignCard}>
                            <View style={styles.assignHeader}>
                                <Text style={styles.assignId}>Phiếu #{item.appointmentId}</Text>
                                <View style={[styles.priorityBadge, { backgroundColor: priorityColor(item.priority) + '20' }]}>
                                    <Text style={[styles.priorityText, { color: priorityColor(item.priority) }]}>
                                        {item.priority}
                                    </Text>
                                </View>
                            </View>
                            <Text style={styles.assignStatus}>Trạng thái: {item.progressStatus}</Text>
                            <Text style={styles.assignDate}>{new Date(item.assignedDate || item.createdAt).toLocaleDateString('vi-VN')}</Text>
                        </View>
                    ))
                ) : (
                    <Text style={styles.emptyText}>Chưa có phân công nào</Text>
                )}
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
    profileCard: {
        backgroundColor: COLORS.surface, borderRadius: SIZES.radius,
        padding: 24, alignItems: 'center', marginBottom: 20, elevation: 2,
    },
    avatarContainer: {
        width: 80, height: 80, borderRadius: 40,
        backgroundColor: COLORS.accent + '20', justifyContent: 'center', alignItems: 'center', marginBottom: 12,
    },
    avatarText: { fontSize: 32, fontWeight: 'bold', color: COLORS.accent },
    nameText: { fontSize: 22, fontWeight: 'bold', color: COLORS.primary, marginBottom: 4 },
    specialtyText: { fontSize: 15, color: COLORS.secondary, marginBottom: 12 },
    statusBadge: { paddingHorizontal: 16, paddingVertical: 6, borderRadius: 20 },
    statusText: { fontWeight: 'bold', fontSize: 14 },
    statsRow: {
        flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24,
    },
    statBox: {
        flex: 0.31, backgroundColor: COLORS.surface, borderRadius: 12,
        padding: 16, alignItems: 'center', elevation: 2,
    },
    statValue: { fontSize: 24, fontWeight: 'bold', color: COLORS.primary },
    statLabel: { fontSize: 12, color: COLORS.textMuted, marginTop: 4, textAlign: 'center' },
    sectionTitle: { fontSize: 17, fontWeight: 'bold', color: COLORS.primary, marginBottom: 12 },
    assignCard: {
        backgroundColor: COLORS.surface, borderRadius: 10, padding: 16, marginBottom: 10, elevation: 1
    },
    assignHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
    assignId: { fontSize: 16, fontWeight: 'bold', color: COLORS.primary },
    priorityBadge: { paddingHorizontal: 10, paddingVertical: 3, borderRadius: 12 },
    priorityText: { fontSize: 12, fontWeight: 'bold' },
    assignStatus: { fontSize: 14, color: COLORS.secondary, marginBottom: 2 },
    assignDate: { fontSize: 12, color: COLORS.textMuted },
    emptyText: { textAlign: 'center', color: COLORS.textMuted, marginTop: 16, fontStyle: 'italic' },
});

export default TechnicianDetailScreen;
