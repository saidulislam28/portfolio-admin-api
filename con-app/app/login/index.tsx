import smLogo from "@/assets/images/smlogo.png";
import { BaseButton } from "@/components/BaseButton";
import { ROUTES } from "@/constants/app.routes";
import { useAuth } from "@/context/useAuth";
import { PRIMARY_COLOR } from "@/lib/constants";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { loginConsultant } from "@sm/common";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Image,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function LoginScreen() {
  const router = useRouter();
  const { login }: any = useAuth();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { logout }: any = useAuth();

  const handleLogin = async () => {
    setLoading(true);

    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      setLoading(false);
      return;
    }

    try {
      const result = await loginConsultant(email, password);
      if (!result.success) {
        Alert.alert("Error", result.message);
        setLoading(false);
        return;
      }
      login(result?.data, result?.data?.token);
      router.push(ROUTES.HOME);
    } catch (error) {
      Alert.alert("Error", error?.message ?? "An unexpected error occurred");
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safearea}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.logoContainer}>
          <Image source={smLogo} style={styles.logo} resizeMode="contain" />
        </View>

        <Text style={styles.title}>Welcome back</Text>
        <Text style={styles.subtitle}>
          You can search course, apply course and find{"\n"}
          scholarship for abroad studies
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

        {/* Password Input */}
        <View style={styles.inputContainer}>
          <Feather name="lock" size={20} style={styles.icon} />
          <TextInput
            placeholder="Enter your Password"
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

        <TouchableOpacity
          onPress={() => router.push(ROUTES.FORGET_PASSWORD)}
          style={styles.forgotPassword}
        >
          <Text style={styles.forgotPasswordText}>Forgot password?</Text>
        </TouchableOpacity>

        {/* Login Button */}
        {/* <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>
            {loading ? "Loading..." : "Login"}
          </Text>
        </TouchableOpacity> */}
        <BaseButton title="Login" disabled={loading} onPress={handleLogin} />

        {/* <View style={styles.dividerContainer}>
          <View style={styles.divider} />
          <Text style={styles.orText}>or</Text>
          <View style={styles.divider} />
        </View>

        <View style={styles.socialContainer}>
          <TouchableOpacity style={styles.socialButton}>
            <Feather name="phone" size={18} color={PRIMARY_COLOR} />
            <Text style={styles.socialButtonText}>Phone Number</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.socialButton}>
            <AntDesign name="google" size={18} color={PRIMARY_COLOR} />
            <Text style={styles.socialButtonText}>Google</Text>
          </TouchableOpacity>
        </View>

        <Link style={{marginTop:20}} href={'/registration'}>
          <Text style={styles.joinText}>
            Don’t have an account? <Text style={styles.joinLink}>Join us</Text>
          </Text>
        </Link> */}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safearea: {
    flex: 1,
    backgroundColor: "#fff",
    position: "relative",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    paddingHorizontal: 16,
  },
  container: {
    flex: 1,
    padding: 24,
    alignItems: "center", // Center-align all child elements horizontally
    justifyContent: "center", // Center-align content vertically
    minHeight: "100%", // Ensure full height for vertical centering
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
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 20,
    color: "#000",
    textAlign: "center", // Center-align text content
    width: "100%", // Full width for proper text centering
  },
  subtitle: {
    textAlign: "center", // Center-align text content
    fontSize: 13,
    color: "#666",
    marginVertical: 16,
    width: "100%", // Full width for proper text centering
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
    color: "#888",
  },
  input: {
    flex: 1,
    fontSize: 14,
    paddingVertical: 0,
    textAlign: "center", // Center-align input text
  },
  forgotPassword: {
    width: "100%",
    alignItems: "center", // Center the forgot password link
    marginBottom: 20,
  },
  forgotPasswordText: {
    color: PRIMARY_COLOR,
    fontSize: 13,
    textAlign: "center", // Center-align text
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
    textAlign: "center", // Center-align button text
  },
});
