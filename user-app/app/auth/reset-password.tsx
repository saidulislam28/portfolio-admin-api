import { PRIMARY_COLOR } from "@/lib/constants";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_USER, Post } from "@sm/common";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "@/context/useAuth";
import { ROUTES } from "@/constants/app.routes";
import { InputField } from "@/components/InputField"; // Update this import path as needed

export default function ResetPasswordScreen() {
  const router = useRouter();
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [errors, setErrors] = useState({
    otp: "",
    password: "",
    confirmPassword: "",
  });
  const { login }: any = useAuth();

  const validateForm = () => {
    const newErrors = {
      otp: "",
      password: "",
      confirmPassword: "",
    };

    if (!otp) {
      newErrors.otp = "Please enter the OTP";
    }

    if (!password) {
      newErrors.password = "Please enter a new password";
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Password and Confirm Password do not match";
    }

    setErrors(newErrors);
    return !newErrors.otp && !newErrors.password && !newErrors.confirmPassword;
  };

  const handleResetPassword = async () => {
    setLoading(true);

    const email_or_phone = await AsyncStorage.getItem("email");

    // Clear previous errors
    setErrors({
      otp: "",
      password: "",
      confirmPassword: "",
    });

    // Validation
    if (!validateForm()) {
      setLoading(false);
      return;
    }

    try {
      const result = await Post(API_USER.reset_password, {
        otp: Number(otp),
        password,
        email_or_phone,
      });

      if (!result?.data?.success) {
        Alert.alert('Error', result.error);
        setLoading(false);
        return;
      }
      await AsyncStorage.removeItem("email");

      login(result?.data?.data, result?.data?.data?.token);
      router.push(ROUTES.HOME as any);

    } catch (error:any) {
      Alert.alert('Error', error?.message ?? 'An unexpected error occurred');
      setLoading(false);
    }
  };

  const handleFocus = (fieldKey: string) => {
    setFocusedField(fieldKey);
    // Clear error when user starts typing
    if (errors[fieldKey as keyof typeof errors]) {
      setErrors(prev => ({
        ...prev,
        [fieldKey]: "",
      }));
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
          placeholder="Enter OTP"
          keyboardType="numeric"
          maxLength={6}
          fieldKey="otp"
          focusedField={focusedField}
          onFocus={() => handleFocus("otp")}
          onBlur={handleBlur}
          testID="otp-input"
        />

        {/* Password Input */}
        <InputField
          label="New Password"
          value={password}
          onChangeText={setPassword}
          error={errors.password}
          placeholder="Enter New Password"
          isPassword={true}
          fieldKey="password"
          focusedField={focusedField}
          onFocus={() => handleFocus("password")}
          onBlur={handleBlur}
          testID="password-input"
        />

        {/* Confirm Password Input */}
        <InputField
          label="Confirm Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          error={errors.confirmPassword}
          placeholder="Confirm New Password"
          isPassword={true}
          fieldKey="confirmPassword"
          focusedField={focusedField}
          onFocus={() => handleFocus("confirmPassword")}
          onBlur={handleBlur}
          testID="confirm-password-input"
        />

        {/* Reset Password Button */}
        <TouchableOpacity
          style={styles.resetButton}
          onPress={handleResetPassword}
          disabled={loading}
        >
          <Text style={styles.resetButtonText}>
            {loading ? "Resetting..." : "Reset Password"}
          </Text>
        </TouchableOpacity>

        {/* Back to Login Link */}
        <TouchableOpacity
          onPress={() => router.push(ROUTES.LOGIN as any)}
          style={styles.backToLogin}
        >
          <Text style={styles.backToLoginText}>
            Remember your password?{" "}
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
    backgroundColor: "#fff",
  },
  container: {
    flexGrow: 1,
    padding: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#000",
  },
  subtitle: {
    textAlign: "center",
    fontSize: 13,
    color: "#666",
    marginBottom: 32,
  },
  resetButton: {
    backgroundColor: PRIMARY_COLOR,
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
    width: "100%",
    marginTop: 8,
    marginBottom: 20,
  },
  resetButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  backToLogin: {
    marginTop: 20,
  },
  backToLoginText: {
    fontSize: 13,
    color: "#333",
    textAlign: "center",
  },
  loginLink: {
    color: PRIMARY_COLOR,
    fontWeight: "600",
  },
});