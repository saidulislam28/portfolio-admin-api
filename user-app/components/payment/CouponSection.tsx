import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BLACK, DARK_GRAY, LIGHT_GRAY, PRIMARY_COLOR } from '@/lib/constants';
import { Coupon } from '../types/PaymentTypes';

interface CouponSectionProps {
  appliedCoupon: Coupon | null;
  discountAmount: number;
  onAddCoupon: () => void;
  onRemoveCoupon: () => void;
}

export const CouponSection: React.FC<CouponSectionProps> = ({
  appliedCoupon,
  discountAmount,
  onAddCoupon,
  onRemoveCoupon,
}) => {
  return (
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
          <TouchableOpacity onPress={onRemoveCoupon}>
            <Ionicons name="close-circle" size={20} color="red" />
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity style={styles.addCouponButton} onPress={onAddCoupon}>
          <Ionicons name="pricetag" size={18} color={PRIMARY_COLOR} />
          <Text style={styles.addCouponText}>Add coupon code</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
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
});
