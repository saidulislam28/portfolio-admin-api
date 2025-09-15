import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';

interface StarRatingProps {
  value: number;
  onValueChange: (value: number) => void;
  maxStars?: number;
}

const StarRating: React.FC<StarRatingProps> = ({
  value,
  onValueChange,
  maxStars = 9,
}) => {
  return (
    <View style={styles.starContainer}>
      {Array.from({ length: maxStars }, (_, index) => index + 1).map(star => (
        <TouchableOpacity
          key={star}
          onPress={() => onValueChange(star)}
          style={styles.starButton}
        >
          <Text
            style={[
              styles.star,
              star <= value ? styles.starSelected : null,
            ]}
          >
            {star <= value ? '★' : '☆'}
          </Text>
        </TouchableOpacity>
      ))}
      <Text style={styles.ratingText}>{value.toFixed(1)}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  starContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    flexWrap: 'wrap',
  },
  starButton: {
    marginRight: 8,
    padding: 8,
  },
  star: {
    fontSize: 28,
    color: '#bdc3c7',
  },
  starSelected: {
    color: '#f39c12',
  },
  ratingText: {
    marginLeft: 15,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
});

export default StarRating;