import { ROUTES } from "@/constants/app.routes";
import { PRIMARY_COLOR, SECONDARY_COLOR } from "@/lib/constants";
import { AntDesign } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
const BookSection = ({ books }: any) => {
  const router = useRouter();

  const [activeFilter, setActiveFilter] = useState("All");
  const [visibleCards, setVisibleCards] = useState(4);

  // Filter options
  const filterOptions = ["All", "Speaking", "Listening", "Reading", "Writing"];

  // Filter function
  const filteredData =
    activeFilter === "All"
      ? books
      : books?.filter((item: any) => item?.category === activeFilter);

  const loadMoreCards = () => {
    // console.log("fikl", filteredData);
    if (visibleCards < filteredData.length) {
      setVisibleCards((prev) => Math.min(prev + 2, filteredData.length));
    }
  };

  const navigateToDetails = (book: any) => {
    router.push({
      pathname: ROUTES.BOOK_DETAILS as any,
      params: { id: book.id },
    });
  };

  // Render card item
  const renderCard = ({ item }: any) => (
    <TouchableOpacity
      onPress={() => navigateToDetails(item)}
      style={styles.card}
    >
      <View
        style={{
          padding: 10,
          backgroundColor: "white",
          borderRadius: 8,
          flex: 1, // Ensures proper flex behavior
        }}
      >

        <View style={styles.cardHeader}>
          <Image
            source={{
              uri:
                item?.image ??
                "https://images.unsplash.com/photo-1535905557558-afc4877a26fc?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fGJvb2t8ZW58MHx8MHx8fDA%3D",
            }}
            resizeMode="cover"
            style={styles.image}
          />
        </View>
      </View>
      <View style={styles.cardBody}>
        {/* Removed slice(0, 10) to show full title */}
        <Text
          style={styles.cardTitle}
          numberOfLines={2} // Allow up to 2 lines
          ellipsizeMode="tail" // Add ... at the end if text is too long
        >
          {item?.title}
        </Text>
        <Text
          style={styles.writer}
          numberOfLines={2} // Allow up to 2 lines
          ellipsizeMode="tail" // Add ... at the end if text is too long
        >
          By: {item?.writer ?? "N/A"}
        </Text>
        <Text style={styles.cardPrice}>BDT {item?.price}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Filter options */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterContainer}
      >
        {filterOptions?.map((option) => (
          <TouchableOpacity
            key={option}
            style={[
              styles.filterButton,
              activeFilter === option && styles.activeFilterButton,
            ]}
            onPress={() => {
              setActiveFilter(option);
              setVisibleCards(4); // Reset visible cards when filter changes
            }}
          >
            <Text
              style={[
                styles.filterText,
                activeFilter === option && styles.activeFilterText,
              ]}
            >
              {option}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Cards */}
      <FlatList
        horizontal
        data={filteredData ?? []}
        renderItem={renderCard}
        keyExtractor={(item) => item.id}
        showsHorizontalScrollIndicator={false}
        onEndReached={loadMoreCards}
        onEndReachedThreshold={0.5}
        contentContainerStyle={styles.cardsContainer}
        snapToInterval={200 + 32} // Card width (200) + marginHorizontal (16*2)
        snapToAlignment="center" // This makes cards snap to center
        decelerationRate="fast"
        disableIntervalMomentum={true} // Prevents half-scrolled states
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 4,
    marginVertical: 4,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#333",
  },
  filterContainer: {
    marginBottom: 16,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: "#f0f0f0",
  },
  activeFilterButton: {
    backgroundColor: PRIMARY_COLOR,
  },
  filterText: {
    color: "#666",
  },
  activeFilterText: {
    color: "white",
  },
  sub_container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },

  card: {
    width: 200, // Must match the width in snapToInterval calculation
    backgroundColor: "#f8f8f8",
    borderRadius: 12,
    marginVertical: 8,
    marginHorizontal: 16, // This creates 16px spacing on both sides (16*2 = 32)
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardsContainer: {
    paddingLeft: 8, // Add some left padding to the container
  },
  cardHeader: {
    height: 150, // Fixed height for consistency
    borderRadius: 8,
    overflow: "hidden",
    marginBottom: 8,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  cardBody: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    minHeight: 60, // Minimum height to accommodate 2 lines of title
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    lineHeight: 20, // Explicit line height for consistency
    marginBottom: 4,
    // Remove any width constraints to allow full text
  },
  cardPrice: {
    fontSize: 14,
    fontWeight: "500",
    color: PRIMARY_COLOR,
    marginTop: 4,
  },
  description: {
    fontSize: 12,
    color: "#666",
    paddingHorizontal: 12,
    paddingVertical: 6,
    lineHeight: 16,
    minHeight: 32, // Minimum height for 2 lines
  },
  writer: {
    fontSize: 12,
    color: "#666",
    // paddingHorizontal: 12,
    paddingVertical: 6,
    lineHeight: 16,
    minHeight: 32, // Minimum height for 2 lines
  },
  cardFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: PRIMARY_COLOR,
    padding: 12,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    marginTop: 8,
  },
  cardStats: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 4,
  },
});

export default BookSection;
