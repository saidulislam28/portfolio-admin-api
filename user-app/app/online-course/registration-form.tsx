import { BaseButton } from "@/components/BaseButton";
import CommonHeader from "@/components/CommonHeader";
import { InputField } from "@/components/InputField";
import { useAuth } from "@/context/useAuth";
import { PACKAGE_SERVICE_TYPE, PRIMARY_COLOR } from "@/lib/constants";
import { validateEmail, validatePhone } from "@/utility/validator";
import { API_USER, Post } from "@sm/common";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  View
} from "react-native";

const devFormData = {
  first_name: "John",
  last_name: "Doe",
  address: "123 Test Street",
  email: "john.doe@example.com",
  phone: "01717247384",
  passportFile: null,
  gender: "Male",
  whatsapp_number: "01717247384",
  emergency_contact_name: "Jane Doe",
  emergency_contact: "01717247384",
};

const ExamRegistrationFrom = () => {
  const { packageId, center } = useLocalSearchParams();
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  if (isLoading || user === null) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date: Date) => {
    // setSelectedDate(date);
    hideDatePicker();
  };

  const [formData, setFormData] = useState<any>(
    __DEV__
      ? devFormData
      : {
        first_name: "",
        last_name: "",
        address: "",
        email: "",
        phone: "",
        passportFile: null,
        gender: "",
        whatsapp_number: "",
        emergency_contact_name: "",
        emergency_contact: "",
      }
  );

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    const requiredFields = [
      "first_name",
      "last_name",
      "email",
      "phone",
      "whatsapp_number",
      "address",
      "gender",
      "emergency_contact_name",
      "emergency_contact"
    ];

    for (const field of requiredFields) {
      if (!formData[field]?.trim()) {
        newErrors[field] = `${field.replace(/_/g, ' ')} is required`;
      }
    }

    // Email validation
    // Email validation
    const emailValidation = validateEmail(formData.email);
    if (!emailValidation.isValid) {
      newErrors.email = emailValidation.error!;
    }

    // Phone validation using reusable function
    const phoneValidation = validatePhone(formData.phone);
    if (!phoneValidation.isValid) {
      newErrors.phone = phoneValidation.error!;
    }
    const whatsappValidation = validatePhone(formData.whatsapp_number);
    if (!whatsappValidation.isValid) {
      newErrors.whatsapp_number = whatsappValidation.error!;
    }
    const emergencyValidation = validatePhone(formData.emergency_contact);
    if (!emergencyValidation.isValid) {
      newErrors.emergency_contact = emergencyValidation.error!;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (name: any, value: any) => {
    setFormData((prev: any) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleFocus = (fieldKey: string) => {
    setFocusedField(fieldKey);
  };

  const handleBlur = () => {
    setFocusedField(null);
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    console.log("formdata ", formData);
    // return

    try {
      const orderInfo = {
        first_name: formData?.first_name,
        last_name: formData?.last_name,
        address: formData?.address,
        email: formData?.email,
        phone: formData?.phone,
        gender: formData?.gender,
        whatsapp_number: formData?.whatsapp_number,
        emergency_contact_name: formData?.emergency_contact_name,
        emergency_contact: formData?.emergency_contact,
        passport_file: formData?.passportFile,
      };

      const payload = {
        email: formData?.email,
        first_name: formData?.first_name,
        last_name: formData?.last_name,
        address: formData?.address,
        phone: formData?.phone,
        package_id: +packageId,
        service_type: PACKAGE_SERVICE_TYPE.ielts_academic,
        order_info: orderInfo,
      };

      const response = await Post(API_USER.create_order, payload);
      const responseData = response?.data?.data;
      if (response?.data?.success) {
        router.push(
          `/sslpay-screen?payment_url=${responseData.payment_url}&service_type=${PACKAGE_SERVICE_TYPE.ielts_academic}&amount=${responseData?.total_amount}`
        );
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error("Registration failed:", error.message);
      Alert.alert("Error", "Registration failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const openTestDatesLink = () => {
    Linking.openURL(
      "https://www.britishcouncil.org.bd/en/exam/ielts/dates-fees-locations"
    );
  };

  return (
    <View style={styles.container}>
      <CommonHeader />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.header}>Course Enrollment Form</Text>

        <InputField
          label="First Name*"
          value={formData.first_name}
          onChangeText={(text) => handleChange("first_name", text)}
          error={errors.first_name}
          fieldKey="first_name"
          focusedField={focusedField}
          onFocus={() => handleFocus("first_name")}
          onBlur={handleBlur}
          placeholder="First Name"
          keyboardType="default"
        />

        <InputField
          label="Last Name*"
          value={formData.last_name}
          onChangeText={(text) => handleChange("last_name", text)}
          error={errors.last_name}
          fieldKey="last_name"
          focusedField={focusedField}
          onFocus={() => handleFocus("last_name")}
          onBlur={handleBlur}
          placeholder="Last name"
          keyboardType="default"
        />

        <InputField
          label="Gender*"
          value={formData.gender}
          onChangeText={(text) => handleChange("gender", text)}
          error={errors.gender}
          fieldKey="gender"
          focusedField={focusedField}
          onFocus={() => handleFocus("gender")}
          onBlur={handleBlur}
          placeholder="Write Your Gender"
          keyboardType="default"
        />

        <InputField
          label="Email*"
          value={formData.email}
          onChangeText={(text) => handleChange("email", text)}
          error={errors.email}
          fieldKey="email"
          focusedField={focusedField}
          onFocus={() => handleFocus("email")}
          onBlur={handleBlur}
          placeholder="Write Email address"
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <InputField
          label="Phone*"
          value={formData.phone}
          onChangeText={(text) => handleChange("phone", text)}
          error={errors.phone}
          fieldKey="phone"
          focusedField={focusedField}
          onFocus={() => handleFocus("phone")}
          onBlur={handleBlur}
          placeholder="Write Phone Number"
          keyboardType="phone-pad"
        />

        <InputField
          label="Whatsapp No.*"
          value={formData.whatsapp_number}
          onChangeText={(text) => handleChange("whatsapp_number", text)}
          error={errors.whatsapp_number}
          fieldKey="whatsapp_number"
          focusedField={focusedField}
          onFocus={() => handleFocus("whatsapp_number")}
          onBlur={handleBlur}
          placeholder="Write Whatsapp Phone Number"
          keyboardType="phone-pad"
        />

        <InputField
          label="Address*"
          value={formData.address}
          onChangeText={(text) => handleChange("address", text)}
          error={errors.address}
          fieldKey="address"
          focusedField={focusedField}
          onFocus={() => handleFocus("address")}
          onBlur={handleBlur}
          placeholder="Write permanent address"
          keyboardType="default"
        />

        <InputField
          label="Emergency Contact Name*"
          value={formData.emergency_contact_name}
          onChangeText={(text) => handleChange("emergency_contact_name", text)}
          error={errors.emergency_contact_name}
          fieldKey="emergency_contact_name"
          focusedField={focusedField}
          onFocus={() => handleFocus("emergency_contact_name")}
          onBlur={handleBlur}
          placeholder="Write emergency contact name"
          multiline
          numberOfLines={4}
        />

        <InputField
          label="Emergency Contact*"
          value={formData.emergency_contact}
          onChangeText={(text) => handleChange("emergency_contact", text)}
          error={errors.emergency_contact}
          fieldKey="emergency_contact"
          focusedField={focusedField}
          onFocus={() => handleFocus("emergency_contact")}
          onBlur={handleBlur}
          placeholder="Write emergency contact number"
          keyboardType="phone-pad"
        />

        <Text style={styles.note}>
          Register for IELTS with us today, and our booking agent will contact
          you to schedule TWO FREE Video Call Speaking Mock Test.
        </Text>
      </ScrollView>
      <View style={styles.stickyButtonContainer}>
        <BaseButton title="Submit" onPress={handleSubmit} isLoading={isSubmitting} />
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
  },
  stickyButtonContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingTop: 15,
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
  dateText: {
    marginTop: 20,
    fontSize: 16,
  },
  dateInputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    backgroundColor: "#fff",
  },
  dateInputText: {
    fontSize: 16,
    color: "#333",
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
    textAlign: "center",
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 15,
    marginBottom: 5,
    color: "#333",
  },
  subLabel: {
    fontSize: 12,
    color: "#666",
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 5,
  },
  inputError: {
    borderColor: "red",
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    marginBottom: 5,
    overflow: "hidden",
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    overflow: "hidden",
  },
  picker: {
    height: 54,
    width: "100%",
  },
  error: {
    color: "red",
    fontSize: 12,
    marginBottom: 10,
  },
  link: {
    color: "#1a73e8",
    textDecorationLine: "underline",
    marginBottom: 20,
  },
  note: {
    marginTop: 20,
    marginBottom: 20,
    fontStyle: "italic",
    textAlign: "center",
    color: "#555",
  },
  submitButton: {
    backgroundColor: PRIMARY_COLOR,
    padding: 15,
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
    fontWeight: "bold",
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

export default ExamRegistrationFrom;