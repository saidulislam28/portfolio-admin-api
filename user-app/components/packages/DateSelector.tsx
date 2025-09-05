import { BLACK, DARK_GRAY, LIGHT_GRAY, PRIMARY_COLOR, WHITE } from '@/lib/constants';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function DateSelector({ dates, selectedDate, onDateSelect }) {
  const formatDateForDisplay = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else {
      return date.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric'
      });
    }
  };

  const getAvailableSlotCount = (dateObj) => {
    return dateObj.slots.filter(slot => !slot.is_booked).length;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Available Dates</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {dates.map((dateObj) => {
          const isSelected = selectedDate === dateObj.date;
          const availableSlots = getAvailableSlotCount(dateObj);

          return (
            <TouchableOpacity
              key={dateObj.date}
              style={[
                styles.dateCard,
                isSelected && styles.selectedDateCard,
                availableSlots === 0 && styles.unavailableDateCard
              ]}
              onPress={() => availableSlots > 0 && onDateSelect(dateObj.date)}
              disabled={availableSlots === 0}
              activeOpacity={0.7}
            >
              <Text style={[
                styles.dateText,
                isSelected && styles.selectedDateText,
                availableSlots === 0 && styles.unavailableDateText
              ]}>
                {formatDateForDisplay(dateObj.date)}
              </Text>
              <Text style={[
                styles.dayText,
                isSelected && styles.selectedDayText,
                availableSlots === 0 && styles.unavailableDayText
              ]}>
                {new Date(dateObj.date).toLocaleDateString('en-US', { day: 'numeric' })}
              </Text>
              <Text style={[
                styles.availabilityText,
                isSelected && styles.selectedAvailabilityText,
                availableSlots === 0 && styles.unavailableAvailabilityText
              ]}>
                {availableSlots === 0 ? 'Full' : `${availableSlots} slots`}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: BLACK,
    marginBottom: 15,
  },
  scrollContent: {
    paddingRight: 20,
    paddingBottom: 50
  },
  dateCard: {
    backgroundColor: WHITE,
    borderRadius: 12,
    padding: 16,
    marginRight: 12,
    minWidth: 100,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: LIGHT_GRAY,
    // shadowColor: '#000',
    // shadowOffset: {
    //   width: 0,
    //   height: 2,
    // },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  selectedDateCard: {
    borderColor: PRIMARY_COLOR,
    backgroundColor: '#f8f9ff',
  },
  unavailableDateCard: {
    backgroundColor: '#f5f5f5',
    borderColor: '#e0e0e0',
  },
  dateText: {
    fontSize: 14,
    fontWeight: '500',
    color: DARK_GRAY,
    marginBottom: 4,
  },
  selectedDateText: {
    color: PRIMARY_COLOR,
  },
  unavailableDateText: {
    color: '#999',
  },
  dayText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  selectedDayText: {
    color: PRIMARY_COLOR,
  },
  unavailableDayText: {
    color: '#999',
  },
  availabilityText: {
    fontSize: 12,
    color: DARK_GRAY,
  },
  selectedAvailabilityText: {
    color: PRIMARY_COLOR,
  },
  unavailableAvailabilityText: {
    color: '#999',
  },
});