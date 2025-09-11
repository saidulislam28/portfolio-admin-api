import * as Localization from 'expo-localization';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Dimensions,
  StyleSheet,
  View,
} from 'react-native';

import { ROUTES } from '@/constants/app.routes';
import { PRIMARY_COLOR } from '@/lib/constants';
import { API_USER, Appointment, categorizeAppointments, CategorizedAppointments, Get } from '@sm/common';
import { useRouter } from 'expo-router';
import LiveAppointments from '@/components/myappointments/LiveAppointmentCard';
import AnimatedTabView from '@/components/myappointments/AnimatedTabView';

const { width: SCREEN_WIDTH } = Dimensions.get('window');


const AppointmentsScreen: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const user_timezone = Localization.getCalendars()[0].timeZone
  const router = useRouter();

  const handleGetAppointments = async () => {
    setIsLoading(true);
    const response = await Get(API_USER.get_appointments);
    if (response.success) {
      setAppointments(response?.data);
      setRefresh(false);
      setIsLoading(false);
      return;
    }
    Alert.alert("Error", "Failed to load data!");
    setIsLoading(false);
  };

  const categorizedAppointments = useMemo((): CategorizedAppointments => {
    return categorizeAppointments(appointments, user_timezone as string);
  }, [appointments]);


  console.log("all appoitment for user>>>", categorizedAppointments)


  const handleAppointmentPress = useCallback((appointment: Appointment) => {
    router.push({
      pathname: ROUTES.BOOKING_DETAILS as any,
      params: { id: appointment.id },
    });
  }, []);

  const handleRefresh = useCallback(() => {
    setRefresh(true);
    handleGetAppointments();
  }, []);

  useEffect(() => {
    handleGetAppointments();
  }, []);

  return (
    <View style={styles.container}>
      <LiveAppointments
        liveAppointments={categorizedAppointments.live}
        onAppointmentPress={handleAppointmentPress}
      />

      <AnimatedTabView
        upcomingAppointments={categorizedAppointments.upcoming}
        pastAppointments={categorizedAppointments.past}
        onAppointmentPress={handleAppointmentPress}
        onRefresh={handleRefresh}
        refreshing={refresh}
      />
    </View>
  );
};

// Styles
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
    color: '#212529',
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
});

export default AppointmentsScreen;