import React from 'react';
import { ScrollView, Text, TouchableOpacity, StyleSheet, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { OrderDetailsCard } from './OrderDetailsCard';
import { ErrorBanner } from './ErrorBanner';
import { OrderDetailsResponse } from '../types/OrderTypes';

interface SuccessContentProps {
  orderData: OrderDetailsResponse | null;
  serviceType: string;
  error: string | null;
  onRetry: () => void;
  onBackToHome: () => void;
}

export const SuccessContent: React.FC<SuccessContentProps> = ({
  orderData,
  serviceType,
  error,
  onRetry,
  onBackToHome,
}) => {
  if (!orderData) return null;

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
    >
      {/* Error Banner */}
      {error && orderData && (
        <ErrorBanner onRetry={onRetry} />
      )}

      {/* Success Message */}
      <Text style={styles.title}>{orderData.title}</Text>
      <Text style={styles.subtitle}>{orderData.subtitle}</Text>

      {/* Order Details Card */}
      <OrderDetailsCard
        orderData={orderData}
        serviceType={serviceType}
      />

      {/* Action Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.homeButton}
          onPress={onBackToHome}
          activeOpacity={0.7}
        >
          <Feather name="home" size={18} color="rgba(255, 255, 255, 0.8)" />
          <Text style={styles.homeButtonText}>Back to Home</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
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
  buttonContainer: {
    width: '100%',
    gap: 12,
    zIndex: 15,
  },
  homeButton: {
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
  homeButtonText: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 14,
    fontWeight: '500',
  },
});