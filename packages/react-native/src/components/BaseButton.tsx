import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  View,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

type ButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'outline' | 'text';

type BaseButtonProps = {
  onPress: () => void;
  title: string;
  variant?: ButtonVariant;
  iconName?: React.ComponentProps<typeof MaterialIcons>['name'];
  customIcon?: React.ReactNode;
  isLoading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  testID?: string;
  color?: string;
};

export const BaseButton = ({
  onPress,
  title,
  variant = 'primary',
  iconName,
  customIcon,
  isLoading = false,
  disabled = false,
  fullWidth = true,
  testID,
  color = 'red',
}: BaseButtonProps) => {
  const getButtonStyles = () => {
    switch (variant) {
      case 'primary':
        return [
          styles.button,
          styles.primaryButton,
          { backgroundColor: color },
        ];
      case 'secondary':
        return [styles.button, styles.secondaryButton];
      case 'tertiary':
        return [styles.button, styles.tertiaryButton];
      case 'text':
        return [styles.button, styles.textButton];
      case 'outline':
        return [styles.button, styles.outlineButton, { borderColor: color }];
      default:
        return [styles.button];
    }
  };

  const getTextStyles = () => {
    switch (variant) {
      case 'primary':
        return styles.primaryText;
      case 'secondary':
        return styles.secondaryText;
      case 'tertiary':
        return styles.tertiaryText;
      case 'text':
        return styles.textButtonText;
      case 'outline':
        return [styles.outlineText, { color }];
      default:
        return styles.primaryText;
    }
  };

  return (
    <TouchableOpacity
      style={[
        ...getButtonStyles(),
        fullWidth && styles.fullWidth,
        (isLoading || disabled) && styles.disabled,
      ]}
      onPress={onPress}
      disabled={isLoading || disabled}
      activeOpacity={0.8}
      testID={testID}
      accessibilityLabel={title}
      accessibilityRole="button"
    >
      {isLoading ? (
        <ActivityIndicator color={variant === 'primary' ? '#FFFFFF' : color} />
      ) : (
        <View style={styles.content}>
          {customIcon && <View style={styles.icon}>{customIcon}</View>}
          {!customIcon && iconName && (
            <MaterialIcons
              name={iconName}
              size={24}
              color={variant === 'primary' ? '#FFFFFF' : color}
              style={styles.icon}
            />
          )}
          <Text
            style={[
              getTextStyles(),
              (isLoading || disabled) && styles.disabled,
            ]}
          >
            {title}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    borderRadius: 8,
    height: 50,
    justifyContent: 'center',
    marginBottom: 16,
    paddingHorizontal: 16,
   
  },
  fullWidth: {
    width: '100%',
  },
  content: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  icon: {
    marginRight: 12,
  },
  primaryButton: {
    backgroundColor: 'red',
  },
  tertiaryButton: {
    backgroundColor: 'black',
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderColor: 'red',
    borderWidth: 1,
  },
  primaryText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  tertiaryText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: 'white',
    borderColor: '#DDDDDD',
    borderWidth: 1,
  },
  secondaryText: {
    color: '#344054',
    fontSize: 16,
    fontWeight: '500',
  },
  textButton: {
    backgroundColor: 'transparent',
    paddingVertical: 8,
  },
  textButtonText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '500',
    textDecorationLine: 'underline',
  },
  disabled: {
    backgroundColor: 'grey',
    color: '#AEB3B3',
    fontWeight: '600',
  },
  outlineText: {
    fontSize: 16,
    fontWeight: '500',
  },
});
