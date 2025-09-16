import ConsultantInfo from "@/components/appointment-details/ConsultantInfo";
import ScheduleInfo from "@/components/appointment-details/ScheduleInfo";
import StatusBadge from "@/components/appointment-details/StatusBadge";
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
import { MaterialIcons } from "@expo/vector-icons";
import { API_USER, GetOne, PACKAGE_SERVICE_TYPE } from "@sm/common";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Dimensions,
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

  const handleRefresh = async () => {
    setRefreshing(true);
    await handleFetchAppointment();
  };

  const startVideoCall = async () => {
    await callService.initialize();
    await startCall(appointment?.token, user?.id);
    router.push({
      pathname: ROUTES.CALL_CONSULTANT as any,
      params: {
        consultant_id: appointment?.Consultant?.id
      }
    });
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

    if (appointment?.start_at) {
      updateCountdown();
      const interval = setInterval(updateCountdown, 1000);
      return () => clearInterval(interval);
    }
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
            tintColor={PRIMARY_COLOR}
            colors={[PRIMARY_COLOR]}
          />
        }
      >
        {/* Status Card */}
        <View style={styles.statusCard}>
          <View style={styles.statusHeader}>
            <StatusBadge 
              status={appointment?.status} 
              isLive={isLive} 
            />
          </View>
        </View>

        {/* Client Information */}
        <View style={styles.card}>
          <ConsultantInfo consultant={appointment?.Consultant} />
        </View>

        {/* Appointment Schedule */}
        <View style={styles.card}>
          <ScheduleInfo
            startAt={appointment?.start_at}
            endAt={appointment?.end_at}
            durationInMin={appointment?.duration_in_min}
            timeLeft={timeLeft}
          />
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
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
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
});

export default AppointmentDetailPage;