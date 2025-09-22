import { ROUTES } from '@/constants/app.routes';
import { API_USER, Get, replacePlaceholders } from '@sm/common';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, StatusBar, StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import LottieView from 'lottie-react-native';
import { Dimensions } from 'react-native';

import { LoadingScreen } from '@/components/payment-success/LoadingScreen';
import { ErrorScreen } from '@/components/payment-success/ErrorScreen';
import { SuccessContent } from '@/components/payment-success/SuccessContent';
import { OrderDetailsResponse } from '@/types/orders';
import { getDefaultOrderData } from '@/utils/orderUtils';

const { width, height } = Dimensions.get('window');

const PaymentSuccessPage = () => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const confettiRef = useRef(null);

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
      const data: OrderDetailsResponse = await Get(
        replacePlaceholders(API_USER.order_details, { id: order_id })
      );

      console.log("order data on successpage>", data);
      setOrderData(data);
    } catch (err) {
      console.error('Error fetching order details:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch order details');
      setOrderData(getDefaultOrderData());
    } finally {
      setLoading(false);
    }
  };

  const retryFetch = () => {
    fetchOrderDetails();
  };

  const handleBackToHome = () => {
    router.dismissAll();
    router.replace(ROUTES.HOME as any);
  };

  useEffect(() => {
    if (order_id) {
      fetchOrderDetails();
    }
  }, [order_id]);

  useEffect(() => {
    if (!loading && orderData) {
      // Start confetti animation
      if (confettiRef.current) {
        confettiRef.current.play();
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

      // Cleanup interval when component unmounts
      return () => {
        clearInterval(confettiInterval);
      };
    }
  }, [loading, orderData]);

  if (loading) {
    return <LoadingScreen />;
  }

  if (error && !orderData) {
    return (
      <ErrorScreen
        onRetry={retryFetch}
        onBackToHome={handleBackToHome}
      />
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

      {/* Animated Content */}
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
        <SuccessContent
          orderData={orderData}
          serviceType={service_type as string}
          error={error}
          onRetry={retryFetch}
          onBackToHome={handleBackToHome}
        />
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

      {/* Decorative Elements */}
      <View style={styles.decorativeContainer}>
        <View style={[styles.decorativeCircle, styles.circle1]} />
        <View style={[styles.decorativeCircle, styles.circle2]} />
        <View style={[styles.decorativeCircle, styles.circle3]} />
      </View>
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