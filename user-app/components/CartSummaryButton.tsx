import { PRIMARY_COLOR } from '@/lib/constants';
import { Link } from 'expo-router';
import { Pressable, StyleSheet, Text } from 'react-native';

interface CartSummaryButtonProps {
  itemCount: number;
  totalPrice: number;
}

export default function CartSummaryButton({ 
  itemCount, 
  totalPrice 
}: CartSummaryButtonProps) {


  console.log("cartItems", totalPrice);


  return (
    <Link href="/cart" asChild>
      <Pressable style={styles.container}>
        <Text style={styles.text}>
          {itemCount} {itemCount === 1 ? 'item' : 'items'} | ${totalPrice.toFixed(2)}
        </Text>
        <Text style={styles.text}>View Cart</Text>
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: PRIMARY_COLOR,
    padding: 16,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 4,
  },
  text: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});