import React, { useMemo } from 'react';
import { Calendar } from 'react-native-calendars';
import { StyleSheet } from 'react-native';

interface Appointment {
  id: string;
  client: string;
  status: string;
  type: string;
  start_at: string;
}

interface AppointmentsData {
  [date: string]: Appointment[];
}

interface CalendarViewProps {
  selectedDate: string;
  onDayPress: (day: any) => void;
  appointmentsData: AppointmentsData;
}

const CalendarView: React.FC<CalendarViewProps> = ({
  selectedDate,
  onDayPress,
  appointmentsData,
}) => {
  const markedDates = useMemo(() => {
    const marked: any = {};

    Object.keys(appointmentsData).forEach(date => {
      const count = appointmentsData[date].length;
      marked[date] = {
        marked: true,
        dotColor: '#4A90E2',
        customStyles: {
          container: {
            backgroundColor:
              count > 3 ? '#FF6B6B' : count > 1 ? '#4ECDC4' : '#95E1D3',
            borderRadius: 8,
          },
          text: {
            color: 'white',
            fontWeight: 'bold',
          },
        },
      };
    });

    if (marked[selectedDate]) {
      marked[selectedDate] = {
        ...marked[selectedDate],
        selected: true,
        selectedColor: '#4A90E2',
      };
    } else {
      marked[selectedDate] = {
        selected: true,
        selectedColor: '#4A90E2',
      };
    }

    return marked;
  }, [selectedDate, appointmentsData]);

  return (
    <Calendar
      style={styles.calendar}
      current={selectedDate}
      onDayPress={onDayPress}
      markedDates={markedDates}
      markingType="custom"
      theme={{
        backgroundColor: '#ffffff',
        calendarBackground: '#ffffff',
        textSectionTitleColor: '#2d4150',
        dayTextColor: '#2d4150',
        todayTextColor: '#4A90E2',
        selectedDayTextColor: '#ffffff',
        monthTextColor: '#2d4150',
        arrowColor: '#4A90E2',
        textDayFontSize: 16,
        textMonthFontSize: 18,
        textDayHeaderFontSize: 14,
      }}
    />
  );
};

const styles = StyleSheet.create({
  calendar: {
    margin: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
});

export default CalendarView;