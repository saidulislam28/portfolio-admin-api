import smLogo from "@/assets/images/smlogo.png";
import { BaseButton } from "@/components/BaseButton";
import { InputField } from "@/components/InputField";
import { ROUTES } from "@/constants/app.routes";
import { useAuth } from "@/context/useAuth";
import { useAuth as useNewAuth } from "@/hooks/useAuth";
import { useSocialAuth } from "@/hooks/useSocialAuth";
import { PRIMARY_COLOR } from "@/lib/constants";
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
  TouchableOpacity,
  View,
} from "react-native";

import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-google-signin/google-signin';

export default function LoginScreen() {
  const router = useRouter();
  const { login }: any = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [showEmailOption, setShowEmailOption] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isAppleLoading, setIsAppleLoading] = useState(false);

  const { signInWithApple, signInWithGoogle } = useNewAuth();


  const {
    socialLoading,
    // isGoogleLoading,
    isFacebookLoading,
    signInWithFacebook
  } = useSocialAuth();

  const validateInputs = () => {
    const cleanedEmail = email.replace(/\s+/g, "").toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Clear previous errors
    setEmailError("");
    setPasswordError("");

    let isValid = true;

    if (!cleanedEmail) {
      setEmailError("Email is required");
      isValid = false;
    }

    if (!password) {
      setPasswordError("Password is required");
      isValid = false;
    }

    if (!isValid) {
      return false;
    }

    if (!emailRegex.test(cleanedEmail)) {
      setEmailError("Please enter a valid email address");
      return false;
    }

    if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters");
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
        setPasswordError("Invalid email or password");
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

  const handlePasswordChange = (text: string) => {
    setPassword(text);
    if (passwordError) {
      setPasswordError("");
    }
  };

  const handleFieldFocus = (fieldKey: string) => {
    setFocusedField(fieldKey);
  };

  const handleFieldBlur = () => {
    setFocusedField(null);
  };

  const handleGoogleSignIn = async () => {
    try {
      setIsGoogleLoading(true);
      await signInWithGoogle();
      router.replace(ROUTES.HOME as any);
    } finally {
      setIsGoogleLoading(false);
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
          <View style={{ width: '100%' }}>
            <InputField
              label="Email"
              value={email}
              onChangeText={handleEmailChange}
              error={emailError}
              fieldKey="email"
              focusedField={focusedField}
              onFocus={() => handleFieldFocus("email")}
              onBlur={handleFieldBlur}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholder="info@gmail.com"
              testID="email-input"
            />

            {/* Password Input */}
            <InputField
              label="Password"
              value={password}
              onChangeText={handlePasswordChange}
              error={passwordError}
              isPassword={true}
              fieldKey="password"
              focusedField={focusedField}
              onFocus={() => handleFieldFocus("password")}
              onBlur={handleFieldBlur}
              autoCapitalize="none"
              placeholder="Enter Your Password"
              testID="password-input"
            />
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

            <GoogleSigninButton onPress={handleGoogleSignIn} />
            {/* <TouchableOpacity
              style={[styles.socialButton, isGoogleLoading && styles.disabledButton]}
              onPress={handleGoogleSignIn}
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
            </TouchableOpacity> */}
          </View>

          {/* Join Us Link */}
          <View style={styles.signupContainer}>
            <Text style={styles.joinText}>Don't have an account? </Text>
            <Link href={ROUTES.REGISTRATION as any}>
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
  forgotPassword: {
    alignSelf: "flex-end",
    marginBottom: 30,
  },
  forgotPasswordText: {
    color: PRIMARY_COLOR,
    fontSize: 14,
    fontWeight: "500",
  },
  disabledButton: {
    opacity: 0.7,
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