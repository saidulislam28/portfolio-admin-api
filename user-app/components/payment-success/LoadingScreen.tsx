import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import LottieView from 'lottie-react-native';

export const LoadingScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#4A90E2', '#357ABD', '#1E3A8A']}
        style={styles.gradient}
      />
      <LottieView
        source={{
          uri: 'https://assets5.lottiefiles.com/packages/lf20_szlepvdh.json'
        }}
        style={styles.animation}
        autoPlay
        loop
      />
      <Text style={styles.text}>Loading your order details...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#4A90E2',
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  animation: {
    width: 80,
    height: 80,
    marginBottom: 20,
  },
  text: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});