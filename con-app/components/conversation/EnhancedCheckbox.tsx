import { FeedbackData } from '@/types/conversation-feedback';
import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { Checkbox } from 'react-native-paper';

interface EnhancedCheckboxProps {
  label: string;
  field: keyof FeedbackData;
  isChecked: boolean;
  onPress: () => void;
}

const EnhancedCheckbox: React.FC<EnhancedCheckboxProps> = ({
  label,
  isChecked,
  onPress,
}) => {
  return (
    <TouchableOpacity
      style={styles.checkboxContainer}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.checkboxWrapper}>
        <Checkbox.Android
          status={isChecked ? 'checked' : 'unchecked'}
          onPress={onPress}
          color="#3a86ff"
          uncheckedColor="#888"
        />
      </View>
      <Text style={styles.checkboxLabel}>{label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: '#f8f9fa',
  },
  checkboxWrapper: {
    marginRight: 12,
  },
  checkboxLabel: {
    fontSize: 16, // Default size, will be overridden by parent styles
    flex: 1,
    color: '#34495e',
  },
});

export default React.memo(EnhancedCheckbox);