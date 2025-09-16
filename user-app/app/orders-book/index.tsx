import CommonHeader from "@/components/CommonHeader";
import { ROUTES } from "@/constants/app.routes";
import { PRIMARY_COLOR } from "@/lib/constants";
import { Book } from "@/lib/data";
import { API_USER, Get } from "@sm/common";
import { Stack, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";


export default function BookOrder() {
  const router = useRouter();

  const [orderedBook, setOrderedBook] = useState([]);

  useEffect(() => {
    const fetchBooks = async () => {
      const book = await Get(API_USER.book_order);
      // console.log("book", book)

      setOrderedBook(book?.data);
    };
    fetchBooks();
  }, []);

  // console.log("ordered books >>>", orderedBook)

  const navigateToDetails = (book: Book) => {
    router.push({
      pathname: ROUTES.ORDER_DETAILS,
      params: { id: book.id },
    });
  };

  const renderOrderItem = ({ item }: { item: any }) => {
    const orderDate = new Date(item?.date).toLocaleDateString();

    return (
      <TouchableOpacity
        style={styles.orderCard}
        onPress={() => navigateToDetails(item)}
      >
        <View style={styles.orderHeader}>
          <Text style={styles.orderId}>Order # {item?.id}</Text>
          <Text
            style={[
              styles.orderStatus,
              item?.status === "Approved"
                ? styles.statusApproved
                : item?.status === "Pending"
                  ? styles.statusPending
                  : styles.statusCanceled,
            ]}
          >
            {item?.status}
          </Text>
        </View>

        <Text style={styles.orderDate}>Placed on: {orderDate}</Text>

        <View style={styles.booksContainer}>
          {item?.books?.slice(0, 3).map((book: any, index: number) => (
            <Image
              key={index}
              source={{ uri: book.image }}
              style={styles.bookImage}
              resizeMode="contain"
            />
          ))}
          {item?.books?.length > 3 && (
            <View style={styles.moreBooks}>
              <Text style={styles.moreBooksText}>
                +{item?.books?.length - 3}
              </Text>
            </View>
          )}
        </View>

        <View style={styles.orderFooter}>
          <Text style={styles.totalText}>
            Total: BDT {item?.total?.toFixed(2)}
          </Text>
          <Text
            style={[
              styles.paymentStatus,
              item?.payment_status === "paid"
                ? styles.paymentPaid
                : styles.paymentUnpaid,
            ]}
          >
            {item?.payment_status}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: "Book Store" }} />
      <CommonHeader />
      <View style={styles.scrollContent}>
        <Text style={styles.pageTitle}>My Book Orders</Text>

        {orderedBook.length > 0 ? (
          <FlatList
            data={orderedBook}
            renderItem={renderOrderItem}
            keyExtractor={(item) => item?.id?.toString()}
            contentContainerStyle={styles.listContainer}
          />
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              You haven't placed any orders yet.
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 150,
    marginTop: 20,
  },
  stickyButtonContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 30, // Account for safe area
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
    elevation: 8, // Android shadow
    shadowColor: "#000", // iOS shadow
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  backButton: {
    color: PRIMARY_COLOR,
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 20,
    marginTop: 15,
    marginBottom: 8,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  listContainer: {
    paddingBottom: 20,
  },
  orderCard: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  orderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  orderId: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  orderStatus: {
    fontSize: 14,
    fontWeight: "600",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  statusApproved: {
    backgroundColor: "#e6f7ee",
    color: "#10b981",
  },
  statusPending: {
    backgroundColor: "#fff3e6",
    color: "#f59e0b",
  },
  statusCanceled: {
    backgroundColor: "#fee2e2",
    color: "#ef4444",
  },
  orderDate: {
    fontSize: 14,
    color: "#666",
    marginBottom: 12,
  },
  booksContainer: {
    flexDirection: "row",
    marginBottom: 12,
  },
  bookImage: {
    width: 50,
    height: 70,
    marginRight: 8,
    borderRadius: 4,
  },
  moreBooks: {
    width: 50,
    height: 70,
    backgroundColor: "#e2e8f0",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4,
  },
  moreBooksText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#64748b",
  },
  orderFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#eee",
    paddingTop: 12,
  },
  totalText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  paymentStatus: {
    fontSize: 14,
    fontWeight: "600",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  paymentPaid: {
    backgroundColor: "#e6f7ee",
    color: "#10b981",
  },
  paymentUnpaid: {
    backgroundColor: "#fee2e2",
    color: "#ef4444",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
  },
});
