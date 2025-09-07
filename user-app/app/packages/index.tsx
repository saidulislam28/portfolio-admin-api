import CommonHeader from "@/components/CommonHeader";
import CustomPackageModal from "@/components/packages/CustomPackageModal";
import PackageCard from "@/components/packages/PackageCard";
import { ROUTES } from "@/constants/app.routes";
import {
  DARK_GRAY,
  FOREIGN_CURRENCY_MULTIPLIER,
  LIGHT_GRAY,
  PACKAGE_SERVICE_TYPE,
  PRIMARY_COLOR,
  WHITE,
} from "@/lib/constants";
import { mockUser } from "@/services/mockDataService";
import { API_USER, Get } from "@sm/common";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function PackagesScreen() {
  const router = useRouter();
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPackage, setSelectedPackage]: any = useState(null);
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [customPackageData, setCustomPackageData] = useState({
    mockTests: 1,
    partnerConversations: 0,
  });
  const { serviceType } = useLocalSearchParams();

  useEffect(() => {
    loadPackages();
  }, []);

  const loadPackages = async () => {
    try {
      const response: any = await Get(API_USER.get_packages);

      if (response.success) {
        setPackages(response?.data?.packages);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to load packages");
    } finally {
      setLoading(false);
    }
  };

  const filteredPackages = packages?.filter(
    (pkg: any) => pkg?.service_type === serviceType
  );

  const handlePackageSelect = (pkg: any) => {
    if (pkg.type === "custom") {
      setShowCustomModal(true);
      setSelectedPackage(pkg);
    } else {
      setSelectedPackage(pkg);
    }
  };

  const handleCustomPackageConfirm = (data: any) => {
    const customPrice = data.mockTests * 180 + data.partnerConversations * 150;
    const customPackage = {
      ...selectedPackage,
      price: customPrice,
      sessions_count: data.mockTests + data.partnerConversations,
      customData: data,
    };
    setSelectedPackage(customPackage);
    setCustomPackageData(data);
    setShowCustomModal(false);
  };

  const handleContinue = () => {
    if (!selectedPackage) {
      Alert.alert("Error", "Please select a package to continue");
      return;
    }

    if (
      serviceType === PACKAGE_SERVICE_TYPE.spoken ||
      serviceType === PACKAGE_SERVICE_TYPE.ielts_gt ||
      serviceType === PACKAGE_SERVICE_TYPE.ielts_academic
    ) {
      return router.push({
        pathname: ROUTES.BOOKING_PAYMENT,
        params: {
          packageId: selectedPackage.id,
          packageName: selectedPackage.name,
          packagePrice: selectedPackage.price_bdt,
          packageSessions: selectedPackage.sessions_count,
          packageType: "fixed",
          service_type: selectedPackage.service_type,
        },
      });
    }

    router.push({
      pathname: ROUTES.BOOKING_DATETIME,
      params: {
        packageId: selectedPackage.id,
        packageName: selectedPackage.name,
        packagePrice: selectedPackage.price_bdt,
        packageSessions: selectedPackage.sessions_count,
        packageType: "fixed",
        service_type: selectedPackage.service_type,
        customData: selectedPackage?.customData
          ? JSON.stringify(selectedPackage.customData)
          : null,
      },
    });
  };

  const getDisplayPrice = (price: number) => {
    if (mockUser.isForeigner) {
      return Math.round(price * FOREIGN_CURRENCY_MULTIPLIER);
    }
    return price;
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={PRIMARY_COLOR} />
        <Text style={styles.loadingText}>Loading packages...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <CommonHeader />
        <View style={styles.header}>
          <Text style={styles.title}>Select Your Package</Text>
          <Text style={styles.subtitle}>
            Choose the package that best fits your needs
          </Text>
        </View>

        <View style={styles.packagesContainer}>
          {filteredPackages?.map((pkg: any) => (
            <PackageCard
              key={pkg.id}
              package={pkg}
              isSelected={selectedPackage?.id === pkg.id}
              onSelect={() => handlePackageSelect(pkg)}
              displayPrice={getDisplayPrice(pkg.price_bdt_original)}
              discountPrice={getDisplayPrice(pkg.price_bdt)}
              currency={mockUser.currency}
              customData={
                pkg.id === selectedPackage?.id ? customPackageData : null
              }
            />
          ))}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.continueButton,
            { backgroundColor: selectedPackage ? PRIMARY_COLOR : DARK_GRAY },
          ]}
          onPress={handleContinue}
          disabled={!selectedPackage}
        >
          <Text style={styles.continueButtonText}>Continue</Text>
        </TouchableOpacity>
      </View>

      <CustomPackageModal
        visible={showCustomModal}
        onClose={() => setShowCustomModal(false)}
        onConfirm={handleCustomPackageConfirm}
        initialData={customPackageData}
      />
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
    backgroundColor: WHITE,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: DARK_GRAY,
  },
  scrollContainer: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingTop: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: PRIMARY_COLOR,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: DARK_GRAY,
    lineHeight: 22,
  },
  packagesContainer: {
    padding: 20,
    paddingTop: 10,
  },
  footer: {
    padding: 20,
    backgroundColor: WHITE,
    borderTopWidth: 1,
    borderTopColor: LIGHT_GRAY,
  },
  continueButton: {
    height: 50,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: WHITE,
  },
  backButton: {
    color: PRIMARY_COLOR,
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 20,
    marginTop: 45,
    // marginBottom: 10,
  },
});
