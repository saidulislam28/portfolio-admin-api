import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { Card, Text } from "react-native-paper";
import { useRouter } from "expo-router";
import CommonHeader from "@/components/CommonHeader";
import { PRIMARY_COLOR } from "@/lib/constants";
import { BaseButton } from "@/components/BaseButton";
import { InputField } from "@/components/InputField"; // Add this import

const ChangePasswordScreen = () => {
  const router = useRouter();
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  const handlePasswordChange = (name, value) => {
    setPasswordData({
      ...passwordData,
      [name]: value,
    });
  };

  const validatePasswordForm = () => {
    const newErrors: any = {};

    if (!passwordData.currentPassword) {
      newErrors.currentPassword = "Current password is required";
    }

    if (!passwordData.newPassword) {
      newErrors.newPassword = "New password is required";
    } else if (passwordData.newPassword.length < 6) {
      newErrors.newPassword = "Password must be at least 6 characters";
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const savePassword = () => {
    setLoading(true)
    if (validatePasswordForm()) {
      // In a real app, you would call an API here
      router.back();
    }
    setLoading(false)
  };

  const getPasswordStrength = (password) => {
    if (!password) return 0;
    if (password.length < 6) return 1;
    if (password.length < 8) return 2;
    if (/[A-Z]/.test(password) && /[0-9]/.test(password)) return 4;
    return 3;
  };

  const renderPasswordStrength = (password) => {
    const strength = getPasswordStrength(password);
    const colors = ["#ff0000", "#ff4500", "#ffa500", "#9acd32", "#008000"];
    const labels = ["Very Weak", "Weak", "Moderate", "Strong", "Very Strong"];

    return (
      <View style={styles.strengthContainer}>
        <View style={styles.strengthBar}>
          {[1, 2, 3, 4].map((i) => (
            <View
              key={i}
              style={[
                styles.strengthSegment,
                {
                  backgroundColor: i <= strength ? colors[strength] : "#e0e0e0",
                },
              ]}
            />
          ))}
        </View>
        <Text style={[styles.strengthText, { color: colors[strength] }]}>
          {labels[strength]}
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <CommonHeader />
      <Card style={styles.section}>
        <Card.Content>
          <Text variant="titleLarge" style={styles.title}>
            Change Password
          </Text>

          <InputField
            label="Current Password"
            value={passwordData.currentPassword}
            onChangeText={(text) => handlePasswordChange("currentPassword", text)}
            error={errors.currentPassword}
            isPassword={true}
            focusedField={focusedField}
            fieldKey="currentPassword"
            onFocus={() => setFocusedField("currentPassword")}
            onBlur={() => setFocusedField(null)}
            placeholder="Enter your current password"
            testID="currentPassword-input"
          />

          <InputField
            label="New Password"
            value={passwordData.newPassword}
            onChangeText={(text) => handlePasswordChange("newPassword", text)}
            error={errors.newPassword}
            isPassword={true}
            focusedField={focusedField}
            fieldKey="newPassword"
            onFocus={() => setFocusedField("newPassword")}
            onBlur={() => setFocusedField(null)}
            placeholder="Enter your new password"
            testID="newPassword-input"
          />
          {passwordData.newPassword && renderPasswordStrength(passwordData.newPassword)}

          <InputField
            label="Confirm New Password"
            value={passwordData.confirmPassword}
            onChangeText={(text) => handlePasswordChange("confirmPassword", text)}
            error={errors.confirmPassword}
            isPassword={true}
            focusedField={focusedField}
            fieldKey="confirmPassword"
            onFocus={() => setFocusedField("confirmPassword")}
            onBlur={() => setFocusedField(null)}
            placeholder="Confirm your new password"
            testID="confirmPassword-input"
          />

          <BaseButton
            title="Change Password"
            onPress={savePassword}
            isLoading={loading}
          />
        </Card.Content>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  section: {
    borderRadius: 12,
    elevation: 2,
    margin: 16,
  },
  title: {
    marginBottom: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
  strengthContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    marginTop: -8, // Adjust spacing since InputField has its own margin
  },
  strengthBar: {
    flexDirection: "row",
    height: 4,
    flex: 1,
    marginRight: 8,
  },
  strengthSegment: {
    flex: 1,
    height: 4,
    marginRight: 2,
    borderRadius: 2,
  },
  strengthText: {
    fontSize: 12,
    fontWeight: "bold",
  },
});

export default ChangePasswordScreen;