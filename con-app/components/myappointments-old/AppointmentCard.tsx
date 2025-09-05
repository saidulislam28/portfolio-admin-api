import { formateServiceType } from "@/utility/consultant-utils";
import { getStatusColor } from "@/utility/statusColor";
import React from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
} from "react-native";

interface User {
  full_name: string;
  email?: string;
  id?: string;
}

interface Order {
  service_type: string;
  id?: string;
  // Add other order properties as needed
}

export interface Appointment {
  id: string;
  start_at: string | Date;
  notes?: string;
  duration_in_min: number;
  type?: string;
  User?: User;
  Order?: Order;
  status?: string
  // Add other appointment properties as needed
}

interface AppointmentCardProps {
  appointment: Appointment;
  onPress: () => void;
  isPast?: boolean;
  formatDate?: (date: string | Date) => string;
  formatTime?: (date: string | Date) => string;
  getTypeColor?: (type?: string) => string;
  cardWidth?: number;
  showTimeUntil?: boolean;
  showPastIndicator?: boolean;
}

const { width } = Dimensions.get("window");
const DEFAULT_CARD_WIDTH = width > 600 ? width / 2 - 48 : width - 32;

export default function AppointmentCard({
  appointment,
  onPress,
  isPast = false,
  formatDate: customFormatDate,
  formatTime: customFormatTime,
  getTypeColor: customGetTypeColor,
  cardWidth = DEFAULT_CARD_WIDTH,
  showTimeUntil = true,
  showPastIndicator = true,
}: AppointmentCardProps) {
  const defaultFormatDate = (date: string | Date) => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const jsDate = new Date(date);
    const isToday = jsDate.toDateString() === today.toDateString();
    const isTomorrow = jsDate.toDateString() === tomorrow.toDateString();
    const isYesterday = jsDate.toDateString() === yesterday.toDateString();

    if (isToday) return "Today";
    if (isTomorrow) return "Tomorrow";
    if (isYesterday) return "Yesterday";

    return jsDate.toLocaleDateString([], {
      month: "short",
      day: "numeric",
      year:
        jsDate.getFullYear() !== today.getFullYear() ? "numeric" : undefined,
    });
  };

  const defaultFormatTime = (date: string | Date) => {
    const jsDate = new Date(date);
    return jsDate.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const defaultGetTypeColor = (type?: string) => {
    return type === "Mock Test" ? "#e74c3c" : "#3498db";
  };

  const getTimeUntil = () => {
    if (isPast || !showTimeUntil) return null;

    const now = new Date();
    const jsDate = new Date(appointment.start_at);
    const timeDiff = jsDate.getTime() - now.getTime();
    const hours = Math.floor(timeDiff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (days > 0) {
      return `in ${days} day${days > 1 ? "s" : ""}`;
    } else if (hours > 0) {
      return `in ${hours} hour${hours > 1 ? "s" : ""}`;
    } else {
      const minutes = Math.floor(timeDiff / (1000 * 60));
      return `in ${minutes} min`;
    }
  };

  const formatDateFn = customFormatDate || defaultFormatDate;
  const formatTimeFn = customFormatTime || defaultFormatTime;
  const getTypeColorFn = customGetTypeColor || defaultGetTypeColor;




  return (
    <TouchableOpacity
      style={[
        styles.container,
        isPast && styles.pastContainer,
        { width: cardWidth },
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <View style={styles.dateTimeContainer}>
          <Text style={[styles.date, isPast && styles.pastText]}>
            {formatDateFn(appointment.start_at)}
          </Text>
          <Text style={[styles.time, isPast && styles.pastText]}>
            {formatTimeFn(appointment.start_at)}
          </Text>
          {!isPast && showTimeUntil && (
            <Text style={styles.timeUntil}>{getTimeUntil()}</Text>
          )}
        </View>
        <View
          style={[
            styles.typeBadge,
            { backgroundColor: getTypeColorFn(appointment.type) },
          ]}
        >
          <Text style={styles.typeText}>
            {formateServiceType(appointment?.Order?.service_type as string)}
          </Text>
        </View>
      </View>

      {appointment.notes && (
        <Text
          style={[styles.title, isPast && styles.pastText]}
          numberOfLines={2}
        >
          {appointment.notes}
        </Text>
      )}

      <View style={styles.details}>
        <View style={styles.detailRow}>
          <Text style={[styles.detailLabel, isPast && styles.pastText]}>
            With:
          </Text>
          <Text style={[styles.detailValue, isPast && styles.pastText]}>
            {appointment.User?.full_name || "Unknown"}
          </Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={[styles.detailLabel, isPast && styles.pastText]}>
            Duration:
          </Text>
          <Text style={[styles.detailValue, isPast && styles.pastText]}>
            {appointment.duration_in_min} minutes
          </Text>
        </View>
      </View>

      {isPast && showPastIndicator && (
        <View
          style={[
            styles.pastIndicator,
            { backgroundColor: getStatusColor(appointment?.status!) },
          ]}
        >
          <Text style={styles.pastIndicatorText}>
            {appointment?.status}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 24,
    marginBottom: 20,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  pastContainer: {
    backgroundColor: "#f8f9fa",
    opacity: 0.9,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  dateTimeContainer: {
    flex: 1,
  },
  date: {
    fontSize: 20,
    fontWeight: "600",
    color: "#212529",
    marginBottom: 4,
  },
  time: {
    fontSize: 18,
    color: "#6c757d",
    marginBottom: 4,
  },
  timeUntil: {
    fontSize: 16,
    color: "#28a745",
    fontWeight: "500",
  },
  typeBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    minWidth: 80,
    alignItems: "center",
  },
  typeText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#212529",
    marginBottom: 16,
    lineHeight: 24,
  },
  details: {
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: "row",
    marginBottom: 8,
    alignItems: "center",
  },
  detailLabel: {
    fontSize: 16,
    color: "#6c757d",
    width: 100,
  },
  detailValue: {
    fontSize: 16,
    color: "#212529",
    fontWeight: "500",
    flex: 1,
  },
  pastText: {
    color: "#adb5bd",
  },
  pastIndicator: {
    alignSelf: "flex-end",
    backgroundColor: "#28a745",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  pastIndicatorText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
    textTransform: "uppercase",
  },
});
