import React, { useEffect, useState } from 'react';
import {
  Alert,
  Dimensions,
  Platform,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

// Import components
import ConsultationNotesCard from '@/components/appointment-details/ConsultantNoteModal';
import StatusModal from '@/components/appointment-details/statusModal';
import { VideoCallButton } from '@/components/appointment-details/video-call-button';
import { BaseButton } from '@/components/BaseButton';
import AppointmentHeader from '@/components/appointment-details/AppointmentHeader';
import StatusCard from '@/components/appointment-details/StatusCard';
import UserInfoCard from '@/components/appointment-details/UserInfoCard';
import ScheduleCard from '@/components/appointment-details/ScheduleCard';

// Import utilities and types
import { ROUTES } from '@/constants/app.routes';
import { useAuth } from '@/context/useAuth';
import { PACKAGE_SERVICE_TYPE, PRIMARY_COLOR } from '@/lib/constants';
import { callService } from '@/services/AgoraCallService';
import { startAudioService } from '@/services/AudioService';
import { getStatusColor } from '@/utility/statusColor';
import { useCallStore } from '@/zustand/callStore';
import {
  API_CONSULTANT,
  Get,
  Patch,
  replacePlaceholders,
  sendCallStartNotificationToUser,
} from '@sm/common';

// Import types
import { Appointment, AppointmentDetailPageProps, BookingStatus } from '@/types/appointment-details';

const { width } = Dimensions.get('window');
const isTablet = width >= 600;

// Constants that depend on tablet status
const CARD_PADDING = isTablet ? 24 : 16;
const PROFILE_IMAGE_SIZE = isTablet ? 100 : 60;
const FONT_SIZE_LARGE = isTablet ? 22 : 18;
const FONT_SIZE_MEDIUM = isTablet ? 18 : 16;
const FONT_SIZE_SMALL = isTablet ? 16 : 14;

const BOOKING_STATUS = {
  PENDING: 'PENDING',
  CONFIRMED: 'CONFIRMED',
  CANCELLED: 'CANCELLED',
  COMPLETED: 'COMPLETED',
} as const;

const AppointmentDetailPage: React.FC<AppointmentDetailPageProps> = ({
  appointment: propAppointment,
  onCallStart,
  showHeader = true,
  showActions = true,
  isTabletOverride,
}: any) => {
  const router = useRouter();
  const params = useLocalSearchParams();

  // Calculate tablet status - allow override via props
  const calculatedIsTablet =
    isTabletOverride !== undefined ? isTabletOverride : width >= 600;
  const isTablet = calculatedIsTablet;

  const [isLoading, setIsLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState('');
  const [isStatusModalVisible, setIsStatusModalVisible] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<BookingStatus>(
    BOOKING_STATUS.PENDING
  );
  const [statusCLoading, setStatusCLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const { user } = useAuth();

  const { startCall } = useCallStore();

  // Use appointment from props or parse from params
  const getAppointmentId = () => {
    if (propAppointment?.id) return propAppointment.id;
    if (params?.appointment) {
      try {
        const parsed = JSON.parse(params.appointment as string);
        return parsed.id;
      } catch (err) {
        console.error('Failed to parse appointment:', err);
        return null;
      }
    }
    return null;
  };

  const statusOptions = Object.values(BOOKING_STATUS)?.filter(
    i => i !== appointment?.status
  ) as BookingStatus[];

  const appointmentId = getAppointmentId();

  useEffect(() => {
    if (!appointmentId) {
      setIsLoading(false);
      return;
    }

    handleFetchAppointment();
  }, [appointmentId]);

  const handleFetchAppointment = async () => {
    try {
      setRefreshing(true);
      const response = await Get(
        API_CONSULTANT.appointment_details.replace('{id}', appointmentId)
      );

      if (response?.data) {
        setAppointment(response.data);
      } else {
        Alert.alert('Error', 'Failed to fetch appointment details');
      }
    } catch (error: any) {
      Alert.alert('Error', error?.message ?? 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = async () => {
    await handleFetchAppointment();
  };

  const handleStatusChange = () => {
    setSelectedStatus(
      (appointment?.status as BookingStatus) || BOOKING_STATUS.PENDING
    );
    setIsStatusModalVisible(true);
  };

  const handleCancelStatusChange = () => {
    setIsStatusModalVisible(false);
    setIsDropdownOpen(false);
    setSelectedStatus(
      (appointment?.status as BookingStatus) || BOOKING_STATUS.PENDING
    );
  };

  const handleConfirmStatusChange = async () => {
    setStatusCLoading(true);
    try {
      const result = await Patch(
        `${API_CONSULTANT.update_appointment}/${appointment?.id}`,
        { status: selectedStatus }
      );
      if (result?.data?.success) {
        setStatusCLoading(false);
        handleFetchAppointment();
        handleRefresh();
        setIsStatusModalVisible(false);
      }
    } catch (error: any) {
      console.log('error>>', error.message);
      Alert.alert('Error', error?.message ?? 'An unexpected error occurred');
    } finally {
      setStatusCLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const startVideoCall = async () => {
    console.log('=== button pressed ===', appointment);

    try {
      if (onCallStart) {
        onCallStart();
        return;
      }

      await callService.initialize();
      await startCall(
        appointment?.token as any,
        Number(appointment?.consultant_id),
        {
          id: Number(appointment?.User?.id) || 0,
          name: appointment?.User?.full_name || '',
          avatar: appointment?.User?.profile_image,
        } as any
      );

      await sendCallStartNotificationToUser(appointment.id);
      startAudioService();
      router.push(
        replacePlaceholders(ROUTES.CALL_USER, {
          id: appointment?.User?.id as any,
          appointment_id: appointment?.id as any,
          service_type: appointment?.Order?.service_type as any,
        }) as any
      );
    } catch (error: any) {
      console.error('Failed to start call:', error);
      Alert.alert(
        'Call Failed',
        'Unable to start the video call. Please try again.',
        [{ text: 'OK' }]
      );
    }
  };

  const formatTime = (dateString: any) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'confirmed':
        return 'checkmark-circle';
      case 'pending':
        return 'time';
      case 'cancelled':
        return 'close-circle';
      case 'completed':
        return 'checkmark-done-circle';
      default:
        return 'help-circle';
    }
  };

  const handleSubmitFeedback = () => {
    console.log('feebdback click');
    if (!appointment) return;

    if (
      appointment?.Order?.service_type ===
      PACKAGE_SERVICE_TYPE.speaking_mock_test
    ) {
      return router.push({
        pathname: ROUTES.MOCK_FEEDBACK_PAGE as any,
        params: {
          consultant_id: `${user?.id}`,
          appointment_id: `${appointment?.id}`,
        },
      });
    }
    router.push({
      pathname: ROUTES.CONVERSATION_FEEDBACK_PAGE as any,
      params: {
        consultant_id: `${user?.id}`,
        appointment_id: `${appointment?.id}`,
      },
    });
  };

  useEffect(() => {
    console.log('use effect 1');
    const updateCountdown = () => {
      if (!appointment?.start_at) return;

      const now = new Date();
      const appointmentTime = new Date(appointment?.start_at);
      const timeDiff = appointmentTime.getTime() - now.getTime();

      if (timeDiff <= 0) {
        setTimeLeft('Starting now!');
      } else {
        const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
          (timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

        if (days > 0) {
          setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`);
        } else if (hours > 0) {
          setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
        } else {
          setTimeLeft(`${minutes}m ${seconds}s`);
        }
      }
    };

    if (appointment?.start_at) {
      updateCountdown();
      const interval = setInterval(updateCountdown, 1000);

      return () => clearInterval(interval);
    }
  }, [appointment?.start_at]);

  const updateNote = async (newNote: string) => {
    if (!appointment) return;

    setStatusCLoading(true);
    try {
      const result = await Patch(
        `${API_CONSULTANT.update_note}/${Number(appointment?.id)}`,
        { notes: newNote }
      );

      if (result.success) {
        setStatusCLoading(false);
        handleFetchAppointment();
        handleRefresh();
      }
    } catch (error: any) {
      Alert.alert('Error', error?.message ?? 'An unexpected error occurred');
    } finally {
      setStatusCLoading(false);
    }
  };

  if (!appointment) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Loading appointment details...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <AppointmentHeader
        appointmentId={appointment.id}
        showHeader={showHeader}
        isTablet={isTablet}
        fontSizeLarge={FONT_SIZE_LARGE}
      />

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={PRIMARY_COLOR}
            colors={[PRIMARY_COLOR]}
          />
        }
      >
        <StatusCard
          status={appointment.status}
          onStatusChange={handleStatusChange}
          isTablet={isTablet}
          fontSizeSmall={FONT_SIZE_SMALL}
          cardPadding={CARD_PADDING}
          getStatusColor={getStatusColor}
          getStatusIcon={getStatusIcon}
        />

        <UserInfoCard
          user={appointment.User}
          isTablet={isTablet}
          fontSizeLarge={FONT_SIZE_LARGE}
          fontSizeSmall={FONT_SIZE_SMALL}
          profileImageSize={PROFILE_IMAGE_SIZE}
        />

        <ScheduleCard
          startAt={appointment.start_at}
          endAt={appointment.end_at}
          durationInMin={appointment.duration_in_min}
          timeLeft={timeLeft}
          isTablet={isTablet}
          fontSizeLarge={FONT_SIZE_LARGE}
          fontSizeMedium={FONT_SIZE_MEDIUM}
          fontSizeSmall={FONT_SIZE_SMALL}
          cardPadding={CARD_PADDING}
          formatDate={formatDate}
          formatTime={formatTime}
        />

        <ConsultationNotesCard
          appointment={appointment}
          uploadNotes={updateNote}
          handleRefresh={handleRefresh}
        />

        {showActions && (
          <View style={styles.actionButtons}>
            <VideoCallButton
              status={appointment.status}
              startVideoCall={startVideoCall}
            />

            <BaseButton
              title="Provide Feedback"
              onPress={handleSubmitFeedback}
              disabled={
                !!(
                  appointment.MockTestFeedback ||
                  appointment.ConversationFeedback
                )
              }
              variant="outline"
            />
          </View>
        )}
      </ScrollView>

      <StatusModal
        isStatusModalVisible={isStatusModalVisible}
        handleCancelStatusChange={handleCancelStatusChange}
        isDropdownOpen={isDropdownOpen}
        setIsDropdownOpen={setIsDropdownOpen}
        selectedStatus={selectedStatus}
        statusOptions={statusOptions}
        setSelectedStatus={setSelectedStatus}
        getStatusColor={getStatusColor}
        handleConfirmStatusChange={handleConfirmStatusChange}
        statusCLoading={statusCLoading}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    position: 'relative',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    paddingHorizontal: 16,
  },
  content: {
    flex: 1,
    paddingHorizontal: 0,
  },
  actionButtons: {
    marginTop: 24,
    marginBottom: 32,
    gap: 12,
  },
});

export default AppointmentDetailPage;