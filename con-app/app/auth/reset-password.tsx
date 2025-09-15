import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useAuth } from '@/context/useAuth';
import { PRIMARY_COLOR } from '@/lib/constants';
import { Platform, StatusBar } from 'react-native';
import { ROUTES } from '@/constants/app.routes';
import { API_CONSULTANT, Post } from '@sm/common';
import { InputField } from '@/components/InputField';

export default function ResetPasswordScreen() {
  const router = useRouter();
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [errors, setErrors] = useState<{
    otp?: string;
    password?: string;
    confirmPassword?: string;
  }>({});
  const { login }: any = useAuth();

  const handleResetPassword = async () => {
    setLoading(true);
    setErrors({}); // Clear previous errors

    const email_or_phone = await AsyncStorage.getItem('email');

    // Validation
    const newErrors: {
      otp?: string;
      password?: string;
      confirmPassword?: string;
    } = {};

    if (!otp) {
      newErrors.otp = 'OTP is required';
    } else if (otp.length !== 6) {
      newErrors.otp = 'OTP must be 6 digits';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setLoading(false);
      return;
    }

    try {
      const result = await Post(API_CONSULTANT.reset, {
        otp: Number(otp),
        password,
        email_or_phone,
      });

      if (!result.success) {
        setErrors({ otp: result.error });
        setLoading(false);
        return;
      }

      await AsyncStorage.removeItem('email');
      login(result.data);
      router.push(ROUTES.HOME);
    } catch (error) {
      setErrors({ otp: error?.message ?? 'An unexpected error occurred' });
      setLoading(false);
    }
  };

  const handleFocus = (fieldKey: string) => {
    setFocusedField(fieldKey);
    // Clear error for this field when focused
    if (errors[fieldKey as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [fieldKey]: undefined }));
    }
  };

  const handleBlur = () => {
    setFocusedField(null);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Reset Password</Text>
        <Text style={styles.subtitle}>Enter your OTP and new password</Text>

        {/* OTP Input */}
        <InputField
          label="OTP"
          value={otp}
          onChangeText={setOtp}
          error={errors.otp}
          keyboardType="numeric"
          fieldKey="otp"
          focusedField={focusedField}
          onFocus={() => handleFocus('otp')}
          onBlur={handleBlur}
          placeholder="Enter OTP"
          maxLength={6}
          testID="otp-input"
        />

        {/* Password Input */}
        <InputField
          label="New Password"
          value={password}
          onChangeText={setPassword}
          error={errors.password}
          isPassword={true}
          fieldKey="password"
          focusedField={focusedField}
          onFocus={() => handleFocus('password')}
          onBlur={handleBlur}
          placeholder="Enter New Password"
          testID="password-input"
        />

        {/* Confirm Password Input */}
        <InputField
          label="Confirm Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          error={errors.confirmPassword}
          isPassword={true}
          fieldKey="confirmPassword"
          focusedField={focusedField}
          onFocus={() => handleFocus('confirmPassword')}
          onBlur={handleBlur}
          placeholder="Confirm New Password"
          testID="confirm-password-input"
        />

        {/* Reset Password Button */}
        <TouchableOpacity
          style={styles.resetButton}
          onPress={handleResetPassword}
          disabled={loading}
        >
          <Text style={styles.resetButtonText}>
            {loading ? 'Resetting...' : 'Reset Password'}
          </Text>
        </TouchableOpacity>

        {/* Back to Login Link */}
        <TouchableOpacity
          onPress={() => router.push(ROUTES.LOGIN)}
          style={styles.backToLogin}
        >
          <Text style={styles.backToLoginText}>
            Remember your password?{' '}
            <Text style={styles.loginLink}>Back to Login</Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
    position: 'relative',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  container: {
    flexGrow: 1,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#000',
    textAlign: 'center',
    width: '100%',
  },
  subtitle: {
    textAlign: 'center',
    fontSize: 13,
    color: '#666',
    marginBottom: 32,
    width: '100%',
  },
  resetButton: {
    backgroundColor: PRIMARY_COLOR,
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    width: '100%',
    marginTop: 8,
    marginBottom: 20,
  },
  resetButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  backToLogin: {
    marginTop: 20,
    width: '100%',
    alignItems: 'center',
  },
  backToLoginText: {
    fontSize: 13,
    color: '#333',
    textAlign: 'center',
  },
  loginLink: {
    color: PRIMARY_COLOR,
    fontWeight: '600',
  },
});
