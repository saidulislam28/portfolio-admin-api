import CommonHeader from "@/components/CommonHeader";
import { PACKAGE_SERVICE_TYPE, PRIMARY_COLOR } from "@/lib/constants";
// import { Post } from "@/services/api/api";
import { API_CREATE_OREDR } from "@/services/api/endpoints";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "@/app/context/useAuth";
import { API_USER, Post } from "@sm/common";

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
    const requiredFields = [
      "first_name",
      "last_name",
      "email",
      "phone",
      "whatsapp_number",
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
    if (!phoneRegex.test(formData.whatsapp_number)) {
      Alert.alert("Validation Error", "Please enter a valid WhatsApp number");
      return false;
    }

    return true;
  };

  // console.log("idddsss..>>>>", packageId, JSON.parse(center))

  const handleChange = (name: any, value: any) => {
    setFormData((prev: any) => ({ ...prev, [name]: value }));
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

      // const stringifyorderInfo = JSON.stringify(orderInfo);

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
        // router.push('/exam/success');
      }
    } catch (error) {
      console.error("Registration failed:", error.message);
      alert("Registration failed. Please try again.");
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
        <Text style={styles.label}>First Name*</Text>
        <TextInput
          style={styles.input}
          placeholder="First Name"
          keyboardType="default"
          value={formData.first_name}
          onChangeText={(text) => handleChange("first_name", text)}
        />
        <Text style={styles.label}>Last Name*</Text>
        <TextInput
          style={styles.input}
          placeholder="Last name"
          keyboardType="default"
          value={formData.last_name}
          onChangeText={(text) => handleChange("last_name", text)}
        />
        <Text style={styles.label}>Gender*</Text>
        <TextInput
          style={styles.input}
          placeholder="Write Your Gender"
          keyboardType="default"
          value={formData.gender}
          onChangeText={(text) => handleChange("gender", text)}
        />
        <Text style={styles.label}>Email*</Text>
        <TextInput
          style={styles.input}
          placeholder="Write Email address"
          keyboardType="email-address"
          value={formData.email}
          onChangeText={(text) => handleChange("email", text)}
        />

        <Text style={styles.label}>Phone*</Text>
        <TextInput
          style={styles.input}
          placeholder="Write Phone Number"
          keyboardType="phone-pad"
          value={formData.phone}
          onChangeText={(text) => handleChange("phone", text)}
        />
        <Text style={styles.label}>Whatsapp No.*</Text>
        <TextInput
          style={styles.input}
          placeholder="Write Whatsapp Phone Number"
          keyboardType="phone-pad"
          value={formData.whatsapp_number}
          onChangeText={(text) => handleChange("whatsapp_number", text)}
        />

        <Text style={styles.label}>Address*</Text>

        <TextInput
          style={styles.input}
          placeholder="Write parmanent address"
          keyboardType="default"
          value={formData.address}
          onChangeText={(text) => handleChange("address", text)}
        />
        {/* 
            <Text style={styles.label}>Level of Education*</Text> */}
        {/* <View style={styles.pickerWrapper}>
                <Picker
                    selectedValue={formData.educationLevel}
                    onValueChange={(itemValue) => handleChange('educationLevel', itemValue)}
                    style={styles.picker}
                    prompt="Select your education level"
                >
                    <Picker.Item label="Select your education level" value="" />
                    <Picker.Item label="Secondary (up to 16 years)" value="secondary_up_to_16" />
                    <Picker.Item label="Secondary (16-19 years)" value="secondary_16_19" />
                    <Picker.Item label="Degree (or equivalent)" value="degree" />
                    <Picker.Item label="Post-graduate" value="post_graduate" />
                </Picker>
            </View> */}

        {/* <View style={styles.pickerWrapper}>
                <BottomSheetDropdown
                    value={formData.educationLevel}
                    onSelect={(itemValue) => handleChange('educationLevel', itemValue)}
                    placeholder="Select your education level"
                    items={[
                        { label: "Secondary (up to 16 years)", value: "secondary_up_to_16" },
                        { label: "Secondary (16-19 years)", value: "secondary_16_19" },
                        { label: "Degree (or equivalent)", value: "degree" },
                        { label: "Post-graduate", value: "post_graduate" },
                    ]}
                />
            </View> */}

        <Text style={styles.label}>Emergency Contact Name*</Text>
        <TextInput
          style={styles.input}
          placeholder="Write emegergency contact name"
          multiline
          numberOfLines={4}
          value={formData.emergency_contact_name}
          onChangeText={(text) => handleChange("emergency_contact_name", text)}
        />
        <Text style={styles.label}>Emergency Contact*</Text>
        <TextInput
          style={styles.input}
          placeholder="Write address"
          multiline
          numberOfLines={4}
          value={formData.emergency_contact}
          onChangeText={(text) => handleChange("emergency_contact", text)}
        />
        <Text style={styles.note}>
          Register for IELTS with us today, and our booking agent will contact
          you to schedule TWO FREE Video Call Speaking Mock Test.
        </Text>
      </ScrollView>
      <View style={styles.stickyButtonContainer}>
        <TouchableOpacity
          style={[styles.submitButton, isSubmitting && styles.disabledButton]}
          onPress={handleSubmit}
          // disabled={isSubmitting}
        >
          <Text style={styles.buttonText}>Submit</Text>
        </TouchableOpacity>
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
