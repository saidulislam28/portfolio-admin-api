import { BaseButton } from "@/components/BaseButton";
import CommonHeader from "@/components/CommonHeader";
import { ROUTES } from "@/constants/app.routes";
import { PRIMARY_COLOR } from "@/lib/constants";
import { API_USER, Get, PACKAGE_SERVICE_TYPE } from "@sm/common";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type PackageType = "ielts_gt" | "ielts_academic" | "spoken";
type Package = {
  id: number;
  name: string;
  price_bdt_original: number;
  price_bdt: number;
  service_type: string;
};

const PACKAGE_TYPES = {
  ielts_gt: "IELTS General Training",
  ielts_academic: "IELTS Academic",
  spoken: "Spoken",
} as const;

export default function PackagesScreen() {
  const [selectedPackageType, setSelectedPackageType] =
    useState<PackageType | null>("ielts_gt");
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const router = useRouter();
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadPackages();
  }, []);

  const loadPackages = async () => {
    setLoading(true);
    try {
      const response: any = await Get(API_USER.get_packages);
      if (response.success) {
        setPackages(response?.data?.packages || []);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to load packages");
    } finally {
      setLoading(false);
    }
  };

  const filteredPackages = packages?.filter((pkg) => {
    if (!selectedPackageType) return false;
    return pkg.service_type === PACKAGE_SERVICE_TYPE[selectedPackageType];
  });

  const handleContinue = () => {
    if (selectedPackage) {
      router.push({
        pathname: ROUTES.ONLINE_REGISTRATION_FORM,
        params: {
          packageId: selectedPackage.id.toString(),
        },
      });
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={PRIMARY_COLOR} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CommonHeader />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.header}>Select Online Course Type</Text>

        {/* Package Type Selection */}
        <View style={styles.packageTypeContainer}>
          {Object.entries(PACKAGE_TYPES).map(([key, value]) => (
            <TouchableOpacity
              key={key}
              style={[
                styles.packageTypeItem,
                selectedPackageType === key && styles.selectedPackageType,
              ]}
              onPress={() => setSelectedPackageType(key as PackageType)}
            >
              <Text style={styles.packageTypeText}>{value}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Package List */}
        {selectedPackageType && (
          <View style={styles.packageListContainer}>
            <Text style={styles.subHeader}>Available Packages</Text>
            {filteredPackages?.length === 0 ? (
              <Text style={styles.noPackagesText}>
                No packages available for this type
              </Text>
            ) : (
              filteredPackages?.map((pkg) => (
                <TouchableOpacity
                  key={pkg.id}
                  style={[
                    styles.packageItem,
                    selectedPackage?.id === pkg.id && styles.selectedItem,
                  ]}
                  onPress={() => setSelectedPackage(pkg)}
                >
                  <Text style={styles.packageName}>{pkg?.name}</Text>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 8,
                    }}
                  >
                    <Text style={styles.discountedPrice}>
                      BDT {pkg?.price_bdt}
                    </Text>
                    <Text style={styles.originalPrice}>
                      BDT {pkg?.price_bdt_original}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))
            )}
          </View>
        )}

        {/* Continue Button */}
      </ScrollView>
      <View style={styles.stickyButtonContainer}>
        <BaseButton title="Continue" onPress={handleContinue} disabled={!selectedPackage} />
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    fontSize: 22,
    fontWeight: "600",
    marginBottom: 20,
    color: "#333",
    textAlign: "center",
  },
  subHeader: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 15,
    color: "#444",
  },
  packageTypeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    flexWrap: "wrap",
    gap: 10,
  },
  packageTypeItem: {
    flex: 1,
    minWidth: "30%",
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    alignItems: "center",
    backgroundColor: "#f9f9f9",
    textAlign: "center",
  },
  selectedPackageType: {
    borderColor: PRIMARY_COLOR,
    backgroundColor: "#e8f0fe",
  },
  packageTypeText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
    textAlign: "center",
  },
  packageListContainer: {
    marginBottom: 20,
  },
  packageItem: {
    padding: 15,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#fff",
  },
  selectedItem: {
    borderColor: PRIMARY_COLOR,
    backgroundColor: "#e8f0fe",
  },
  packageName: {
    fontSize: 16,
    color: "#333",
    flex: 1,
    marginRight: 10,
  },
  discountedPrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: PRIMARY_COLOR,
  },
  originalPrice: {
    fontSize: 14,
    color: "#888",
    textDecorationLine: "line-through",
  },
  noPackagesText: {
    textAlign: "center",
    color: "#666",
    marginVertical: 20,
  },
  continueButton: {
    backgroundColor: PRIMARY_COLOR,
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  disabledButton: {
    backgroundColor: "#cccccc",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  backButton: {
    color: PRIMARY_COLOR,
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 10,
    marginTop: 25,
    marginBottom: 5,
  },
});
