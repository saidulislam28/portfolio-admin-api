import { PRIMARY_COLOR } from '@/lib/constants';
import { Image, Pressable, StyleSheet, Text, View, Dimensions } from 'react-native';

const { width: screenWidth } = Dimensions.get('window');

interface Book {
  id: string;
  title: string;
  price: number;
  image: string;
  description: string;
  writer: string;
}

interface BookItemProps {
  book: Book;
  onPress: () => void;
}

export default function BookCard({ book, onPress }: BookItemProps) {
  return (
    <Pressable onPress={onPress} style={styles.cardContainer}>
      {/* Left side - Book Cover */}
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: book.image }}
          style={styles.bookImage}
          resizeMode="cover"
        />
      </View>

      {/* Right side - Book Details */}
      <View style={styles.contentContainer}>
        <Text style={styles.bookTitle} numberOfLines={2} ellipsizeMode="tail">
          {book?.title}
        </Text>

        <Text style={styles.author} numberOfLines={1} ellipsizeMode="tail">
          By: {book?.writer ?? 'N/A'}
        </Text>

        <View style={styles.bottomRow}>
          <Text style={styles.priceNow}>
            BDT {book?.price?.toFixed(2)}
          </Text>

          <View style={styles.ratingContainer}>
            <Text style={styles.starIcon}>⭐</Text>
            <Text style={styles.rating}>4.5</Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    // marginHorizontal: 16,
    marginVertical: 8,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    minHeight: 120,
    width: screenWidth - 32, // Responsive width with margins
  },
  imageContainer: {
    marginRight: 12,
    borderRadius: 8,
    overflow: 'hidden',
  },
  bookImage: {
    width: 80,
    height: 96,
    borderRadius: 8,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  bookTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    lineHeight: 22,
    marginBottom: 4,
    flexShrink: 1,
  },
  author: {
    fontSize: 13,
    color: '#666666',
    marginBottom: 8,
    flexShrink: 1,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 'auto',
  },
  priceNow: {
    fontSize: 16,
    fontWeight: 'bold',
    color: PRIMARY_COLOR,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  starIcon: {
    fontSize: 12,
    marginRight: 4,
  },
  rating: {
    fontSize: 12,
    fontWeight: '500',
    color: '#333333',
  },
});