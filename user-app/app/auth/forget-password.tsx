import { BaseButton } from "@/components/BaseButton";
import { ROUTES } from "@/constants/app.routes";
import { PRIMARY_COLOR } from "@/lib/constants";
import { MaterialCommunityIcons } from "@expo/vector-icons";
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

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const result = await Post(API_USER.forget_password, {
        email_or_phone: email,
      });
      if (!result?.data?.success) {
        Alert.alert("Error", result?.data?.error);
        setLoading(false);
        return;
      }

      await AsyncStorage.setItem("email", result?.data?.data?.email);
      router.push(ROUTES.RESET_PASSWORD as any);
    } catch (error: any) {
      Alert.alert("Error", error?.message ?? "An unexpected error occurred");
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Forget Password</Text>
        <Text style={styles.subtitle}>
          Inter your email for forget password
        </Text>

        {/* Email Input */}
        <View style={styles.inputContainer}>
          <MaterialCommunityIcons
            name="email-outline"
            size={20}
            style={styles.icon}
          />
          <TextInput
            placeholder="Enter your Email"
            style={styles.input}
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />

        </View>
        <BaseButton title="Submit" onPress={handleSubmit} isLoading={loading} />

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
    flexGrow: 1, // Changed from padding: 24
    padding: 24,
    alignItems: "center",
    justifyContent: "center", // Added for vertical centering
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
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
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
  forgotPassword: {
    alignSelf: "flex-end",
    marginBottom: 20,
  },
  forgotPasswordText: {
    color: PRIMARY_COLOR,
    fontSize: 13,
  },
  loginButton: {
    backgroundColor: PRIMARY_COLOR,
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
    width: "100%",
    marginBottom: 20,
  },
  loginButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: "#ddd",
  },
  orText: {
    marginHorizontal: 10,
    color: "#888",
    fontSize: 13,
  },
  socialContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    gap: 10,
  },
  socialButton: {
    flex: 1,
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    backgroundColor: "#fff",
    gap: 6,
  },
  socialButtonText: {
    fontSize: 13,
  },
  joinText: {
    marginTop: 30,
    fontSize: 13,
    color: "#333",
  },
  joinLink: {
    color: PRIMARY_COLOR,
    fontWeight: "600",
  },
  backToLogin: {
    marginTop: 10,
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
