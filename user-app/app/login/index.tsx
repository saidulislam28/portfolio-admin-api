import { PRIMARY_COLOR } from "@/lib/constants";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { loginUser, LoginUserResponse } from "@sm/common";
import { Link, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import smLogo from "@/assets/images/smlogo.png";
import { useAuth } from "@/context/useAuth";
import { ROUTES } from "@/constants/app.routes";
import { useSocialAuth } from "@/hooks/useSocialAuth";
import { BaseButton } from "@/components/BaseButton";

export default function LoginScreen() {
  const router = useRouter();
  const { login }: any = useAuth();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState("");

  // Use the custom social auth hook
  const {
    socialLoading,
    isGoogleLoading,
    isFacebookLoading,
    signInWithGoogle,
    signInWithFacebook
  } = useSocialAuth();

  const validateInputs = () => {
    const cleanedEmail = email.replace(/\s+/g, "").toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Clear previous email error
    setEmailError("");

    if (!cleanedEmail || !password) {
      if (!cleanedEmail) {
        setEmailError("Email is required");
      }
      Alert.alert("Error", "Please fill in all fields");
      return false;
    }

    if (!emailRegex.test(cleanedEmail)) {
      setEmailError("Incorrect Email");
      Alert.alert("Error", "Please enter a valid email address");
      return false;
    }

    if (password.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters");
      return false;
    }

    return true;
  };

  const handleLogin = async () => {
    if (!validateInputs()) {
      return;
    }

    setLoading(true);
    const cleanedEmail = email.replace(/\s+/g, "").toLowerCase();

    try {
      const result: LoginUserResponse = await loginUser(cleanedEmail, password, "");
      if (!result.success) {
        Alert.alert("Error", result.error);
        setLoading(false);
        return;
      }
      login(result.data, result.data.token);
      router.push(ROUTES.HOME as any);
    } catch (error: any) {
      const status = error?.response?.status;
      const message =
        error?.response?.data?.message ||
        error.message ||
        "An unexpected error occurred";

      console.log("Error status:", status);

      if (status === 401) {
        Alert.alert("Unauthorized", "Invalid email or password.");
      } else if (status === 500) {
        Alert.alert("Server Error", "Something went wrong on the server.");
      } else {
        Alert.alert("Error", message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEmailChange = (text: string) => {
    setEmail(text);
    if (emailError) {
      setEmailError("");
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Logo */}
          <View style={styles.logoContainer}>
            <Image source={smLogo} style={styles.logo} resizeMode="contain" />
          </View>

          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>
            You can search course, apply course and find{"\n"}
            scholarship for abroad studies
          </Text>

          {/* Email Input */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Email</Text>
            <View
              style={[styles.inputContainer, emailError && styles.inputError]}
            >
              <MaterialCommunityIcons
                name="email-outline"
                size={20}
                style={styles.icon}
              />
              <TextInput
                placeholder="info@gmail.com"
                style={styles.input}
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={handleEmailChange}
                placeholderTextColor="#999"
              />
            </View>
            {emailError ? (
              <View style={styles.errorContainer}>
                <MaterialCommunityIcons
                  name="alert"
                  size={16}
                  color="#FF4444"
                />
                <Text style={styles.errorText}>{emailError}</Text>
              </View>
            ) : null}
          </View>

          {/* Password Input */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Password</Text>
            <View style={styles.inputContainer}>
              <Feather name="lock" size={20} style={styles.icon} />
              <TextInput
                placeholder="Enter Your Password"
                secureTextEntry={!passwordVisible}
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                autoCapitalize="none"
                placeholderTextColor="#999"
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
          </View>

          <TouchableOpacity
            onPress={() => router.push(ROUTES.FORGET_PASSWORD as any)}
            style={styles.forgotPassword}
          >
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>

          <BaseButton title="Login" onPress={handleLogin} isLoading={loading} />
          {/* Divider */}
          <View style={styles.dividerContainer}>
            <View style={styles.divider} />
            <Text style={styles.orText}>Or</Text>
            <View style={styles.divider} />
          </View>

          {/* Social Buttons */}
          <View style={styles.socialContainer}>
            <TouchableOpacity
              style={[styles.socialButton, isFacebookLoading && styles.disabledButton]}
              onPress={signInWithFacebook}
              disabled={socialLoading !== null}
            >
              {isFacebookLoading ? (
                <ActivityIndicator color="#1877F2" size="small" style={{ marginRight: 12 }} />
              ) : (
                <View style={styles.facebookIcon}>
                  <Text style={styles.facebookText}>f</Text>
                </View>
              )}
              <Text style={styles.socialButtonText}>
                {isFacebookLoading ? 'Connecting...' : 'Login With Facebook'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.socialButton, isGoogleLoading && styles.disabledButton]}
              onPress={signInWithGoogle}
              disabled={socialLoading !== null}
            >
              {isGoogleLoading ? (
                <ActivityIndicator color="#4285F4" size="small" style={{ marginRight: 12 }} />
              ) : (
                <View style={styles.googleIconContainer}>
                  <Text style={styles.googleIcon}>G</Text>
                </View>
              )}
              <Text style={styles.socialButtonText}>
                {isGoogleLoading ? 'Connecting...' : 'Login With Google'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Join Us Link */}
          <View style={styles.signupContainer}>
            <Text style={styles.joinText}>Don't have an account? </Text>
            <Link href={"/registration"}>
              <Text style={styles.joinLink}>Join Us</Text>
            </Link>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    padding: 24,
    paddingTop: 40,
    alignItems: "center",
    minHeight: "100%",
  },
  logoContainer: {
    marginBottom: 10,
    alignItems: "center",
  },
  logo: {
    width: 80,
    height: 80,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 8,
    color: "#000",
    textAlign: "center",
  },
  subtitle: {
    textAlign: "center",
    fontSize: 14,
    color: "#666",
    marginBottom: 40,
    lineHeight: 20,
  },
  fieldContainer: {
    width: "100%",
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    width: "100%",
    backgroundColor: "#fff",
    minHeight: 48,
  },
  inputError: {
    borderColor: "#FF4444",
    backgroundColor: "#FFF5F5",
  },
  icon: {
    marginRight: 12,
    color: "#888",
  },
  iconRight: {
    marginLeft: 8,
    color: "#888",
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#000",
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
  },
  errorText: {
    fontSize: 14,
    color: "#FF4444",
    marginLeft: 4,
  },
  forgotPassword: {
    alignSelf: "flex-end",
    marginBottom: 30,
  },
  forgotPasswordText: {
    color: PRIMARY_COLOR,
    fontSize: 14,
    fontWeight: "500",
  },
  loginButton: {
    backgroundColor: PRIMARY_COLOR,
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: "center",
    width: "100%",
    marginBottom: 30,
    minHeight: 52,
    justifyContent: "center",
  },
  disabledButton: {
    opacity: 0.7,
  },
  loginButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
    width: "100%",
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: "#E5E5E5",
  },
  orText: {
    marginHorizontal: 16,
    color: "#888",
    fontSize: 14,
  },
  socialContainer: {
    width: "100%",
    gap: 12,
    marginBottom: 30,
  },
  socialButton: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#E5E5E5",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    backgroundColor: "#F8F9FA",
    minHeight: 52,
  },
  facebookIcon: {
    width: 24,
    height: 24,
    backgroundColor: "#1877F2",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  facebookText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  googleIconContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  googleIcon: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#4285F4",
  },
  socialButtonText: {
    fontSize: 15,
    color: "#333",
    fontWeight: "500",
  },
  signupContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  joinText: {
    fontSize: 14,
    color: "#666",
  },
  joinLink: {
    color: PRIMARY_COLOR,
    fontWeight: "600",
    fontSize: 14,
  },
});