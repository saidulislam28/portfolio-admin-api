import { PRIMARY_COLOR } from "@/lib/constants";
import { Animated, Easing, StyleSheet, View } from "react-native";

export const BookCardSkeleton = () => {
  const animatedValue = new Animated.Value(0);

  Animated.loop(
    Animated.sequence([
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: 1000,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
      Animated.timing(animatedValue, {
        toValue: 0,
        duration: 1000,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ])
  ).start();

  const opacity = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  return (
    <View style={[styles.cardContainer, styles.skeletonContainer]}>
      <Animated.View style={[styles.skeletonImage, { opacity }]} />
      <View style={styles.skeletonContent}>
        <Animated.View style={[styles.skeletonLine, { opacity, width: '80%' }]} />
        <Animated.View style={[styles.skeletonLine, { opacity, width: '60%' }]} />
        <View style={styles.skeletonBottomRow}>
          <Animated.View style={[styles.skeletonLine, { opacity, width: '40%' }]} />
          <Animated.View style={[styles.skeletonLine, { opacity, width: '30%' }]} />
        </View>
      </View>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    position: 'relative',
  },
  listContent: {
    padding: 8,
  },
  gridItem: {
    flex: 1,
    maxWidth: '50%',
    padding: 8,
  },
  backButton: {
    color: PRIMARY_COLOR,
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 20,
    marginTop: 15,
    marginBottom: 8,
  },
  // Skeleton styles
  skeletonContainer: {
    backgroundColor: '#f8f9fc',
    borderColor: '#e0e0e0',
  },
  skeletonImage: {
    width: 140,
    height: 120,
    backgroundColor: '#e0e0e0',
    borderRadius: 8,
    marginBottom: 10,
  },
  skeletonContent: {
    flex: 1,
    padding: 10,
  },
  skeletonLine: {
    height: 12,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    marginBottom: 8,
  },
  skeletonBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 'auto',
  },
  cardContainer: {
    backgroundColor: '#F8F9FC',
    borderRadius: 8,
    width: 151,
    height: 255,
    maxHeight: 300,
    borderWidth: 1,
    padding: 5,
    borderColor: PRIMARY_COLOR,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});