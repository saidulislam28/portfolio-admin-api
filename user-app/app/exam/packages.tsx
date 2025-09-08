import { BaseButton } from "@/components/BaseButton";
import CommonHeader from "@/components/CommonHeader";
import { ROUTES } from "@/constants/app.routes";
import { PACKAGE_SERVICE_TYPE, PRIMARY_COLOR } from "@/lib/constants";
import { API_USER, Get } from "@sm/common";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function PackagesScreen() {
  const [selectedPackage, setSelectedPackage] = useState<number | null>(null);
  const [selectedCenter, setSelectedCenter] = useState<number | any>(null);
  const router = useRouter();
  const [packages, setPackages] = useState([]);
  const [center, setCenter] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadPackages();
  }, []);

  const loadPackages = async () => {
    setLoading(true);
    try {
      const response: any = await Get(API_USER.get_packages);
      // console.log("response packages exam page", response?.data)
      if (response.success) {
        setPackages(response?.data?.packages);
        setCenter(response?.data?.center);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to load packages");
    } finally {
      setLoading(false);
    }
  };

  const filteredPackages = packages?.filter(
    (pkg: any) => pkg?.service_type === PACKAGE_SERVICE_TYPE.exam_registration
  );

  const handleContinue = () => {
    // return console.log(selectedPackage, selectedCenter)

    if (selectedPackage && selectedCenter) {
      router.push({
        pathname: ROUTES.EXAM_REGISTRATION_FORM as any,
        params: {
          packageId: selectedPackage?.toString(),
          center: selectedCenter?.toString(),
        },
      });
    }
  };

  return (
    <View style={styles.container}>
      <CommonHeader />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.header}>Select Test Type</Text>

        {filteredPackages?.map((pkg: any) => (
          <TouchableOpacity
            key={pkg.id}
            style={[
              styles.packageItem,
              selectedPackage === pkg?.id && styles.selectedItem,
            ]}
            onPress={() => setSelectedPackage(pkg?.id)}
          >
            <Text style={styles.packageName}>{pkg?.name}</Text>
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
            >
              <Text style={styles.discountedPrice}>BDT {pkg?.price_bdt}</Text>
              <Text style={styles.originalPrice}>
                BDT {pkg?.price_bdt_original}
              </Text>
            </View>
          </TouchableOpacity>
        ))}

        {selectedPackage && (
          <>
            <Text style={[styles.header, { marginTop: 30 }]}>
              Choose Test Center Location
            </Text>

            {center?.map((center: any) => (
              <TouchableOpacity
                key={center?.id}
                style={[
                  styles.centerItem,
                  selectedCenter === center?.id && styles.selectedItem,
                ]}
                onPress={() => setSelectedCenter(center?.id)}
              >
                <Text>{center?.name}</Text>
              </TouchableOpacity>
            ))}
          </>
        )}
      </ScrollView>
      <View style={styles.stickyButtonContainer}>
          <BaseButton title="Continue to Registration" onPress={handleContinue} disabled={!selectedPackage || !selectedCenter} />
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
  backButton: {
    color: PRIMARY_COLOR,
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 10,
    marginTop: 25,
    marginBottom: 5,
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
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#333",
  },
  packageItem: {
    padding: 15,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  centerItem: {
    padding: 15,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    marginBottom: 10,
  },
  selectedItem: {
    borderColor: "#1a73e8",
    backgroundColor: "#e8f0fe",
  },
  packageName: {
    flex: 1,
    marginRight: 10,
  },
  packagePrice: {
    fontWeight: "bold",
    color: "#1a73e8",
  },
  continueButton: {
    backgroundColor: PRIMARY_COLOR,
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 30,
  },
  disabledButton: {
    backgroundColor: "#cccccc",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
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
});
