import { AntDesign, MaterialCommunityIcons } from "@expo/vector-icons";
import { Link, useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import { Image } from "react-native";

import smLogo from "@/assets/images/smlogo.png";
import { BaseButton } from "@/components/BaseButton";
import { InputField } from "@/components/InputField";
import { ROUTES } from "@/constants/app.routes";
import { useAuth } from "@/context/useAuth";
import { PRIMARY_COLOR } from "@/lib/constants";
import { Picker } from "@react-native-picker/picker";
import { registerUser } from "@sm/common";
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from "react-native";

export default function RegisterScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [expectedLevel, setExpectedLevel] = useState("");
  const [focusedField, setFocusedField] = useState<string | null>(null);

  // Error states
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    expectedLevel: "",
  });

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

    // Clear errors when filling dummy data
    setErrors({
      name: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      expectedLevel: "",
    });
  }, []);

  // Clear specific error when user starts typing
  const clearError = (field: keyof typeof errors) => {
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

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

  const validateForm = () => {
    const newErrors = {
      name: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      expectedLevel: "",
    };

    let isValid = true;

    // Normalize email and phone
    const cleanedEmail = email.replace(/\s+/g, "").toLowerCase();
    const cleanedPhone = phone.replace(/\s+/g, "");

    // Required field validation
    if (!name.trim()) {
      newErrors.name = "Name is required";
      isValid = false;
    }

    if (!cleanedEmail) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!validateEmail(cleanedEmail)) {
      newErrors.email = "Please enter a valid email address";
      isValid = false;
    }

    // Phone validation (if phone is provided)
    // if (cleanedPhone && !validateBDPhone(cleanedPhone)) {
    //   newErrors.phone = "Please enter a valid Bangladesh phone number (e.g., 01712345678)";
    //   isValid = false;
    // }

    if (!password) {
      newErrors.password = "Password is required";
      isValid = false;
    } else if (!validatePassword(password)) {
      newErrors.password = "Password must be at least 6 characters long";
      isValid = false;
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
      isValid = false;
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
      isValid = false;
    }

    if (!expectedLevel) {
      newErrors.expectedLevel = "Please select your expected level";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleRegister = async () => {
    // Dismiss keyboard
    Keyboard.dismiss();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    // Normalize email
    const cleanedEmail = email.replace(/\s+/g, "").toLowerCase();
    const cleanedPhone = phone.replace(/\s+/g, "");

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
        router.push(`${ROUTES.VERIFY_OTP}?email=${response?.data?.email}` as any);
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


            <View style={{ width: '100%' }}>
              {/* Name Field */}

              <InputField
                label="Name"
                value={name}
                onChangeText={(text) => {
                  setName(text);
                  clearError('name');
                }}
                error={errors.name}
                placeholder="Enter Your Name"
                fieldKey="name"
                focusedField={focusedField}
                onFocus={() => setFocusedField('name')}
                onBlur={() => setFocusedField(null)}
                returnKeyType="next"
                testID="name-input"
              />

              {/* Email Field */}
              <InputField
                label="Email"
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  clearError('email');
                }}
                error={errors.email}
                placeholder="Enter Your Email"
                fieldKey="email"
                focusedField={focusedField}
                onFocus={() => setFocusedField('email')}
                onBlur={() => setFocusedField(null)}
                keyboardType="email-address"
                autoCapitalize="none"
                returnKeyType="next"
                testID="email-input"
              />

              {/* Phone Field */}
              <InputField
                label="Phone"
                value={phone}
                onChangeText={(text) => {
                  setPhone(text);
                  clearError('phone');
                }}
                error={errors.phone}
                placeholder="Enter Your Phone Number"
                fieldKey="phone"
                focusedField={focusedField}
                onFocus={() => setFocusedField('phone')}
                onBlur={() => setFocusedField(null)}
                keyboardType="phone-pad"
                returnKeyType="next"
                testID="phone-input"
              />

              {/* Password Field */}
              <InputField
                label="Password"
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  clearError('password');
                }}
                error={errors.password}
                placeholder="Enter Your Password"
                fieldKey="password"
                focusedField={focusedField}
                onFocus={() => setFocusedField('password')}
                onBlur={() => setFocusedField(null)}
                isPassword={true}
                returnKeyType="next"
                testID="password-input"
              />

              {/* Confirm Password Field */}
              <InputField
                label="Confirm Password"
                value={confirmPassword}
                onChangeText={(text) => {
                  setConfirmPassword(text);
                  clearError('confirmPassword');
                }}
                error={errors.confirmPassword}
                placeholder="Confirm Your Password"
                fieldKey="confirmPassword"
                focusedField={focusedField}
                onFocus={() => setFocusedField('confirmPassword')}
                onBlur={() => setFocusedField(null)}
                isPassword={true}
                returnKeyType="next"
                testID="confirm-password-input"
              />

            </View>


            {/* Expected Level Field */}
            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>Expected Level</Text>
              <View style={[
                styles.pickerContainer,
                focusedField === 'expectedLevel' && styles.pickerContainerFocused,
                errors.expectedLevel && styles.pickerContainerError
              ]}>
                <MaterialCommunityIcons
                  name="calendar-account-outline"
                  size={20}
                  style={styles.icon}
                />
                <Picker
                  selectedValue={expectedLevel}
                  onValueChange={(itemValue) => {
                    setExpectedLevel(itemValue);
                    clearError('expectedLevel');
                  }}
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
              {errors.expectedLevel && (
                <Text style={styles.errorText}>{errors.expectedLevel}</Text>
              )}
            </View>

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
              <Link href={ROUTES.LOGIN as any}>
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
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 14,
    color: "#212529",
    marginBottom: 6,
  },
  pickerContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: "#CED4DA",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    backgroundColor: "#FFFFFF",
    height: 48,
  },
  pickerContainerFocused: {
    borderColor: "#0D6EFD",
  },
  pickerContainerError: {
    borderColor: "#DC3545",
  },
  icon: {
    marginRight: 12,
    color: "#999",
  },
  picker: {
    flex: 1,
    color: "#333",
  },
  errorText: {
    color: "#DC3545",
    fontSize: 14,
    marginTop: 8,
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