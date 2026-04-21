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
    TextInput
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES } from '../../theme/theme';
import apiClient from '../../api/apiClient';

const CustomerListScreen = ({ navigation }: any) => {
    const [customers, setCustomers] = useState([]);
    const [filteredCustomers, setFilteredCustomers] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);

    useFocusEffect(
        React.useCallback(() => {
            fetchCustomers();
        }, [])
    );

    const fetchCustomers = async () => {
        try {
            const response = await apiClient.get('/api/customers');
            setCustomers(response.data);
            setFilteredCustomers(response.data);
        } catch (error) {
            console.error('Lỗi lấy danh sách khách hàng:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (query: string) => {
        setSearchQuery(query);
        if (query.trim() === '') {
            setFilteredCustomers(customers);
        } else {
            const filtered = customers.filter((c: any) => 
                c.fullName.toLowerCase().includes(query.toLowerCase()) || 
                c.phoneNumber.includes(query)
            );
            setFilteredCustomers(filtered);
        }
    };

    const renderCustomerItem = ({ item }: any) => (
        <TouchableOpacity 
            style={styles.card}
            onPress={() => navigation.navigate('CustomerDetail', { id: item.id })}
        >
            <View style={styles.avatarContainer}>
                <Text style={styles.avatarText}>{item.fullName.charAt(0)}</Text>
            </View>
            <View style={styles.infoContainer}>
                <Text style={styles.nameText}>{item.fullName}</Text>
                <Text style={styles.phoneText}>{item.phoneNumber}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={COLORS.textMuted} />
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" />
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Quản lý Khách hàng</Text>
                <TouchableOpacity 
                    style={styles.addButton}
                    onPress={() => navigation.navigate('CustomerForm')}
                >
                    <Ionicons name="add" size={28} color={COLORS.surface} />
                </TouchableOpacity>
            </View>

            <View style={styles.searchBar}>
                <Ionicons name="search" size={20} color={COLORS.textMuted} />
                <TextInput 
                    style={styles.searchInput}
                    placeholder="Tìm theo tên hoặc số điện thoại..."
                    value={searchQuery}
                    onChangeText={handleSearch}
                />
            </View>

            {loading ? (
                <ActivityIndicator size="large" color={COLORS.accent} style={styles.loader} />
            ) : (
                <FlatList
                    data={filteredCustomers}
                    renderItem={renderCustomerItem}
                    keyExtractor={(item: any) => item.id.toString()}
                    contentContainerStyle={styles.listContent}
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <Ionicons name="people-outline" size={64} color={COLORS.border} />
                            <Text style={styles.emptyText}>Chưa có khách hàng nào</Text>
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
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.surface,
        marginHorizontal: SIZES.padding,
        marginTop: 10,
        marginBottom: 5,
        paddingHorizontal: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: COLORS.border,
        height: 44,
    },
    searchInput: {
        flex: 1,
        marginLeft: 10,
        fontSize: 15,
        color: COLORS.text,
    },
    addButton: {
        backgroundColor: COLORS.accent,
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 4,
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    listContent: {
        padding: SIZES.padding,
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.surface,
        padding: 16,
        borderRadius: SIZES.radius,
        marginBottom: 12,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    avatarContainer: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: COLORS.accent + '20', // Opacity 20%
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    avatarText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: COLORS.accent,
    },
    infoContainer: {
        flex: 1,
    },
    nameText: {
        fontSize: 18,
        fontWeight: '600',
        color: COLORS.primary,
        marginBottom: 4,
    },
    phoneText: {
        fontSize: 14,
        color: COLORS.textMuted,
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
    }
});

export default CustomerListScreen;
