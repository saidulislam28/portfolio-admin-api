import React, { useRef } from 'react';
import { Dimensions, FlatList, Image, StyleSheet, View } from 'react-native';
const { width } = Dimensions.get('window');

const images = [
  {
    id: '1',
    uri: 'https://images.unsplash.com/photo-1747595509327-20fb3e0c3216?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  },
  {
    id: '2',
    uri: 'https://images.unsplash.com/photo-1747595509327-20fb3e0c3216?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  },
  {
    id: '3',
    uri: 'https://images.unsplash.com/photo-1747595509327-20fb3e0c3216?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  },
];

export default function Carousel() {
  const flatListRef = useRef<FlatList>(null);
  return (
    <View style={styles.CarouselContainer}>
      <FlatList
        ref={flatListRef}
        data={images}
        keyExtractor={item => item.id}
        horizontal
        // pagingEnabled
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <Image source={{ uri: item.uri }} style={styles.image} />
        )}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  CarouselContainer: {
    height: 400,
    marginTop: 24,
    borderRadius: 10,
  },
  image: {
    width: width * 0.9,
    height: 300,
    resizeMode: 'cover',
    borderRadius: 10,
    marginRight: 14,
  },
});
