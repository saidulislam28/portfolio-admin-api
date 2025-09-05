import { PRIMARY_COLOR } from "@/lib/constants";
// import { Post } from "@/services/api/api";
import { RESEND_OTP } from "@/services/api/endpoints";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_USER, Post } from "@sm/common";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "./context/useAuth";
import { ROUTES } from "@/constants/app.routes";

const VerifyOtpScreen = () => {
  const { verifyOtp, tempEmail, login }: any = useAuth();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isResending, setIsResending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [resendCount, setResendCount] = useState(0);
  const [countdown, setCountdown] = useState(0);
  const [isBlocked, setIsBlocked] = useState(false);
  const router = useRouter();

  const inputs = useRef<TextInput[]>([]);
  const countdownInterval = useRef<NodeJS.Timeout | null>(null);

  // Check if OTP is complete
  const isOtpComplete = otp.every((digit) => digit !== "");

  // Start countdown timer
  const startCountdown = () => {
    setCountdown(30);
    countdownInterval.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          if (countdownInterval.current) {
            clearInterval(countdownInterval.current);
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Initialize countdown on component mount
  useEffect(() => {
    startCountdown();
    return () => {
      if (countdownInterval.current) {
        clearInterval(countdownInterval.current);
      }
    };
  }, []);

  const handleChange = (text: string, index: number) => {
    if (!/^\d*$/.test(text)) return;

    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    if (text && index < 5) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleVerify = async () => {
    setIsVerifying(true);

    const email = await AsyncStorage.getItem("email");

    const otpValue = otp.join("");
    if (!otpValue || otpValue.length < 6) {
      Alert.alert("Error", "Please enter a valid 6-digit OTP");
      setIsVerifying(false);
      return;
    }

    try {
      const result = await Post(API_USER.verify_otp, {
        email,
        otp: Number(otpValue),
      });
      if (!result.success) {
        Alert.alert("Error", result.error);
        setIsVerifying(false);
        return;
      }
      login(result?.data?.user);
      router.push(ROUTES.HOME);
    } catch (error: any) {
      Alert.alert("Error", error?.message ?? "An unexpected error occurred");
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    // if (isBlocked || countdown > 0 || resendCount >= 5) return;

    const email = await AsyncStorage.getItem("email");
    console.log("email", email);
    setIsResending(true);

    try {
      // Mock API call for resend OTP
      const result = await Post(API_USER.RESEND_OTP, { email });
      if (!result.success) {
        Alert.alert("Error", result.error);
        setIsVerifying(false);
        return;
      }

      // const newResendCount = resendCount + 1;
      // setResendCount(newResendCount);

      // if (newResendCount >= 5) {
      //   setIsBlocked(true);
      //   Alert.alert(
      //     'Account Blocked',
      //     'You have exceeded the maximum number of OTP resend attempts. Please contact support for assistance.',
      //     [{ text: 'OK' }]
      //   );
      // } else {
      //   Alert.alert('Success', 'OTP has been resent to your email');
      //   startCountdown();
      // }
    } catch (error) {
      console.log(error?.message);
    } finally {
      setIsResending(false);
    }
  };

  const getResendButtonText = () => {
    if (isBlocked) return "Contact Support";
    if (isResending) return "Sending...";
    return "Resend OTP";
  };

  const isResendDisabled =
    isBlocked || isResending || countdown > 0 || resendCount >= 5;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={styles.innerContainer}>
        <Text style={styles.title}>Verify Your Email</Text>
        <Text style={styles.subtitle}>Enter the OTP sent to {tempEmail}</Text>

        <View style={styles.otpContainer}>
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              ref={(ref) => (inputs.current[index] = ref!)}
              style={styles.otpBox}
              keyboardType="numeric"
              maxLength={1}
              value={digit}
              onChangeText={(text) => handleChange(text, index)}
              returnKeyType="next"
              autoFocus={index === 0}
            />
          ))}
        </View>

        <TouchableOpacity
          style={[
            styles.button,
            (!isOtpComplete || isVerifying) && styles.buttonDisabled,
          ]}
          onPress={handleVerify}
          disabled={!isOtpComplete || isVerifying}
        >
          {isVerifying ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color="white" />
              <Text style={[styles.buttonText, styles.loadingText]}>
                Verifying...
              </Text>
            </View>
          ) : (
            <Text style={styles.buttonText}>Verify</Text>
          )}
        </TouchableOpacity>

        <View style={styles.resendSection}>
          {isBlocked ? (
            <View style={styles.messageContainer}>
              <Text style={styles.errorMessage}>
                Maximum resend attempts reached
              </Text>
              <Text style={styles.errorSubMessage}>
                Please contact support for assistance
              </Text>
            </View>
          ) : countdown > 0 ? (
            <View style={styles.messageContainer}>
              <Text style={styles.infoMessage}>Didn't receive the code?</Text>
              <Text style={styles.countdownMessage}>
                You can resend in {countdown} seconds
              </Text>
            </View>
          ) : (
            <View style={styles.messageContainer}>
              <Text style={styles.infoMessage}>Didn't receive the code?</Text>
              {resendCount > 0 && (
                <Text style={styles.attemptMessage}>
                  Attempts remaining: {5 - resendCount}
                </Text>
              )}
            </View>
          )}

          <TouchableOpacity
            style={[
              styles.resendButton,
              isResendDisabled && styles.resendButtonDisabled,
            ]}
            onPress={handleResend}
            disabled={isResendDisabled}
          >
            <Text
              style={[
                styles.resendButtonText,
                isResendDisabled && styles.resendButtonTextDisabled,
              ]}
            >
              {isBlocked
                ? "Contact Support"
                : isResending
                  ? "Sending..."
                  : "Resend OTP"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  innerContainer: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
    color: "#333",
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 30,
    textAlign: "center",
    color: "#666",
  },
  otpContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  otpBox: {
    width: 50,
    height: 50,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    textAlign: "center",
    fontSize: 18,
    color: "#333",
  },
  button: {
    backgroundColor: PRIMARY_COLOR,
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 15,
  },
  buttonDisabled: {
    backgroundColor: "#ccc",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  loadingText: {
    marginLeft: 10,
  },
  resendButton: {
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    borderWidth: 1,
    borderColor: PRIMARY_COLOR,
  },
  resendButtonDisabled: {
    borderColor: "#ccc",
  },
  resendButtonText: {
    color: PRIMARY_COLOR,
    fontSize: 16,
    fontWeight: "bold",
  },
  resendButtonTextDisabled: {
    color: "#ccc",
  },
  resendSection: {
    marginTop: 10,
    alignItems: "center",
  },
  messageContainer: {
    alignItems: "center",
    marginBottom: 15,
  },
  infoMessage: {
    fontSize: 14,
    color: "#666",
    marginBottom: 5,
  },
  countdownMessage: {
    fontSize: 14,
    color: "#ff6b35",
    fontWeight: "500",
  },
  attemptMessage: {
    fontSize: 12,
    color: "#999",
  },
  errorMessage: {
    fontSize: 14,
    color: "#ff4444",
    fontWeight: "500",
    marginBottom: 3,
  },
  errorSubMessage: {
    fontSize: 12,
    color: "#999",
    textAlign: "center",
  },
});

export default VerifyOtpScreen;
