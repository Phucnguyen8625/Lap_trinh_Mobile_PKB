import React, { useState, useEffect } from 'react';
import { 
    View, 
    Text, 
    StyleSheet, 
    FlatList, 
    TouchableOpacity, 
    ActivityIndicator, 
    Alert,
    SafeAreaView 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES } from '../../theme/theme';
import apiClient from '../../api/apiClient';

const TechnicianAssignmentScreen = ({ navigation, route }: any) => {
    const { appointmentId } = route.params;
    const [technicians, setTechnicians] = useState([]);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);
    const [selectedPriority, setSelectedPriority] = useState('Cao');

    const PRIORITY_OPTIONS = [
        { label: '🔴 Cao', value: 'Cao', color: COLORS.danger },
        { label: '🟡 Trung bình', value: 'Trung bình', color: '#F59E0B' },
        { label: '🟢 Thấp', value: 'Thấp', color: COLORS.success },
    ];

    useEffect(() => {
        fetchTechnicians();
    }, []);

    const fetchTechnicians = async () => {
        try {
            const response = await apiClient.get('/api/technicians');
            setTechnicians(response.data);
        } catch (error) {
            console.error('Lỗi lấy danh sách KTV:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAssign = async (techId: number, techName: string) => {
        Alert.alert(
            'Xác nhận phân công',
            `Phân công cho ${techName} với mức ưu tiên ${selectedPriority}?`,
            [
                { text: 'Hủy', style: 'cancel' },
                {
                    text: 'Xác nhận', onPress: async () => {
                        setProcessing(true);
                        try {
                            await apiClient.post('/api/technicians/assign', {
                                appointmentId,
                                technicianId: techId,
                                priority: selectedPriority
                            });
                            Alert.alert('Thành công', 'Đã phân công kỹ thuật viên thành công');
                            navigation.goBack();
                        } catch (error) {
                            Alert.alert('Lỗi', 'Không thể phân công kỹ thuật viên');
                        } finally {
                            setProcessing(false);
                        }
                    }
                }
            ]
        );
    };

    const renderTechItem = ({ item }: any) => (
        <TouchableOpacity 
            style={[styles.card, item.status !== 'Sẵn sàng' && { opacity: 0.5 }]}
            onPress={() => item.status === 'Sẵn sàng' && handleAssign(item.id, item.fullName)}
            disabled={processing || item.status !== 'Sẵn sàng'}
        >
            <View style={styles.avatarSmall}>
                <Text style={styles.avatarText}>{item.fullName?.charAt(0) || 'K'}</Text>
            </View>
            <View style={styles.infoContainer}>
                <Text style={styles.nameText}>{item.fullName}</Text>
                <Text style={styles.specialtyText}>Chuyên môn: {item.specialty}</Text>
                <Text style={styles.taskText}>Công việc hiện tại: {item.currentTasks ?? 0}</Text>
            </View>
            <View style={[
                styles.statusBadge, 
                { backgroundColor: item.status === 'Sẵn sàng' ? COLORS.success + '20' : COLORS.danger + '20' }
            ]}>
                <Text style={[
                    styles.statusText, 
                    { color: item.status === 'Sẵn sàng' ? COLORS.success : COLORS.danger }
                ]}>{item.status}</Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color={COLORS.primary} />
                </TouchableOpacity>
                <View style={styles.headerTitleContainer}>
                    <Text style={styles.headerTitle}>Phân công Kỹ thuật viên</Text>
                    <Text style={styles.headerSubtitle}>Chọn người phụ trách sửa chữa</Text>
                </View>
                <View style={{ width: 24 }} />
            </View>

            {/* Chọn mức độ ưu tiên */}
            <View style={styles.prioritySection}>
                <Text style={styles.priorityLabel}>Mức độ ưu tiên:</Text>
                <View style={styles.priorityRow}>
                    {PRIORITY_OPTIONS.map((opt) => (
                        <TouchableOpacity
                            key={opt.value}
                            style={[styles.priorityBtn, selectedPriority === opt.value && { backgroundColor: opt.color, borderColor: opt.color }]}
                            onPress={() => setSelectedPriority(opt.value)}
                        >
                            <Text style={[styles.priorityBtnText, selectedPriority === opt.value && { color: COLORS.surface }]}>
                                {opt.label}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            {loading ? (
                <ActivityIndicator size="large" color={COLORS.accent} style={styles.loader} />
            ) : (
                <FlatList
                    data={technicians}
                    renderItem={renderTechItem}
                    keyExtractor={(item: any) => item.id.toString()}
                    contentContainerStyle={styles.listContent}
                    ListHeaderComponent={<Text style={styles.listLabel}>Chọn kỹ thuật viên (chỉ "Sẵn sàng" mới khả dụng):</Text>}
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyText}>Không tìm thấy kỹ thuật viên nào</Text>
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
        alignItems: 'center',
        paddingHorizontal: SIZES.padding,
        paddingVertical: 15,
        backgroundColor: COLORS.surface,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },
    headerTitleContainer: {
        flex: 1,
        marginLeft: 15,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.primary,
    },
    headerSubtitle: {
        fontSize: 12,
        color: COLORS.textMuted,
    },
    listContent: {
        padding: SIZES.padding,
    },
    card: {
        flexDirection: 'row',
        backgroundColor: COLORS.surface,
        padding: 16,
        borderRadius: SIZES.radius,
        marginBottom: 12,
        alignItems: 'center',
        elevation: 2,
    },
    infoContainer: {
        flex: 1,
    },
    nameText: {
        fontSize: 17,
        fontWeight: 'bold',
        color: COLORS.primary,
        marginBottom: 4,
    },
    specialtyText: {
        fontSize: 14,
        color: COLORS.secondary,
    },
    taskText: {
        fontSize: 12,
        color: COLORS.textMuted,
        marginTop: 4,
    },
    statusBadge: {
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 8,
    },
    statusText: {
        fontSize: 12,
        fontWeight: 'bold',
    },
    loader: {
        flex: 1,
    },
    emptyContainer: {
        alignItems: 'center',
        marginTop: 50,
    },
    emptyText: {
        color: COLORS.textMuted,
    },
    prioritySection: {
        backgroundColor: COLORS.surface,
        paddingHorizontal: SIZES.padding,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },
    priorityLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.secondary,
        marginBottom: 8,
    },
    priorityRow: {
        flexDirection: 'row',
        gap: 8,
    },
    priorityBtn: {
        paddingHorizontal: 14,
        paddingVertical: 7,
        borderRadius: 20,
        borderWidth: 1.5,
        borderColor: COLORS.border,
        backgroundColor: COLORS.background,
    },
    priorityBtnText: {
        fontSize: 13,
        fontWeight: '600',
        color: COLORS.secondary,
    },
    avatarSmall: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: COLORS.accent + '20',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    avatarText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.accent,
    },
    listLabel: {
        fontSize: 13,
        color: COLORS.textMuted,
        marginBottom: 10,
        fontStyle: 'italic',
    }
});

export default TechnicianAssignmentScreen;
