import { useLoading } from '@/zustand/commonStore';
import React from 'react';
import { ActivityIndicator, Modal, StyleSheet, View } from 'react-native';

// type Props = {
//     visible: boolean;
// };

const LoadingOverlay: React.FC = () => {
  const { isLoading } = useLoading();
  return (
    <Modal
      visible={isLoading}
      transparent
      animationType="fade"
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <ActivityIndicator size="large" color="#ffffff" />
      </View>
    </Modal>
  );
};

export default LoadingOverlay;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
