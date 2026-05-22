import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { COLORS, SIZES, SPACING } from '../../theme/theme';
import { useAuth } from '../../context/AuthContext';
import { Cpu } from 'lucide-react-native';
import CustomButton from '../../components/CustomButton';

const RoleRedirectScreen = () => {
  const { user, logout } = useAuth();

  useEffect(() => {
    // In a real app, logic here would determine where to navigate
    // For now, it's just a placeholder showing that logic is happening
  }, [user]);

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Cpu size={50} color={COLORS.primary} />
      </View>
      <ActivityIndicator size="large" color={COLORS.primary} style={styles.loader} />
      <Text style={styles.text}>Chào mừng, {user?.name}</Text>
      <Text style={styles.subtext}>Đang chuẩn bị {user?.role === 'admin' ? 'Bảng điều khiển Admin' : 'tài khoản của bạn'}...</Text>
      
      <CustomButton 
        title="Đăng xuất" 
        onPress={logout} 
        variant="secondary" 
        style={styles.logoutButton} 
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    width: 100,
    height: 100,
    borderRadius: 25,
    backgroundColor: COLORS.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.xl,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  loader: {
    marginBottom: SPACING.lg,
  },
  text: {
    fontSize: SIZES.h2,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  subtext: {
    fontSize: SIZES.font,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xl,
  },
  logoutButton: {
    width: '60%',
    marginTop: SPACING.xxl,
  },
});

export default RoleRedirectScreen;
