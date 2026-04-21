import React, { useState } from 'react';
import { 
    View, 
    Text, 
    StyleSheet, 
    TextInput, 
    TouchableOpacity, 
    ScrollView, 
    Alert,
    SafeAreaView 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES } from '../../theme/theme';
import apiClient from '../../api/apiClient';

const CustomerFormScreen = ({ navigation, route }: any) => {
    const isEdit = route.params?.id !== undefined;
    const [fullName, setFullName] = useState(route.params?.fullName || '');
    const [phoneNumber, setPhoneNumber] = useState(route.params?.phoneNumber || '');
    const [email, setEmail] = useState(route.params?.email || '');
    const [address, setAddress] = useState(route.params?.address || '');
    const [loading, setLoading] = useState(false);

    const handleSave = async () => {
        if (!fullName || !phoneNumber) {
            Alert.alert('Lỗi', 'Vui lòng nhập tên và số điện thoại');
            return;
        }

        setLoading(true);
        try {
            const data = { fullName, phoneNumber, email, address };
            if (isEdit) {
                await apiClient.put(`/api/customers/${route.params.id}`, data);
                Alert.alert('Thành công', 'Cập nhật thông tin khách hàng thành công');
            } else {
                await apiClient.post('/api/customers', data);
                Alert.alert('Thành công', 'Thêm khách hàng mới thành công');
            }
            navigation.goBack();
        } catch (error: any) {
            console.error('Lỗi lưu khách hàng:', error);
            Alert.alert('Lỗi', 'Không thể lưu thông tin: ' + (error.response?.data?.message || error.message));
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
                <Text style={styles.headerTitle}>{isEdit ? 'Sửa Khách hàng' : 'Thêm Khách hàng'}</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView contentContainerStyle={styles.formContent}>
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Họ và tên *</Text>
                    <TextInput 
                        style={styles.input}
                        placeholder="Nguyễn Văn A"
                        value={fullName}
                        onChangeText={setFullName}
                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Số điện thoại *</Text>
                    <TextInput 
                        style={styles.input}
                        placeholder="0123 456 789"
                        keyboardType="phone-pad"
                        value={phoneNumber}
                        onChangeText={setPhoneNumber}
                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Email</Text>
                    <TextInput 
                        style={styles.input}
                        placeholder="example@gmail.com"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        value={email}
                        onChangeText={setEmail}
                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Địa chỉ</Text>
                    <TextInput 
                        style={[styles.input, styles.textArea]}
                        placeholder="Nhập địa chỉ..."
                        multiline
                        numberOfLines={4}
                        value={address}
                        onChangeText={setAddress}
                    />
                </View>

                <TouchableOpacity 
                    style={[styles.saveButton, loading && { opacity: 0.7 }]}
                    onPress={handleSave}
                    disabled={loading}
                >
                    <Text style={styles.saveButtonText}>
                        {loading ? 'Đang lưu...' : (isEdit ? 'Cập nhật' : 'Lưu thông tin')}
                    </Text>
                </TouchableOpacity>
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
    formContent: {
        padding: SIZES.padding,
    },
    inputGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.secondary,
        marginBottom: 8,
    },
    input: {
        backgroundColor: COLORS.surface,
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        color: COLORS.text,
    },
    textArea: {
        height: 100,
        textAlignVertical: 'top',
    },
    saveButton: {
        backgroundColor: COLORS.accent,
        paddingVertical: 16,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 20,
        elevation: 4,
        shadowColor: COLORS.accent,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
    saveButtonText: {
        color: COLORS.surface,
        fontSize: 18,
        fontWeight: 'bold',
    }
});

export default CustomerFormScreen;
