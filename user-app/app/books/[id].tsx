import { BaseButton } from "@/components/BaseButton";
import CommonHeader from "@/components/CommonHeader";
import { ROUTES } from "@/constants/app.routes";
import { useCart } from "@/hooks/useCart";
import { PRIMARY_COLOR } from "@/lib/constants";
import { API_USER, GetOne } from "@sm/common";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import RenderHTML from "react-native-render-html";

export default function BookDetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { width } = useWindowDimensions();

  const {
    items: cartItems,
    summary: cartSummary,
    loading: cartLoading,
    addItemToCart,
  } = useCart();

  const [bookDetails, setBookDetails] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        setLoading(true);
        const book = await GetOne(API_USER.get_books, Number(id));
        console.log("book from fetching>>", book)
        if (book?.success) {
          setBookDetails(book?.data ?? {});
        }
      } catch (error) {
        console.log("Error fetching book details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBook();
  }, [id]);

  const handleAddToCart = async () => {
    if (!bookDetails?.id) return;
    console.log('add', bookDetails)

    // Use the cart hook to add item to cart
    addItemToCart(
      bookDetails.id.toString(),
      {
        id: bookDetails.id,
        title: bookDetails.title,
        price: bookDetails.price,
        image: bookDetails.image,
        writer: bookDetails.writer,
        description: bookDetails.description,
        // Add any other relevant book details
      },
      1 // Default quantity
    );
  };

  // Show loading spinner
  if (loading || cartLoading || !bookDetails) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={PRIMARY_COLOR} />
      </View>
    );
  }

  // Check if book is already in cart
  const isBookInCart = cartItems[bookDetails.id.toString()] !== undefined;
  const cartItemQuantity = isBookInCart ? cartItems[bookDetails.id.toString()].quantity : 0;

  return (
    <View style={styles.container}>
      <CommonHeader />
      <ScrollView style={styles.scrollContent}>
        {/* Book Details */}
        <View style={styles.content}>
          <Image
            source={{ uri: bookDetails?.image }}
            style={styles.bookImage}
            resizeMode="contain"
          />

          <Text style={styles.bookTitle}>{bookDetails?.title}</Text>
          <Text style={styles.bookPrice}>BDT {bookDetails?.price}</Text>
          <Text style={styles.writer}>By: {bookDetails?.writer ?? "N/A"}</Text>

          <View style={styles.descriptionContainer}>
            <RenderHTML
              contentWidth={width}
              source={{ html: bookDetails?.description as string }}
            />
          </View>

          <View style={{paddingBottom: 150}}>
            <BaseButton title="Add to Cart" onPress={handleAddToCart} isLoading={cartLoading} variant="outline" />
          </View>
        </View>
        {/* Cart Summary - Show only if items in cart */}

      </ScrollView>
      {cartSummary.totalItems > 0 && (
        <View style={styles.cartSummary}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryText}>
              {cartSummary.totalItems} {cartSummary.totalItems === 1 ? "item" : "items"}
            </Text>
            <Text style={styles.summaryPrice}>
              BDT {cartSummary.subtotal.toFixed(2)}
            </Text>
          </View>

          <TouchableOpacity
            style={styles.viewCartButton}
            onPress={() => router.push(ROUTES.CART as any)}
          >
            <Text style={styles.viewCartText}>View Cart</Text>
          </TouchableOpacity>
        </View>
      )}
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
  scrollContent: {
    paddingBottom: 150,
  },
  backButton: {
    color: PRIMARY_COLOR,
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 20,
    marginTop: 15,
    marginBottom: 10,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  bookImage: {
    width: "100%",
    height: 250,
    marginBottom: 20,
    borderRadius: 8,
    backgroundColor: "#f5f5f5",
  },
  bookTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  bookPrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: PRIMARY_COLOR,
    marginBottom: 15,
  },
  bookDescription: {
    fontSize: 16,
    color: "#666",
    lineHeight: 24,
    marginBottom: 30,
  },
  writer: {
    fontSize: 14,
    color: "#666",
  },
  inCartContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#e8f5e8",
    padding: 15,
    borderRadius: 8,
  },
  inCartText: {
    color: "#2e7d32",
    fontSize: 16,
    fontWeight: "500",
  },
  addToCartButton: {
    backgroundColor: PRIMARY_COLOR,
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
    alignItems: "center",
  },
  addToCartText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  cartSummary: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    backgroundColor: "#f9f9f9",
    padding: 20,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  summaryText: {
    fontSize: 16,
    color: "#333",
  },
  summaryPrice: {
    fontSize: 18,
    fontWeight: "bold",
    color: PRIMARY_COLOR,
  },
  viewCartButton: {
    backgroundColor: PRIMARY_COLOR,
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: "center",
  },
  viewCartButtonSmall: {
    backgroundColor: PRIMARY_COLOR,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  viewCartText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  descriptionContainer: {
    backgroundColor: "#f5f5f5",
    padding: 10,
    marginVertical: 20,
    borderRadius: 10,
  },
});