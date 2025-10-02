import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import BottomSheet, {
  BottomSheetView,
  BottomSheetBackdrop,
} from '@gorhom/bottom-sheet';
import { PRIMARY_COLOR } from '@/lib/constants';

interface EndCallConfirmationBottomSheetProps {
  onEndCallWithFeedback: () => void;
  onEndCallWithoutFeedback: () => void;
  onCancel: () => void;
  isBottomSheetOpen: boolean
  onChange: any;
}

const EndCallConfirmationBottomSheet: React.FC<
  EndCallConfirmationBottomSheetProps
> = ({ onEndCallWithFeedback, onEndCallWithoutFeedback, onCancel, isBottomSheetOpen, onChange }) => {
  return (
    <BottomSheet
      index={isBottomSheetOpen ? 0 : -1}
      snapPoints={['40%']}
      enablePanDownToClose
      onChange={(i) => onChange(i >= 0)}
      backdropComponent={props => (
        <BottomSheetBackdrop
          {...props}
          disappearsOnIndex={-1}
          appearsOnIndex={0}
        />
      )}
    >
      <BottomSheetView style={styles.bottomSheetContent}>
        <View style={styles.bottomSheetHeader}>
          <Ionicons name="call" size={32} color="#EF4444" />
          <Text style={styles.bottomSheetTitle}>End Call?</Text>
          <Text style={styles.bottomSheetDescription}>
            Are you sure you want to end this call? You'll be able to provide
            feedback about your experience.
          </Text>
        </View>

        <View style={styles.bottomSheetButtons}>
          <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.confirmButton}
            onPress={onEndCallWithFeedback}
          >
            <Text style={styles.confirmButtonText}>
              End Call & Rate
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.endCallButton}
            onPress={onEndCallWithoutFeedback}
          >
            <Text style={styles.endCallButtonText}>
              End Call Without Rating
            </Text>
          </TouchableOpacity>
        </View>
      </BottomSheetView>
    </BottomSheet>
  );
};

export default EndCallConfirmationBottomSheet;

const styles = StyleSheet.create({
  bottomSheetContent: {
    flex: 1,
    padding: 24,
  },
  bottomSheetHeader: {
    alignItems: 'center',
    marginBottom: 32,
  },
  bottomSheetTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginTop: 16,
    marginBottom: 8,
  },
  bottomSheetDescription: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
  },
  bottomSheetButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginTop: 16,
  },
  cancelButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#374151',
    fontWeight: '600',
    fontSize: 16,
  },
  confirmButton: {
    flex: 2,
    padding: 16,
    borderRadius: 12,
    backgroundColor: PRIMARY_COLOR,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },
  endCallButton: {
    flex: 2,
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#6B7280',
    alignItems: 'center',
  },
  endCallButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },
});
