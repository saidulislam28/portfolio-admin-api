import { BaseButton } from "@/components/BaseButton";
import CommonHeader from "@/components/CommonHeader";
import { InputField } from "@/components/InputField";
import { ROUTES } from "@/constants/app.routes";
import { useAuth } from "@/context/useAuth";
import { useAppSettings } from "@/hooks/queries/useAppSettings";
import { useCart, useCartActions, useCartSummary } from "@/hooks/useCart";
import { PRIMARY_COLOR } from "@/lib/constants";
import { validateEmail, validatePhone } from "@/utility/validator";
import { API_USER, PACKAGE_SERVICE_TYPE, Post, replacePlaceholders } from "@sm/common";
import { Stack, useRouter } from "expo-router";
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

export default function CheckoutScreen() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const {
    data: appSettingsData,
    error,
    isSuccess: isSettingsFetchSuccess,
  } = useAppSettings();
  const { items } = useCart();
  const { totalItems, subtotal, loading: cartLoading } = useCartSummary();
  const { clearAllItems } = useCartActions();

  const [formData, setFormData] = useState<any>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    zipCode: "",
    country: "",
    isCOD: false,
  });

  const charge = appSettingsData?.base_data?.delivery_charge ?? 0;
  const deliveryCharge = Number(charge);



  console.log("delivery charge", charge, deliveryCharge);

  const [processing, setProcessing] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handlePaymentMethodChange = (isCOD: boolean) => {
    setFormData((prev) => ({
      ...prev,
      isCOD: isCOD,
    }));
  };

  // Updated function to work with the new 'items' object structure
  const prepareItemsArray = () => {
    console.log("rep", items);
    return Object.entries(items).map(([bookId, item]) => {
      return {
        book_id: parseInt(bookId),
        qty: item.quantity,
        unit_price: item.bookDetails.price,
        subtotal: Number(item.quantity) * Number(item.bookDetails.price),
      };
    });
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    const requiredFields = [
      "firstName",
      "lastName",
      "email",
      "phone",
      "address",
    ];

    // Check required fields
    for (const field of requiredFields) {
      if (!formData[field]?.trim()) {
        newErrors[field] = `${field
          .replace(/([A-Z])/g, " $1")
          .replace(/^./, (str) => str.toUpperCase())} is required`;
      }
    }

    // Email validation
    const emailValidation = validateEmail(formData.email);
    if (!emailValidation.isValid) {
      newErrors.email = emailValidation.error!;
    }

    // Phone validation (basic)
    const phoneValidation = validatePhone(formData.phone);
    if (!phoneValidation.isValid) {
      newErrors.phone = phoneValidation.error!;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCheckout = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setProcessing(true);

      // Use the summary object for the subtotal
      const total = subtotal + deliveryCharge;
      const itemsToPurchase = prepareItemsArray();

      const orderData = {
        first_name: user?.full_name,
        email: formData.email ?? user?.email,
        phone: formData.phone ?? user?.phone,
        address: formData.address,
        service_type: PACKAGE_SERVICE_TYPE.book_purchase,
        subtotal: subtotal,
        delivery_charge: deliveryCharge,
        total: total,
        items: itemsToPurchase,
        cod: formData.isCOD,
      };


      const response = await Post(API_USER.create_order, orderData);
      const responseData = response?.data?.data;

      if (response?.data?.success) {
        clearAllItems();
        // REMAIN ROUTES
        if (formData.isCOD) {
          return router.push(
            {
              pathname: ROUTES.PAYMENT_SUCCESS as any,
              params: {
                service_type: PACKAGE_SERVICE_TYPE.book_purchase,
                order_id: responseData?.order_id
              }
            }
          );
        }
        router.push(
          {
            pathname: ROUTES.SSL_PAYMENT as any,
            params: {
              payment_url: responseData?.payment_url,
              service_type: PACKAGE_SERVICE_TYPE.book_purchase,
              amount: responseData?.total_amount,
              order_id: responseData.order_id
            }

          }
        );
      } else {
        throw new Error("Failed to place order");
      }
    } catch (error: any) {
      console.log("Full error:", error);
      console.log("Error response:", error.response?.data);
      console.log("Error status:", error.response?.status);
      console.log("Error headers:", error.response?.headers);

      Alert.alert(
        "Order Failed",
        "There was an error placing your order. Please try again."
      );
    } finally {
      setProcessing(false);
    }
  };

  useEffect(() => {
    if (user && formData.firstName === "") {
      setFormData((prev: any) => ({
        ...prev,
        firstName: user?.full_name || "",
        email: user?.email || "",
        phone: user?.phone || "",
      }));
    }
  }, [user]);

  if (isLoading || user === null || cartLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={PRIMARY_COLOR} />
        <Text style={styles.loadingText}>Loading checkout...</Text>
      </View>
    );
  }
  // Use the summary object for the subtotal
  const total = subtotal + Number(deliveryCharge);

  return (
    <View style={styles.container}>
      <CommonHeader />

      <ScrollView style={styles.scrollContent}>
        <Stack.Screen options={{ title: "Checkout" }} />

        {/* Order Summary */}
        <View style={styles.orderSummary}>
          <Text style={styles.sectionTitle}>Order Summary</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal:</Text>
            {/* Use the summary object for the subtotal */}
            <Text style={styles.summaryValue}>BDT {subtotal}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Delivery:</Text>
            <Text style={styles.summaryValue}>
              {deliveryCharge === 0 ? "FREE" : `BDT ${deliveryCharge}`}
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.totalLabel}>Total:</Text>
            <Text style={styles.totalValue}>BDT {total}</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Shipping Information</Text>

        <InputField
          label="First Name"
          fieldKey="firstName"
          value={formData.firstName}
          onChangeText={(text) => handleChange("firstName", text)}
          error={errors.firstName}
          placeholder="Enter first name"
          focusedField={focusedField}
          onFocus={() => setFocusedField("firstName")}
          onBlur={() => setFocusedField(null)}
        />

        <InputField
          label="Last Name"
          fieldKey="lastName"
          value={formData.lastName}
          onChangeText={(text) => handleChange("lastName", text)}
          error={errors.lastName}
          placeholder="Enter last name"
          focusedField={focusedField}
          onFocus={() => setFocusedField("lastName")}
          onBlur={() => setFocusedField(null)}
        />

        <InputField
          label="Email"
          fieldKey="email"
          value={formData.email}
          onChangeText={(text) => handleChange("email", text)}
          error={errors.email}
          keyboardType="email-address"
          placeholder="Enter email address"
          focusedField={focusedField}
          onFocus={() => setFocusedField("email")}
          onBlur={() => setFocusedField(null)}
        />

        <InputField
          label="Phone"
          fieldKey="phone"
          value={formData.phone}
          onChangeText={(text) => handleChange("phone", text)}
          error={errors.phone}
          keyboardType="phone-pad"
          placeholder="Enter phone number"
          focusedField={focusedField}
          onFocus={() => setFocusedField("phone")}
          onBlur={() => setFocusedField(null)}
        />

        <InputField
          label="Address"
          fieldKey="address"
          value={formData.address}
          onChangeText={(text) => handleChange("address", text)}
          error={errors.address}
          placeholder="Enter full address"
          focusedField={focusedField}
          onFocus={() => setFocusedField("address")}
          onBlur={() => setFocusedField(null)}
          multiline={true}
          numberOfLines={3}
        />

        {/* Payment Method Section */}
        <Text style={styles.sectionTitle}>Payment Method</Text>

        <TouchableOpacity
          style={styles.radioOption}
          onPress={() => handlePaymentMethodChange(false)}
        >
          <View style={styles.radioCircle}>
            {!formData.isCOD && <View style={styles.selectedRb} />}
          </View>
          <Text style={styles.radioText}>Online Payment</Text>
        </TouchableOpacity>

        {/* COD Option */}
        <TouchableOpacity
          style={styles.radioOption}
          onPress={() => handlePaymentMethodChange(true)}
        >
          <View style={styles.radioCircle}>
            {formData.isCOD && <View style={styles.selectedRb} />}
          </View>
          <Text style={styles.radioText}>Cash on delivery</Text>
        </TouchableOpacity>
      </ScrollView>

      <View style={styles.stickyButtonContainer}>
        <BaseButton
          title="Procced"
          onPress={handleCheckout}
          isLoading={processing}
        />
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
  },
  stickyButtonContainer: {
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingTop: 5,
    paddingBottom: 30,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
    elevation: 8,
    shadowColor: "#000", 
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
    marginLeft: 10,
    marginTop: 25,
    marginBottom: 5,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#666",
  },
  orderSummary: {
    backgroundColor: "#f9f9f9",
    padding: 10,
    borderRadius: 8,
    marginBottom: 20,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
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
  totalValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: PRIMARY_COLOR,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 16,
    marginBottom: 8,
    color: PRIMARY_COLOR,
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    marginBottom: 8,
    fontWeight: "600",
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    backgroundColor: "#fff",
    fontSize: 16,
  },
  payButton: {
    backgroundColor: PRIMARY_COLOR,
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 24,
  },
  disabledButton: {
    backgroundColor: "#ccc",
  },
  payButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  radioContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  radioOption: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    paddingVertical: 8,
  },
  radioCircle: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: PRIMARY_COLOR,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  selectedRb: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: PRIMARY_COLOR,
  },
  radioText: {
    fontSize: 16,
    color: "#333",
  },
});
