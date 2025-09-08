import { BaseButton } from "@/components/BaseButton";
import { ROUTES } from "@/constants/app.routes";
import { PRIMARY_COLOR } from "@/lib/constants";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_CONSULTANT, Post } from "@sm/common";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Platform, StatusBar } from "react-native";
import { InputField } from "@/components/InputField"; // Import the InputField component

export default function ForgetScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [error, setError] = useState<string | undefined>(undefined);

  const handleSubmit = async () => {
    setLoading(true);
    setError(undefined); // Clear previous error

    // Validate email
    if (!email) {
      setError("Email is required");
      setLoading(false);
      return;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email");
      setLoading(false);
      return;
    }

    try {
      const result = await Post(API_CONSULTANT.forget, { email_or_phone: email });
      if (!result.success) {
        setError(result.error);
        setLoading(false);
        return;
      }

      await AsyncStorage.setItem("email", result?.data?.email);
      router.push(ROUTES.RESET_PASSWORD);
    } catch (error) {
      setError(error?.message ?? "An unexpected error occurred");
      setLoading(false);
    }
  };

  const handleFocus = (fieldKey: string) => {
    setFocusedField(fieldKey);
    // Clear error when field is focused
    if (error) {
      setError(undefined);
    }
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

        <View style={{ width: "100%" }}>
          {/* Email Input */}
          <InputField
            label="Email"
            value={email}
            onChangeText={setEmail}
            error={error}
            keyboardType="email-address"
            autoCapitalize="none"
            fieldKey="email"
            focusedField={focusedField}
            onFocus={() => handleFocus("email")}
            onBlur={handleBlur}
            placeholder="Enter your Email"
            testID="email-input"
          />

        </View>


        <BaseButton title="Submit" onPress={handleSubmit} isLoading={loading} />

        <TouchableOpacity
          onPress={() => router.push(ROUTES.LOGIN)}
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
    position: "relative",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
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
    textAlign: "center",
    width: "100%",
  },
  subtitle: {
    textAlign: "center",
    fontSize: 13,
    color: "#666",
    marginVertical: 16,
    width: "100%",
  },
  backToLogin: {
    marginTop: 20,
    width: "100%",
    alignItems: "center",
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