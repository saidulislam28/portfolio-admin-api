import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { BaseButton } from '@/components/BaseButton';
import { BLACK } from '@/lib/constants';

interface PaymentButtonProps {
  onPress: () => void;
  isLoading: boolean;
}

export const PaymentButton: React.FC<PaymentButtonProps> = ({
  onPress,
  isLoading,
}) => {
  return (
    <View style={styles.paymentButtonContainer}>
      <BaseButton 
        title="Proceed" 
        onPress={onPress} 
        isLoading={isLoading} 
      />
      <Text style={styles.secureText}>
        🔒 Your payment is secured with 256-bit SSL encryption
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  paymentButtonContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  secureText: {
    textAlign: 'center',
    color: BLACK,
    fontSize: 12,
    marginTop: 15,
  },
});