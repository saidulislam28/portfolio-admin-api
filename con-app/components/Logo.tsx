import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import AppLogo from '@/assets/images/Logo512.png';

const Logo = () => {
  return (
    <View style={styles.iconContainer}>
      <Image source={AppLogo} style={styles.iconImage} resizeMode="contain" />
    </View>
  );
};

export default Logo;

const styles = StyleSheet.create({
  iconContainer: {},
  iconImage: {
    width: 100,
    height: 100,
    borderRadius: 35,

    // tintColor: '#FFFFFF',
  },
});
