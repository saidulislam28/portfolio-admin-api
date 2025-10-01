import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Keyboard,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import BottomSheet, { 
  BottomSheetBackdrop, 
  BottomSheetFlatList
} from '@gorhom/bottom-sheet';
import { BottomSheetTextInput } from '@gorhom/bottom-sheet';
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

  const inputRef = useRef(null);
  const inputTextRef = useRef('');

  const snapPoints = useMemo(() => ['75%', '90%'], []);

  useEffect(() => {
    if (isVisible) {
      bottomSheetRef.current?.expand();
    } else {
      bottomSheetRef.current?.close();
    }
  }, [isVisible]);

  useEffect(() => {
    const keyboardWillShow = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      () => {
        // Snap to larger size when keyboard shows
        bottomSheetRef.current?.snapToIndex(1);
      }
    );

    const keyboardWillHide = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => {
        // Return to smaller size when keyboard hides
        bottomSheetRef.current?.snapToIndex(0);
      }
    );

    return () => {
      keyboardWillShow.remove();
      keyboardWillHide.remove();
    };
  }, []);

  const handleApplyCoupon = async () => {
    if (inputTextRef.current !== '') {
      Keyboard.dismiss();
      setValidatingCoupon(true);
      const success = await onValidateCoupon(inputTextRef.current);
      if (success) {
        setCouponCode('');
      }
      setValidatingCoupon(false);
      // inputTextRef.current = ''
      inputRef?.current?.clear();
    }
  };

  const handleCouponSelect = useCallback(async (coupon: Coupon) => {
    Keyboard.dismiss();
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

  const ListHeaderComponent = useCallback(() => (
    <View>
      <View style={styles.modalHeader}>
        <Text style={styles.modalTitle}>Apply Coupon</Text>
        <TouchableOpacity onPress={onClose}>
          <Ionicons name="close" size={24} color={BLACK} />
        </TouchableOpacity>
      </View>

      <View style={styles.couponInputContainer}>
        <BottomSheetTextInput
          style={styles.couponInput}
          placeholder="Enter coupon code"
          autoCapitalize="characters"
          editable={!validatingCoupon}
          ref={inputRef} 
          onChangeText={(text) => { inputTextRef.current = text; console.log(text) }} 
          defaultValue={inputTextRef.current}
        />
        <TouchableOpacity
          style={[styles.applyButton, validatingCoupon && styles.applyButtonDisabled]}
          onPress={handleApplyCoupon}
          disabled={validatingCoupon}
        >
          {validatingCoupon ? (
            <ActivityIndicator color={WHITE} size="small" />
          ) : (
            <Text style={styles.applyButtonText}>Apply</Text>
          )}
        </TouchableOpacity>
      </View>

      <Text style={styles.availableCouponsTitle}>Your Available Coupons</Text>

      {loadingCoupons && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={PRIMARY_COLOR} />
        </View>
      )}
    </View>
  ), [couponCode, validatingCoupon, loadingCoupons, onClose, handleApplyCoupon]);

  const ListEmptyComponent = useCallback(() => {
    if (loadingCoupons) return null;
    return <Text style={styles.noCouponsText}>No coupons available</Text>;
  }, [loadingCoupons]);

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={-1}
      snapPoints={snapPoints}
      enablePanDownToClose
      onClose={onClose}
      backdropComponent={BottomSheetBackdrop}
      handleIndicatorStyle={styles.handleIndicator}
      keyboardBehavior="interactive"
      keyboardBlurBehavior="restore"
      android_keyboardInputMode="adjustResize"
      enableDynamicSizing={false}
    >
      <BottomSheetFlatList
        data={availableCoupons}
        renderItem={renderCouponItem}
        keyExtractor={(item) => item.id.toString()}
        ListHeaderComponent={ListHeaderComponent}
        ListEmptyComponent={ListEmptyComponent}
        contentContainerStyle={styles.listContent}
        keyboardShouldPersistTaps="handled"
      />
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  handleIndicator: {
    backgroundColor: LIGHT_GRAY,
    width: 40,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
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
    borderColor: DARK_GRAY,
    borderRadius: 8,
    padding: 15,
    marginRight: 10,
    fontSize: 16,
    backgroundColor: WHITE,
    color: DARK_GRAY
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
