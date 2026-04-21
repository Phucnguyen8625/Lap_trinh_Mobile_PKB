import React, { useState, useEffect } from 'react';
import { 
    View, 
    Text, 
    StyleSheet, 
    ScrollView, 
    TouchableOpacity, 
    ActivityIndicator,
    SafeAreaView 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES } from '../../theme/theme';
import apiClient from '../../api/apiClient';
import { useFocusEffect } from '@react-navigation/native';

const RepairProgressScreen = ({ navigation, route }: any) => {
    const { appointmentId } = route.params;
    const [progress, setProgress] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useFocusEffect(
        React.useCallback(() => {
            fetchProgress();
        }, [appointmentId])
    );

    const fetchProgress = async () => {
        try {
            const response = await apiClient.get(`/api/technicians/progress/${appointmentId}`);
            setProgress(response.data);
        } catch (error) {
            console.error('Lỗi lấy tiến độ:', error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusLabel = (s: string) => {
        const map: any = {
            'Confirmed': 'Tiếp nhận',
            'Checking': 'Kiểm tra',
            'Repairing': 'Đang sửa',
            'WaitingForParts': 'Chờ linh kiện',
            'Completed': 'Hoàn thành',
            'HandedOver': 'Đã bàn giao'
        };
        return map[s] || s;
    };

    const getStatusColor = (s: string) => {
        const normalized = s?.toLowerCase() || '';
        if (normalized === 'waitingforparts') return '#EF4444';
        if (normalized === 'completed') return COLORS.success;
        if (normalized === 'repairing') return COLORS.accent;
        return COLORS.border;
    };

    const renderTimelineItem = (item: any, index: number, isLast: boolean) => (
        <View key={index} style={styles.timelineItem}>
            <View style={styles.timelineLeft}>
                <View style={[styles.timelineDot, { backgroundColor: index === 0 ? getStatusColor(item.status) : COLORS.border }]} />
                {!isLast && <View style={styles.timelineLine} />}
            </View>
            <View style={styles.timelineRight}>
                <Text style={[styles.timelineStatus, { color: index === 0 ? COLORS.primary : COLORS.textMuted }]}>
                    {getStatusLabel(item.status)}
                </Text>
                {item.note && <Text style={styles.timelineNote}>{item.note}</Text>}
                <Text style={styles.timelineTime}>
                    {new Date(item.time).toLocaleString('vi-VN')}
                </Text>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color={COLORS.primary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Tiến độ Sửa chữa</Text>
                <View style={{ width: 24 }} />
            </View>

            {loading ? (
                <ActivityIndicator size="large" color={COLORS.accent} style={styles.loader} />
            ) : progress ? (
                <ScrollView contentContainerStyle={styles.content}>
                    <View style={styles.card}>
                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>Trạng thái hiện tại:</Text>
                            <Text style={[styles.progressValue, { color: getStatusColor(progress.progressStatus) }]}>
                                {getStatusLabel(progress.progressStatus)}
                            </Text>
                        </View>
                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>Mức độ ưu tiên:</Text>
                            <Text style={[styles.priorityValue, { color: COLORS.danger }]}>{progress.priority}</Text>
                        </View>
                    </View>

                    <Text style={styles.sectionTitle}>Lịch sử tiến trình</Text>
                    <View style={styles.timelineContainer}>
                        {(() => {
                            // Parse an toàn: statusHistory có thể là null, mảng, hoặc chuỗi JSON
                            let historyArr = [];
                            try {
                                if (Array.isArray(progress.statusHistory)) {
                                    historyArr = progress.statusHistory;
                                } else if (typeof progress.statusHistory === 'string') {
                                    historyArr = JSON.parse(progress.statusHistory) || [];
                                }
                            } catch (e) {
                                historyArr = [];
                            }

                            if (historyArr.length === 0) {
                                return <Text style={{ color: COLORS.textMuted, textAlign: 'center' }}>Chưa có lịch sử cập nhật</Text>;
                            }

                            return [...historyArr].reverse().map((item: any, index: number) => 
                                renderTimelineItem(item, index, index === historyArr.length - 1)
                            );
                        })()}
                    </View>

                    <TouchableOpacity 
                        style={styles.updateButton}
                        onPress={() => navigation.navigate('StatusUpdate', { 
                            appointmentId: progress.appointmentId, 
                            assignmentId: progress.id,
                            currentStatus: progress.progressStatus 
                        })}
                    >
                        <Text style={styles.updateButtonText}>Cập nhật Trạng thái</Text>
                    </TouchableOpacity>

                    {progress.progressStatus === 'Completed' && (
                        <TouchableOpacity 
                            style={[styles.updateButton, { backgroundColor: COLORS.success, marginTop: 12 }]}
                            onPress={() => navigation.navigate('Handover', { 
                                appointmentId: progress.appointmentId,
                                assignmentId: progress.id,
                                customerName: progress.customerName || ''
                            })}
                        >
                            <Text style={[styles.updateButtonText, { color: COLORS.surface }]}>
                                🤝 Bàn giao máy cho khách
                            </Text>
                        </TouchableOpacity>
                    )}
                </ScrollView>
            ) : (
                <View style={styles.emptyContainer}>
                    <Text>Chưa có thông tin tiến độ cho phiếu này.</Text>
                </View>
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
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: COLORS.primary,
    },
    content: {
        padding: SIZES.padding,
    },
    card: {
        backgroundColor: COLORS.primary,
        borderRadius: SIZES.radius,
        padding: 20,
        marginBottom: 25,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    infoLabel: {
        color: COLORS.surface + '90',
        fontSize: 14,
    },
    progressValue: {
        color: COLORS.surface,
        fontSize: 16,
        fontWeight: 'bold',
    },
    priorityValue: {
        fontSize: 14,
        fontWeight: 'bold',
        backgroundColor: COLORS.surface,
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 4,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.secondary,
        marginBottom: 20,
    },
    timelineContainer: {
        backgroundColor: COLORS.surface,
        borderRadius: SIZES.radius,
        padding: 20,
        marginBottom: 30,
    },
    timelineItem: {
        flexDirection: 'row',
        minHeight: 70,
    },
    timelineLeft: {
        alignItems: 'center',
        marginRight: 15,
        width: 20,
    },
    timelineDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        zIndex: 1,
    },
    timelineLine: {
        width: 2,
        flex: 1,
        backgroundColor: COLORS.border,
        marginTop: -2,
    },
    timelineRight: {
        flex: 1,
        paddingBottom: 20,
    },
    timelineStatus: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 4,
    },
    timelineTime: {
        fontSize: 12,
        color: COLORS.textMuted,
    },
    timelineNote: {
        fontSize: 14,
        color: COLORS.secondary,
        marginVertical: 4,
        fontStyle: 'italic',
    },
    updateButton: {
        backgroundColor: COLORS.highlight,
        paddingVertical: 16,
        borderRadius: 8,
        alignItems: 'center',
        elevation: 4,
    },
    updateButtonText: {
        color: COLORS.primary,
        fontSize: 16,
        fontWeight: 'bold',
    },
    loader: {
        flex: 1,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    }
});

export default RepairProgressScreen;
