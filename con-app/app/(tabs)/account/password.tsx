import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Card, Text, TextInput } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { Platform, StatusBar } from 'react-native';
const ChangePasswordScreen = () => {
  const router = useRouter();
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});

  const handlePasswordChange = (name, value) => {
    setPasswordData({
      ...passwordData,
      [name]: value,
    });
  };

  const validatePasswordForm = () => {
    const newErrors = {};

    if (!passwordData.currentPassword) {
      newErrors.currentPassword = 'Current password is required';
    }

    if (!passwordData.newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (passwordData.newPassword.length < 6) {
      newErrors.newPassword = 'Password must be at least 6 characters';
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const savePassword = () => {
    if (validatePasswordForm()) {
      // In a real app, you would call an API here
      router.back();
    }
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
    const colors = ['#ff0000', '#ff4500', '#ffa500', '#9acd32', '#008000'];
    const labels = ['Very Weak', 'Weak', 'Moderate', 'Strong', 'Very Strong'];

    return (
      <View style={styles.strengthContainer}>
        <View style={styles.strengthBar}>
          {[1, 2, 3, 4].map((i) => (
            <View
              key={i}
              style={[
                styles.strengthSegment,
                { backgroundColor: i <= strength ? colors[strength] : '#e0e0e0' },
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
      <Card style={styles.section}>
        <Card.Content>
          <Text variant="titleLarge" style={styles.title}>
            Change Password
          </Text>

          <TextInput
            label="Current Password"
            value={passwordData.currentPassword}
            onChangeText={(text) => handlePasswordChange('currentPassword', text)}
            error={!!errors.currentPassword}
            style={styles.input}
            mode="outlined"
            secureTextEntry
            left={<TextInput.Icon icon="lock" />}
          />
          {errors.currentPassword && (
            <Text style={styles.errorText}>{errors.currentPassword}</Text>
          )}

          <TextInput
            label="New Password"
            value={passwordData.newPassword}
            onChangeText={(text) => handlePasswordChange('newPassword', text)}
            error={!!errors.newPassword}
            style={styles.input}
            mode="outlined"
            secureTextEntry
            left={<TextInput.Icon icon="lock-reset" />}
          />
          {renderPasswordStrength(passwordData.newPassword)}
          {errors.newPassword && (
            <Text style={styles.errorText}>{errors.newPassword}</Text>
          )}

          <TextInput
            label="Confirm New Password"
            value={passwordData.confirmPassword}
            onChangeText={(text) => handlePasswordChange('confirmPassword', text)}
            error={!!errors.confirmPassword}
            style={styles.input}
            mode="outlined"
            secureTextEntry
            left={<TextInput.Icon icon="lock-check" />}
          />
          {errors.confirmPassword && (
            <Text style={styles.errorText}>{errors.confirmPassword}</Text>
          )}

          <Button
            mode="contained"
            onPress={savePassword}
            style={styles.saveButton}
            labelStyle={styles.buttonLabel}
          >
            Change Password
          </Button>
        </Card.Content>
      </Card>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    position: 'relative',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    paddingHorizontal: 16,
  },
  section: {
    borderRadius: 12,
    elevation: 2,
  },
  title: {
    marginBottom: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  input: {
    marginBottom: 8,
    backgroundColor: 'white',
  },
  errorText: {
    color: 'red',
    marginBottom: 12,
    marginLeft: 8,
    fontSize: 12,
  },
  saveButton: {
    marginTop: 16,
    borderRadius: 8,
    backgroundColor: '#6200ee',
  },
  buttonLabel: {
    color: 'white',
    fontWeight: 'bold',
  },
  strengthContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  strengthBar: {
    flexDirection: 'row',
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
    fontWeight: 'bold',
  },
});

export default ChangePasswordScreen;