import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SPACING, SIZES } from '../theme/theme';

const CustomButton = ({ title, onPress, loading, variant = 'primary', style }) => {
  const isPrimary = variant === 'primary';

  if (isPrimary) {
    return (
      <TouchableOpacity 
        onPress={onPress} 
        disabled={loading} 
        activeOpacity={0.8}
        style={[styles.buttonWrapper, style]}
      >
        <LinearGradient
          colors={[COLORS.primary, '#1D4ED8']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.button}
        >
          {loading ? (
            <ActivityIndicator color={COLORS.white} />
          ) : (
            <Text style={styles.text}>{title}</Text>
          )}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity 
      onPress={onPress} 
      disabled={loading}
      activeOpacity={0.7}
      style={[styles.secondaryButton, style]}
    >
      <Text style={styles.secondaryText}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonWrapper: {
    width: '100%',
    marginVertical: SPACING.sm,
  },
  button: {
    height: 56,
    borderRadius: SIZES.radius,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  text: {
    color: COLORS.white,
    fontSize: SIZES.body,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  secondaryButton: {
    height: 56,
    borderRadius: SIZES.radius,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    width: '100%',
    marginVertical: SPACING.sm,
  },
  secondaryText: {
    color: COLORS.text,
    fontSize: SIZES.body,
    fontWeight: '600',
  }
});

export default CustomButton;
