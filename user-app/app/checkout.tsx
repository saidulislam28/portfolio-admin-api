import CommonHeader from '@/components/CommonHeader';
import { PACKAGE_SERVICE_TYPE, PRIMARY_COLOR } from '@/lib/constants';
import { useAuth } from '@/context/useAuth';
import { API_USER, Post } from '@sm/common';
import { Stack, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useCart, useCartActions, useCartSummary } from '@/hooks/useCart';

export default function CheckoutScreen() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  // Updated hook destructuring to use the new items and summary properties
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

  const [processing, setProcessing] = useState(false);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handlePaymentMethodChange = (isCOD: boolean) => {
    setFormData((prev) => ({
      ...prev,
      isCOD: isCOD,
    }));
  };

  // Updated function to work with the new 'items' object structure
  const prepareItemsArray = () => {
    console.log('rep', items)
    return Object.entries(items).map(([bookId, item]) => {
      return {
        book_id: parseInt(bookId),
        qty: item.quantity,
        unit_price: item.bookDetails.price,
        subtotal: Number(item.quantity) * Number(item.bookDetails.price)
      };
    });
  };

  const validateForm = () => {
    const requiredFields = [
      'firstName', 'lastName', 'email', 'phone',
      'address'
    ];

    for (const field of requiredFields) {
      if (!formData[field]?.trim()) {
        Alert.alert('Validation Error', `${field.replace('_', ' ')} is required`);
        return false;
      }
    }
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      Alert.alert('Validation Error', 'Please enter a valid email address');
      return false;
    }

    // Phone validation (basic)
    const phoneRegex = /^01[3-9]\d{8}$/;
    if (!phoneRegex.test(formData.phone)) {
      Alert.alert('Validation Error', 'Please enter a valid Bangladeshi phone number');
      return false;
    }

    return true;
  };


  const handleCheckout = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setProcessing(true);

      const deliveryCharge = 50;
      // Use the summary object for the subtotal
      const total = subtotal + deliveryCharge;
      const itemsToPurchase = prepareItemsArray();

      const orderData = {
        first_name: formData.firstName ?? user?.full_name,
        last_name: formData.lastName,
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
        // Use the new clearAllItems action
        clearAllItems()
        // REMAIN ROUTES
        if (formData.isCOD) {
          return router.push(
            `/payment-success?service_type=${PACKAGE_SERVICE_TYPE.book_purchase}`
          );
        }
        router.push(
          `/sslpay-screen?payment_url=${responseData?.payment_url}&service_type=${PACKAGE_SERVICE_TYPE.book_purchase}&amount=${responseData?.total_amount}`
        );
      } else {
        throw new Error("Failed to place order");
      }
    } catch (error: any) {
      console.log('Full error:', error);
      console.log('Error response:', error.response?.data);
      console.log('Error status:', error.response?.status);
      console.log('Error headers:', error.response?.headers);

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

  const deliveryCharge: number = 50;
  // Use the summary object for the subtotal
  const total = subtotal + deliveryCharge;

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
        <View style={styles.formGroup}>
          <Text style={styles.label}>First Name</Text>
          <TextInput
            style={styles.input}
            value={formData.firstName}
            onChangeText={(text) => handleChange("firstName", text)}
            placeholder="Enter first name"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Last Name</Text>
          <TextInput
            style={styles.input}
            value={formData.lastName}
            onChangeText={(text) => handleChange("lastName", text)}
            placeholder="Enter last name"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            value={formData.email}
            onChangeText={(text) => handleChange("email", text)}
            keyboardType="email-address"
            placeholder="Enter email address"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Phone</Text>
          <TextInput
            style={styles.input}
            value={formData.phone}
            onChangeText={(text) => handleChange("phone", text)}
            keyboardType="phone-pad"
            placeholder="Enter phone number"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Address</Text>
          <TextInput
            style={styles.input}
            value={formData.address}
            onChangeText={(text) => handleChange("address", text)}
            placeholder="Enter full address"
          />
        </View>

        {/* <View style={styles.formGroup}>
          <Text style={styles.label}>City</Text>
          <TextInput
            style={styles.input}
            value={formData.city}
            onChangeText={(text) => handleChange("city", text)}
            placeholder="Enter city"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Post Code</Text>
          <TextInput
            style={styles.input}
            value={formData.zipCode}
            onChangeText={(text) => handleChange("zipCode", text)}
            keyboardType="numeric"
            placeholder="Enter post code"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Country</Text>
          <TextInput
            style={styles.input}
            value={formData.country}
            onChangeText={(text) => handleChange("country", text)}
            placeholder="Enter country"
          />
        </View> */}

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

        <Pressable
          style={[styles.payButton, processing && styles.disabledButton]}
          onPress={handleCheckout}
          disabled={processing}
        >
          {processing ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text style={styles.payButtonText}>Complete Payment</Text>
          )}
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',

  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 150, // Add padding to account for sticky button
  },
  stickyButtonContainer: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: 5,
    paddingBottom: 30,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    elevation: 8,
    shadowColor: '#000', // iOS shadow
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
