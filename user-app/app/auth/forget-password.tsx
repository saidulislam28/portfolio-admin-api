import React, { useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { InputField } from '@/components/InputField'; // Assuming this is the correct path
import { BaseButton } from "@/components/BaseButton";
import { ROUTES } from "@/constants/app.routes";
import { PRIMARY_COLOR } from "@/lib/constants";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_USER, Post } from "@sm/common";

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleSubmit = async () => {
    setLoading(true);
    setError(""); // Clear previous errors

    // Basic validation
    if (!email.trim()) {
      setError("Email is required");
      setLoading(false);
      return;
    }

    try {
      const result = await Post(API_USER.forget_password, {
        email_or_phone: email,
      });

      if (!result?.data?.success) {
        setError(result?.data?.error || "An error occurred");
        setLoading(false);
        return;
      }

      await AsyncStorage.setItem("email", result?.data?.data?.email);
      router.push(ROUTES.RESET_PASSWORD as any);
    } catch (error: any) {
      setError(error?.message ?? "An unexpected error occurred");
      setLoading(false);
    }
  };

  const handleFocus = (fieldKey: string) => {
    setFocusedField(fieldKey);
    setError(""); // Clear error when user focuses on input
  };

  const handleBlur = () => {
    setFocusedField(null);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Forget Password</Text>
        <Text style={styles.subtitle}>
          Enter your email for forget password
        </Text>

        {/* Email Input */}
        <View style={{ width: '100%' }}>
          <InputField
            label="Email"
            value={email}
            onChangeText={setEmail}
            error={error}
            fieldKey="email"
            focusedField={focusedField}
            onFocus={() => handleFocus("email")}
            onBlur={handleBlur}
            placeholder="Enter your Email"
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            testID="email-input"
          />
        </View>

        <BaseButton
          title="Submit"
          onPress={handleSubmit}
          isLoading={loading}
        />

        <View style={styles.backToLogin}>
          <Text style={styles.backToLoginText}>
            Remember your password?{" "}
            <Text
              style={styles.loginLink}
              onPress={() => router.push(ROUTES.LOGIN as any)}
            >
              Back to Login
            </Text>
          </Text>
        </View>
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
    marginTop: 20,
    color: "#000",
  },
  subtitle: {
    textAlign: "center",
    fontSize: 13,
    color: "#666",
    marginVertical: 16,
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