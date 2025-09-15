import React, {
  useState,
  useMemo,
  useEffect,
  useRef,
  useCallback,
} from 'react';
import { View, StyleSheet, FlatList, StatusBar, SafeAreaView } from 'react-native';
import { Calendar } from 'react-native-calendars';
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetFlatList,
} from '@gorhom/bottom-sheet';
import { API_CONSULTANT, Get } from '@sm/common';
import { useRouter } from 'expo-router';
import { ROUTES } from '@/constants/app.routes';
import { getUserDeviceTimezone } from '@/utils/userTimezone';
import { PRIMARY_COLOR } from '@/lib/constants';
import CalendarView from '@/components/calender/CalendarView';
import Legend from '@/components/calender/Legend';
import TodayPreview from '@/components/calender/TodayPreview';
import AppointmentCard from '@/components/calender/AppointmentCard';
import Header from '@/components/calender/Header';
import TimelineView from '@/components/calender/TimelineView';
import BottomSheetContent from '@/components/calender/BottomSheetContent';



const getTodayDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

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

const AppointmentManager = () => {
  const [viewMode, setViewMode] = useState<'calendar' | 'timeline'>('calendar');
  const [selectedDate, setSelectedDate] = useState(getTodayDate());
  const [modalDate, setModalDate] = useState('');
  const [appointmentsData, setAppointmentsData] = useState<AppointmentsData>({});

  const router = useRouter();
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ['25%', '50%', '90%'], []);

  const fetchAppointment = async () => {
    try {
      const response = await Get(API_CONSULTANT.appointment_calendar);
      setAppointmentsData(response?.data ?? {});
    } catch (error: any) {
      console.log('Appointment Fetch Error:', error?.message);
    }
  };

  useEffect(() => {
    fetchAppointment();
  }, []);

  const getDayAppointments = (date: string): Appointment[] => {
    return appointmentsData[date] || [];
  };

  const onDayPress = (day: any) => {
    const appointments = getDayAppointments(day.dateString);
    if (appointments.length > 0) {
      setModalDate(day.dateString);
      bottomSheetRef.current?.expand();
    }
    setSelectedDate(day.dateString);
  };

  const handlePressAppointment = (item: Appointment) => {
    bottomSheetRef.current?.close();
    router.push({
      pathname: ROUTES.APPOINTMENT_DETAIL as any,
      params: { appointment: JSON.stringify(item) },
    });
  };

  const handleSheetChanges = useCallback((index: number) => {
    console.log('handleSheetChanges', index);
  }, []);

  const renderCalendarItem = ({ item }: { item: any }) => {
    switch (item.type) {
      case 'calendar':
        return (
          <CalendarView
            selectedDate={selectedDate}
            onDayPress={onDayPress}
            appointmentsData={appointmentsData}
          />
        );
      case 'legend':
        return <Legend />;
      case 'preview':
        return (
          <TodayPreview
            selectedDate={selectedDate}
            appointments={getDayAppointments(selectedDate)}
            onPressAppointment={handlePressAppointment}
          />
        );
      default:
        return null;
    }
  };

  const renderBottomSheetItem = ({ item }: { item: Appointment }) => (
    <AppointmentCard
      item={item}
      onPress={() => handlePressAppointment(item)}
    />
  );

  const calendarData = [
    { type: 'calendar' },
    { type: 'legend' },
    { type: 'preview' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFB" />

      <Header
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        title="My Appointments"
      />

      {viewMode === 'calendar' ? (
        <FlatList
          data={calendarData}
          renderItem={renderCalendarItem}
          keyExtractor={item => item.type}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.content}
        />
      ) : (
        <TimelineView
          selectedDate={selectedDate}
          appointments={getDayAppointments(selectedDate)}
          onPressAppointment={handlePressAppointment}
        />
      )}

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
        <BottomSheetContent
          modalDate={modalDate}
          appointments={getDayAppointments(modalDate)}
          renderItem={renderBottomSheetItem}
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
  content: {
    flexGrow: 1,
  },
  bottomSheetBackground: {
    backgroundColor: '#F8FAFB',
    borderRadius: 24,
  },
  bottomSheetIndicator: {
    backgroundColor: '#CBD5E0',
    width: 40,
  },
});

export default AppointmentManager;