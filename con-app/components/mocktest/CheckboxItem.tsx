import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

interface CheckboxItemProps {
  label: string;
  checked: boolean;
  onToggle: () => void;
}

const CheckboxItem: React.FC<CheckboxItemProps> = ({
  label,
  checked,
  onToggle,
}) => {
  return (
    <TouchableOpacity
      style={styles.checkboxContainer}
      onPress={onToggle}
    >
      <Text style={styles.checkboxIcon}>{checked ? '☑' : '□'}</Text>
      <Text style={styles.checkboxLabel}>{label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 6,
    backgroundColor: '#f9f9f9',
    marginBottom: 8,
  },
  checkboxIcon: {
    fontSize: 24,
    color: '#3498db',
    marginRight: 12,
    minWidth: 24,
  },
  checkboxLabel: {
    fontSize: 16,
    color: '#34495e',
    flex: 1,
  },
});

export default CheckboxItem;