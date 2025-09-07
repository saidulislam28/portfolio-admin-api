import { AntDesign, Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { Link, useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import { Image } from "react-native";

import { useAuth } from "@/context/useAuth";
import smLogo from "@/assets/images/smlogo.png";
import { ROUTES } from "@/constants/app.routes";
import { PRIMARY_COLOR } from "@/lib/constants";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Picker } from "@react-native-picker/picker";
import { registerUser } from "@sm/common";
import {
  ActivityIndicator,
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { BaseButton } from "@/components/BaseButton";

export default function RegisterScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [expectedLevel, setExpectedLevel] = useState("");

  const router = useRouter();
  const { register } = useAuth();

  const fillDummyData = useCallback(() => {
    const randomSuffix = Math.floor(100 + Math.random() * 900);
    const dummyEmail = `user${randomSuffix}@example.com`;

    setName("John Doe");
    setEmail(dummyEmail);
    setPhone(`01712345${randomSuffix}`);
    setPassword("123456");
    setConfirmPassword("123456");
    setExpectedLevel("medium");
  }, []);

  // Email validation regex
  const validateEmail = (email: any) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Bangladesh phone number validation regex
  const validateBDPhone = (phone: string): boolean => {
    // Remove spaces and non-digits
    const cleanedPhone = phone.replace(/\s+/g, "").trim();

    // Regex for Bangladeshi phone numbers: 11 digits starting with allowed prefixes
    const bdPhoneRegex = /^(013|014|015|016|017|018|019)\d{8}$/;

    return bdPhoneRegex.test(cleanedPhone);
  };

  // Password validation (minimum 6 characters)
  const validatePassword = (password: any) => {
    return password.length >= 6;
  };

  const handleRegister = async () => {
    // Dismiss keyboard
    Keyboard.dismiss();

    setLoading(true);
    setError("");

    // Normalize email
    const cleanedEmail = email.replace(/\s+/g, "").toLowerCase();
    const cleanedPhone = phone.replace(/\s+/g, "");

    // Required field check
    if (!name || !cleanedEmail || !password || !expectedLevel) {
      Alert.alert("Error", "Please fill all required fields.");
      setLoading(false);
      return;
    }

    // Email validation
    if (!validateEmail(cleanedEmail)) {
      Alert.alert("Invalid Email", "Please enter a valid email address.");
      setLoading(false);
      return;
    }

    // Phone validation (if phone is provided)
    // if (cleanedPhone && !validateBDPhone(cleanedPhone)) {
    //   Alert.alert(
    //     "Invalid Phone Number",
    //     "Please enter a valid Bangladesh phone number (e.g., 01712345678 or +8801712345678)."
    //   );
    //   setLoading(false);
    //   return;
    // }

    // Password validation
    if (!validatePassword(password)) {
      Alert.alert(
        "Invalid Password",
        "Password must be at least 6 characters long."
      );
      setLoading(false);
      return;
    }

    const registerData: any = {
      full_name: name,
      email: cleanedEmail,
      password,
      phone: cleanedPhone,
      expected_level: expectedLevel,
    };

    try {
      const response = await registerUser(registerData);
      if (response.success) {
        router.push(`${ROUTES.VERIFY_OTP}?email=${response?.data?.email}`);
      } else {
        // Show API error instead of going to OTP page
        const errorMessage =
          response.message ||
          response.error ||
          "Registration failed. Please try again.";
        console.log("error registration", response?.error);
        Alert.alert("Registration Error", errorMessage);
      }
    } catch (error: any) {
      console.log("Registration error:", error);
      // Show specific error from API if available
      let errorMessage = "Something went wrong! Please try again.";

      if (error.response?.data?.message) {
        const msg = error.response.data.message;
        if (Array.isArray(msg)) {
          errorMessage = msg.join("\n"); // show all errors nicely
        } else {
          errorMessage = msg;
        }
      }

      Alert.alert("Registration Error", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ScrollView style={styles.safeArea}>
        {/* <CommonHeader /> */}
        <KeyboardAvoidingView
          style={styles.keyboardAvoidingView}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
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

            <Text style={styles.title}>Hi, Welcome</Text>
            <Text style={styles.subtitle}>
              You can search course, apply course and find{"\n"}
              scholarship for abroad studies.
            </Text>

            {/* Name Field */}
            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>Name</Text>
              <View style={styles.inputContainer}>
                <MaterialCommunityIcons
                  name="account-outline"
                  size={20}
                  style={styles.icon}
                />
                <TextInput
                  placeholder="Enter Your Name"
                  style={styles.input}
                  value={name}
                  onChangeText={setName}
                  returnKeyType="next"
                  blurOnSubmit={false}
                />
              </View>
            </View>

            {/* Email Field */}
            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>Email</Text>
              <View style={styles.inputContainer}>
                <MaterialCommunityIcons
                  name="email-outline"
                  size={20}
                  style={styles.icon}
                />
                <TextInput
                  placeholder="Enter Your Email"
                  style={styles.input}
                  keyboardType="email-address"
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  returnKeyType="next"
                  blurOnSubmit={false}
                />
              </View>
            </View>

            {/* Phone Field */}
            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>Phone</Text>
              <View style={styles.inputContainer}>
                <MaterialCommunityIcons
                  name="phone-outline"
                  size={20}
                  style={styles.icon}
                />
                <TextInput
                  placeholder="01712345678"
                  style={styles.input}
                  keyboardType="phone-pad"
                  value={phone}
                  onChangeText={setPhone}
                  returnKeyType="next"
                  blurOnSubmit={false}
                />
              </View>
            </View>

            {/* Password Field */}
            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>Password</Text>
              <View style={styles.inputContainer}>
                <MaterialCommunityIcons
                  name="lock-outline"
                  size={20}
                  style={styles.icon}
                />
                <TextInput
                  placeholder="Enter Your Password"
                  secureTextEntry={!passwordVisible}
                  style={styles.input}
                  value={password}
                  onChangeText={setPassword}
                  returnKeyType="next"
                  blurOnSubmit={false}
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
              <Text style={styles.helperText}>Must be 6 characters</Text>
            </View>

            {/* Confirm Password Field */}
            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>Confirm Password</Text>
              <View style={styles.inputContainer}>
                <MaterialCommunityIcons
                  name="lock-outline"
                  size={20}
                  style={styles.icon}
                />
                <TextInput
                  placeholder="Confirm Your Password"
                  secureTextEntry={!confirmPasswordVisible}
                  style={styles.input}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  returnKeyType="next"
                  blurOnSubmit={false}
                />
                <TouchableOpacity
                  onPress={() =>
                    setConfirmPasswordVisible(!confirmPasswordVisible)
                  }
                >
                  <Feather
                    name={confirmPasswordVisible ? "eye" : "eye-off"}
                    size={20}
                    style={styles.iconRight}
                  />
                </TouchableOpacity>
              </View>
              <Text style={styles.helperText}>Must be 6 characters</Text>
            </View>

            {/* Expected Level Field */}
            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>Expected Level</Text>
              <View style={styles.pickerContainer}>
                <MaterialCommunityIcons
                  name="calendar-account-outline"
                  size={20}
                  style={styles.icon}
                />
                <Picker
                  selectedValue={expectedLevel}
                  onValueChange={(itemValue) => setExpectedLevel(itemValue)}
                  style={styles.picker}
                >
                  <Picker.Item
                    label="Select Expected Level"
                    value=""
                    enabled={false}
                  />
                  <Picker.Item label="Low (3 - 5)" value="low" />
                  <Picker.Item label="Medium (5 - 7)" value="medium" />
                  <Picker.Item label="High (above 7)" value="high" />
                </Picker>
              </View>
            </View>

            {/* Register Button */}
            {/* <TouchableOpacity
              disabled={loading}
              onPress={handleRegister}
              style={[styles.registerButton, loading && styles.disabledButton]}
            >
              {loading ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="small" color="#fff" />
                  <Text style={styles.loadingText}>Registering...</Text>
                </View>
              ) : (
                <Text style={styles.registerButtonText}>Register</Text>
              )}
            </TouchableOpacity> */}
            {__DEV__ && (
              <TouchableOpacity
                onPress={fillDummyData}
                style={styles.dummyDataButton}
              >
                <Text style={styles.dummyDataButtonText}>
                  .FILL DUMMY DATA.
                </Text>
              </TouchableOpacity>
            )}
            <BaseButton
              title="Register"
              onPress={handleRegister}
              isLoading={loading}
            />

            {/* Or Divider */}
            <View style={styles.orContainer}>
              <Text style={styles.orText}>Or</Text>
            </View>

            {/* Social Buttons */}
            <View style={styles.socialButtonsContainer}>
              <TouchableOpacity style={styles.socialButton}>
                <MaterialCommunityIcons
                  name="facebook"
                  size={20}
                  color="#1877F2"
                />
                <Text style={styles.socialButtonText}>
                  Register With Facebook
                </Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.socialButton}>
                <AntDesign name="google" size={20} color="#DB4437" />
                <Text style={styles.socialButtonText}>
                  Register With Google
                </Text>
              </TouchableOpacity>
            </View>

            {/* Login Link */}
            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>Have an account? </Text>
              <Link href={"/login"}>
                <Text style={styles.loginLink}>Login</Text>
              </Link>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </ScrollView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  container: {
    padding: 20,
    alignItems: "center",
    flexGrow: 1,
  },
  logoContainer: {
    marginTop: 20,
    marginBottom: 20,
    alignItems: "center",
  },
  logo: {
    width: 80,
    height: 80,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 8,
  },
  subtitle: {
    textAlign: "center",
    fontSize: 14,
    color: "#666",
    marginBottom: 30,
    lineHeight: 20,
  },
  fieldContainer: {
    width: "100%",
    marginBottom: 20,
  },
  fieldLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: "#E5E5E5",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: "#F8F8F8",
  },
  pickerContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: "#E5E5E5",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: "#F8F8F8",
  },
  icon: {
    marginRight: 12,
    color: "#999",
  },
  iconRight: {
    marginLeft: 12,
    color: "#999",
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
  picker: {
    flex: 1,
    color: "#333",
  },
  helperText: {
    fontSize: 12,
    color: PRIMARY_COLOR,
    marginTop: 4,
    marginLeft: 4,
  },
  registerButton: {
    backgroundColor: PRIMARY_COLOR,
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: "center",
    width: "100%",
    marginTop: 10,
    marginBottom: 20,
  },
  disabledButton: {
    opacity: 0.7,
  },
  registerButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    marginLeft: 8,
  },
  orContainer: {
    marginVertical: 20,
  },
  orText: {
    fontSize: 14,
    color: "#999",
  },
  socialButtonsContainer: {
    width: "100%",
    gap: 12,
    marginBottom: 30,
  },
  socialButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#E5E5E5",
    borderRadius: 8,
    paddingVertical: 12,
    backgroundColor: "#fff",
  },
  socialButtonText: {
    fontSize: 14,
    color: "#333",
    marginLeft: 8,
    fontWeight: "500",
  },
  loginContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  loginText: {
    fontSize: 14,
    color: "#666",
  },
  loginLink: {
    fontSize: 14,
    color: PRIMARY_COLOR,
    fontWeight: "600",
  },
  dummyDataButton: {
    backgroundColor: "#FFD700", // Gold color for visibility
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: "center",
    width: "100%",
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#FFC107",
  },
  dummyDataButtonText: {
    color: "#000",
    fontWeight: "bold",
    fontSize: 14,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
});
