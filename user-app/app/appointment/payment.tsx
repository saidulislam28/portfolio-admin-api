import { useAuth } from '@/context/useAuth';
import CommonHeader from '@/components/CommonHeader';
import PaymentSummary from '@/components/packages/PaymentSummary';
import { API_USER, Get, Post, replacePlaceholders } from '@sm/common';
import * as Localization from 'expo-localization';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Alert, ScrollView, StyleSheet } from 'react-native';
import { ROUTES } from '@/constants/app.routes';
import { Coupon, CouponValidationResponse } from '@/types/paymentTypes';
import { CouponSection } from '@/components/payment/CouponSection';
import { PaymentButton } from '@/components/payment/PaymentButton';
import { CouponBottomSheet } from '@/components/payment/CouponBottomSheet';

export default function PaymentScreen() {
  const router = useRouter();
  const params: any = useLocalSearchParams();
  const { user } = useAuth();

  // State
  const [processing, setProcessing] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('stripe');
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [showCouponModal, setShowCouponModal] = useState(false);
  const [availableCoupons, setAvailableCoupons] = useState<Coupon[]>([]);
  const [loadingCoupons, setLoadingCoupons] = useState(false);

  // Memoized data
  const packageData = useMemo(() => ({
    id: params?.packageId,
    name: params?.packageName,
    price: parseInt(params?.packagePrice),
    sessions: parseInt(params?.packageSessions),
    type: params?.packageType,
    service_type: params?.service_type,
  }), [params]);

  const selectedSlots = useMemo(() =>
    params?.selectedSlots ? JSON.parse(params.selectedSlots) : []
    , [params?.selectedSlots]);

  const appoinmentData = useMemo(() =>
    selectedSlots.map((slot: any) => {
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
    })
    , [selectedSlots]);

  const totals = useMemo(() => {
    const subtotal = packageData.price;
    const processingFee = 0;
    const tax = 0;
    const totalBeforeDiscount = Math.round(subtotal + processingFee + tax);
    const finalTotal = Math.max(0, totalBeforeDiscount - discountAmount);


    return {
      subtotal,
      processingFee: Math.round(processingFee),
      tax: Math.round(tax),
      discount: discountAmount,
      total: totalBeforeDiscount,
      final_amount: finalTotal,
      totalBeforeDiscount
    };
  }, [packageData.price, selectedPaymentMethod, discountAmount]);

  // Effects
  useEffect(() => {
    fetchAvailableCoupons();
  }, []);

  // API calls
  const fetchAvailableCoupons = useCallback(async () => {
    if (!user?.token) return;

    setLoadingCoupons(true);
    try {
      const response = await Get(API_USER.user_coupon);
      if (response?.success) {
        setAvailableCoupons(response?.data || []);
      }
    } catch (error) {
      console.log('Error fetching coupons:', error);
    } finally {
      setLoadingCoupons(false);
    }
  }, [user?.token]);

  const validateCoupon = useCallback(async (code: string): Promise<boolean> => {
    if (!code.trim()) {
      Alert.alert('Error', 'Please enter a coupon code');
      return false;
    }

    try {
      const payload = {
        code: code.trim(),
        orderAmount: packageData.price,
        serviceType: packageData.service_type,
      };

      const response = await Post(API_USER.validate_coupon, payload);
      const validationData: CouponValidationResponse = response?.data?.data;

      if (validationData.isValid && validationData.coupon) {
        setAppliedCoupon(validationData.coupon);
        setDiscountAmount(validationData.discountAmount || 0);
        setShowCouponModal(false);
        Alert.alert('Success', validationData.message);
        return true;
      } else {
        Alert.alert('Invalid Coupon', validationData.message);
        return false;
      }
    } catch (error: any) {
      console.log('Coupon validation error:', error);
      Alert.alert(
        'Error',
        error.response?.data?.message || 'Failed to validate coupon. Please try again.'
      );
      return false;
    }
  }, [packageData.price, packageData.service_type]);

  const removeCoupon = useCallback(() => {
    setAppliedCoupon(null);
    setDiscountAmount(0);
  }, []);

  const handlePayment = useCallback(async () => {
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
      };
      // console.log("totals", totals);
      // console.log("discountAmount", discountAmount);
      // console.log("order data>", orderData);
      // setProcessing(false);
      // return

      const response = await Post(API_USER.create_order, orderData);
      const responseData = response?.data?.data;

      if (response?.data?.success) {
        router.push(
          {
            pathname: ROUTES.SSL_PAYMENT as any,
            params: {
              payment_url: responseData?.payment_url,
              service_type: params?.service_type,
              amount: responseData?.total_amount,
              order_id: responseData.order_id
            }
          }
        );
      }
    } catch (err: any) {

      console.error("Profile update error:", err);
      console.error("Error details:", err.response?.data || err.message);
      Alert.alert('Error', err.response?.data?.message ?? "An error occured during order");
    } finally {
      setProcessing(false);
    }
  }, [user, packageData, params, totals, appoinmentData, appliedCoupon, router]);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <CommonHeader text='Payment details' />

      <PaymentSummary
        packageData={packageData}
        selectedSlots={selectedSlots}
        totals={totals}
        discountAmount={discountAmount}
      />

      <CouponSection
        appliedCoupon={appliedCoupon}
        discountAmount={discountAmount}
        onAddCoupon={() => setShowCouponModal(true)}
        onRemoveCoupon={removeCoupon}
      />

      <PaymentButton
        onPress={handlePayment}
        isLoading={processing}
      />

      <CouponBottomSheet
        isVisible={showCouponModal}
        onClose={() => setShowCouponModal(false)}
        availableCoupons={availableCoupons}
        loadingCoupons={loadingCoupons}
        onValidateCoupon={validateCoupon}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    position: 'relative',
  },
});
