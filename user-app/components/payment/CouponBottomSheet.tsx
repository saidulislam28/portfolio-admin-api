import React, { useState, useCallback, useMemo } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  FlatList, 
  StyleSheet,
  ActivityIndicator 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import BottomSheet, { BottomSheetBackdrop, BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { BLACK, DARK_GRAY, LIGHT_GRAY, PRIMARY_COLOR, WHITE } from '@/lib/constants';
import { Coupon } from '@/types/paymentTypes';

interface CouponBottomSheetProps {
  isVisible: boolean;
  onClose: () => void;
  availableCoupons: Coupon[];
  loadingCoupons: boolean;
  onValidateCoupon: (code: string) => Promise<boolean>;
}

export const CouponBottomSheet: React.FC<CouponBottomSheetProps> = ({
  isVisible,
  onClose,
  availableCoupons,
  loadingCoupons,
  onValidateCoupon,
}) => {
  const [couponCode, setCouponCode] = useState('');
  const [validatingCoupon, setValidatingCoupon] = useState(false);
  const bottomSheetRef = React.useRef<BottomSheet>(null);

  const snapPoints = useMemo(() => {
    const baseHeight = 300;
    const itemHeight = 80;
    const maxItems = Math.min(availableCoupons.length, 4);
    const calculatedHeight = baseHeight + (maxItems * itemHeight);
    return [Math.min(calculatedHeight, 600)];
  }, [availableCoupons.length]);

  React.useEffect(() => {
    if (isVisible) {
      bottomSheetRef.current?.expand();
    } else {
      bottomSheetRef.current?.close();
    }
  }, [isVisible]);

  const handleApplyCoupon = useCallback(async () => {
    setValidatingCoupon(true);
    const success = await onValidateCoupon(couponCode);
    if (success) {
      setCouponCode('');
    }
    setValidatingCoupon(false);
  }, [couponCode, onValidateCoupon]);

  const handleCouponSelect = useCallback(async (coupon: Coupon) => {
    setValidatingCoupon(true);
    const success = await onValidateCoupon(coupon.code);
    setValidatingCoupon(false);
  }, [onValidateCoupon]);

  const renderCouponItem = useCallback(({ item }: { item: Coupon }) => (
    <TouchableOpacity
      style={styles.couponItem}
      onPress={() => handleCouponSelect(item)}
      disabled={validatingCoupon}
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
  ), [handleCouponSelect, validatingCoupon]);

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={-1}
      snapPoints={snapPoints}
      enablePanDownToClose
      onClose={onClose}
      backdropComponent={BottomSheetBackdrop}
      handleIndicatorStyle={styles.handleIndicator}
    >
      <BottomSheetScrollView contentContainerStyle={styles.modalContent}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>Apply Coupon</Text>
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="close" size={24} color={BLACK} />
          </TouchableOpacity>
        </View>

        <View style={styles.couponInputContainer}>
          <TextInput
            style={styles.couponInput}
            placeholder="Enter coupon code"
            value={couponCode}
            onChangeText={setCouponCode}
            autoCapitalize="characters"
            editable={!validatingCoupon}
          />
          <TouchableOpacity
            style={[styles.applyButton, validatingCoupon && styles.applyButtonDisabled]}
            onPress={handleApplyCoupon}
            disabled={validatingCoupon || !couponCode.trim()}
          >
            {validatingCoupon ? (
              <ActivityIndicator color={WHITE} size="small" />
            ) : (
              <Text style={styles.applyButtonText}>Apply</Text>
            )}
          </TouchableOpacity>
        </View>

        <Text style={styles.availableCouponsTitle}>Your Available Coupons</Text>
        
        {loadingCoupons ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={PRIMARY_COLOR} />
          </View>
        ) : availableCoupons.length > 0 ? (
          <FlatList
            data={availableCoupons}
            renderItem={renderCouponItem}
            keyExtractor={(item) => item.id.toString()}
            scrollEnabled={false}
          />
        ) : (
          <Text style={styles.noCouponsText}>No coupons available</Text>
        )}
      </BottomSheetScrollView>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  handleIndicator: {
    backgroundColor: LIGHT_GRAY,
    width: 40,
  },
  modalContent: {
    padding: 20,
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
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
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
});
