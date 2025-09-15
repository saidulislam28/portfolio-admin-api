import smLogo from '@/assets/images/smlogo.png';
import { BaseButton } from '@/components/BaseButton';
import { ROUTES } from '@/constants/app.routes';
import { useAuth } from '@/context/useAuth';
import { PRIMARY_COLOR } from '@/lib/constants';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { loginConsultant } from '@sm/common';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Image,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { InputField } from '@/components/InputField';

export default function LoginScreen() {
  const router = useRouter();
  const { login }: any = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {}
  );
  const { logout }: any = useAuth();

  const handleLogin = async () => {
    setLoading(true);
    setErrors({}); // Clear previous errors

    // Validate inputs
    const newErrors: { email?: string; password?: string } = {};

    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setLoading(false);
      return;
    }

    try {
      const result = await loginConsultant(email, password);
      if (!result.success) {
        setErrors({ password: result.message });
        setLoading(false);
        return;
      }
      login(result?.data, result?.data?.token);
      router.push(ROUTES.HOME);
    } catch (error) {
      setErrors({ password: error?.message ?? 'An unexpected error occurred' });
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
    <SafeAreaView style={styles.safearea}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.logoContainer}>
          <Image source={smLogo} style={styles.logo} resizeMode="contain" />
        </View>

        <Text style={styles.title}>Welcome back</Text>
        <Text style={styles.subtitle}>
          You can search course, apply course and find{'\n'}
          scholarship for abroad studies
        </Text>

        <View style={{ width: '100%' }}>
          {/* Email Input */}
          <InputField
            label="Email"
            value={email}
            onChangeText={setEmail}
            error={errors.email}
            keyboardType="email-address"
            autoCapitalize="none"
            fieldKey="email"
            focusedField={focusedField}
            onFocus={() => handleFocus('email')}
            onBlur={handleBlur}
            placeholder="Enter your Email"
            testID="email-input"
          />

          {/* Password Input */}
          <InputField
            label="Password"
            value={password}
            onChangeText={setPassword}
            error={errors.password}
            isPassword={true}
            fieldKey="password"
            focusedField={focusedField}
            onFocus={() => handleFocus('password')}
            onBlur={handleBlur}
            placeholder="Enter your Password"
            testID="password-input"
          />
        </View>

        <TouchableOpacity
          onPress={() => router.push(ROUTES.FORGET_PASSWORD)}
          style={styles.forgotPassword}
        >
          <Text style={styles.forgotPasswordText}>Forgot password?</Text>
        </TouchableOpacity>
        <BaseButton title="Login" isLoading={loading} onPress={handleLogin} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safearea: {
    flex: 1,
    backgroundColor: '#fff',
    position: 'relative',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    paddingHorizontal: 16,
  },
  container: {
    flex: 1,
    padding: 24,
    alignItems: 'center', // Center-align all child elements horizontally
    justifyContent: 'center', // Center-align content vertically
    minHeight: '100%', // Ensure full height for vertical centering
  },
  logoContainer: {
    marginBottom: 10,
    alignItems: 'center',
  },
  logo: {
    width: 80,
    height: 80,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
    color: '#000',
    textAlign: 'center', // Center-align text content
    width: '100%', // Full width for proper text centering
  },
  subtitle: {
    textAlign: 'center', // Center-align text content
    fontSize: 13,
    color: '#666',
    marginVertical: 16,
    width: '100%', // Full width for proper text centering
  },
  forgotPassword: {
    width: '100%',
    alignItems: 'center', // Center the forgot password link
    marginBottom: 20,
  },
  forgotPasswordText: {
    color: PRIMARY_COLOR,
    fontSize: 13,
    textAlign: 'center', // Center-align text
  },
});
