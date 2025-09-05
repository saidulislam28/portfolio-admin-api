import { PACKAGE_SERVICE_TYPE, PRIMARY_COLOR } from "@/lib/constants";
import { SERVICE_TYPE } from "@/store/slices/app/constants";
import {
  AppointmentStatus,
  formatAppointmentTime,
  type Appointment
} from '@/utility/appointment';
import React, { useCallback, useMemo } from "react";
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from "react-native";
const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface AppointmentCardProps {
  appointment: Appointment;
  onPress: (appointment: Appointment) => void;
}

const AppointmentCard: React.FC<AppointmentCardProps> = React.memo(({ appointment, onPress }) => {
  const handlePress = useCallback(() => {
    onPress(appointment);
  }, [appointment, onPress]);

  const isCancelled = appointment.status === AppointmentStatus.CANCELLED;
  const isCompleted = appointment.status === AppointmentStatus.COMPLETED;

  const statusColor = useMemo(() => {
    switch (appointment.status) {
      case AppointmentStatus.CANCELLED:
        return '#FF6B6B';
      case AppointmentStatus.COMPLETED:
        return '#4ECDC4';
      case AppointmentStatus.CONFIRMED:
        return '#45B7D1';
      case AppointmentStatus.PENDING:
        return '#FFA726';
      default:
        return '#6C757D';
    }
  }, [appointment.status]);

  const renderServiceType = () => {
    switch (appointment?.Order?.service_type) {
      case PACKAGE_SERVICE_TYPE.conversation:
        return "Conversation";
      case PACKAGE_SERVICE_TYPE.speaking_mock_test  :
        return "Mock Test";
      default:
        return appointment?.Order?.service_type || "N/A";
    }
  };

  return (
    <TouchableOpacity style={styles.appointmentCard} onPress={handlePress}>
      <View style={styles.cardHeader}>
        <Text style={styles.serviceType}>{renderServiceType()}</Text>
        <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
          <Text style={styles.statusText}>{appointment.status}</Text>
        </View>
      </View>

      <View style={styles.cardContent}>
        <Text style={styles.appointmentId}>ID: #{appointment.id}</Text>

        {appointment.Consultant && (
          <Text style={styles.consultantName}>
            Consultant: {appointment.Consultant.full_name || 'Assigned'}
          </Text>
        )}

        <Text style={styles.appointmentTime}>
          {formatAppointmentTime(appointment.start_at)}
        </Text>

        <Text style={styles.duration}>
          Duration: {appointment.duration_in_min} minutes
        </Text>

        {appointment.notes && (
          <Text style={styles.notes} numberOfLines={2}>
            Notes: {appointment.notes}
          </Text>
        )}
      </View>

      {isCancelled && appointment.cancel_reason && (
        <View style={styles.cancelledSection}>
          <Text style={styles.cancelReason}>Cancelled: {appointment.cancel_reason}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
});



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  liveSection: {
    backgroundColor: '#FFF5F5',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
  },
  liveSectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#DC3545',
    marginBottom: 12,
  },
  tabContainer: {
    flex: 1,
  },
  tabHeader: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
    position: 'relative',
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
  },
  activeTab: {
    // Active tab styling handled by indicator
  },
  tabText: {
    fontSize: 16,
    color: '#6C757D',
    fontWeight: '500',
  },
  activeTabText: {
    color: PRIMARY_COLOR,
    fontWeight: 'bold',
  },
  tabIndicator: {
    position: 'absolute',
    bottom: 0,
    height: 3,
    backgroundColor: PRIMARY_COLOR,
    width: SCREEN_WIDTH / 2,
  },
  tabContentContainer: {
    flex: 1,
    flexDirection: 'row',
    width: SCREEN_WIDTH * 2,
  },
  tabContent: {
    width: SCREEN_WIDTH,
    flex: 1,
  },
  appointmentCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  serviceType: {
    fontSize: 18,
    fontWeight: 'bold',
    color: PRIMARY_COLOR,
    flex: 1,
    textTransform: 'capitalize',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  cardContent: {
    gap: 6,
  },
  appointmentId: {
    fontSize: 14,
    color: '#6C757D',
    fontWeight: '500',
  },
  consultantName: {
    fontSize: 14,
    color: '#495057',
    fontWeight: '500',
  },
  appointmentTime: {
    fontSize: 16,
    color: '#212529',
    fontWeight: '600',
  },
  duration: {
    fontSize: 14,
    color: '#6C757D',
  },
  notes: {
    fontSize: 14,
    color: '#495057',
    fontStyle: 'italic',
  },
  cancelledSection: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E9ECEF',
  },
  cancelReason: {
    fontSize: 14,
    color: '#DC3545',
    fontWeight: '500',
  },
  listContainer: {
    paddingBottom: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyText: {
    fontSize: 16,
    color: '#6C757D',
    textAlign: 'center',
    fontWeight: '500',
  },
});


export default AppointmentCard;