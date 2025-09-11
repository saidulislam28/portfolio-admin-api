import { BaseButton } from "@/components/BaseButton";
import CommonHeader from "@/components/CommonHeader";
import { ROUTES } from "@/constants/app.routes";
import { useAuth } from "@/context/useAuth";
import {
  AppointmentStatus,
  PRIMARY_COLOR,
  SECONDARY_COLOR,
} from "@/lib/constants";
import { callService } from "@/services/AgoraCallService";
import { useCallStore } from "@/zustand/callStore";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { API_USER, GetOne, PACKAGE_SERVICE_TYPE, replacePlaceholders } from "@sm/common";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Dimensions,
  Image,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View
} from "react-native";

const { width } = Dimensions.get("window");

const AppointmentDetailPage = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { user, isLoading: isAuthLoading }: any = useAuth();
  const { startCall, isConnecting, isInCall } = useCallStore();

  const [isLoading, setIsLoading] = useState(true);
  const [appointment, setAppointments]: any = useState(null);
  const [timeLeft, setTimeLeft] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const handleFetchAppointment = async () => {
    // console.log("step 1")
    setIsLoading(true);
    try {
      const result = await GetOne(API_USER.get_appointments, Number(id));
      console.log("appointment details from user-app", result?.data?.data);
      if (!result.data) {
        Alert.alert("Error from result", result.error);
        return;
      }
      setAppointments(result?.data);
      setIsLoading(false);
      setRefreshing(false);
    } catch (error: any) {
      Alert.alert("Error from custom", error?.message ?? "");
      setIsLoading(false);
      setRefreshing(false);
    }
  };
  useEffect(() => {
    if (id) {
      handleFetchAppointment();
    }
  }, [id]);




  // Add this refresh handler function
  const handleRefresh = async () => {
    setRefreshing(true);
    await handleFetchAppointment();
  };

  // console.log(appointment)
  const startVideoCall = async () => {
    // Initialize Agora if not already done
    await callService.initialize(); // Replace with your App ID
    // Start the call process
    await startCall(appointment?.token, user?.id);
    //router remain
    router.push(replacePlaceholders(ROUTES.CALL_CONSULTANT, { consultant_id: appointment?.Consultant?.id }) as any);

  };

  const formatDate = (dateString: any) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (dateString: any) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const getStatusColor = (status: any) => {
    switch (status?.toLowerCase()) {
      case "confirmed":
        return "#10B981";
      case "pending":
        return "#F59E0B";
      case "cancelled":
        return "#EF4444";
      case "completed":
        return "#8B5CF6";
      default:
        return "#6B7280";
    }
  };

  const getStatusIcon = (status: any) => {
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

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const appointmentTime = new Date(appointment?.start_at);
      const timeDiff = appointmentTime?.getTime() - now.getTime();

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

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [appointment?.start_at]);

  const isLive =
    new Date(appointment?.start_at).getTime() < new Date().getTime() &&
    appointment?.status === AppointmentStatus?.pending;

  const serviceType = appointment?.Order?.service_type;
  const isDisabled =
    serviceType === PACKAGE_SERVICE_TYPE.speaking_mock_test
      ? appointment?.MockTestFeedback == null
      : serviceType === PACKAGE_SERVICE_TYPE.conversation
        ? appointment?.ConversationFeedback == null
        : true;

  const handleFeedback = () => {
    if (serviceType === PACKAGE_SERVICE_TYPE.speaking_mock_test) {
      return router.push({
        pathname: ROUTES.MOCKTEST_REPORT as any,
        params: { appointmentId: appointment.id },
      });
    }

    router.push({
      pathname: ROUTES.CONVERSATION_REPORT as any,
      params: { appointmentId: appointment.id },
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <CommonHeader
        onPress={() => router.replace(ROUTES.MY_APPOINTMENT as any)}
      />

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={PRIMARY_COLOR} // Optional: match your theme
            colors={[PRIMARY_COLOR]} // Optional: for Android
          />
        }
      >
        {/* Status Card */}
        <View style={styles.statusCard}>
          <View style={styles.statusHeader}>
            <View
              style={[
                styles.statusBadge,
                { backgroundColor: getStatusColor(appointment?.status) },
              ]}
            >
              <Ionicons
                name={getStatusIcon(appointment?.status)}
                size={16}
                color="white"
              />
              {/* <Text style={styles.statusText}>{appointment?.status}</Text> */}
              <Text style={styles.statusText}>
                {isLive ? "Live" : appointment?.status}
              </Text>
            </View>
            {/* <TouchableOpacity
                            style={styles.statusButton}> <Text style={styles.changeStatusText}>Change Status</Text></TouchableOpacity> */}
          </View>
        </View>

        {/* Client Information */}
        <View style={styles.card}>
          {appointment?.Consultant ? (
            <>
              <View style={styles.cardHeader}>
                <MaterialIcons name="person" size={20} color={PRIMARY_COLOR} />
                <Text style={styles.cardTitle}>Consultant Information</Text>
              </View>

              <View style={styles.clientInfo}>
                <Image
                  source={{
                    uri:
                      appointment?.Consultant?.profile_image ??
                      "https://avatar.iran.liara.run/public",
                  }}
                  style={styles.profileImage}
                />
                <View style={styles.clientDetails}>
                  <View style={styles.nameRow}>
                    <Text style={styles.clientName}>
                      {appointment?.Consultant?.full_name}
                    </Text>
                    {appointment?.Consultant?.is_verified && (
                      <Ionicons
                        name="checkmark-circle"
                        size={16}
                        color="#10B981"
                      />
                    )}
                  </View>
                  <Text style={styles.clientLevel}>
                    {appointment?.Consultant?.bio ?? ""}
                  </Text>
                  {/* <Text style={styles.clientEmail}>
                    {appointment?.Consultant?.email}
                  </Text> */}
                  {/* <Text style={styles.clientPhone}>
                    {appointment?.Consultant?.phone}
                  </Text> */}
                </View>
              </View>
            </>
          ) : (
            <View>
              <Text style={{ ...styles.cardTitle, textAlign: "center" }}>
                No Consultant Appoinded yet
              </Text>
            </View>
          )}
        </View>

        {/* Appointment Schedule */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <MaterialIcons name="schedule" size={20} color={PRIMARY_COLOR} />
            <Text style={styles.cardTitle}>Schedule</Text>
          </View>

          <View style={styles.scheduleInfo}>
            <View style={styles.scheduleRow}>
              <View style={styles.scheduleItem}>
                <Text style={styles.scheduleLabel}>Date</Text>
                <Text style={styles.scheduleValue}>
                  {formatDate(appointment?.start_at)}
                </Text>
              </View>
            </View>

            <View style={styles.scheduleRow}>
              <View style={styles.scheduleItem}>
                <Text style={styles.scheduleLabel}>Start Time</Text>
                <Text style={styles.scheduleValue}>
                  {formatTime(appointment?.start_at)}
                </Text>
              </View>
              <View style={styles.scheduleItem}>
                <Text style={styles.scheduleLabel}>End Time</Text>
                <Text style={styles.scheduleValue}>
                  {formatTime(appointment?.end_at)}
                </Text>
              </View>
            </View>

            <View style={styles.scheduleRow}>
              <View style={styles.scheduleItem}>
                <Text style={styles.scheduleLabel}>Duration</Text>
                <Text style={styles.scheduleValue}>
                  {appointment?.duration_in_min} minutes
                </Text>
              </View>
              <View style={styles.scheduleItem}>
                <Text style={styles.scheduleLabel}>Starts in:</Text>
                <Text style={styles.scheduleValue}>{timeLeft}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Notes Section */}
        {appointment?.notes && (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <MaterialIcons name="note" size={20} color={PRIMARY_COLOR} />
              <Text style={styles.cardTitle}>Consultation Notes</Text>
            </View>
            <Text style={styles.notesText}>{appointment?.notes}</Text>
          </View>
        )}

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          {/* <View style={styles.secondaryButtons}>
            <View style={{ flex: 1 }}>
              <BaseButton
                title="Message"
                onPress={() => console.log("nothing")}
                disabled={false}
                variant="outline"
                fullWidth={false}
              />
            </View>
            <View style={{ flex: 1 }}>
              <BaseButton
                title="Call"
                onPress={startVideoCall}
                isLoading={isConnecting}
                variant="outline"
                fullWidth={false}
              />
            </View>
          </View> */}

          <BaseButton
            title=" Feedback Report"
            onPress={handleFeedback}
            disabled={isDisabled}
            variant="primary"
            fullWidth={false}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  // container: {
  //     flex: 1,
  // },
  container: {
    flex: 1,
    // backgroundColor: '#fff',
    // position: 'relative',
    // paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    // padding: 20,
    backgroundColor: "#F9FAFB",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#fff",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  backButton: {
    padding: 8,
  },
  statusButton: {
    backgroundColor: PRIMARY_COLOR,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    color: "#fff",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1F2937",
  },
  changeStatusText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#fff",
  },
  feedbackButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#fff",
    gap: 8,
    height: 48,
  },
  feedbackButtonDisabled: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "gray",
    gap: 8,
    height: 48,
  },
  feedbackButtonText: {
    color: PRIMARY_COLOR,
    fontSize: 14,
    fontWeight: "500",
  },
  disableText: {
    color: "white",
    fontSize: 14,
    fontWeight: "500",
  },
  moreButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  statusCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
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
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 4,
  },
  statusText: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
  },
  appointmentId: {
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "500",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginTop: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    gap: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
  },
  clientInfo: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#E5E7EB",
  },
  clientDetails: {
    flex: 1,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 4,
  },
  clientName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1F2937",
  },
  clientLevel: {
    fontSize: 12,
    color: PRIMARY_COLOR,
    backgroundColor: "#EEF2FF",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    alignSelf: "flex-start",
    marginBottom: 8,
  },
  clientEmail: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 2,
  },
  clientPhone: {
    fontSize: 14,
    color: "#6B7280",
  },
  scheduleInfo: {
    gap: 12,
  },
  scheduleRow: {
    flexDirection: "row",
    gap: 16,
  },
  scheduleItem: {
    flex: 1,
  },
  scheduleLabel: {
    fontSize: 12,
    color: "#6B7280",
    marginBottom: 4,
  },
  scheduleValue: {
    fontSize: 14,
    fontWeight: "500",
    color: "#1F2937",
  },
  notesText: {
    fontSize: 14,
    color: "#374151",
    lineHeight: 20,
  },
  actionButtons: {
    marginTop: 24,
    marginBottom: 32,
    gap: 12,
  },
  primaryButton: {
    backgroundColor: SECONDARY_COLOR,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  primaryButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  secondaryButtons: {
    flexDirection: "row",
    gap: 12,
  },
  secondaryButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#fff",
    gap: 6,
  },
  disabledButton: {
    borderColor: "#ccc",
    backgroundColor: "#f2f2f2",
  },
  disabledButtonText: {
    color: "#999",
  },
  secondaryButtonText: {
    color: PRIMARY_COLOR,
    fontSize: 14,
    fontWeight: "500",
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 24,
    width: width - 40,
    maxWidth: 400,
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1F2937",
    textAlign: "center",
    marginBottom: 20,
  },
  dropdownContainer: {
    marginBottom: 24,
    position: "relative",
    zIndex: 1000,
  },
  dropdownHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 8,
    backgroundColor: "#fff",
  },
  dropdownText: {
    fontSize: 16,
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
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  dropdownItemSelected: {
    backgroundColor: "#EEF2FF",
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 12,
  },
  dropdownItemText: {
    fontSize: 16,
    color: "#1F2937",
  },
  dropdownItemTextSelected: {
    color: PRIMARY_COLOR,
    fontWeight: "500",
  },
  modalButtons: {
    flexDirection: "row",
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    alignItems: "center",
  },
  cancelButtonText: {
    fontSize: 16,
    color: "#6B7280",
    fontWeight: "500",
  },
  confirmButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: PRIMARY_COLOR,
    alignItems: "center",
  },
  confirmButtonText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "600",
  },
});
export default AppointmentDetailPage;
