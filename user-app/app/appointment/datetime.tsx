import { BaseButton } from "@/components/BaseButton";
import CommonHeader from "@/components/CommonHeader";
import BookingSummary from "@/components/packages/BookingSummary";
import DateSelector from "@/components/packages/DateSelector";
import TimeSlotGrid from "@/components/packages/TimeSlotGrid";
import { ROUTES } from "@/constants/app.routes";
import { useAppointmentTimeslots } from "@/hooks/queries/useAppointmentTimeslots";
import { useMyActiveAppointments } from "@/hooks/queries/useMyActiveAppointments";
import {
  DARK_GRAY,
  ERROR_COLOR,
  LIGHT_GRAY,
  PRIMARY_COLOR,
  SUCCESS_COLOR,
  WHITE,
} from "@/lib/constants";
import { getUserDeviceTimezone } from "@/utils/userTimezone";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState, useMemo, useRef } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import dayjs from 'dayjs'
import { flattenTimeslots } from "@/utils/timeslots";

export default function DateTimeScreen() {
  const router = useRouter();
  const params: any = useLocalSearchParams();

  const timezone = getUserDeviceTimezone();

  const [loading, setLoading] = useState(true);
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [lockingSlots, setLockingSlots] = useState(new Set());
  const [currentSelectedDate, setCurrentSelectedDate] = useState(null);
  const hasInitialized = useRef(false);

  const { data: availableDates, isLoading: isLoadingTimeslots } = useAppointmentTimeslots(timezone);
  const { data: activeAppointments, isLoading: isLoadingActiveAppointment } = useMyActiveAppointments();

  const today = dayjs().format("YYYY-MM-DD");

  // filter out past days AND today
  const filteredDates = availableDates?.filter(
    (item: any) => dayjs(item.date).isAfter(today, "day") // strictly after today
  );

  // console.log("slot data>>>", filteredDates);


  const packageData = {
    id: params.packageId,
    name: params.packageName,
    price: parseInt(params.packagePrice),
    sessions: parseInt(params.packageSessions),
    type: params.packageType,
    service_type: params.service_type,
    customData: params?.customData ? JSON.parse(params.customData) : null,
  };

  // Create a set of already booked slot keys for quick lookup
  const bookedSlotKeys = useMemo(() => {
    if (!activeAppointments?.data) return [];
    return flattenTimeslots(activeAppointments?.data);
  }, [activeAppointments, isLoadingActiveAppointment]);

  // Wait for both APIs to complete before showing content
  const isLoading = isLoadingTimeslots || isLoadingActiveAppointment;

  useEffect(() => {
    if (filteredDates && Array.isArray(filteredDates) && filteredDates.length && !isLoading) {
      if (!hasInitialized.current) {
        // Only set initially
        setCurrentSelectedDate(filteredDates[0].date);
        hasInitialized.current = true;
      } else if (!currentSelectedDate || !filteredDates.find(d => d.date === currentSelectedDate)) {
        // If current selected date is no longer available, reset to first available
        setCurrentSelectedDate(filteredDates[0].date);
      }
    }
  }, [isLoading, filteredDates, currentSelectedDate]);

  const handleDateSelect = (date) => {
    setCurrentSelectedDate(date);
  };

  const handleSlotSelect = async (date, slot) => {
    const slotKey = `${date}-${slot.id}`;
    // const bookedSlotKeys = getBookedSlotKeys(activeAppointments?.data);

    // Check if slot is already selected - if yes, deselect it 🚀
    const existingSlotIndex = selectedSlots.findIndex((s) => s.key === slotKey);
    if (existingSlotIndex >= 0) {
      // Remove from selected slots
      setSelectedSlots((prev) => prev.filter((s) => s.key !== slotKey));
      return;
    }

    // Check if slot is already booked by the system
    if (slot.is_booked) {
      Alert.alert(
        "Slot Unavailable",
        "This time slot is already booked. Please select another."
      );
      return;
    }

    // Check if we've reached the session limit
    if (selectedSlots.length >= packageData.sessions) {
      Alert.alert(
        "Session Limit Reached",
        `You can only select ${packageData.sessions} time slot${packageData.sessions > 1 ? "s" : ""
        } for this package.`
      );
      return;
    }

    setSelectedSlots((prev) => [
      ...prev,
      {
        key: slotKey,
        date,
        slot,
        dateString:
          filteredDates.find((d) => d.date === date)?.dateString || date,
      },
    ]);
  };

  const handleContinue = () => {
    if (selectedSlots.length !== packageData.sessions) {
      Alert.alert(
        "Incomplete Selection",
        `Please select ${packageData.sessions} time slot${packageData.sessions > 1 ? "s" : ""
        } to continue.`
      );
      return;
    }

    // Navigate to payment screen
    router.push({
      pathname: ROUTES.BOOKING_PAYMENT,
      params: {
        ...params,
        selectedSlots: JSON.stringify(selectedSlots),
      },
    });
  };

  const getCurrentDateSlots = () => {
    const currentDate = filteredDates?.find(
      (d) => d.date === currentSelectedDate
    );

    if (!currentDate) return [];

    // Filter out slots that user has already booked
    return currentDate.slots.filter(slot => {
      const userSlotKey = `${slot.date_time_raw}`;
      console.log('userslotkey', userSlotKey, bookedSlotKeys)
      if (!bookedSlotKeys) {
        return true;
      }
      // Return false (hide) if user already has this slot booked
      return !bookedSlotKeys.includes(userSlotKey);
    });
  };

  const getSlotStatus = (date, slot) => {
    const slotKey = `${date}-${slot.id}`;
    const userSlotKey = `${date}-${slot.time}`;
    // const bookedSlotKeys = getBookedSlotKeys(activeAppointments?.data);


    if (lockingSlots.has(slotKey)) return "locking";
    if (selectedSlots.find((s) => s.key === slotKey)) return "selected";
    if (slot.is_booked) return "booked";

    // Check if user already has this slot booked
    if (bookedSlotKeys && bookedSlotKeys.includes(userSlotKey)) return "user_booked";

    return "available";
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={PRIMARY_COLOR} />
        <Text style={styles.loadingText}>Loading available dates...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <CommonHeader text="Select date & time" />
        <View style={{ marginTop: 16 }}></View>

        <BookingSummary
          packageData={packageData}
          selectedSlots={selectedSlots}
        />

        {params?.packageSessions && (
          <>
            <DateSelector
              dates={filteredDates}
              selectedDate={currentSelectedDate}
              onDateSelect={handleDateSelect}
            />

            <TimeSlotGrid
              slots={getCurrentDateSlots()}
              selectedDate={currentSelectedDate}
              onSlotSelect={(slot) =>
                handleSlotSelect(currentSelectedDate, slot)
              }
              getSlotStatus={(slot) => getSlotStatus(currentSelectedDate, slot)}
            />
          </>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.legend}>
          <View style={styles.legendItem}>
            <View
              style={[styles.legendDot, { backgroundColor: SUCCESS_COLOR }]}
            />
            <Text style={styles.legendText}>Available</Text>
          </View>
          <View style={styles.legendItem}>
            <View
              style={[styles.legendDot, { backgroundColor: PRIMARY_COLOR }]}
            />
            <Text style={styles.legendText}>Selected</Text>
          </View>
          <View style={styles.legendItem}>
            <View
              style={[styles.legendDot, { backgroundColor: ERROR_COLOR }]}
            />
            <Text style={styles.legendText}>Booked</Text>
          </View>
        </View>
        <BaseButton
          title={`Continue to Payment (${selectedSlots.length}/${packageData.sessions} selected)`}
          onPress={handleContinue}
          disabled={selectedSlots.length !== packageData.sessions}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    position: "relative",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: WHITE,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: DARK_GRAY,
  },
  scrollContainer: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingTop: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: PRIMARY_COLOR,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: DARK_GRAY,
    lineHeight: 22,
  },
  footer: {
    padding: 20,
    backgroundColor: WHITE,
    borderTopWidth: 1,
    borderTopColor: LIGHT_GRAY,
  },
  legend: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 15,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 6,
  },
  legendText: {
    fontSize: 12,
    color: DARK_GRAY,
  },
  continueButton: {
    height: 50,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: WHITE,
  },
  backButton: {
    color: PRIMARY_COLOR,
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 20,
    marginTop: 45,
  },
});