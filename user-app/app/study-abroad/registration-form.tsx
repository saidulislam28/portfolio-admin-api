import { BaseButton } from "@/components/BaseButton";
import CommonHeader from "@/components/CommonHeader";
import { ROUTES } from "@/constants/app.routes";
import { useAuth } from "@/context/useAuth";
import { PACKAGE_SERVICE_TYPE, PRIMARY_COLOR } from "@/lib/constants";
import { API_USER, Post } from "@sm/common";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";

const ExamRegistrationFrom = () => {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

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
    const requiredFields = [
      "first_name",
      "last_name",
      "email",
      "phone",
      "whatsapp",
      "address",
    ];

    for (const field of requiredFields) {
      if (!formData[field]?.trim()) {
        Alert.alert(
          "Validation Error",
          `${field.replace("_", " ")} is required`
        );
        return false;
      }
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      Alert.alert("Validation Error", "Please enter a valid email address");
      return false;
    }

    // Phone validation (basic)
    const phoneRegex = /^01[3-9]\d{8}$/;
    if (!phoneRegex.test(formData.phone)) {
      Alert.alert(
        "Validation Error",
        "Please enter a valid Bangladeshi phone number"
      );
      return false;
    }

    // WhatsApp validation
    if (!phoneRegex.test(formData.whatsapp)) {
      Alert.alert("Validation Error", "Please enter a valid WhatsApp number");
      return false;
    }

    return true;
  };

  // console.log("idddsss..>>>>", packageId, JSON.parse(center))

  const handleChange = (name: any, value: any) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
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
        router.push(ROUTES.HOME);
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

        <Text style={styles.label}>First Name*</Text>
        <TextInput
          style={styles.input}
          placeholder="Given Name as passport"
          keyboardType="default"
          value={formData.first_name}
          onChangeText={(text) => handleChange("first_name", text)}
        />
        <Text style={styles.label}>Last Name*</Text>
        <TextInput
          style={styles.input}
          placeholder="Surname as passport"
          keyboardType="default"
          value={formData.last_name}
          onChangeText={(text) => handleChange("last_name", text)}
        />
        <Text style={styles.label}>Email No.*</Text>
        <TextInput
          style={styles.input}
          placeholder="Write Email address"
          keyboardType="email-address"
          value={formData.email}
          onChangeText={(text) => handleChange("email", text)}
        />

        <Text style={styles.label}>Cell Phone No.*</Text>
        <TextInput
          style={styles.input}
          placeholder="Write Cell Phone Number"
          keyboardType="phone-pad"
          value={formData.phone}
          onChangeText={(text) => handleChange("phone", text)}
        />
        <Text style={styles.label}>Whatsapp No.*</Text>
        <TextInput
          style={styles.input}
          placeholder="Write whatsapp Phone Number"
          keyboardType="phone-pad"
          value={formData.whatsapp}
          onChangeText={(text) => handleChange("whatsapp", text)}
        />

        <Text style={styles.label}>Permanent Address*</Text>

        <TextInput
          style={styles.input}
          placeholder="Write parmanent address"
          keyboardType="default"
          value={formData.address}
          onChangeText={(text) => handleChange("address", text)}
        />

        <Text style={styles.label}>Preferred Study Destination*</Text>
        <TextInput
          style={styles.input}
          placeholder="Write your destination"
          value={formData.destination}
          onChangeText={(text) => handleChange("destination", text)}
        />

        <Text style={styles.label}>Academic Background*</Text>
        <TextInput
          style={styles.input}
          // style={[styles.input, errors.shippingAddress && styles.inputError]}
          placeholder="Write academic background"
          multiline
          numberOfLines={4}
          value={formData.academic_background}
          onChangeText={(text) => handleChange("academic_background", text)}
        />
        <Text style={styles.label}>IELTS Score*</Text>
        <TextInput
          style={styles.input}
          // style={[styles.input, errors.shippingAddress && styles.inputError]}
          placeholder="Write IELTS Score"
          multiline
          numberOfLines={4}
          value={formData.ielts_score}
          onChangeText={(text) => handleChange("ielts_score", text)}
        />
        <Text style={styles.label}>Budget*</Text>
        <TextInput
          style={styles.input}
          // style={[styles.input, errors.shippingAddress && styles.inputError]}
          placeholder="Write budget"
          multiline
          numberOfLines={4}
          value={formData.budget}
          onChangeText={(text) => handleChange("budget", text)}
        />

        {/* <Text style={styles.label}>Upload Passport Information page*</Text>
            <Text style={styles.subLabel}>(JPG, JPEG, PNG, PDF) Limit 2MB</Text> */}
        {/* <FileUpload
                onFileSelected={(file) => handleChange('passportFile', file)}
            /> */}

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
  // picker: {
  //     height: 50,
  //     width: '100%'
  // },
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
