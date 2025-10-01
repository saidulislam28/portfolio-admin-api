import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  TextInputProps,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { PRIMARY_COLOR } from '@/lib/constants';

const COLORS = {
  danger: '#DC3545',
  label: '#212529',
  primary: PRIMARY_COLOR,
  border: '#CED4DA',
  white: '#FFFFFF',
  placeholder: '#6C757D',
};

interface InputFieldProps extends Omit<TextInputProps, 'style'> {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
  isPassword?: boolean;
  focusedField?: string | null;
  fieldKey: string;
  onFocus?: () => void;
  onBlur?: () => void;
  disabled?: boolean;
  testID?: string;
}

export const InputField: React.FC<InputFieldProps> = ({
  label,
  value,
  onChangeText,
  error,
  isPassword = false,
  focusedField,
  fieldKey,
  onFocus,
  onBlur,
  disabled = false,
  placeholder,
  testID,
  ...textInputProps
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const isFocused = focusedField === fieldKey;

  return (
    <View style={styles.inputGroup}>
      <Text style={styles.label}>{label}</Text>
      <View style={isPassword ? styles.passwordWrapper : undefined}>
        <TextInput
          style={[
            styles.input,
            isFocused && styles.inputFocused,
            error && styles.inputError,
            isPassword && { flex: 1 },
          ]}
          placeholderTextColor={COLORS.placeholder}
          placeholder={placeholder || label}
          secureTextEntry={isPassword && !showPassword}
          value={value}
          onChangeText={onChangeText}
          onFocus={onFocus}
          onBlur={onBlur}
          editable={!disabled}
          testID={testID}
          accessibilityLabel={label}
          {...textInputProps}
        />
        {isPassword && (
          <TouchableOpacity
            onPress={() => setShowPassword(prev => !prev)}
            style={styles.eyeIcon}
            disabled={disabled}
            testID={testID ? `${testID}-toggle-password` : undefined}
            accessibilityLabel={
              showPassword ? 'Hide password' : 'Show password'
            }
            accessibilityRole="button"
          >
            <MaterialIcons
              name={showPassword ? 'visibility' : 'visibility-off'}
              size={22}
              color="#999"
            />
          </TouchableOpacity>
        )}
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  errorText: {
    color: COLORS.danger,
    fontSize: 14,
    marginTop: 8,
  },
  eyeIcon: {
    padding: 8,
    position: 'absolute',
    right: 12,
  },
  input: {
    backgroundColor: COLORS.white,
    borderColor: COLORS.border,
    borderRadius: 10,
    borderWidth: 1,
    fontSize: 16,
    height: 48,
    paddingHorizontal: 12,
    color: COLORS.label, // explicitly set text color, to fix invisible text on android dark mode
  },
  inputError: {
    borderColor: COLORS.danger,
  },
  inputFocused: {
    borderColor: COLORS.primary,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    color: COLORS.label,
    fontSize: 14,
    marginBottom: 6,
  },
  passwordWrapper: {
    alignItems: 'center',
    flexDirection: 'row',
  },
});
