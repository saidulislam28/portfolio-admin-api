import BookCard from "@/components/BookCard";
import { BookCardSkeleton } from "@/components/books/BookCardSkeleton";
import CommonHeader from "@/components/CommonHeader";
import SearchBar from "@/components/SearchBar";
import { ROUTES } from "@/constants/app.routes";
import { useBooksAll } from "@/hooks/queries/useBooks";
import { PRIMARY_COLOR } from "@/lib/constants";
import { Stack, useRouter } from "expo-router";
import { useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";

interface Book {
  id: string;
  title: string;
  author: string;
  price: number;
  coverImage?: string;
  description?: string;
}


export default function BookListScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [cartItems, setCartItems] = useState<Record<string, number>>({});
  const router = useRouter();

  const {
    data: books,
    isLoading: isBooksLoading,
    error: errorBooks,
    isSuccess: isBookFetchSuccess,
  } = useBooksAll();

  if (isBooksLoading) {
    return (
      <View style={styles.container}>
        <Stack.Screen options={{ title: "Book Store" }} />
        <CommonHeader />
        <SearchBar value={searchQuery} onChangeText={setSearchQuery} />
        {[1,2,3,4].map( i => <BookCardSkeleton />)}
      </View>
    );
  }


  const filteredBooks =
    books?.books.filter((book) =>
      book?.title?.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

  const navigateToDetails = (book: Book) => {
    router.push({
      pathname: ROUTES.BOOK_DETAILS,
      params: { id: book.id },
    });
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: "Book Store" }} />
      <CommonHeader />
      <SearchBar value={searchQuery} onChangeText={setSearchQuery} />
      <FlatList
        data={filteredBooks}
        renderItem={({ item }) => (
          <BookCard book={item} onPress={() => navigateToDetails(item)}/>
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No books found</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  listContent: {
    padding: 8,
    alignItems: 'center'
  },
  gridItem: {
    flex: 1,
    maxWidth: "50%",
    padding: 8,
  },
  backButton: {
    color: PRIMARY_COLOR,
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 20,
    marginTop: 15,
    marginBottom: 8,
  },
  // Skeleton styles
  skeletonContainer: {
    backgroundColor: "#f8f9fc",
    borderColor: "#e0e0e0",
  },
  skeletonImage: {
    width: 140,
    height: 120,
    backgroundColor: "#e0e0e0",
    borderRadius: 8,
    marginBottom: 10,
  },
  skeletonContent: {
    flex: 1,
    padding: 10,
  },
  skeletonLine: {
    height: 12,
    backgroundColor: "#e0e0e0",
    borderRadius: 4,
    marginBottom: 8,
  },
  skeletonBottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: "auto",
  },
  cardContainer: {
    backgroundColor: "#F8F9FC",
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
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
});
