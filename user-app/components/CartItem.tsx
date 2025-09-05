import { PRIMARY_COLOR } from '@/lib/constants';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

interface CartItemProps {
  book: {
    id: string;
    title: string;
    cover: string;
    price: number;
  };
  quantity: number;
  onQuantityChange: (bookId: string, newQuantity: number) => void;
}

export default function CartItem({ book, quantity, onQuantityChange }: CartItemProps) {
  return (
    <View style={styles.container}>
      <Image source={{ uri: book.cover }} style={styles.cover} />
      <View style={styles.details}>
        <Text style={styles.title}>{book.title}</Text>
        <Text style={styles.price}>${book.price.toFixed(2)}</Text>
        
        <View style={styles.quantityControls}>
          <Pressable 
            onPress={() => onQuantityChange(book.id, quantity - 1)}
            style={styles.quantityButton}
          >
            <Text style={styles.quantityButtonText}>-</Text>
          </Pressable>
          
          <Text style={styles.quantity}>{quantity}</Text>
          
          <Pressable 
            onPress={() => onQuantityChange(book.id, quantity + 1)}
            style={styles.quantityButton}
          >
            <Text style={styles.quantityButtonText}>+</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 12,
    marginBottom: 12,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  cover: {
    width: 80,
    height: 120,
    borderRadius: 4,
  },
  details: {
    flex: 1,
    marginLeft: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  price: {
    fontSize: 16,
    color: PRIMARY_COLOR,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    backgroundColor: PRIMARY_COLOR,
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  quantity: {
    marginHorizontal: 12,
    fontSize: 16,
  },
});