import ConsultationNotesCard from "@/components/appointment-details/ConsultantNoteModal";
import StatusModal from "@/components/appointment-details/statusModal";
import { VideoCallButton } from "@/components/appointment-details/video-call-button";
import { ROUTES } from "@/constants/app.routes";
import { useAuth } from "@/context/useAuth";
import {
  PACKAGE_SERVICE_TYPE,
  PRIMARY_COLOR,
  SECONDARY_COLOR,
} from "@/lib/constants";
import { callService } from "@/services/AgoraCallService";
import { startAudioService } from "@/services/AudioService";
import { notificationService } from "@/services/NotificationService";
import { getStatusColor } from "@/utility/statusColor";
import { useCallStore } from "@/zustand/callStore";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { API_CONSULTANT, Get, Patch, USER_ROLE } from "@sm/common";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Dimensions,
  Image,
  Platform,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";

// Define types
export interface User {
  id: number;
  full_name: string;
  profile_image?: string;
  email: string;
  phone?: string;
  is_verified?: boolean;
  expected_level?: string;
  is_test_user?: boolean;
}

export interface Order {
  service_type: string;
}

export interface Feedback {
  MockTestFeedback?: any;
  ConversationFeedback?: any;
}

export interface Appointment {
  id: number;
  token?: string;
  consultant_id: number;
  user_id: number;
  User: User;
  status: string;
  start_at: string;
  end_at: string;
  duration_in_min: number;
  Order?: Order;
  notes?: string;
  MockTestFeedback?: any;
  ConversationFeedback?: any;
}

export interface AppointmentDetailPageProps {
  appointment?: Appointment;
  onRefresh?: () => void;
  onStatusChange?: (newStatus: string) => Promise<boolean>;
  onNoteUpdate?: (newNote: string) => Promise<boolean>;
  onCallStart?: () => void;
  showHeader?: boolean;
  showActions?: boolean;
  isTabletOverride?: boolean;
  customRoutes?: {
    myAppointments: string;
    mockFeedback: string;
    conversationFeedback: string;
    callUser: (userId: number) => string;
  };
  customConstants?: {
    primaryColor?: string;
    secondaryColor?: string;
  };
}

const BOOKING_STATUS = {
  // INITIATED: "INITIATED",
  PENDING: "PENDING",
  CONFIRMED: "CONFIRMED",
  CANCELLED: "CANCELLED",
  COMPLETED: "COMPLETED",
  // NO_SHOW: "NO_SHOW",
} as const;

type BookingStatus = typeof BOOKING_STATUS[keyof typeof BOOKING_STATUS];

const { width, height } = Dimensions.get("window");
const isTablet = width >= 600;
// Constants that depend on tablet status
const CARD_PADDING = isTablet ? 24 : 16;
const PROFILE_IMAGE_SIZE = isTablet ? 100 : 60;
const BUTTON_HEIGHT = isTablet ? 64 : 52;
const FONT_SIZE_LARGE = isTablet ? 22 : 18;
const FONT_SIZE_MEDIUM = isTablet ? 18 : 16;
const FONT_SIZE_SMALL = isTablet ? 16 : 14;


const AppointmentDetailPage: React.FC<AppointmentDetailPageProps> = ({
  appointment: propAppointment,
  onRefresh,
  onStatusChange,
  onNoteUpdate,
  onCallStart,
  showHeader = true,
  showActions = true,
  isTabletOverride,
  customRoutes = {
    myAppointments: ROUTES.MY_APPOINTMENTS,
    mockFeedback: ROUTES.MOCK_FEEDBACK_PAGE,
    conversationFeedback: ROUTES.CONVERSATION_FEEDBACK_PAGE,
    callUser: ROUTES.CALL_USER
  },
  customConstants = {
    primaryColor: PRIMARY_COLOR,
    secondaryColor: SECONDARY_COLOR
  }
}) => {
  const router = useRouter();
  const params = useLocalSearchParams();

  // Calculate tablet status - allow override via props
  const calculatedIsTablet = isTabletOverride !== undefined ? isTabletOverride : width >= 600;
  const isTablet = calculatedIsTablet;



  const [isLoading, setIsLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState("");
  const [isStatusModalVisible, setIsStatusModalVisible] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<BookingStatus>(BOOKING_STATUS.PENDING);
  const [statusCLoading, setStatusCLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [appointment, setAppointment] = useState<Appointment | null>(null); const { user } = useAuth();

  const { startCall, isConnecting, isInCall } = useCallStore();

  // Use appointment from props or parse from params
  const getAppointmentId = () => {
    if (propAppointment?.id) return propAppointment.id;
    if (params?.appointment) {
      try {
        const parsed = JSON.parse(params.appointment as string);
        return parsed.id;
      } catch (err) {
        console.error("Failed to parse appointment:", err);
        return null;
      }
    }
    return null;
  };


  // console.log("apponintment params>>>>", PAppointment)

  const statusOptions = Object.values(BOOKING_STATUS)?.filter(
    (i) => i !== appointment?.status
  ) as BookingStatus[];

  const appointmentId = getAppointmentId();

  useEffect(() => {
    if (!appointmentId) {
      setIsLoading(false);
      return;
    }

    handleFetchAppointment();
  }, [appointmentId]); // Depend on the ID only

  const handleFetchAppointment = async () => {
    try {
      setRefreshing(true);
      const response = await Get(API_CONSULTANT.appointment_details.replace('{id}', appointmentId));

      if (response?.data) {
        setAppointment(response.data);
      } else {
        Alert.alert("Error", "Failed to fetch appointment details");
      }
    } catch (error: any) {
      Alert.alert("Error", error?.message ?? "An unexpected error occurred");
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = async () => {
    console.log(
      "handle refresh"
    )
    await handleFetchAppointment();
  };

  const handleStatusChange = () => {
    setSelectedStatus((appointment?.status as BookingStatus) || BOOKING_STATUS.PENDING);
    setIsStatusModalVisible(true);
  };

  const handleCancelStatusChange = () => {
    setIsStatusModalVisible(false);
    setIsDropdownOpen(false);
    setSelectedStatus((appointment?.status as BookingStatus) || BOOKING_STATUS.PENDING);
  };

  const handleConfirmStatusChange = async () => {

    // console.log("selected status", selectedStatus)

    setStatusCLoading(true);
    try {
      const result = await Patch(
        `${API_CONSULTANT.update_appointment}/${appointment?.id}`,
        { status: selectedStatus }
      );
      // console.log("result is here>>>", result?.data)
      if (result?.data?.success) {
        setStatusCLoading(false)
        handleFetchAppointment();
        handleRefresh();
        setIsStatusModalVisible(false)
      }
    } catch (error: any) {
      console.log("error>>", error.message)
      Alert.alert("Error", error?.message ?? "An unexpected error occurred");
    } finally {
      setStatusCLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const startVideoCall = async () => {

    console.log("=== button pressed ===", appointment?.status);

    try {
      if (onCallStart) {
        // Use custom call start handler if provided
        onCallStart();
        return;
      }

      // Default implementation
      await callService.initialize();
      await startCall(appointment?.token, appointment?.consultant_id, {
        id: appointment?.user_id || 0,
        name: appointment?.User?.full_name || "",
        avatar: appointment?.User?.profile_image,
      });

      const notificationPayload:any = {
        ...appointment,
        caller_name: user?.full_name || "",
      };

      if (user?.profile_image) {
        notificationPayload.caller_image = user.profile_image;
      }

      await notificationService.startCall(
        appointment?.user_id || 0,
        USER_ROLE.user,
        notificationPayload
      );
      startAudioService();
      router.push(customRoutes.callUser(Number(appointment?.user_id)));
    } catch (error) {
      console.error("Failed to start call:", error);
      Alert.alert(
        "Call Failed",
        "Unable to start the video call. Please try again.",
        [{ text: "OK" }]
      );
    }
  };

  const formatTime = (dateString: any) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };



  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case "confirmed":
        return "checkmark-circle";
      case "pending":
        return "time";
      case "cancelled":
        return "close-circle";
      case "completed":
        return "checkmark-done-circle";
      default:
        return "help-circle";
    }
  };

  const handleSubmitFeedback = () => {
    if (!appointment) return;

    if (
      appointment?.Order?.service_type ===
      PACKAGE_SERVICE_TYPE.speaking_mock_test
    ) {
      return router.push({
        pathname: customRoutes.mockFeedback,
        params: {
          consultant_id: JSON.stringify(user?.id),
          appointment: JSON.stringify(appointment),
        },
      });
    }
    router.push({
      pathname: customRoutes.conversationFeedback,
      params: {
        consultant_id: JSON.stringify(user?.id),
        appointment: JSON.stringify(appointment),
      },
    });
  };

  useEffect(() => {
    console.log("use effect 1")
    const updateCountdown = () => {
      if (!appointment?.start_at) return;

      const now = new Date();
      const appointmentTime = new Date(appointment?.start_at);
      const timeDiff = appointmentTime.getTime() - now.getTime();

      if (timeDiff <= 0) {
        setTimeLeft("Starting now!");
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
      // let success = false;

      // if (onNoteUpdate) {
      //   success = await onNoteUpdate(newNote);
      // } else {
      const result = await Patch(
        `${API_CONSULTANT.update_note}/${Number(appointment?.id)}`,
        { notes: newNote }
      );

      console.log("update note result", result?.data)

      if (result.success) {
        setStatusCLoading(false)
        handleFetchAppointment();
        handleRefresh();
      }

      // }

      // if (success) {
      //   handleFetchAppointment();
      // }
    } catch (error: any) {
      Alert.alert("Error", error?.message ?? "An unexpected error occurred");
    } finally {
      setStatusCLoading(false);
    }
  };

  const phoneNumber = appointment?.User?.phone;

  const now = new Date();
  const endAt = appointment ? new Date(appointment?.end_at) : new Date();
  const isExpired = now >= endAt;
  const isTestUser = appointment?.User?.is_test_user;
  const isTestConsultant = user?.is_test_user;
  const startAt = appointment ? new Date(appointment?.start_at) : new Date();
  const isStarted = startAt <= now && now < endAt;



  if (!appointment) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Loading appointment details...</Text>
      </SafeAreaView>
    );
  }

  console.log("appoipntment>>", appointment)

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Header */}
      {showHeader && (
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.replace(ROUTES.MY_APPOINTMENTS)}
            style={styles.backButton}
            hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
          >
            <Ionicons
              name="arrow-back"
              size={isTablet ? 32 : 24}
              color="#1F2937"
            />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { fontSize: isTablet ? FONT_SIZE_LARGE + 4 : FONT_SIZE_LARGE }]}>
            Appointment Details
          </Text>
          <View style={styles.appointmentIdContainer}>
            <Text style={[styles.appointmentId, { fontSize: isTablet ? FONT_SIZE_SMALL : 14 }]}>
              #{appointment?.id}
            </Text>
          </View>
        </View>
      )}

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={customConstants.primaryColor}
            colors={[customConstants.primaryColor]}
          />
        }
      >
        {/* Status Card */}
        <View style={[styles.statusCard, { padding: CARD_PADDING }]}>
          <View style={styles.statusHeader}>
            <View
              style={[
                styles.statusBadge,
                { backgroundColor: getStatusColor(appointment?.status) },
              ]}
            >
              <Ionicons
                name={getStatusIcon(appointment?.status)}
                size={isTablet ? 20 : 16}
                color="white"
              />
              <Text style={styles.statusText}>{appointment?.status}</Text>
            </View>
            <TouchableOpacity
              onPress={handleStatusChange}
              style={[
                styles.statusButton,
                { backgroundColor: customConstants.primaryColor }
              ]}
              activeOpacity={0.7}
            >
              <Text style={styles.changeStatusText}>Change Status</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Client Information */}
        <View style={[styles.card, { padding: CARD_PADDING }]}>
          <View style={styles.cardHeader}>
            <MaterialIcons
              name="person"
              size={isTablet ? 28 : 20}
              color={customConstants.primaryColor}
            />
            <Text style={[styles.cardTitle, { fontSize: isTablet ? FONT_SIZE_LARGE : 16 }]}>
              User Information
            </Text>
          </View>

          <View style={styles.clientInfo}>
            <Image
              source={{
                uri: appointment?.User?.profile_image || "https://avatar.iran.liara.run/public",
              }}
              style={[styles.profileImage, { width: PROFILE_IMAGE_SIZE, height: PROFILE_IMAGE_SIZE }]}
            />
            <View style={styles.clientDetails}>
              <View style={styles.nameRow}>
                <Text style={[styles.clientName, { fontSize: isTablet ? FONT_SIZE_LARGE + 4 : 18 }]}>
                  {appointment?.User?.full_name}
                </Text>
                {appointment?.User?.is_verified && (
                  <Ionicons
                    name="checkmark-circle"
                    size={isTablet ? 24 : 16}
                    color="#10B981"
                  />
                )}
              </View>
              <Text style={styles.clientLevel}>
                {appointment?.User?.expected_level || "Above 7"} Level
              </Text>
            </View>
          </View>
        </View>

        {/* Appointment Schedule */}
        <View style={[styles.card, { padding: CARD_PADDING }]}>
          <View style={styles.cardHeader}>
            <MaterialIcons
              name="schedule"
              size={isTablet ? 28 : 20}
              color={customConstants.primaryColor}
            />
            <Text style={[styles.cardTitle, { fontSize: isTablet ? FONT_SIZE_LARGE : 16 }]}>
              Schedule
            </Text>
          </View>

          <View style={styles.scheduleInfo}>
            <View style={styles.scheduleRow}>
              <View style={styles.scheduleItem}>
                <Text style={styles.scheduleLabel}>Date</Text>
                <Text style={[styles.scheduleValue, { fontSize: isTablet ? FONT_SIZE_MEDIUM : 14 }]}>
                  {formatDate(appointment?.start_at)}
                </Text>
              </View>
            </View>

            <View style={styles.scheduleRow}>
              <View style={styles.scheduleItem}>
                <Text style={styles.scheduleLabel}>Start Time</Text>
                <Text style={[styles.scheduleValue, { fontSize: isTablet ? FONT_SIZE_MEDIUM : 14 }]}>
                  {formatTime(appointment?.start_at)}
                </Text>
              </View>
              <View style={styles.scheduleItem}>
                <Text style={styles.scheduleLabel}>End Time</Text>
                <Text style={[styles.scheduleValue, { fontSize: isTablet ? FONT_SIZE_MEDIUM : 14 }]}>
                  {formatTime(appointment?.end_at)}
                </Text>
              </View>
            </View>

            <View style={styles.scheduleRow}>
              <View style={styles.scheduleItem}>
                <Text style={styles.scheduleLabel}>Duration</Text>
                <Text style={[styles.scheduleValue, { fontSize: isTablet ? FONT_SIZE_MEDIUM : 14 }]}>
                  {appointment?.duration_in_min} minutes
                </Text>
              </View>
              <View style={styles.scheduleItem}>
                <Text style={styles.scheduleLabel}>Starts in:</Text>
                <Text style={[styles.scheduleValue, { color: "#EF4444", fontSize: isTablet ? FONT_SIZE_MEDIUM : 14 }]}>
                  {timeLeft}
                </Text>
              </View>
            </View>
          </View>
        </View>

        <ConsultationNotesCard
          appointment={appointment}
          uploadNotes={updateNote}
          handleRefresh={handleRefresh}
        />

        {/* Action Buttons */}
        {showActions && (
          <View style={styles.actionButtons}>
            <VideoCallButton
              status={appointment?.status}
              startVideoCall={startVideoCall}
            />


            <TouchableOpacity
              style={[
                styles.feedbackButton,
                { height: BUTTON_HEIGHT },
                appointment?.MockTestFeedback || appointment?.ConversationFeedback
                  ? styles.feedbackButtonDisabled
                  : styles.feedbackButton,
              ]}
              onPress={handleSubmitFeedback}
              activeOpacity={0.7}
              disabled={
                !!(
                  appointment?.MockTestFeedback || appointment?.ConversationFeedback
                )
              }
            >
              <MaterialIcons
                name="feedback"
                size={isTablet ? 24 : 18}
                color={customConstants.primaryColor}
              />
              <Text
                style={[
                  styles.feedbackButtonText,
                  appointment?.MockTestFeedback || appointment?.ConversationFeedback
                    ? styles.disableText
                    : styles.feedbackButtonText,
                  { color: customConstants.primaryColor }
                ]}
              >
                Provide Feedback
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {/* Status Change Modal */}
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
        customConstants={customConstants}
        statusCLoading={statusCLoading}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    position: "relative",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    paddingHorizontal: isTablet ? 24 : 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: isTablet ? 24 : 16,
    paddingVertical: isTablet ? 16 : 12,
    backgroundColor: "#fff",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  backButton: {
    padding: isTablet ? 12 : 8,
  },
  headerTitle: {
    fontSize: isTablet ? FONT_SIZE_LARGE + 4 : FONT_SIZE_LARGE,
    fontWeight: "600",
    color: "#1F2937",
  },
  appointmentIdContainer: {
    minWidth: isTablet ? 120 : 80,
    alignItems: "flex-end",
  },
  appointmentId: {
    fontSize: isTablet ? FONT_SIZE_SMALL : 14,
    color: "#6B7280",
    fontWeight: "500",
  },
  content: {
    flex: 1,
    paddingHorizontal: isTablet ? 8 : 0,
  },
  statusCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: CARD_PADDING,
    marginTop: isTablet ? 24 : 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statusHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: isTablet ? 16 : 12,
    paddingVertical: isTablet ? 10 : 6,
    borderRadius: 20,
    gap: 8,
  },
  statusText: {
    color: "white",
    fontSize: isTablet ? FONT_SIZE_SMALL : 12,
    fontWeight: "600",
  },
  statusButton: {
    backgroundColor: PRIMARY_COLOR,
    paddingHorizontal: isTablet ? 20 : 12,
    paddingVertical: isTablet ? 12 : 8,
    borderRadius: 20,
    minWidth: isTablet ? 160 : 120,
    alignItems: "center",
  },
  changeStatusText: {
    fontSize: isTablet ? FONT_SIZE_SMALL : 12,
    fontWeight: "600",
    color: "#fff",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: CARD_PADDING,
    marginTop: isTablet ? 20 : 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: isTablet ? 20 : 16,
    gap: 12,
  },
  cardTitle: {
    fontSize: isTablet ? FONT_SIZE_LARGE : 16,
    fontWeight: "600",
    color: "#1F2937",
  },
  clientInfo: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: isTablet ? 20 : 12,
  },
  profileImage: {
    width: PROFILE_IMAGE_SIZE,
    height: PROFILE_IMAGE_SIZE,
    borderRadius: PROFILE_IMAGE_SIZE / 2,
    backgroundColor: "#E5E7EB",
  },
  clientDetails: {
    flex: 1,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 6,
  },
  clientName: {
    fontSize: isTablet ? FONT_SIZE_LARGE + 4 : 18,
    fontWeight: "600",
    color: "#1F2937",
  },
  clientLevel: {
    fontSize: isTablet ? FONT_SIZE_SMALL : 12,
    color: PRIMARY_COLOR,
    backgroundColor: "#EEF2FF",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: "flex-start",
    marginBottom: isTablet ? 12 : 8,
  },
  contactInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: isTablet ? 8 : 4,
  },
  clientEmail: {
    fontSize: isTablet ? FONT_SIZE_SMALL : 14,
    color: "#6B7280",
  },
  clientPhone: {
    fontSize: isTablet ? FONT_SIZE_SMALL : 14,
    color: "#6B7280",
  },
  scheduleInfo: {
    gap: isTablet ? 16 : 12,
  },
  scheduleRow: {
    flexDirection: "row",
    gap: isTablet ? 24 : 16,
  },
  scheduleItem: {
    flex: 1,
  },
  scheduleLabel: {
    fontSize: isTablet ? FONT_SIZE_SMALL : 12,
    color: "#6B7280",
    marginBottom: isTablet ? 8 : 4,
  },
  scheduleValue: {
    fontSize: isTablet ? FONT_SIZE_MEDIUM : 14,
    fontWeight: "500",
    color: "#1F2937",
  },
  notesText: {
    fontSize: isTablet ? FONT_SIZE_MEDIUM : 14,
    color: "#374151",
    lineHeight: isTablet ? 26 : 20,
  },
  actionButtons: {
    marginTop: isTablet ? 32 : 24,
    marginBottom: isTablet ? 40 : 32,
    gap: isTablet ? 20 : 12,
  },
  primaryButton: {
    backgroundColor: SECONDARY_COLOR,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: isTablet ? 18 : 14,
    borderRadius: 12,
    gap: 12,
    height: BUTTON_HEIGHT,
  },
  primaryButtonText: {
    color: "white",
    fontSize: isTablet ? FONT_SIZE_MEDIUM : 16,
    fontWeight: "600",
  },
  secondaryButtons: {
    flexDirection: "row",
    gap: isTablet ? 20 : 12,
  },
  secondaryButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: isTablet ? 16 : 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#fff",
    gap: 8,
    height: BUTTON_HEIGHT,
  },
  secondaryButtonText: {
    color: PRIMARY_COLOR,
    fontSize: isTablet ? FONT_SIZE_SMALL : 14,
    fontWeight: "500",
  },
  feedbackButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: isTablet ? 16 : 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#fff",
    gap: 8,
    height: BUTTON_HEIGHT,
  },
  feedbackButtonDisabled: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: isTablet ? 16 : 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "gray",
    gap: 8,
    height: BUTTON_HEIGHT,
  },
  feedbackButtonText: {
    color: PRIMARY_COLOR,
    fontSize: isTablet ? FONT_SIZE_SMALL : 14,
    fontWeight: "500",
  },
  disableText: {
    color: "white",
    fontSize: isTablet ? FONT_SIZE_SMALL : 14,
    fontWeight: "500",
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: isTablet ? 40 : 20,
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: isTablet ? 32 : 24,
    width: isTablet ? width * 0.7 : width - 40,
    maxWidth: 600,
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  modalTitle: {
    fontSize: isTablet ? FONT_SIZE_LARGE + 4 : 18,
    fontWeight: "600",
    color: "#1F2937",
    textAlign: "center",
    marginBottom: isTablet ? 28 : 20,
  },
  dropdownContainer: {
    marginBottom: isTablet ? 32 : 24,
    position: "relative",
    zIndex: 1000,
  },
  dropdownHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: isTablet ? 20 : 16,
    paddingVertical: isTablet ? 16 : 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 8,
    backgroundColor: "#fff",
  },
  dropdownText: {
    fontSize: isTablet ? FONT_SIZE_MEDIUM : 16,
    color: "#1F2937",
    fontWeight: "500",
  },
  dropdownList: {
    position: "absolute",
    top: "100%",
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderTopWidth: 0,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    zIndex: 1001,
  },
  dropdownItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: isTablet ? 20 : 16,
    paddingVertical: isTablet ? 16 : 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  dropdownItemSelected: {
    backgroundColor: "#EEF2FF",
  },
  statusIndicator: {
    width: isTablet ? 12 : 8,
    height: isTablet ? 12 : 8,
    borderRadius: isTablet ? 6 : 4,
    marginRight: isTablet ? 16 : 12,
  },
  dropdownItemText: {
    fontSize: isTablet ? FONT_SIZE_MEDIUM : 16,
    color: "#1F2937",
  },
  dropdownItemTextSelected: {
    color: PRIMARY_COLOR,
    fontWeight: "500",
  },
  modalButtons: {
    flexDirection: "row",
    gap: isTablet ? 20 : 12,
    marginTop: isTablet ? 8 : 0,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: isTablet ? 16 : 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    alignItems: "center",
  },
  cancelButtonText: {
    fontSize: isTablet ? FONT_SIZE_MEDIUM : 16,
    color: "#6B7280",
    fontWeight: "500",
  },
  confirmButton: {
    flex: 1,
    paddingVertical: isTablet ? 16 : 12,
    borderRadius: 8,
    backgroundColor: PRIMARY_COLOR,
    alignItems: "center",
  },
  disabledButton: {
    borderColor: "#ccc",
    backgroundColor: "#f2f2f2",
  },
  disabledButtonText: {
    color: "#999",
  },
  confirmButtonText: {
    fontSize: isTablet ? FONT_SIZE_MEDIUM : 16,
    color: "#fff",
    fontWeight: "600",
  },
});

export default AppointmentDetailPage;
