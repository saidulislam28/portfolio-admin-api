import { useAuth } from '@/app/context/useAuth';
import CommonHeader from '@/components/CommonHeader';
import PaymentSummary from '@/components/packages/PaymentSummary';
import { BLACK, DARK_GRAY, LIGHT_GRAY, PRIMARY_COLOR, WHITE } from '@/lib/constants';
import { API_USER, Post, Get } from '@sm/common';
import * as Localization from 'expo-localization';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState, useEffect } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  Modal,
  FlatList
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Coupon {
  id: number;
  code: string;
  description: string;
  discount_type: 'PERCENTAGE' | 'FIXED';
  discount_value: number;
  min_order_amount: number;
  max_discount: number | null;
  is_active: boolean;
  is_global: boolean;
  start_date: string;
  end_date: string;
  categories: string[];
  max_uses: number;
  used_count: number;
}

interface CouponValidationResponse {
  isValid: boolean;
  message: string;
  coupon?: Coupon;
  discountAmount?: number;
}

export default function PaymentScreen() {
  const router = useRouter();
  const params: any = useLocalSearchParams();
  const { user } = useAuth();
  const [processing, setProcessing] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('stripe');
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [showCouponModal, setShowCouponModal] = useState(false);
  const [availableCoupons, setAvailableCoupons] = useState<Coupon[]>([]);
  const [loadingCoupons, setLoadingCoupons] = useState(false);
  const [validatingCoupon, setValidatingCoupon] = useState(false);

  const packageData = {
    id: params?.packageId,
    name: params?.packageName,
    price: parseInt(params?.packagePrice),
    sessions: parseInt(params?.packageSessions),
    type: params?.packageType,
    service_type: params?.service_type,
  };

  const selectedSlots = params?.selectedSlots
    ? JSON.parse(params.selectedSlots)
    : [];

  // Fetch available coupons on component mount
  useEffect(() => {
    fetchAvailableCoupons();
  }, []);

  const fetchAvailableCoupons = async () => {
    if (!user?.token) return;

    setLoadingCoupons(true);
    try {
      const response = await Get('user/coupons/my-coupons');

      console.log("response my coupons", response?.data)

      if (response?.success) {
        setAvailableCoupons(response?.data || []);
      }
    } catch (error) {
      console.log('Error fetching coupons:', error);
    } finally {
      setLoadingCoupons(false);
    }
  };

  const validateCoupon = async (code: string) => {
    if (!code.trim()) {
      Alert.alert('Error', 'Please enter a coupon code');
      return;
    }

    setValidatingCoupon(true);
    try {
      const payload = {
        code: code.trim(),
        orderAmount: packageData.price,
        serviceType: packageData.service_type,
      };

      const response = await Post('user/coupons/validate', payload);

      console.log("validation response>>", response?.data)

      const validationData: CouponValidationResponse = response?.data?.data;

      if (validationData.isValid && validationData.coupon) {
        setAppliedCoupon(validationData.coupon);
        setDiscountAmount(validationData.discountAmount || 0);
        setCouponCode('');
        setShowCouponModal(false);
        Alert.alert('Success', validationData.message);
      } else {
        Alert.alert('Invalid Coupon', validationData.message);
      }
    } catch (error: any) {
      console.log('Coupon validation error:', error);
      Alert.alert(
        'Error',
        error.response?.data?.message || 'Failed to validate coupon. Please try again.'
      );
    } finally {
      setValidatingCoupon(false);
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setDiscountAmount(0);
  };

  const appoinmentData = selectedSlots.map((slot: any) => {
    const [hourMin, ampm] = slot.slot.time.split(' ');
    let [hour, minute] = hourMin.split(':').map(Number);

    if (ampm === 'PM' && hour !== 12) hour += 12;
    if (ampm === 'AM' && hour === 12) hour = 0;

    const [year, month, day] = slot.date.split('-').map(Number);
    const startTime = new Date(year, month - 1, day, hour, minute);

    const duration_in_min = 20;
    const endDate = new Date(startTime.getTime() + duration_in_min * 60 * 1000);

    return {
      start_at: startTime.toISOString(),
      duration_in_min,
      end_at: endDate.toISOString(),
      notes: 'IELTS Speaking Test'
    };
  });

  // user_id: user?.id,
  const handlePayment = async () => {
    setProcessing(true);
    try {
      const orderData = {
        first_name: user?.full_name,
        last_name: user?.full_name,
        email: user?.email,
        phone: user?.phone,
        address: "dhaka 1216",
        package_id: +packageData.id,
        service_type: params?.service_type,
        total: +totals?.total,
        delivery_charge: 0,
        subtotal: +packageData.price,
        appointments: appoinmentData,
        user_timezone: Localization.getCalendars()[0].timeZone,
        coupon_code: appliedCoupon?.code,
        // discount_amount: discountAmount
      };

      const response = await Post(API_USER.create_order, orderData);
      const responseData = response?.data?.data;

      if (response?.data?.success) {
        router.push(`/sslpay-screen?payment_url=${responseData?.payment_url}&service_type=${params.service_type}&amount=${responseData?.total_amount}`);
      }
    } catch (error: any) {
      console.log('Full error:', error);
      Alert.alert('Error', 'An error occurred during payment processing. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  const calculateTotal = () => {
    const subtotal = packageData.price;
    const processingFee = selectedPaymentMethod === 'stripe' ? subtotal * 0.025 : 0;
    const tax = subtotal * 0.05;
    const totalBeforeDiscount = Math.round(subtotal + processingFee + tax);
    const finalTotal = Math.max(0, totalBeforeDiscount - discountAmount);

    return {
      subtotal,
      processingFee: Math.round(processingFee),
      tax: Math.round(tax),
      discount: discountAmount,
      total: finalTotal,
      totalBeforeDiscount
    };
  };

  const totals = calculateTotal();

  const renderCouponItem = ({ item }: { item: Coupon }) => (
    <TouchableOpacity
      style={styles.couponItem}
      onPress={() => {
        setCouponCode(item.code);
        validateCoupon(item.code);
      }}
    >
      <View style={styles.couponInfo}>
        <Text style={styles.couponCode}>{item.code}</Text>
        <Text style={styles.couponDescription}>{item.description}</Text>
        <Text style={styles.couponDiscount}>
          {item.discount_type === 'PERCENTAGE'
            ? `${item.discount_value}% off`
            : `BDT ${item.discount_value} off`
          }
        </Text>
      </View>
      <Ionicons name="arrow-forward" size={20} color={PRIMARY_COLOR} />
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <CommonHeader text='Payment details' />

      {/* Coupon Section */}
      <View style={styles.couponSection}>
        <Text style={styles.sectionTitle}>Apply Coupon</Text>

        {appliedCoupon ? (
          <View style={styles.appliedCoupon}>
            <View style={styles.couponAppliedInfo}>
              <Ionicons name="checkmark-circle" size={20} color="green" />
              <Text style={styles.appliedCouponText}>
                {appliedCoupon.code} applied (-BDT {discountAmount})
              </Text>
            </View>
            <TouchableOpacity onPress={removeCoupon}>
              <Ionicons name="close-circle" size={20} color="red" />
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            style={styles.addCouponButton}
            onPress={() => setShowCouponModal(true)}
          >
            <Ionicons name="pricetag" size={18} color={PRIMARY_COLOR} />
            <Text style={styles.addCouponText}>Add coupon code</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Payment Summary */}
      <PaymentSummary
        packageData={packageData}
        selectedSlots={selectedSlots}
        totals={totals}
        discountAmount={discountAmount}
      />

      {/* Payment Button */}
      <View style={styles.paymentButtonContainer}>
        <TouchableOpacity
          style={[styles.paymentButton, processing && styles.paymentButtonDisabled]}
          onPress={handlePayment}
          disabled={processing}
        >
          {processing ? (
            <View style={styles.processingContainer}>
              <ActivityIndicator color={WHITE} size="small" />
              <Text style={styles.processingText}>Processing...</Text>
            </View>
          ) : (
            <Text style={styles.paymentButtonText}>
              Pay BDT {totals.total.toLocaleString()}
            </Text>
          )}
        </TouchableOpacity>

        <Text style={styles.secureText}>
          🔒 Your payment is secured with 256-bit SSL encryption
        </Text>
      </View>

      {/* Coupon Modal */}
      <Modal
        visible={showCouponModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowCouponModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Apply Coupon</Text>
              <TouchableOpacity onPress={() => setShowCouponModal(false)}>
                <Ionicons name="close" size={24} color={BLACK} />
              </TouchableOpacity>
            </View>

            {/* Coupon Input */}
            <View style={styles.couponInputContainer}>
              <TextInput
                style={styles.couponInput}
                placeholder="Enter coupon code"
                value={couponCode}
                onChangeText={setCouponCode}
                autoCapitalize="characters"
              />
              <TouchableOpacity
                style={[styles.applyButton, validatingCoupon && styles.applyButtonDisabled]}
                onPress={() => validateCoupon(couponCode)}
                disabled={validatingCoupon}
              >
                {validatingCoupon ? (
                  <ActivityIndicator color={WHITE} size="small" />
                ) : (
                  <Text style={styles.applyButtonText}>Apply</Text>
                )}
              </TouchableOpacity>
            </View>

            {/* Available Coupons */}
            <Text style={styles.availableCouponsTitle}>Your Available Coupons</Text>
            {loadingCoupons ? (
              <ActivityIndicator size="large" color={PRIMARY_COLOR} />
            ) : availableCoupons.length > 0 ? (
              <FlatList
                data={availableCoupons}
                renderItem={renderCouponItem}
                keyExtractor={(item) => item.id.toString()}
                style={styles.couponList}
              />
            ) : (
              <Text style={styles.noCouponsText}>No coupons available</Text>
            )}
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    position: 'relative',
  },
  couponSection: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: LIGHT_GRAY,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: DARK_GRAY,
    marginBottom: 15,
  },
  addCouponButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: LIGHT_GRAY,
    borderStyle: 'dashed',
  },
  addCouponText: {
    marginLeft: 10,
    color: PRIMARY_COLOR,
    fontWeight: '500',
  },
  appliedCoupon: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#e8f5e8',
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#4caf50',
  },
  couponAppliedInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  appliedCouponText: {
    marginLeft: 8,
    color: '#2e7d32',
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: WHITE,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: BLACK,
  },
  couponInputContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  couponInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: LIGHT_GRAY,
    borderRadius: 8,
    padding: 15,
    marginRight: 10,
    fontSize: 16,
  },
  applyButton: {
    backgroundColor: PRIMARY_COLOR,
    borderRadius: 8,
    padding: 15,
    minWidth: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  applyButtonDisabled: {
    backgroundColor: LIGHT_GRAY,
  },
  applyButtonText: {
    color: WHITE,
    fontWeight: 'bold',
  },
  availableCouponsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: DARK_GRAY,
    marginBottom: 15,
  },
  couponList: {
    maxHeight: 300,
  },
  couponItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: LIGHT_GRAY,
  },
  couponInfo: {
    flex: 1,
  },
  couponCode: {
    fontSize: 16,
    fontWeight: 'bold',
    color: BLACK,
    marginBottom: 4,
  },
  couponDescription: {
    fontSize: 14,
    color: DARK_GRAY,
    marginBottom: 4,
  },
  couponDiscount: {
    fontSize: 14,
    color: PRIMARY_COLOR,
    fontWeight: '500',
  },
  noCouponsText: {
    textAlign: 'center',
    color: DARK_GRAY,
    fontStyle: 'italic',
    marginVertical: 20,
  },
  paymentButtonContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  paymentButton: {
    backgroundColor: PRIMARY_COLOR,
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  paymentButtonDisabled: {
    backgroundColor: LIGHT_GRAY,
    elevation: 0,
    shadowOpacity: 0,
  },
  paymentButtonText: {
    color: WHITE,
    fontSize: 18,
    fontWeight: 'bold',
  },
  processingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  processingText: {
    color: WHITE,
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 10,
  },
  secureText: {
    textAlign: 'center',
    color: BLACK,
    fontSize: 12,
    marginTop: 15,
  },
});