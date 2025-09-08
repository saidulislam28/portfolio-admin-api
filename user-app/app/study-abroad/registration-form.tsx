import { BaseButton } from "@/components/BaseButton";
import CommonHeader from "@/components/CommonHeader";
import { InputField } from "@/components/InputField"; // Add this import
import { ROUTES } from "@/constants/app.routes";
import { useAuth } from "@/context/useAuth";
import { PACKAGE_SERVICE_TYPE } from "@/lib/constants";
import { API_USER, Post } from "@sm/common";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  View
} from "react-native";

const ExamRegistrationFrom = () => {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (isLoading || user === null) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date: Date) => {
    setSelectedDate(date);
    hideDatePicker();
  };

  const [formData, setFormData] = useState({
    first_name: __DEV__ ? "John" : "",
    last_name: __DEV__ ? "Doe" : "",
    address: __DEV__ ? "123 Main St, City, Country" : "",
    email: __DEV__ ? "john.doe@example.com" : "",
    phone: __DEV__ ? "01711111111" : "",
    budget: __DEV__ ? "20000" : "",
    ielts_score: __DEV__ ? "7.5" : "",
    academic_background: __DEV__ ? "Bachelor in Computer Science" : "",
    destination: __DEV__ ? "Canada" : "",
    whatsapp: __DEV__ ? "01711111111" : "",
  });

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    const requiredFields = [
      "first_name",
      "last_name",
      "email",
      "phone",
      "whatsapp",
      "address",
    ];

    // Check required fields
    for (const field of requiredFields) {
      if (!formData[field]?.trim()) {
        newErrors[field] = `${field.replace("_", " ")} is required`;
      }
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Phone validation (basic)
    const phoneRegex = /^01[3-9]\d{8}$/;
    if (formData.phone && !phoneRegex.test(formData.phone)) {
      newErrors.phone = "Please enter a valid Bangladeshi phone number";
    }

    // WhatsApp validation
    if (formData.whatsapp && !phoneRegex.test(formData.whatsapp)) {
      newErrors.whatsapp = "Please enter a valid WhatsApp number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (name: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
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

    try {
      const userInfo = {
        budget: formData?.budget,
        ielts_score: formData?.ielts_score,
        academic_background: formData?.academic_background,
        destination: formData?.destination,
        whatsapp: formData.whatsapp,
        first_name: formData.first_name,
        last_name: formData.last_name,
        address: formData.address,
        email: formData.email,
        phone: formData.phone,
      };

      const payload = {
        email: formData?.email,
        first_name: formData?.first_name,
        last_name: formData?.last_name,
        address: formData?.address,
        phone: formData?.phone,
        service_type: PACKAGE_SERVICE_TYPE.study_abroad,
        order_info: userInfo,
      };

      const response = await Post(API_USER.create_order, payload);
      const responseData = response?.data;
      if (responseData?.success) {
        Alert.alert("Form submitted!", "Our agent will call you within 24h.");
        setFormData({
          first_name: "",
          last_name: "",
          address: "",
          email: "",
          phone: "",
          budget: "",
          ielts_score: "",
          academic_background: "",
          destination: "",
          whatsapp: "",
        });
        setErrors({});
        router.push(ROUTES.HOME as any);
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error("Registration failed:", error);
      alert("Registration failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <CommonHeader />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.header}>Submit Your Study Abroad Inquiry</Text>

        <InputField
          label="First Name*"
          fieldKey="first_name"
          value={formData.first_name}
          onChangeText={(text) => handleChange("first_name", text)}
          placeholder="Given Name as passport"
          keyboardType="default"
          error={errors.first_name}
          focusedField={focusedField}
          onFocus={() => handleFocus("first_name")}
          onBlur={handleBlur}
        />

        <InputField
          label="Last Name*"
          fieldKey="last_name"
          value={formData.last_name}
          onChangeText={(text) => handleChange("last_name", text)}
          placeholder="Surname as passport"
          keyboardType="default"
          error={errors.last_name}
          focusedField={focusedField}
          onFocus={() => handleFocus("last_name")}
          onBlur={handleBlur}
        />

        <InputField
          label="Email No.*"
          fieldKey="email"
          value={formData.email}
          onChangeText={(text) => handleChange("email", text)}
          placeholder="Write Email address"
          keyboardType="email-address"
          error={errors.email}
          focusedField={focusedField}
          onFocus={() => handleFocus("email")}
          onBlur={handleBlur}
        />

        <InputField
          label="Cell Phone No.*"
          fieldKey="phone"
          value={formData.phone}
          onChangeText={(text) => handleChange("phone", text)}
          placeholder="Write Cell Phone Number"
          keyboardType="phone-pad"
          error={errors.phone}
          focusedField={focusedField}
          onFocus={() => handleFocus("phone")}
          onBlur={handleBlur}
        />

        <InputField
          label="Whatsapp No.*"
          fieldKey="whatsapp"
          value={formData.whatsapp}
          onChangeText={(text) => handleChange("whatsapp", text)}
          placeholder="Write whatsapp Phone Number"
          keyboardType="phone-pad"
          error={errors.whatsapp}
          focusedField={focusedField}
          onFocus={() => handleFocus("whatsapp")}
          onBlur={handleBlur}
        />

        <InputField
          label="Permanent Address*"
          fieldKey="address"
          value={formData.address}
          onChangeText={(text) => handleChange("address", text)}
          placeholder="Write permanent address"
          keyboardType="default"
          error={errors.address}
          focusedField={focusedField}
          onFocus={() => handleFocus("address")}
          onBlur={handleBlur}
        />

        <InputField
          label="Preferred Study Destination*"
          fieldKey="destination"
          value={formData.destination}
          onChangeText={(text) => handleChange("destination", text)}
          placeholder="Write your destination"
          error={errors.destination}
          focusedField={focusedField}
          onFocus={() => handleFocus("destination")}
          onBlur={handleBlur}
        />

        <InputField
          label="Academic Background*"
          fieldKey="academic_background"
          value={formData.academic_background}
          onChangeText={(text) => handleChange("academic_background", text)}
          placeholder="Write academic background"
          multiline
          numberOfLines={4}
          error={errors.academic_background}
          focusedField={focusedField}
          onFocus={() => handleFocus("academic_background")}
          onBlur={handleBlur}
        />

        <InputField
          label="IELTS Score*"
          fieldKey="ielts_score"
          value={formData.ielts_score}
          onChangeText={(text) => handleChange("ielts_score", text)}
          placeholder="Write IELTS Score"
          multiline
          numberOfLines={4}
          error={errors.ielts_score}
          focusedField={focusedField}
          onFocus={() => handleFocus("ielts_score")}
          onBlur={handleBlur}
        />

        <InputField
          label="Budget*"
          fieldKey="budget"
          value={formData.budget}
          onChangeText={(text) => handleChange("budget", text)}
          placeholder="Write budget"
          multiline
          numberOfLines={4}
          error={errors.budget}
          focusedField={focusedField}
          onFocus={() => handleFocus("budget")}
          onBlur={handleBlur}
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
  header: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
    textAlign: "center",
  },
  note: {
    marginTop: 20,
    marginBottom: 20,
    fontStyle: "italic",
    textAlign: "center",
    color: "#555",
  },
});

export default ExamRegistrationFrom;