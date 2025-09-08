import { BaseButton } from "@/components/BaseButton";
import CommonHeader from "@/components/CommonHeader";
import BookingSummary from "@/components/packages/BookingSummary";
import DateSelector from "@/components/packages/DateSelector";
import TimeSlotGrid from "@/components/packages/TimeSlotGrid";
import { ROUTES } from "@/constants/app.routes";
import {
  DARK_GRAY,
  ERROR_COLOR,
  LIGHT_GRAY,
  PRIMARY_COLOR,
  SUCCESS_COLOR,
  WHITE,
} from "@/lib/constants";
import { apiService } from "@/services/mockDataService";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function DateTimeScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const [availableDates, setAvailableDates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [lockingSlots, setLockingSlots] = useState(new Set());
  const [currentSelectedDate, setCurrentSelectedDate] = useState(null);

  const packageData = {
    id: params.packageId,
    name: params.packageName,
    price: parseInt(params.packagePrice),
    sessions: parseInt(params.packageSessions),
    type: params.packageType,
    service_type: params.service_type,
    customData: params?.customData ? JSON.parse(params.customData) : null,
  };

  useEffect(() => {
    loadAvailableDates();
  }, []);

  const loadAvailableDates = async () => {
    try {
      const response = await apiService.getAvailableDates();
      // console.log('resp', response)
      if (response.length) {
        // console.log(response)
        setAvailableDates(response);
        setCurrentSelectedDate(response[0].date);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to load available dates");
    } finally {
      setLoading(false);
    }
  };

  const handleDateSelect = (date) => {
    setCurrentSelectedDate(date);
  };

  const handleSlotSelect = async (date, slot) => {
    const slotKey = `${date}-${slot.id}`;

    // Check if slot is already selected - if yes, deselect it 🚀
    const existingSlotIndex = selectedSlots.findIndex((s) => s.key === slotKey);
    if (existingSlotIndex >= 0) {
      // Remove from selected slots
      setSelectedSlots((prev) => prev.filter((s) => s.key !== slotKey));

      // Update the slot status in available dates to make it available again 🚀
      setAvailableDates((prev) =>
        prev.map((dateObj) =>
          dateObj.date === date
            ? {
              ...dateObj,
              slots: dateObj.slots.map((s) =>
                s.id === slot.id ? { ...s, is_booked: false } : s
              ),
            }
            : dateObj
        )
      );
      return;
    }

    // Check if slot is already booked
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

    // Lock the slot
    setLockingSlots((prev) => new Set([...prev, slotKey]));

    try {
      const response = await apiService.lockTimeSlot(slot.id);
      // console.log(response)
      if (response.success) {
        // Add to selected slots
        setSelectedSlots((prev) => [
          ...prev,
          {
            key: slotKey,
            date,
            slot,
            dateString:
              availableDates.find((d) => d.date === date)?.dateString || date,
          },
        ]);

        // Update the slot status in available dates
        setAvailableDates((prev) =>
          prev.map((dateObj) =>
            dateObj.date === date
              ? {
                ...dateObj,
                slots: dateObj.slots.map((s) =>
                  s.id === slot.id ? { ...s, is_booked: true } : s
                ),
              }
              : dateObj
          )
        );
      } else {
        Alert.alert(
          "Slot Unavailable",
          response.message || "This time slot is no longer available."
        );
      }
    } catch (error) {
      Alert.alert("Error", "Failed to lock time slot. Please try again.");
    } finally {
      setLockingSlots((prev) => {
        const newSet = new Set(prev);
        newSet.delete(slotKey);
        return newSet;
      });
    }
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
    const currentDate = availableDates.find(
      (d) => d.date === currentSelectedDate
    );
    return currentDate ? currentDate.slots : [];
  };

  // console.log(availableDates[0]?.slots)

  const getSlotStatus = (date, slot) => {
    const slotKey = `${date}-${slot.id}`;
    if (lockingSlots.has(slotKey)) return "locking";
    if (selectedSlots.find((s) => s.key === slotKey)) return "selected";
    if (slot.is_booked) return "booked";
    return "available";
  };

  if (loading) {
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
              dates={availableDates}
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
        <BaseButton title={` Continue to Payment (${selectedSlots.length}/${packageData.sessions}${" "}
            selected)`} onPress={handleContinue} disabled={selectedSlots.length !== packageData.sessions} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    position: "relative",
    // paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
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
    // marginBottom: 10,
  },
});
