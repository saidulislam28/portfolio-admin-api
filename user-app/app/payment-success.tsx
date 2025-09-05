import { ROUTES } from '@/constants/app.routes';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import LottieView from 'lottie-react-native';
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const { width, height } = Dimensions.get('window');

const PaymentSuccessPage = () => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const confettiRef = useRef(null);
  const checkmarkRef = useRef(null);
  const celebrationRef = useRef(null);

  const router = useRouter();
  const params = useLocalSearchParams();
  const { service_type } = params;

  // Generate random IDs/dates for demo purposes
  const [transactionId] = useState(`#TX${Math.floor(Math.random() * 10000)}`);
  const [date] = useState(new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }));

  // Data for different payment types
  const paymentData: any = {
    speaking_mock_test: {
      title: "Appointment Booked! speaking_mock_test",
      subtitle: "🎉 Congratulations! Your English speaking test appointment has been successfully scheduled",
      cardTitle: "Test Appointment Details",
      icon: "calendar",
      details: [
        { label: "Appointment ID", value: `#APT${Math.floor(Math.random() * 10000)}` },
        { label: "Date", value: 'June 28, 2025' },
        { label: "Time", value: '2:30 PM - 3:00 PM' },
        { label: "Test Center", value: 'Downtown Language Center' },
        { label: "Status", value: 'Confirmed', isStatus: true }
      ],
      tip: "💡 Arrive 15 minutes early with a valid ID"
    },
    conversation: {
      title: "Conversation appointment Booked!",
      subtitle: "🎉 Congratulations! Your English Conversation test appointment has been successfully scheduled",
      cardTitle: "Conversation Appointment Details",
      icon: "calendar",
      details: [
        { label: "Appointment ID", value: `#APT${Math.floor(Math.random() * 10000)}` },
        { label: "Date", value: 'June 28, 2025' },
        { label: "Time", value: '2:30 PM - 3:00 PM' },
        { label: "Test Center", value: 'Downtown Language Center' },
        { label: "Status", value: 'Confirmed', isStatus: true }
      ],
      tip: "💡 Arrive 15 minutes early with a valid ID"
    },
    book_purchase: {
      title: "Book Purchased!",
      subtitle: "📚 Your book purchase is complete! Happy reading!",
      cardTitle: "Purchase Details",
      icon: "book",
      details: [
        { label: "Order ID", value: transactionId },
        { label: "Purchase Date", value: date },
        { label: "Delivery", value: '2-3 business days' },
        { label: "Status", value: 'Processing', isStatus: true }
      ],
      tip: "💡 You'll receive a tracking number via email once shipped"
    },
    exam_registration: {
      title: "IELTS Exam Registration Complete!",
      subtitle: "🎓 Your IELTS exam registration was successful. Good luck with your preparation!",
      cardTitle: "Exam Details",
      icon: "edit",
      details: [
        { label: "Registration ID", value: `#IELTS${Math.floor(Math.random() * 10000)}` },
        { label: "Exam Date", value: 'July 15, 2025' },
        { label: "Test Center", value: 'International Testing Center' },
        { label: "Reporting Time", value: '8:30 AM' },
        { label: "Status", value: 'Registered', isStatus: true }
      ],
      tip: "💡 Remember to bring your ID and registration confirmation"
    },
    ielts_academic: {
      title: "IELts Academic Class Booked!",
      subtitle: "👩‍🏫 Your online class has been scheduled. We'll see you there!",
      cardTitle: "Class Details",
      icon: "video",
      details: [
        { label: "Class ID", value: `#CLS${Math.floor(Math.random() * 10000)}` },
        { label: "Date", value: 'June 30, 2025' },
        { label: "Time", value: '10:00 AM - 11:30 AM' },
        { label: "Instructor", value: 'Dr. Sarah Johnson' },
        { label: "Join Link", value: 'Will be emailed to you', isHighlighted: true },
        { label: "Status", value: 'Confirmed', isStatus: true }
      ],
      tip: "💡Check your email for the Zoom link 1 hour before class"
    },
    default: {
      title: "Payment Successful!",
      subtitle: "✅ Your transaction was completed successfully",
      cardTitle: "Transaction Details",
      icon: "check-circle",
      details: [
        { label: "Transaction ID", value: transactionId },
        { label: "Date", value: date },
        { label: "Status", value: 'Completed', isStatus: true }
      ]
    }
  };

  // Get the relevant data based on action or use default
  const currentData = paymentData[service_type] || paymentData.default;

  useEffect(() => {
    // Start all animations
    if (confettiRef.current) {
      confettiRef.current.play();
    }

    if (celebrationRef.current) {
      celebrationRef.current.play();
    }

    if (checkmarkRef.current) {
      setTimeout(() => {
        checkmarkRef.current.play();
      }, 200);
    }

    // Animate page elements
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        delay: 400,
        useNativeDriver: true,
      }),
    ]).start();

    // Restart confetti animation every 8 seconds
    const confettiInterval = setInterval(() => {
      if (confettiRef.current) {
        confettiRef.current.play(0, 120); // Play from frame 0 to 120
      }
    }, 2000);

    // Restart celebration animation every 10 seconds
    const celebrationInterval = setInterval(() => {
      if (celebrationRef.current) {
        celebrationRef.current.play();
      }
    }, 10000);

    // Cleanup intervals when component unmounts
    return () => {
      clearInterval(confettiInterval);
      clearInterval(celebrationInterval);
    };
  }, []);

  const handleBackToHome = () => {
    router.dismissAll();
    router.replace(ROUTES.HOME);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#4A90E2" />

      {/* Background Gradient */}
      <LinearGradient
        colors={['#4A90E2', '#357ABD', '#1E3A8A']}
        style={styles.gradient}
      />

      {/* Content Container */}
      <Animated.View
        style={[
          styles.contentContainer,
          {
            opacity: fadeAnim,
            transform: [
              { scale: scaleAnim },
              { translateY: slideAnim }
            ]
          }
        ]}
      >
        {/* Success Message */}
        <Text style={styles.title}>{currentData.title}</Text>
        <Text style={styles.subtitle}>{currentData.subtitle}</Text>

        {/* Details Card */}
        <View style={styles.appointmentCard}>
          <View style={styles.cardHeader}>
            <Feather name={currentData.icon} size={24} color="#4A90E2" />
            <Text style={styles.cardTitle}>{currentData.cardTitle}</Text>
          </View>

          {currentData.details.map((detail, index) => (
            <React.Fragment key={index}>
              <View style={styles.appointmentRow}>
                <Text style={styles.appointmentLabel}>{detail.label}</Text>
                <Text style={[
                  styles.appointmentValue,
                  detail.isHighlighted && { color: '#4A90E2', fontWeight: 'bold' }
                ]}>
                  {detail.value}
                  {detail.isStatus && (
                    <View style={styles.statusContainer}>
                      <View style={styles.statusDot} />
                      <Text style={styles.statusText}>{detail.value}</Text>
                    </View>
                  )}
                </Text>
              </View>

              {index < currentData.details.length - 1 && <View style={styles.divider} />}
            </React.Fragment>
          ))}

          {currentData.tip && (
            <View style={styles.tipContainer}>
              <Feather name="lightbulb" size={16} color="#FF9500" />
              <Text style={styles.tipText}>{currentData.tip}</Text>
            </View>
          )}
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.tertiaryButton}
            onPress={handleBackToHome}
            activeOpacity={0.7}
          >
            <Feather name="home" size={18} color="rgba(255, 255, 255, 0.8)" />
            <Text style={styles.tertiaryButtonText}>Back to Home</Text>
          </TouchableOpacity>
        </View>

        {/* Decorative Elements */}
        <View style={styles.decorativeContainer}>
          <View style={[styles.decorativeCircle, styles.circle1]} />
          <View style={[styles.decorativeCircle, styles.circle2]} />
          <View style={[styles.decorativeCircle, styles.circle3]} />
        </View>
      </Animated.View>

      {/* Confetti Animation */}
      <LottieView
        ref={confettiRef}
        source={{
          uri: 'https://assets2.lottiefiles.com/packages/lf20_obhph3sh.json'
        }}
        style={styles.confetti}
        autoPlay={false}
        loop={false}
        speed={0.7}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#4A90E2',
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  confetti: {
    position: 'absolute',
    top: 0,
    left: 0,
    // right: 0,
    // bottom: 0,
    width: width,
    height: height / 2,
    zIndex: 20, // Lowered z-index to be behind content
    pointerEvents: 'none',
  },
  celebration: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    bottom: 0,
    width: width,
    height: height * 0.6,
    zIndex: 1, // Lowered z-index to be behind content
    pointerEvents: 'none',
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 25,
    paddingTop: 50,
    paddingBottom: 30,
    zIndex: 10, // Higher z-index to be above confetti
  },
  checkmarkContainer: {
    width: 100,
    height: 100,
    marginBottom: 15,
  },
  checkmark: {
    width: '100%',
    height: '100%',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 22,
    paddingHorizontal: 15,
  },
  appointmentCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.96)',
    borderRadius: 18,
    padding: 20,
    width: '100%',
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.3,
    shadowRadius: 25,
    elevation: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 2,
    borderBottomColor: '#F0F0F0',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C2C54',
    marginLeft: 10,
  },
  appointmentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  appointmentLabel: {
    fontSize: 15,
    color: '#666',
    fontWeight: '500',
    flex: 1,
  },
  appointmentValue: {
    fontSize: 15,
    color: '#2C2C54',
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'right',
  },
  divider: {
    height: 1,
    backgroundColor: '#E8E8E8',
    marginVertical: 12,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    backgroundColor: '#34C759',
    borderRadius: 4,
    marginRight: 8,
  },
  statusText: {
    fontSize: 15,
    color: '#34C759',
    fontWeight: 'bold',
  },
  tipContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF3CD',
    borderRadius: 10,
    padding: 12,
    marginTop: 15,
  },
  tipText: {
    fontSize: 13,
    color: '#856404',
    marginLeft: 8,
    flex: 1,
    fontWeight: '500',
  },
  buttonContainer: {
    width: '100%',
    gap: 12,
    zIndex: 15, // Even higher z-index for buttons
  },
  primaryButton: {
    borderRadius: 25,
    overflow: 'hidden',
    shadowColor: '#34C759',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 8,
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 30,
    gap: 10,
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 25,
    paddingVertical: 16,
    paddingHorizontal: 30,
    gap: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  secondaryButtonText: {
    color: '#4A90E2',
    fontSize: 15,
    fontWeight: '600',
  },
  tertiaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
    paddingVertical: 12,
    paddingHorizontal: 25,
    gap: 8,
    marginTop: 5,
  },
  tertiaryButtonText: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 14,
    fontWeight: '500',
  },
  decorativeContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: 'none',
  },
  decorativeCircle: {
    position: 'absolute',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 100,
  },
  circle1: {
    width: 180,
    height: 180,
    top: -90,
    right: -90,
  },
  circle2: {
    width: 120,
    height: 120,
    bottom: -60,
    left: -60,
  },
  circle3: {
    width: 80,
    height: 80,
    top: 120,
    left: -40,
  },
});

export default PaymentSuccessPage;