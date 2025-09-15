import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import CheckboxItem from './CheckboxItem';

const { width } = Dimensions.get('window');

interface CheckboxItem {
  label: string;
  field: string;
}

interface CheckboxGroupProps {
  items: CheckboxItem[];
  values: { [key: string]: boolean };
  onToggle: (field: string) => void;
}

const CheckboxGroup: React.FC<CheckboxGroupProps> = ({
  items,
  values,
  onToggle,
}) => {
  return (
    <View style={styles.checkboxGroup}>
      {items.map((item, index) => (
        <View key={index} style={styles.checkboxColumn}>
          <CheckboxItem
            label={item.label}
            checked={values[item.field]}
            onToggle={() => onToggle(item.field)}
          />
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  checkboxGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  checkboxColumn: {
    width: width > 600 ? '48%' : '100%',
    marginBottom: 10,
  },
});

export default CheckboxGroup;