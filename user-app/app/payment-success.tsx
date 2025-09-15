import { ROUTES } from '@/constants/app.routes';
import { Feather } from '@expo/vector-icons';
import { API_USER, displayPrice, Get, replacePlaceholders } from '@sm/common';
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
  ScrollView,
  Alert,
} from 'react-native';

const { width, height } = Dimensions.get('window');

interface AppointmentDto {
  appointmentId: string;
  date: string;
  time: string;
}

interface BookItemDto {
  name: string;
  quantity: number;
  price: number;
}

interface ExamItemDto {
  name: string;
  quantity: number;
  price: number;
}

interface BaseOrderResponse {
  title: string;
  subtitle: string;
  cardTitle: string;
  icon: string;
  tip?: string;
  createdAt: string;
}

interface SpeakingMockTestResponse extends BaseOrderResponse {
  appointments: AppointmentDto[];
}

interface ConversationResponse extends BaseOrderResponse {
  appointments: AppointmentDto[];
}

interface BookPurchaseResponse extends BaseOrderResponse {
  orderId: string;
  purchaseDate: string;
  items: BookItemDto[];
  totalPrice: number;
}

interface ExamRegistrationResponse extends BaseOrderResponse {
  registrationId: string;
  examDate: string;
  items: ExamItemDto[];
  totalPrice: number;
}

interface IeltsAcademicResponse extends BaseOrderResponse {
  orderId: string;
}

interface GenericOrderResponse extends BaseOrderResponse {
  orderId: string;
  date: string;
  [key: string]: any;
}

type OrderDetailsResponse =
  | SpeakingMockTestResponse
  | ConversationResponse
  | BookPurchaseResponse
  | ExamRegistrationResponse
  | IeltsAcademicResponse
  | GenericOrderResponse;

const PaymentSuccessPage = () => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const confettiRef = useRef(null);
  const checkmarkRef = useRef(null);
  const celebrationRef = useRef(null);

  const router = useRouter();
  const params = useLocalSearchParams();
  const { service_type, order_id } = params;

  const [orderData, setOrderData] = useState<OrderDetailsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const data: OrderDetailsResponse = await Get(replacePlaceholders(API_USER.order_details, { id: order_id }));

      console.log("order data on successpage>", data);
      setOrderData(data);
    } catch (err) {
      console.error('Error fetching order details:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch order details');
      setOrderData(getDefaultData());
    } finally {
      setLoading(false);
    }
  };

  const retryFetch = () => {
    fetchOrderDetails();
  };

  const getDefaultData = (): OrderDetailsResponse => {
    const date = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    return {
      title: "Payment Successful!",
      subtitle: "✅ Your transaction was completed successfully",
      cardTitle: "Transaction Details",
      icon: "check-circle",
      date: date,
      createdAt: new Date().toISOString()
    } as GenericOrderResponse;
  };

  useEffect(() => {
    if (order_id) {
      fetchOrderDetails();
    }
  }, [order_id]);

  useEffect(() => {
    if (!loading && orderData) {
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
          confettiRef.current.play(0, 120);
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
    }
  }, [loading, orderData]);

  const renderAppointmentDetails = () => {
    const data = orderData as SpeakingMockTestResponse | ConversationResponse;
    if (!data.appointments) return null;

    return data.appointments.map((appointment, index) => (
      <View key={index} style={index > 0 ? styles.appointmentSeparator : null}>
        {data.appointments.length > 1 && (
          <Text style={styles.appointmentHeader}>Appointment {index + 1}</Text>
        )}
        <View style={styles.appointmentRow}>
          <Text style={styles.appointmentLabel}>Appointment ID</Text>
          <Text style={styles.appointmentValue}>#{appointment.appointmentId}</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.appointmentRow}>
          <Text style={styles.appointmentLabel}>Date</Text>
          <Text style={styles.appointmentValue}>{appointment.date}</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.appointmentRow}>
          <Text style={styles.appointmentLabel}>Time</Text>
          <Text style={styles.appointmentValue}>{appointment.time}</Text>
        </View>
        {index < data.appointments.length - 1 && <View style={styles.divider} />}
      </View>
    ));
  };

  const renderBookItems = () => {
    const data = orderData as BookPurchaseResponse | ExamRegistrationResponse;
    if (!data.items) return null;

    return (
      <>
        {data.items.map((item, index) => (
          <React.Fragment key={index}>
            <View style={styles.appointmentRow}>
              <Text style={styles.appointmentLabel}>{item.name}</Text>
              <Text style={styles.appointmentValue}>
                {item.quantity}x {displayPrice(item.price)}
              </Text>
            </View>
            {index < data.items.length - 1 && <View style={styles.divider} />}
          </React.Fragment>
        ))}
        <View style={styles.divider} />
        <View style={styles.appointmentRow}>
          <Text style={[styles.appointmentLabel, styles.totalLabel]}>Total Price</Text>
          <Text style={[styles.appointmentValue, styles.totalValue]}>
            {displayPrice(data.totalPrice?.toFixed(2))}
          </Text>
        </View>
      </>
    );
  };

  const renderOrderDetails = () => {
    if (!orderData) return null;

    switch (service_type) {
      case 'speaking_mock_test':
      case 'conversation':
        return renderAppointmentDetails();

      case 'book_purchase':
        const bookData = orderData as BookPurchaseResponse;
        return (
          <>
            <View style={styles.appointmentRow}>
              <Text style={styles.appointmentLabel}>Order ID</Text>
              <Text style={styles.appointmentValue}>#{bookData.orderId}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.appointmentRow}>
              <Text style={styles.appointmentLabel}>Purchase Date</Text>
              <Text style={styles.appointmentValue}>{bookData.purchaseDate}</Text>
            </View>
            <View style={styles.divider} />
            {renderBookItems()}
          </>
        );

      case 'exam_registration':
        const examData = orderData as ExamRegistrationResponse;
        return (
          <>
            <View style={styles.appointmentRow}>
              <Text style={styles.appointmentLabel}>Registration ID</Text>
              <Text style={styles.appointmentValue}>#{examData.registrationId}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.appointmentRow}>
              <Text style={styles.appointmentLabel}>Exam Date</Text>
              <Text style={styles.appointmentValue}>{examData.examDate}</Text>
            </View>
            <View style={styles.divider} />
            {renderBookItems()}
          </>
        );

      case 'ielts_academic':
        const ieltsData = orderData as IeltsAcademicResponse;
        return (
          <View style={styles.appointmentRow}>
            <Text style={styles.appointmentLabel}>Order ID</Text>
            <Text style={styles.appointmentValue}>#{ieltsData.orderId}</Text>
          </View>
        );

      default:
        const genericData = orderData as GenericOrderResponse;
        return (
          <>
            <View style={styles.appointmentRow}>
              <Text style={styles.appointmentLabel}>Order ID</Text>
              <Text style={styles.appointmentValue}>#{genericData.orderId}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.appointmentRow}>
              <Text style={styles.appointmentLabel}>Date</Text>
              <Text style={styles.appointmentValue}>{genericData.date}</Text>
            </View>
          </>
        );
    }
  };

  const handleBackToHome = () => {
    router.dismissAll();
    router.replace(ROUTES.HOME as any);
  };

  const showRetryAlert = () => {
    Alert.alert(
      'Connection Error',
      'Unable to fetch order details. Would you like to try again?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Retry',
          onPress: retryFetch,
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <LinearGradient
          colors={['#4A90E2', '#357ABD', '#1E3A8A']}
          style={styles.gradient}
        />
        <LottieView
          source={{
            uri: 'https://assets5.lottiefiles.com/packages/lf20_szlepvdh.json'
          }}
          style={styles.loadingAnimation}
          autoPlay
          loop
        />
        <Text style={styles.loadingText}>Loading your order details...</Text>
      </View>
    );
  }

  if (error && !orderData) {
    return (
      <View style={[styles.container, styles.errorContainer]}>
        <LinearGradient
          colors={['#4A90E2', '#357ABD', '#1E3A8A']}
          style={styles.gradient}
        />
        <Feather name="wifi-off" size={48} color="rgba(255, 255, 255, 0.7)" />
        <Text style={styles.errorTitle}>Connection Error</Text>
        <Text style={styles.errorText}>
          Unable to load order details. Please check your internet connection.
        </Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={retryFetch}
          activeOpacity={0.7}
        >
          <Feather name="refresh-cw" size={18} color="white" />
          <Text style={styles.retryButtonText}>Try Again</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.tertiaryButton}
          onPress={handleBackToHome}
          activeOpacity={0.7}
        >
          <Feather name="home" size={18} color="rgba(255, 255, 255, 0.8)" />
          <Text style={styles.tertiaryButtonText}>Back to Home</Text>
        </TouchableOpacity>
      </View>
    );
  }

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
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Error indicator if there was an API error but we have fallback data */}
          {error && orderData && (
            <View style={styles.errorBanner}>
              <Feather name="alert-triangle" size={16} color="#FF9500" />
              <Text style={styles.errorBannerText}>
                Showing offline data. Tap to retry.
              </Text>
              <TouchableOpacity onPress={retryFetch}>
                <Feather name="refresh-cw" size={16} color="#FF9500" />
              </TouchableOpacity>
            </View>
          )}

          {/* Success Message */}
          <Text style={styles.title}>{orderData?.title}</Text>
          <Text style={styles.subtitle}>{orderData?.subtitle}</Text>

          {/* Details Card */}
          <View style={styles.appointmentCard}>
            <View style={styles.cardHeader}>
              <Feather name={orderData?.icon} size={24} color="#4A90E2" />
              <Text style={styles.cardTitle}>{orderData?.cardTitle}</Text>
            </View>

            {renderOrderDetails()}

            {orderData?.tip && (
              <View style={styles.tipContainer}>
                <Feather name="lightbulb" size={16} color="#FF9500" />
                <Text style={styles.tipText}>{orderData.tip}</Text>
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
        </ScrollView>

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
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingAnimation: {
    width: 80,
    height: 80,
    marginBottom: 20,
  },
  loadingText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  errorContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  errorTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  errorText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 30,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 149, 0, 0.2)',
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
    width: '100%',
  },
  errorBannerText: {
    color: '#FF9500',
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
    marginLeft: 8,
    marginRight: 8,
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 25,
    paddingVertical: 15,
    paddingHorizontal: 30,
    gap: 10,
    marginBottom: 15,
    minWidth: 200,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  confetti: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: width,
    height: height / 2,
    zIndex: 20,
    pointerEvents: 'none',
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 25,
    paddingTop: 50,
    paddingBottom: 30,
    zIndex: 10,
  },
  scrollContent: {
    alignItems: 'center',
    justifyContent: 'center',
    flexGrow: 1,
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
  appointmentHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4A90E2',
    marginBottom: 12,
    textAlign: 'center',
  },
  appointmentSeparator: {
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 2,
    borderTopColor: '#F0F0F0',
  },
  divider: {
    height: 1,
    backgroundColor: '#E8E8E8',
    marginVertical: 12,
  },
  totalLabel: {
    fontWeight: 'bold',
    color: '#2C2C54',
  },
  totalValue: {
    fontWeight: 'bold',
    color: '#4A90E2',
    fontSize: 16,
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
    zIndex: 15,
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