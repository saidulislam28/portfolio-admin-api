import { PRIMARY_COLOR } from "@/lib/constants";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
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
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "@/context/useAuth";
import { ROUTES } from "@/constants/app.routes";

export default function ResetPasswordScreen() {
  const router = useRouter();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login }: any = useAuth();

  const handleResetPassword = async () => {
    setLoading(true);

    const email_or_phone = await AsyncStorage.getItem("email");
    // Validation
    if (!otp || !password || !confirmPassword) {
      Alert.alert("Error", "Please fill in all fields");
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Password and Confirm Password do not match");
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

      login(result?.data?.data);
      router.push(ROUTES.HOME);

    } catch (error) {
      Alert.alert('Error', error?.message ?? 'An unexpected error occurred');
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Reset Password</Text>
        <Text style={styles.subtitle}>Enter your OTP and new password</Text>

        {/* OTP Input */}
        <View style={styles.inputContainer}>
          <MaterialCommunityIcons
            name="key-outline"
            size={20}
            style={styles.icon}
          />
          <TextInput
            placeholder="Enter OTP"
            style={styles.input}
            keyboardType="numeric"
            value={otp}
            onChangeText={setOtp}
            maxLength={6}
          />
        </View>

        {/* Password Input */}
        <View style={styles.inputContainer}>
          <Feather name="lock" size={20} style={styles.icon} />
          <TextInput
            placeholder="Enter New Password"
            secureTextEntry={!passwordVisible}
            style={styles.input}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity
            onPress={() => setPasswordVisible(!passwordVisible)}
          >
            <Feather
              name={passwordVisible ? "eye" : "eye-off"}
              size={20}
              style={styles.iconRight}
            />
          </TouchableOpacity>
        </View>

        {/* Confirm Password Input */}
        <View style={styles.inputContainer}>
          <Feather name="lock" size={20} style={styles.icon} />
          <TextInput
            placeholder="Confirm New Password"
            secureTextEntry={!confirmPasswordVisible}
            style={styles.input}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
          <TouchableOpacity
            onPress={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
          >
            <Feather
              name={confirmPasswordVisible ? "eye" : "eye-off"}
              size={20}
              style={styles.iconRight}
            />
          </TouchableOpacity>
        </View>

        {/* Reset Password Button */}
        <TouchableOpacity
          style={styles.resetButton}
          onPress={handleResetPassword}
        >
          <Text disabled={loading} style={styles.resetButtonText}>
            {loading ? "Resetting..." : "Reset Password"}
          </Text>
        </TouchableOpacity>

        {/* Back to Login Link */}
        <TouchableOpacity
          onPress={() => router.push("/login")}
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
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 16,
    paddingHorizontal: 12,
    paddingVertical: 10,
    width: "100%",
    backgroundColor: "#f9f9f9",
  },
  icon: {
    marginRight: 8,
    color: "#888",
  },
  iconRight: {
    marginLeft: 8,
    color: "#888",
  },
  input: {
    flex: 1,
    fontSize: 14,
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
