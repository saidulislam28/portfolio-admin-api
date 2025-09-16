import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';

interface RadioOption {
  id: string;
  title: string;
  desc: string;
}

interface RadioGroupProps {
  options: RadioOption[];
  selectedValue: string | null;
  onValueChange: (option: RadioOption) => void;
}

const RadioGroup: React.FC<RadioGroupProps> = ({
  options,
  selectedValue,
  onValueChange,
}) => {
  return (
    <View style={styles.radioGroup}>
      {options.map(option => (
        <TouchableOpacity
          key={option.id}
          style={styles.radioOption}
          onPress={() => onValueChange(option)}
          activeOpacity={0.7}
        >
          <View style={styles.radioCircle}>
            {selectedValue === option.title && (
              <View style={styles.radioChecked} />
            )}
          </View>
          <Text style={styles.radioLabel}>{option.title}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  radioGroup: {
    marginTop: 10,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
    marginBottom: 8,
  },
  radioCircle: {
    height: 24,
    width: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#3a86ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  radioChecked: {
    height: 14,
    width: 14,
    borderRadius: 7,
    backgroundColor: '#3a86ff',
  },
  radioLabel: {
    fontSize: 16,
    color: '#34495e',
  },
});

export default RadioGroup;