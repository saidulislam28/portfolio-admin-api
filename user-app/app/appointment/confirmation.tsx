import { ROUTES } from "@/constants/app.routes";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Dimensions,
  Platform,
  ScrollView,
  Share,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// Mock constants - replace with your actual imports
const PRIMARY_COLOR = "#007bff";
const WHITE = "#ffffff";
const LIGHT_GRAY = "#e9ecef";
const DARK_GRAY = "#343a40";
const SUCCESS_COLOR = "#28a745";
const LIGHT_GREEN = "#d4edda";

const { width, height } = Dimensions.get("window");

// Confetti Component
const ConfettiPiece = ({ delay, duration, color }) => {
  const [animation, setAnimation] = useState({
    opacity: 1,
    translateY: -50,
    translateX: Math.random() * width,
    rotate: "0deg",
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      const interval = setInterval(() => {
        setAnimation((prev) => ({
          ...prev,
          translateY: prev.translateY + 5,
          rotate: `${parseInt(prev.rotate) + 10}deg`,
          opacity: prev.opacity - 0.01,
        }));
      }, 50);

      setTimeout(() => {
        clearInterval(interval);
      }, duration);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay, duration]);

  return (
    <View
      style={[
        styles.confettiPiece,
        {
          backgroundColor: color,
          opacity: animation.opacity,
          transform: [
            { translateY: animation.translateY },
            { translateX: animation.translateX },
            { rotate: animation.rotate },
          ],
        },
      ]}
    />
  );
};

// Confetti Animation Component
const ConfettiAnimation = () => {
  const colors = [
    "#ff6b6b",
    "#4ecdc4",
    "#45b7d1",
    "#96ceb4",
    "#feca57",
    "#ff9ff3",
  ];

  return (
    <View style={styles.confettiContainer}>
      {Array.from({ length: 50 }, (_, i) => (
        <ConfettiPiece
          key={i}
          delay={Math.random() * 2000}
          duration={3000 + Math.random() * 2000}
          color={colors[Math.floor(Math.random() * colors.length)]}
        />
      ))}
    </View>
  );
};

// Success Icon Component
const SuccessIcon = () => (
  <View style={styles.successIconContainer}>
    <View style={styles.successIcon}>
      <Text style={styles.checkmark}>✓</Text>
    </View>
  </View>
);

// Booking Details Card Component
const BookingDetailsCard = ({ title, children }) => (
  <View style={styles.card}>
    <Text style={styles.cardTitle}>{title}</Text>
    {children}
  </View>
);

// Detail Row Component
const DetailRow = ({ label, value, highlight = false }) => (
  <View style={styles.detailRow}>
    <Text style={styles.detailLabel}>{label}</Text>
    <Text style={[styles.detailValue, highlight && styles.highlightValue]}>
      {value}
    </Text>
  </View>
);

// Action Button Component
const ActionButton = ({ title, onPress, style, textStyle, icon }) => (
  <TouchableOpacity style={[styles.actionButton, style]} onPress={onPress}>
    {icon && <Text style={styles.buttonIcon}>{icon}</Text>}
    <Text style={[styles.actionButtonText, textStyle]}>{title}</Text>
  </TouchableOpacity>
);

export default function BookingConfirmationScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const [showConfetti, setShowConfetti] = useState(true);

  // Mock booking data - in real app, this would come from API or params
  const bookingData = {
    bookingId: params.bookingId || "BK-2024-001",
    transactionId: params.transactionId || "TXN-ABC123",
    packageName: params.packageName || "Three IELTS Mock Speaking Test",
    packagePrice: parseInt(params.packagePrice) || 550,
    packageSessions: parseInt(params.packageSessions) || 3,
    paymentMethod: params.paymentMethod || "stripe",
    bookingDate: new Date().toLocaleDateString(),
    selectedSlots: params.selectedSlots
      ? JSON.parse(params.selectedSlots)
      : [
          { date: "2024-12-15", time: "10:00 AM", duration: "20 min" },
          { date: "2024-12-17", time: "2:00 PM", duration: "20 min" },
          { date: "2024-12-20", time: "4:00 PM", duration: "20 min" },
        ],
  };

  useEffect(() => {
    // Hide confetti after 4 seconds
    const timer = setTimeout(() => {
      setShowConfetti(false);
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  const handleShareBooking = async () => {
    try {
      const message = `🎉 Booking Confirmed!\n\nBooking ID: ${bookingData.bookingId}\nPackage: ${bookingData.packageName}\nSessions: ${bookingData.packageSessions}\nAmount: ৳${bookingData.packagePrice}\n\nThank you for choosing our service!`;

      await Share.share({
        message: message,
        title: "Booking Confirmation",
      });
    } catch (error) {
      Alert.alert("Error", "Unable to share booking details");
    }
  };

  const handleDownloadReceipt = () => {
    Alert.alert(
      "Download Receipt",
      "Receipt will be sent to your email within 5 minutes.",
      [{ text: "OK" }]
    );
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <View style={styles.container}>
      {showConfetti && <ConfettiAnimation />}

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Success Header */}
        <View style={styles.header}>
          <SuccessIcon />
          <Text style={styles.successTitle}>Booking Confirmed!</Text>
          <Text style={styles.successSubtitle}>
            Your mock test sessions have been successfully booked
          </Text>
        </View>

        {/* Booking Summary */}
        <BookingDetailsCard title="Booking Summary">
          <DetailRow
            label="Booking ID"
            value={bookingData.bookingId}
            highlight
          />
          <DetailRow label="Transaction ID" value={bookingData.transactionId} />
          <DetailRow label="Package" value={bookingData.packageName} />
          <DetailRow
            label="Sessions"
            value={`${bookingData.packageSessions} sessions`}
          />
          <DetailRow
            label="Amount Paid"
            value={`৳${bookingData.packagePrice}`}
            highlight
          />
          <DetailRow
            label="Payment Method"
            value={bookingData.paymentMethod.toUpperCase()}
          />
          <DetailRow label="Booking Date" value={bookingData.bookingDate} />
        </BookingDetailsCard>

        {/* Scheduled Sessions */}
        <BookingDetailsCard title="Scheduled Sessions">
          {bookingData.selectedSlots.map((slot, index) => (
            <View key={index} style={styles.sessionCard}>
              <View style={styles.sessionHeader}>
                <Text style={styles.sessionNumber}>Session {index + 1}</Text>
                <Text style={styles.sessionDuration}>{slot.duration}</Text>
              </View>
              <Text style={styles.sessionDate}>{formatDate(slot.date)}</Text>
              <Text style={styles.sessionTime}>{slot.time}</Text>
            </View>
          ))}
        </BookingDetailsCard>

        {/* Important Information */}
        <BookingDetailsCard title="Important Information">
          <View style={styles.infoItem}>
            <Text style={styles.infoIcon}>📧</Text>
            <Text style={styles.infoText}>
              Confirmation email has been sent to your registered email address
            </Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoIcon}>⏰</Text>
            <Text style={styles.infoText}>
              Please join the session 5 minutes before the scheduled time
            </Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoIcon}>📞</Text>
            <Text style={styles.infoText}>
              You will receive a meeting link 30 minutes before each session
            </Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoIcon}>🔄</Text>
            <Text style={styles.infoText}>
              Sessions can be rescheduled up to 24 hours in advance
            </Text>
          </View>
        </BookingDetailsCard>

        {/* Action Buttons */}
        <View style={styles.actionContainer}>
          <ActionButton
            title="Share Booking"
            onPress={handleShareBooking}
            style={styles.shareButton}
            textStyle={styles.shareButtonText}
            icon="📤"
          />

          <ActionButton
            title="Download Receipt"
            onPress={handleDownloadReceipt}
            style={styles.downloadButton}
            textStyle={styles.downloadButtonText}
            icon="📄"
          />
        </View>

        {/* Navigation Buttons */}
        <View style={styles.navigationContainer}>
          <ActionButton
            title="View My Bookings"
            onPress={() => router.push(ROUTES.BOOKINGS)}
            style={styles.primaryButton}
            textStyle={styles.primaryButtonText}
          />

          <ActionButton
            title="Book Another Session"
            onPress={() => router.push(ROUTES.PACKAGES)}
            style={styles.secondaryButton}
            textStyle={styles.secondaryButtonText}
          />

          <ActionButton
            title="Back to Home"
            onPress={() => router.push(ROUTES.HOME)}
            style={styles.homeButton}
            textStyle={styles.homeButtonText}
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    position: "relative",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  confettiContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
    pointerEvents: "none",
  },
  confettiPiece: {
    position: "absolute",
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    alignItems: "center",
    paddingVertical: 40,
    paddingHorizontal: 20,
    backgroundColor: LIGHT_GREEN,
  },
  successIconContainer: {
    marginBottom: 20,
  },
  successIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: SUCCESS_COLOR,
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  checkmark: {
    color: WHITE,
    fontSize: 40,
    fontWeight: "bold",
  },
  successTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: SUCCESS_COLOR,
    marginBottom: 10,
    textAlign: "center",
  },
  successSubtitle: {
    fontSize: 16,
    color: DARK_GRAY,
    textAlign: "center",
    lineHeight: 22,
  },
  card: {
    margin: 20,
    marginBottom: 0,
    backgroundColor: WHITE,
    borderRadius: 12,
    padding: 20,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: DARK_GRAY,
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: LIGHT_GRAY,
    paddingBottom: 10,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
  },
  detailLabel: {
    fontSize: 14,
    color: DARK_GRAY,
    flex: 1,
  },
  detailValue: {
    fontSize: 14,
    color: DARK_GRAY,
    fontWeight: "500",
    textAlign: "right",
    flex: 1,
  },
  highlightValue: {
    color: PRIMARY_COLOR,
    fontWeight: "bold",
  },
  sessionCard: {
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: PRIMARY_COLOR,
  },
  sessionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  sessionNumber: {
    fontSize: 16,
    fontWeight: "600",
    color: PRIMARY_COLOR,
  },
  sessionDuration: {
    fontSize: 12,
    color: DARK_GRAY,
    backgroundColor: LIGHT_GRAY,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  sessionDate: {
    fontSize: 14,
    color: DARK_GRAY,
    marginBottom: 4,
  },
  sessionTime: {
    fontSize: 16,
    fontWeight: "500",
    color: SUCCESS_COLOR,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  infoIcon: {
    fontSize: 16,
    marginRight: 10,
    marginTop: 2,
  },
  infoText: {
    fontSize: 14,
    color: DARK_GRAY,
    flex: 1,
    lineHeight: 20,
  },
  actionContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginTop: 20,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    flex: 0.48,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: "500",
  },
  buttonIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  shareButton: {
    backgroundColor: "#e3f2fd",
    borderWidth: 1,
    borderColor: "#2196f3",
  },
  shareButtonText: {
    color: "#2196f3",
  },
  downloadButton: {
    backgroundColor: "#f3e5f5",
    borderWidth: 1,
    borderColor: "#9c27b0",
  },
  downloadButtonText: {
    color: "#9c27b0",
  },
  navigationContainer: {
    paddingHorizontal: 20,
    marginTop: 30,
  },
  primaryButton: {
    backgroundColor: PRIMARY_COLOR,
    marginBottom: 15,
  },
  primaryButtonText: {
    color: WHITE,
    fontSize: 16,
    fontWeight: "600",
  },
  secondaryButton: {
    backgroundColor: WHITE,
    borderWidth: 2,
    borderColor: PRIMARY_COLOR,
    marginBottom: 15,
  },
  secondaryButtonText: {
    color: PRIMARY_COLOR,
    fontSize: 16,
    fontWeight: "600",
  },
  homeButton: {
    backgroundColor: LIGHT_GRAY,
  },
  homeButtonText: {
    color: DARK_GRAY,
    fontSize: 16,
    fontWeight: "500",
  },
});
