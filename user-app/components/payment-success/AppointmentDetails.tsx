import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { AppointmentDto } from '@/types/orders';

interface AppointmentDetailsProps {
  appointments: AppointmentDto[];
}

function formatUTCToLocalTime(utcString: string): string {
  // Parse the ISO UTC string directly
  const utcDate = new Date(utcString);

  // Format to local time in "hh:mm AM/PM" format
  return utcDate.toLocaleTimeString([], {
    hour12: true,
    hour: '2-digit',
    minute: '2-digit'
  });
}

export const AppointmentDetails: React.FC<AppointmentDetailsProps> = ({ appointments }) => {
  if (!appointments || appointments.length === 0) return null;

  return (
    <>
      {appointments.map((appointment, index) => (
        <AppointmentItem
          key={index}
          appointment={appointment}
          index={index}
          isMultiple={appointments.length > 1}
          showDivider={index < appointments.length - 1}
        />
      ))}
    </>
  );
};

interface AppointmentItemProps {
  appointment: AppointmentDto;
  index: number;
  isMultiple: boolean;
  showDivider: boolean;
}

const AppointmentItem: React.FC<AppointmentItemProps> = ({
  appointment,
  index,
  isMultiple,
  showDivider,
}) => {

  return (
    <View style={index > 0 ? styles.separator : null}>
      {isMultiple && (
        <Text style={styles.header}>Appointment {index + 1}</Text>
      )}
      
      <DetailRow label="Appointment ID" value={`#${appointment.appointmentId}`} />
      <Divider />
      <DetailRow label="Date" value={appointment.date} />
      <Divider />
      <DetailRow label="Time" value={formatUTCToLocalTime(appointment.time)} />
      
      {showDivider && <Divider />}
    </View>
  );
};

const DetailRow: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <View style={styles.detailRow}>
    <Text style={styles.label}>{label}</Text>
    <Text style={styles.value}>{value}</Text>
  </View>
);

const Divider: React.FC = () => <View style={styles.divider} />;

const styles = StyleSheet.create({
  separator: {
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 2,
    borderTopColor: '#F0F0F0',
  },
  header: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4A90E2',
    marginBottom: 12,
    textAlign: 'center',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  label: {
    fontSize: 15,
    color: '#666',
    fontWeight: '500',
    flex: 1,
  },
  value: {
    fontSize: 15,
    color: '#2C2C54',
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'right',
  },
  divider: {
    height: 1,
    backgroundColor: '#E8E8E8',
    marginVertical: 12,
  },
});