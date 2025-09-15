import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AppointmentCard, { Appointment } from './AppointmentCard';

interface TodayPreviewProps {
  selectedDate: string;
  appointments: Appointment[];
  onPressAppointment: (appointment: Appointment) => void;
}

const TodayPreview: React.FC<TodayPreviewProps> = ({
  selectedDate,
  appointments,
  onPressAppointment,
}) => {
  return (
    <View style={styles.todayPreview}>
      <Text style={styles.previewTitle}>
        {selectedDate === new Date().toISOString().split('T')[0]
          ? "Today's"
          : "Selected Day's"}{' '}
        Appointments
      </Text>
      {appointments.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="calendar-outline" size={48} color="#B0BEC5" />
          <Text style={styles.emptyStateText}>
            No appointments scheduled
          </Text>
        </View>
      ) : (
        appointments.map(item => (
          <AppointmentCard
            key={item.id}
            item={item}
            onPress={onPressAppointment}
          />
        ))
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  todayPreview: {
    margin: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  previewTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A202C',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E1E8ED',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#718096',
    marginTop: 12,
  },
});

export default TodayPreview;