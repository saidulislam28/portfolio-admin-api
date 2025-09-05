// components/onboarding/OnboardingSlide.tsx
import React from 'react';
import { View, Text, Image, StyleSheet, Dimensions } from 'react-native';
// import { PRIMARY_COLOR, TEXT_COLOR, SUBTITLE_COLOR, BACKGROUND_COLOR } from '@/lib/constants';
import { OnboardingItem } from './onboarding-data';
import { Colors } from '@/constants/Colors';


const { width, height } = Dimensions.get('window');

interface OnboardingSlideProp {
  item: OnboardingItem;
}

export const OnboardingSlide: React.FC<OnboardingSlideProp> = ({ item }) => {
  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image 
          source={item.image} 
          style={styles.image}
          resizeMode="contain"
        />
      </View>
      
      <View style={styles.textContainer}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.subtitle}>{item.subtitle}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.BACKGROUND_COLOR,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  imageContainer: {
    flex: 0.6,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  image: {
    width: width * 0.8,
    height: height * 0.4,
  },
  textContainer: {
    flex: 0.4,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.TEXT_COLOR,
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 34,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.SUBTITLE_COLOR,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 10,
  },
});