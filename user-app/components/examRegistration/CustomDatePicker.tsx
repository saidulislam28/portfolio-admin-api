import { useState } from 'react';
import { View, Text, TouchableOpacity, Platform, StyleSheet } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function CustomDatePicker({ date, onDateChange }) {
  const [showPicker, setShowPicker] = useState(false);
  
  const onChange = (event, selectedDate) => {
    setShowPicker(Platform.OS === 'ios');
    if (selectedDate) {
      onDateChange(selectedDate);
    }
  };
  
  return (
    <View>
      <TouchableOpacity 
        style={styles.dateInput} 
        onPress={() => setShowPicker(true)}
      >
        <Text>{date.toDateString()}</Text>
      </TouchableOpacity>
      
      {showPicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={onChange}
          minimumDate={new Date()}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  dateInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10
  }
});