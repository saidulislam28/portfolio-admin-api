import { BaseButton } from "@/components/BaseButton";
import CommonHeader from "@/components/CommonHeader";
import { ROUTES } from "@/constants/app.routes";
import { PRIMARY_COLOR } from "@/lib/constants";
import { API_USER, GetOne } from "@sm/common";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import RenderHTML from "react-native-render-html";

const { width: screenWidth } = Dimensions.get("window");

const PackageDetails = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { width } = useWindowDimensions();
  const [packages, setPackages] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadPackages();
  }, []);

  const loadPackages = async () => {
    setLoading(true);
    try {
      const response = await GetOne(API_USER.get_packages, Number(id));
      // console.log("single packages after change>>", response);
      if (response?.success) {
        setPackages(response?.data || {});
      }
    } catch (error) {
      Alert.alert("Error", "Failed to load package details");
    } finally {
      setLoading(false);
    }
  };

  const formatServiceType = (serviceType: any) => {
    if (!serviceType) return "N/A";
    return serviceType.replace(/_/g, " ").toUpperCase();
  };


  const renderPriceSection = () => {
    const { price_bdt, price_bdt_original } = packages || {};

    return (
      <View style={styles.priceSection}>
        <Text style={styles.priceSectionTitle}>Pricing</Text>

        {/* BDT Pricing */}
        <View style={styles.priceRow}>
          <View style={styles.currencySection}>
            <Text style={styles.currencyLabel}>BDT</Text>
            <View style={styles.priceContainer}>
              <Text style={styles.currentPrice}>৳{price_bdt || "N/A"}</Text>
              {price_bdt_original && price_bdt_original > price_bdt && (
                <Text style={styles.originalPrice}>৳{price_bdt_original}</Text>
              )}
            </View>
            {price_bdt_original && price_bdt_original > price_bdt && (
              <View style={styles.discountBadge}>
                <Text style={styles.discountText}>
                  {Math.round(
                    ((price_bdt_original - price_bdt) / price_bdt_original) *
                    100
                  )}
                  % OFF
                </Text>
              </View>
            )}
          </View>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={PRIMARY_COLOR} />
        <Text style={styles.loadingText}>Loading package details...</Text>
      </View>
    );
  }

  if (!packages) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Package not found</Text>
        <Pressable style={styles.retryButton} onPress={loadPackages}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </Pressable>
      </View>
    );
  }

  const handleBuyCourses = () => {
    router.push({
      pathname: ROUTES.ONLINE_REGISTRATION_FORM,
      params: {
        packageId: id.toString(),
      },
    });
  };

  return (
    <View style={styles.container}>
      <CommonHeader />

      <ScrollView
        style={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Package Image */}
        <View style={styles.imageContainer}>
          <Image
            source={{
              uri:
                packages.image ||
                "https://images.unsplash.com/photo-1699544129030-6f421d4dfa7c?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            }}
            style={styles.packageImage}
            resizeMode="cover"
          />
          {!packages?.is_active && (
            <View style={styles.inactiveOverlay}>
              <Text style={styles.inactiveText}>INACTIVE</Text>
            </View>
          )}
        </View>

        <View style={styles.contentContainer}>
          {/* Package Name */}
          <Text style={styles.packageName}>{packages?.name || "N/A"}</Text>

          {/* Service Type Badge */}
          <View style={styles.serviceTypeBadge}>
            <Text style={styles.serviceTypeText}>
              {formatServiceType(packages?.service_type)}
            </Text>
          </View>

          {/* Package Description */}
          <View style={styles.descriptionSection}>
            <Text style={styles.sectionTitle}>Description</Text>
            <View style={styles.descriptionSection}>
              <RenderHTML
                contentWidth={width}
                source={{ html: packages?.description as string }}
              />
            </View>
          </View>

          {/* Package Details */}
          <View style={styles.detailsSection}>
            <Text style={styles.sectionTitle}>Package Details</Text>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Total Classes:</Text>
              <Text style={styles.detailValue}>
                {packages?.class_count || "N/A"}
              </Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Class Duration:</Text>
              <Text style={styles.detailValue}>
                {packages?.class_duration
                  ? `${packages.class_duration} minutes`
                  : "N/A"}
              </Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Sessions Count:</Text>
              <Text style={styles.detailValue}>
                {packages?.sessions_count || "N/A"}
              </Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Status:</Text>
              <View
                style={[
                  styles.statusBadge,
                  {
                    backgroundColor: packages?.is_active
                      ? "#e8f5e8"
                      : "#ffebee",
                  },
                ]}
              >
                <Text
                  style={[
                    styles.statusText,
                    { color: packages?.is_active ? "#2e7d32" : "#c62828" },
                  ]}
                >
                  {packages?.is_active ? "Active" : "Inactive"}
                </Text>
              </View>
            </View>
          </View>

          {/* Pricing Section */}
          {renderPriceSection()}

          {/* Action Button */}
        </View>
      </ScrollView>
      <View style={styles.stickyButtonContainer}>
        <BaseButton title="Enroll Now" onPress={handleBuyCourses} disabled={!packages?.is_active} />
      </View>
    </View>
  );
};

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
  header: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  backButtonContainer: {
    alignSelf: "flex-start",
  },
  backButton: {
    color: PRIMARY_COLOR,
    fontSize: 18,
    fontWeight: "600",
  },
  imageContainer: {
    position: "relative",
    height: 250,
    // paddingHorizontal: 20,
  },
  packageImage: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
  },
  inactiveOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  inactiveText: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
    letterSpacing: 2,
  },
  contentContainer: {
    paddingBottom: 100,
    padding: 10,
  },
  packageName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  serviceTypeBadge: {
    alignSelf: "flex-start",
    backgroundColor: PRIMARY_COLOR,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 10,
  },
  serviceTypeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  descriptionSection: {
    // marginBottom: 25,
    backgroundColor: "#f5f5f5",
    marginVertical: 10,
    borderRadius: 10,
    padding: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: "#666",
  },
  detailsSection: {
    marginBottom: 25,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  detailLabel: {
    fontSize: 16,
    color: "#666",
    flex: 1,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
    textAlign: "right",
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
  },
  priceSection: {
    marginBottom: 30,
    padding: 20,
    backgroundColor: "#f8f9ff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e3e6ff",
  },
  priceSectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 15,
    textAlign: "center",
  },
  priceRow: {
    marginBottom: 15,
  },
  currencySection: {
    alignItems: "center",
  },
  currencyLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 5,
    fontWeight: "500",
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  currentPrice: {
    fontSize: 28,
    fontWeight: "bold",
    color: PRIMARY_COLOR,
    marginRight: 10,
  },
  originalPrice: {
    fontSize: 18,
    color: "#999",
    textDecorationLine: "line-through",
  },
  discountBadge: {
    backgroundColor: "#ff4444",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  discountText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  actionSection: {
    marginTop: 20,
    marginBottom: 40,
  },
  enrollButton: {
    backgroundColor: PRIMARY_COLOR,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  enrollButtonDisabled: {
    backgroundColor: "#ccc",
    elevation: 0,
    shadowOpacity: 0,
  },
  enrollButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  enrollButtonTextDisabled: {
    color: "#999",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#666",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: "#666",
    marginBottom: 20,
    textAlign: "center",
  },
  retryButton: {
    backgroundColor: PRIMARY_COLOR,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default PackageDetails;
