import React, {
  useState,
  useMemo,
  useEffect,
  useRef,
  useCallback,
} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import { Ionicons } from '@expo/vector-icons';
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetFlatList,
} from '@gorhom/bottom-sheet';
import { API_CONSULTANT, Get } from '@sm/common';
import { useRouter } from 'expo-router';
import { ROUTES } from '@/constants/app.routes';
import { BaseButton } from '@/components/BaseButton';
import { convertUtcToTimezoneFormat } from '@/utils/dateTime';
import { getUserDeviceTimezone } from '@/utils/userTimezone';

const getTodayDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0'); // months are 0-based
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const AppointmentManager = () => {
  const [viewMode, setViewMode] = useState('calendar'); // 'calendar' or 'timeline'
  const [selectedDate, setSelectedDate] = useState(getTodayDate());
  const [modalDate, setModalDate] = useState('');
  const [appointmentsData, setappointmentsData] = useState<any>({});
  const router = useRouter();

  // Bottom Sheet refs
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ['25%', '50%', '90%'], []);

  const fetchAppointment = async () => {
    try {
      const response = await Get(API_CONSULTANT.appointment_calendar);
      console.log('consultant appointment', response?.data);
      setappointmentsData(response?.data ?? {});
    } catch (error: any) {
      console.log('Appointment Fetch Error:', error?.message);
    }
  };

  useEffect(() => {
    fetchAppointment();
  }, []);

  // Prepare marked dates for calendar - Fixed to show initially
  const markedDates = useMemo(() => {
    const marked: any = {};

    // Mark all dates with appointments
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

    // Highlight selected date
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

  const getStatusColor = status => {
    switch (status) {
      case 'confirmed':
        return '#4ECDC4';
      case 'pending':
        return '#FFD93D';
      case 'cancelled':
        return '#FF6B6B';
      default:
        return '#95E1D3';
    }
  };

  const getDayAppointments = date => {
    return appointmentsData[date] || [];
  };

  const onDayPress = day => {
    const appointments = getDayAppointments(day.dateString);
    if (appointments.length > 0) {
      setModalDate(day.dateString);
      bottomSheetRef.current?.expand();
    }
    setSelectedDate(day.dateString);
  };

  const handlePressAppointment = (item: any) => {
    bottomSheetRef.current?.close();
    router.push({
      pathname: ROUTES.APPOINTMENT_DETAIL,
      params: { appointment: JSON.stringify(item) },
    });
  };

  const handleSheetChanges = useCallback((index: number) => {
    console.log('handleSheetChanges', index);
  }, []);

  const renderAppointmentCard = ({ item }: any) => (
    <TouchableOpacity
      onPress={() => handlePressAppointment(item)}
      style={styles.appointmentCard}
    >
      <View style={styles.appointmentTime}>
        <Text style={styles.timeText}>
          {convertUtcToTimezoneFormat(item.start_at, getUserDeviceTimezone())}
        </Text>
        <Text style={styles.durationText}>#{item.id}</Text>
      </View>
      <View style={styles.appointmentDetails}>
        <Text style={styles.clientName}>{item.client}</Text>
        <Text style={styles.appointmentType}>{item.type}</Text>
      </View>
      <View
        style={[
          styles.statusBadge,
          { backgroundColor: getStatusColor(item.status) },
        ]}
      >
        <Text style={styles.statusText}>{item.status.toUpperCase()}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderTimelineView = () => {
    const appointments = getDayAppointments(selectedDate);
    const hours = Array.from({ length: 12 }, (_, i) => i + 8); // 8 AM to 7 PM

    const timelineData = [
      {
        type: 'header',
        date: selectedDate,
      },
      ...hours.map(hour => ({
        type: 'timeSlot',
        hour,
        appointments: appointments.filter(apt => {
          const aptHour = parseInt(apt.time.split(':')[0]);
          return aptHour === hour;
        }),
      })),
    ];

    const renderTimelineItem = ({ item }) => {
      if (item.type === 'header') {
        return (
          <Text style={styles.dateHeader}>
            {new Date(item.date).toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </Text>
        );
      }

      return (
        <View style={styles.timeSlot}>
          <View style={styles.timeLabel}>
            <Text style={styles.timeLabelText}>
              {item.hour > 12
                ? `${item.hour - 12}:00 PM`
                : `${item.hour}:00 AM`}
            </Text>
          </View>
          <View style={styles.appointmentSlot}>
            {item.appointments.map(apt => (
              <TouchableOpacity
                key={apt.id}
                style={styles.timelineAppointment}
                onPress={() => handlePressAppointment(apt)}
              >
                <View style={styles.appointmentHeader}>
                  <Text style={styles.timelineClient}>{apt.client}</Text>
                  <Text style={styles.timelineTime}>
                    {convertUtcToTimezoneFormat(
                      apt.start_at,
                      getUserDeviceTimezone()
                    )}
                  </Text>
                </View>
                <Text style={styles.timelineType}>{apt.type}</Text>
                <View
                  style={[
                    styles.timelineStatus,
                    { backgroundColor: getStatusColor(apt.status) },
                  ]}
                >
                  <Text style={styles.timelineStatusText}>{apt.status}</Text>
                </View>
              </TouchableOpacity>
            ))}
            {item.appointments.length === 0 && (
              <View style={styles.emptySlot}>
                <Text style={styles.emptySlotText}>Available</Text>
              </View>
            )}
          </View>
        </View>
      );
    };

    return (
      <FlatList
        data={timelineData}
        renderItem={renderTimelineItem}
        keyExtractor={(item, index) =>
          item.type === 'header' ? 'header' : `slot-${item.hour}`
        }
        contentContainerStyle={styles.timelineContainer}
        showsVerticalScrollIndicator={false}
      />
    );
  };

  // Prepare calendar view data for FlatList
  const calendarData = [
    { type: 'calendar' },
    { type: 'legend' },
    { type: 'preview' },
  ];

  const renderCalendarItem = ({ item }) => {
    switch (item.type) {
      case 'calendar':
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

      case 'legend':
        return (
          <View style={styles.legendContainer}>
            <Text style={styles.legendTitle}>Appointment Load</Text>
            <View style={styles.legendItems}>
              <View style={styles.legendItem}>
                <View
                  style={[styles.legendDot, { backgroundColor: '#95E1D3' }]}
                />
                <Text style={styles.legendText}>Light (1)</Text>
              </View>
              <View style={styles.legendItem}>
                <View
                  style={[styles.legendDot, { backgroundColor: '#4ECDC4' }]}
                />
                <Text style={styles.legendText}>Moderate (2-3)</Text>
              </View>
              <View style={styles.legendItem}>
                <View
                  style={[styles.legendDot, { backgroundColor: '#FF6B6B' }]}
                />
                <Text style={styles.legendText}>Heavy (4+)</Text>
              </View>
            </View>
          </View>
        );

      case 'preview':
        const appointments = getDayAppointments(selectedDate);
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
                <View key={item.id}>{renderAppointmentCard({ item })}</View>
              ))
            )}
          </View>
        );

      default:
        return null;
    }
  };

  const renderBottomSheetItem = ({ item }: any) =>
    renderAppointmentCard({ item });

  console.log('datata', appointmentsData);
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFB" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Appointments</Text>
        <View style={styles.viewToggle}>
          <TouchableOpacity
            style={[
              styles.toggleButton,
              viewMode === 'calendar' && styles.toggleButtonActive,
            ]}
            onPress={() => setViewMode('calendar')}
          >
            <Ionicons
              name="calendar"
              size={20}
              color={viewMode === 'calendar' ? '#fff' : '#4A90E2'}
            />
            <Text
              style={[
                styles.toggleText,
                viewMode === 'calendar' && styles.toggleTextActive,
              ]}
            >
              Calendar
            </Text>
          </TouchableOpacity>

          {/* <TouchableOpacity
            style={[styles.toggleButton, viewMode === 'timeline' && styles.toggleButtonActive]}
            onPress={() => setViewMode('timeline')}
          >
            <Ionicons name="time" size={20} color={viewMode === 'timeline' ? '#fff' : '#4A90E2'} />
            <Text style={[styles.toggleText, viewMode === 'timeline' && styles.toggleTextActive]}>
              Timeline
            </Text>
          </TouchableOpacity> */}
        </View>
      </View>

      {/* Main Content */}
      {viewMode === 'calendar' ? (
        <FlatList
          data={calendarData}
          renderItem={renderCalendarItem}
          keyExtractor={item => item.type}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.content}
        />
      ) : (
        renderTimelineView()
      )}

      {/* Bottom Sheet */}
      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={snapPoints}
        onChange={handleSheetChanges}
        enablePanDownToClose
        backgroundStyle={styles.bottomSheetBackground}
        handleIndicatorStyle={styles.bottomSheetIndicator}
        backdropComponent={BottomSheetBackdrop}
      >
        <View style={styles.bottomSheetHeader}>
          <Text style={styles.bottomSheetTitle}>
            {modalDate &&
              new Date(modalDate).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
          </Text>
        </View>
        <BottomSheetFlatList
          data={getDayAppointments(modalDate)}
          renderItem={renderBottomSheetItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.bottomSheetList}
        />
      </BottomSheet>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFB',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E1E8ED',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1A202C',
  },
  viewToggle: {
    flexDirection: 'row',
    backgroundColor: '#F7FAFC',
    borderRadius: 8,
    padding: 4,
  },
  toggleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    gap: 8,
  },
  toggleButtonActive: {
    backgroundColor: '#4A90E2',
  },
  toggleText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4A90E2',
  },
  toggleTextActive: {
    color: '#fff',
  },
  content: {
    flexGrow: 1,
  },
  calendar: {
    margin: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  legendContainer: {
    margin: 16,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  legendTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A202C',
    marginBottom: 12,
  },
  legendItems: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  legendText: {
    fontSize: 14,
    color: '#4A5568',
  },
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
  appointmentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  appointmentTime: {
    width: 80,
    alignItems: 'flex-start',
  },
  timeText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A202C',
  },
  durationText: {
    fontSize: 12,
    color: '#718096',
    marginTop: 2,
  },
  appointmentDetails: {
    flex: 1,
    paddingLeft: 16,
  },
  clientName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A202C',
  },
  appointmentType: {
    fontSize: 14,
    color: '#4A5568',
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    minWidth: 80,
    alignItems: 'center',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#fff',
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
  timelineContainer: {
    padding: 16,
    flexGrow: 1,
  },
  dateHeader: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A202C',
    marginBottom: 24,
    textAlign: 'center',
  },
  timeSlot: {
    flexDirection: 'row',
    marginBottom: 16,
    minHeight: 80,
  },
  timeLabel: {
    width: 100,
    alignItems: 'flex-end',
    paddingRight: 16,
    paddingTop: 8,
  },
  timeLabelText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4A5568',
  },
  appointmentSlot: {
    flex: 1,
    borderLeftWidth: 2,
    borderLeftColor: '#E1E8ED',
    paddingLeft: 16,
  },
  timelineAppointment: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  appointmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  timelineClient: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A202C',
  },
  timelineTime: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4A90E2',
  },
  timelineType: {
    fontSize: 14,
    color: '#4A5568',
    marginBottom: 8,
  },
  timelineStatus: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  timelineStatusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
  },
  emptySlot: {
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#F7FAFC',
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: '#CBD5E0',
  },
  emptySlotText: {
    fontSize: 14,
    color: '#A0AEC0',
    textAlign: 'center',
  },
  // Bottom Sheet Styles
  bottomSheetBackground: {
    backgroundColor: '#F8FAFB',
    borderRadius: 24,
  },
  bottomSheetIndicator: {
    backgroundColor: '#CBD5E0',
    width: 40,
  },
  bottomSheetHeader: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E1E8ED',
    backgroundColor: '#fff',
  },
  bottomSheetTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A202C',
    textAlign: 'center',
  },
  bottomSheetList: {
    paddingHorizontal: 16,
    backgroundColor: '#fff',
  },
});

export default AppointmentManager;
