import CommonHeader from "@/components/CommonHeader";
import { ROUTES } from "@/constants/app.routes";
import { PRIMARY_COLOR } from "@/lib/constants";
import { useRouter } from "expo-router";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useCart, useCartActions } from "@/hooks/useCart"; // Updated import
import { BaseButton } from "@/components/BaseButton";
import { showSuccessToast } from "@/utils/toast";

export default function CartScreen() {
  const router = useRouter();

  // Use the cart hooks
  const {
    itemsArray: cartItems,
    summary: cartSummary,
    loading: cartLoading,
  } = useCart();

  // Get the actions from useCartActions
  const { clearAllItems, removeItem, incrementItem, decrementItem } =
    useCartActions();

  const handleCheckout = () => {
    if (cartSummary.totalItems === 0) {
      Alert.alert("Empty Cart", "Please add items to cart before checkout.");
      return;
    }
    router.push(ROUTES.CHECKOUT as any);
  };

  // Clear entire cart
  const handleClearCart = async () => {
    Alert.alert("Clear Cart", "Are you sure you want to remove all items?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Clear",
        style: "destructive",
        onPress: async () => {
          await clearAllItems();
          showSuccessToast('Cart cleared!')
        },
      },
    ]);
  };

  // Remove single item
  const handleRemoveItem = (bookId: string, bookTitle: string) => {
    Alert.alert("Remove Item", `Remove "${bookTitle}" from cart?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Remove",
        style: "destructive",
        onPress: async () => {
          await removeItem(bookId);
          showSuccessToast('Item removed from cart')
        },
      },
    ]);
  };

  if (cartLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={PRIMARY_COLOR} />
      </View>
    );
  }

  // Empty cart view
  if (cartSummary.totalItems === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Shopping Cart</Text>
        </View>

        <View style={styles.emptyCart}>
          <Text style={styles.emptyCartText}>Your cart is empty</Text>
          <BaseButton
            title="Continue Shopping"
            onPress={() => router.push(ROUTES.BOOKS as any)}
            disabled={false}
            variant="outline"
          />
          <BaseButton
            title="Return Home"
            onPress={() => router.push(ROUTES.HOME as any)}
            disabled={false}
          />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CommonHeader />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Shopping Cart</Text>
        <TouchableOpacity onPress={handleClearCart}>
          <Text style={styles.clearButton}>Clear All</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.cartList}>
        {cartItems.map((cartItem) => {
          const { bookId, quantity, bookDetails } = cartItem;

          return (
            <View key={bookId} style={styles.cartItem}>
              <Image
                source={{ uri: bookDetails.image }}
                style={styles.bookImage}
                resizeMode="contain"
              />

              <View style={styles.bookInfo}>
                <Text style={styles.bookTitle} numberOfLines={2}>
                  {bookDetails.title}
                </Text>
                <Text style={styles.bookPrice}>BDT {bookDetails.price}</Text>
                <Text style={styles.bookWriter}>
                  By: {bookDetails.writer || "Unknown"}
                </Text>

                <View style={styles.quantityControls}>
                  <TouchableOpacity
                    style={styles.quantityButton}
                    onPress={() => decrementItem(bookId)}
                    disabled={quantity <= 1}
                  >
                    <Text
                      style={[
                        styles.quantityButtonText,
                        quantity <= 1 && styles.disabledButton,
                      ]}
                    >
                      -
                    </Text>
                  </TouchableOpacity>

                  <Text style={styles.quantityText}>{quantity}</Text>

                  <TouchableOpacity
                    style={styles.quantityButton}
                    onPress={() => incrementItem(bookId)}
                  >
                    <Text style={styles.quantityButtonText}>+</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.removeButton}
                    onPress={() => handleRemoveItem(bookId, bookDetails.title)}
                  >
                    <Text style={styles.removeButtonText}>Remove</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.itemTotal}>
                <Text style={styles.itemTotalText}>
                  BDT {(bookDetails.price * quantity).toFixed(2)}
                </Text>
              </View>
            </View>
          );
        })}
      </ScrollView>

      <View style={styles.cartSummary}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Total Items:</Text>
          <Text style={styles.summaryValue}>{cartSummary.totalItems}</Text>
        </View>

        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Subtotal:</Text>
          <Text style={styles.summaryValue}>
            BDT {cartSummary.subtotal.toFixed(2)}
          </Text>
        </View>

        <View style={[styles.summaryRow, styles.totalRow]}>
          <Text style={styles.totalLabel}>Total Amount:</Text>
          <Text style={styles.totalAmount}>
            BDT {cartSummary.subtotal.toFixed(2)}
          </Text>
        </View>

        <TouchableOpacity
          style={styles.checkoutButton}
          onPress={handleCheckout}
        >
          <Text style={styles.checkoutText}>Proceed to Checkout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    position: "relative",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  backButton: {
    color: PRIMARY_COLOR,
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 20,
    marginTop: 15,
    marginBottom: 10,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  clearButton: {
    color: "#ff4444",
    fontSize: 16,
    fontWeight: "600",
  },
  emptyCart: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  emptyCartText: {
    fontSize: 18,
    color: "#666",
    marginBottom: 30,
  },
  continueShopping: {
    backgroundColor: PRIMARY_COLOR,
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 6,
  },
  continueShoppingText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  cartList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  cartItem: {
    flexDirection: "row",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  bookImage: {
    width: 80,
    height: 100,
    borderRadius: 4,
    backgroundColor: "#f5f5f5",
  },
  bookInfo: {
    flex: 1,
    marginLeft: 15,
    justifyContent: "space-between",
  },
  bookTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 5,
  },
  bookPrice: {
    fontSize: 16,
    color: PRIMARY_COLOR,
    fontWeight: "bold",
    marginBottom: 4,
  },
  bookWriter: {
    fontSize: 14,
    color: "#666",
    marginBottom: 10,
    fontStyle: "italic",
  },
  quantityControls: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
  },
  quantityButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  quantityButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  disabledButton: {
    color: "#ccc",
  },
  quantityText: {
    fontSize: 16,
    fontWeight: "bold",
    marginHorizontal: 5,
    minWidth: 20,
    textAlign: "center",
  },
  removeButton: {
    marginLeft: 15,
    padding: 8,
    backgroundColor: "#ffebee",
    borderRadius: 6,
  },
  removeButtonText: {
    color: "#d32f2f",
    fontSize: 12,
    fontWeight: "600",
  },
  itemTotal: {
    justifyContent: "center",
    alignItems: "flex-end",
    minWidth: 80,
  },
  itemTotalText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  cartSummary: {
    borderTopWidth: 1,
    borderTopColor: "#eee",
    backgroundColor: "#f9f9f9",
    padding: 20,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: "#eee",
    paddingTop: 10,
    marginTop: 5,
  },
  summaryLabel: {
    fontSize: 16,
    color: "#666",
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  totalAmount: {
    fontSize: 20,
    fontWeight: "bold",
    color: PRIMARY_COLOR,
  },
  checkoutButton: {
    backgroundColor: PRIMARY_COLOR,
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 15,
  },
  checkoutText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
