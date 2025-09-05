import { DARK_GRAY, LIGHT_GRAY, PRIMARY_COLOR, SUCCESS_COLOR, WHITE } from '@/lib/constants';
import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

export default function PaymentMethodSelector({ selectedMethod, onMethodChange }) {
  const paymentMethods = [
    {
      id: 'stripe',
      name: 'Credit/Debit Card',
      description: 'Visa, Mastercard, American Express',
      icon: '💳',
      fee: '2.5% processing fee',
      popular: true,
      enabled: true
    },
    {
      id: 'sslcommerz',
      name: 'SSL Commerce',
      description: 'bKash, Nagad, Rocket, Bank Transfer',
      icon: '🏦',
      fee: 'No additional fee',
      popular: false,
      enabled: true
    },
    {
      id: 'bkash',
      name: 'bKash',
      description: 'Pay with your bKash account',
      icon: '📱',
      fee: '1.5% processing fee',
      popular: true,
      enabled: true
    },
    {
      id: 'nagad',
      name: 'Nagad',
      description: 'Pay with your Nagad account',
      icon: '💰',
      fee: '1% processing fee',
      popular: false,
      enabled: true
    },
    {
      id: 'rocket',
      name: 'Rocket',
      description: 'Pay with your Rocket account',
      icon: '🚀',
      fee: '1.5% processing fee',
      popular: false,
      enabled: true
    },
    {
      id: 'bank',
      name: 'Bank Transfer',
      description: 'Direct bank account transfer',
      icon: '🏛️',
      fee: 'No processing fee',
      popular: false,
      enabled: false // Disabled for demo
    }
  ];

  const handleMethodSelect = (methodId) => {
    const method = paymentMethods.find(m => m.id === methodId);
    if (method && method.enabled) {
      onMethodChange(methodId);
    }
  };

  const getMethodColor = (method) => {
    if (!method.enabled) return LIGHT_GRAY;
    if (selectedMethod === method.id) return PRIMARY_COLOR;
    return '#e9ecef';
  };

  const getTextColor = (method) => {
    if (!method.enabled) return LIGHT_GRAY;
    if (selectedMethod === method.id) return PRIMARY_COLOR;
    return DARK_GRAY;
  };

  const getSelectedStyle = (method) => {
    if (selectedMethod === method.id && method.enabled) {
      return {
        borderColor: PRIMARY_COLOR,
        borderWidth: 2,
        backgroundColor: '#f0f8ff'
      };
    }
    return {};
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Payment Method</Text>
      <Text style={styles.subtitle}>Choose your preferred payment option</Text>
      
      <View style={styles.methodsContainer}>
        {paymentMethods.map((method) => (
          <TouchableOpacity
            key={method.id}
            style={[
              styles.methodCard,
              getSelectedStyle(method),
              !method.enabled && styles.disabledCard
            ]}
            onPress={() => handleMethodSelect(method.id)}
            disabled={!method.enabled}
            activeOpacity={0.7}
          >
            <View style={styles.methodContent}>
              <View style={styles.methodHeader}>
                <View style={styles.methodLeft}>
                  <Text style={styles.methodIcon}>{method.icon}</Text>
                  <View style={styles.methodInfo}>
                    <View style={styles.methodNameContainer}>
                      <Text style={[styles.methodName, { color: getTextColor(method) }]}>
                        {method.name}
                      </Text>
                      {method.popular && method.enabled && (
                        <View style={styles.popularBadge}>
                          <Text style={styles.popularText}>Popular</Text>
                        </View>
                      )}
                      {!method.enabled && (
                        <View style={styles.disabledBadge}>
                          <Text style={styles.disabledText}>Coming Soon</Text>
                        </View>
                      )}
                    </View>
                    <Text style={[styles.methodDescription, { color: getTextColor(method) }]}>
                      {method.description}
                    </Text>
                    <Text style={[styles.methodFee, { color: getTextColor(method) }]}>
                      {method.fee}
                    </Text>
                  </View>
                </View>
                
                <View style={styles.methodRight}>
                  <View style={[
                    styles.radioButton,
                    { borderColor: getMethodColor(method) },
                    selectedMethod === method.id && method.enabled && styles.radioButtonSelected
                  ]}>
                    {selectedMethod === method.id && method.enabled && (
                      <View style={styles.radioButtonInner} />
                    )}
                  </View>
                </View>
              </View>

              {/* Additional info for selected method */}
              {selectedMethod === method.id && method.enabled && (
                <View style={styles.selectedInfo}>
                  <View style={styles.selectedInfoContent}>
                    {method.id === 'stripe' && (
                      <>
                        <Text style={styles.selectedInfoText}>
                          • Secure card processing with 3D authentication
                        </Text>
                        <Text style={styles.selectedInfoText}>
                          • Instant payment confirmation
                        </Text>
                        <Text style={styles.selectedInfoText}>
                          • Supports international cards
                        </Text>
                      </>
                    )}
                    {method.id === 'sslcommerz' && (
                      <>
                        <Text style={styles.selectedInfoText}>
                          • Multiple payment options in one gateway
                        </Text>
                        <Text style={styles.selectedInfoText}>
                          • Secure SSL encrypted transactions
                        </Text>
                        <Text style={styles.selectedInfoText}>
                          • Instant payment confirmation
                        </Text>
                      </>
                    )}
                    {(method.id === 'bkash' || method.id === 'nagad' || method.id === 'rocket') && (
                      <>
                        <Text style={styles.selectedInfoText}>
                          • Pay directly from your mobile wallet
                        </Text>
                        <Text style={styles.selectedInfoText}>
                          • Quick and secure transactions
                        </Text>
                        <Text style={styles.selectedInfoText}>
                          • Instant payment confirmation
                        </Text>
                      </>
                    )}
                  </View>
                </View>
              )}
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Security Note */}
      <View style={styles.securityNote}>
        <Text style={styles.securityIcon}>🔒</Text>
        <Text style={styles.securityText}>
          All payments are secured with bank-level encryption and comply with PCI DSS standards
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: WHITE,
    margin: 20,
    borderRadius: 12,
    padding: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: DARK_GRAY,
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: LIGHT_GRAY,
    marginBottom: 20,
  },
  methodsContainer: {
    marginBottom: 20,
  },
  methodCard: {
    borderWidth: 1,
    borderColor: '#e9ecef',
    borderRadius: 10,
    marginBottom: 12,
    backgroundColor: WHITE,
    overflow: 'hidden',
  },
  disabledCard: {
    opacity: 0.6,
  },
  methodContent: {
    padding: 16,
  },
  methodHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  methodLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  methodIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  methodInfo: {
    flex: 1,
  },
  methodNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  methodName: {
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
  popularBadge: {
    backgroundColor: SUCCESS_COLOR,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  popularText: {
    fontSize: 10,
    color: WHITE,
    fontWeight: '500',
  },
  disabledBadge: {
    backgroundColor: LIGHT_GRAY,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  disabledText: {
    fontSize: 10,
    color: WHITE,
    fontWeight: '500',
  },
  methodDescription: {
    fontSize: 13,
    marginBottom: 4,
  },
  methodFee: {
    fontSize: 12,
    fontStyle: 'italic',
  },
  methodRight: {
    marginLeft: 12,
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioButtonSelected: {
    borderColor: PRIMARY_COLOR,
  },
  radioButtonInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: PRIMARY_COLOR,
  },
  selectedInfo: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
  },
  selectedInfoContent: {
    backgroundColor: '#f0f8ff',
    padding: 12,
    borderRadius: 8,
  },
  selectedInfoText: {
    fontSize: 12,
    color: DARK_GRAY,
    marginBottom: 4,
    lineHeight: 16,
  },
  securityNote: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: SUCCESS_COLOR,
  },
  securityIcon: {
    fontSize: 14,
    marginRight: 8,
    marginTop: 1,
  },
  securityText: {
    fontSize: 12,
    color: DARK_GRAY,
    flex: 1,
    lineHeight: 16,
  },
});