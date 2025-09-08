import { BaseButton } from "@/components/BaseButton";
import CommonHeader from "@/components/CommonHeader";
import { InputField } from "@/components/InputField"; // Import the InputField component
import { useAuth } from "@/context/useAuth";
import { PACKAGE_SERVICE_TYPE } from "@/lib/constants";
import { MaterialIcons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { API_USER, Post } from "@sm/common";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";

const ExamRegistrationFrom = () => {
  const { packageId, center } = useLocalSearchParams();
  const router = useRouter();
  const { user, token, isLoading } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Image picker states
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  useEffect(() => {
    requestPermissions();
  }, []);

  if (isLoading || user === null) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  const requestPermissions = async () => {
    const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();
    if (cameraPermission.status !== "granted") {
      Alert.alert(
        "Permission Required",
        "Camera permission is required to take photos."
      );
    }

    const mediaPermission =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (mediaPermission.status !== "granted") {
      Alert.alert(
        "Permission Required",
        "Media library permission is required to select photos."
      );
    }
  };

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

  const [formData, setFormData] = useState<any>({
    first_name: __DEV__ ? "John" : "",
    last_name: __DEV__ ? "Doe" : "",
    address: __DEV__ ? "123 Main Street" : "",
    email: __DEV__ ? "john.doe@example.com" : "",
    phone: __DEV__ ? "01717247384" : "",
    whatsapp: __DEV__ ? "01717247384" : "",
    educationLevel: __DEV__ ? "secondary_up_to_16" : "",
    occupation: __DEV__ ? "Engineer" : "",
    shippingAddress: __DEV__ ? "456 Secondary Street" : "",
    notes: __DEV__ ? "Some test notes" : "",
    passportFile: null,
  });

  const handleChange = (name: any, value: any) => {
    setFormData((prev: any) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const showImagePickerOptions = () => {
    Alert.alert(
      "Select Passport Photo",
      "Choose an option to upload your passport information page",
      [
        {
          text: "Camera",
          onPress: () => pickImageFromCamera(),
        },
        {
          text: "Gallery",
          onPress: () => pickImageFromGallery(),
        },
        {
          text: "Cancel",
          style: "cancel",
        },
      ]
    );
  };

  const pickImageFromCamera = async () => {
    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        quality: 0.8,
      });

      if (!result.canceled) {
        setSelectedImage(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to take photo");
    }
  };

  const pickImageFromGallery = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        quality: 0.8,
      });

      if (!result.canceled) {
        setSelectedImage(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to select image");
    }
  };

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

    for (const field of requiredFields) {
      if (!formData[field]?.trim()) {
        newErrors[field] = `${field.replace("_", " ")} is required`;
      }
    }

    if (!selectedDate) {
      newErrors.test_date = "Please select a test date";
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

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    if (!packageId || !center) {
      Alert.alert("Error", "Select package or center first!!!");
      setIsSubmitting(false);
      return;
    }

    try {
      const userInfo = {
        education_level: formData?.educationLevel,
        occupation: formData?.occupation,
        shipping_address: formData?.shippingAddress,
        passport_file: null,
        exam_date: selectedDate?.toISOString(),
        exam_canter: +center,
        whatsapp: formData?.whatsapp,
        notes: formData?.notes || "",
      };

      const payload = {
        email: formData?.email,
        first_name: formData?.first_name,
        last_name: formData?.last_name,
        address: formData?.address,
        center_id: Number(center),
        phone: formData?.phone,
        package_id: +packageId,
        service_type: PACKAGE_SERVICE_TYPE.exam_registration,
        order_info: userInfo,
      };

      const response = await Post(API_USER.create_order, payload);
      const responseData = response?.data?.data;

      if (response?.data?.success) {
        router.push(
          `/sslpay-screen?payment_url=${responseData?.payment_url}&service_type=${PACKAGE_SERVICE_TYPE.exam_registration}&amount=${responseData?.total_amount}`
        );
      } else {
        Alert.alert("Error", "Registration failed. Please try again.");
      }
    } catch (error) {
      console.error("Registration failed:", error);
      Alert.alert("Error", "Registration failed. Please try again.");
    } finally {
      setIsSubmitting(false);
      setIsUploadingImage(false);
    }
  };

  const openTestDatesLink = () => {
    Linking.openURL(
      "https://www.britishcouncil.org.bd/en/exam/ielts/dates-fees-locations"
    );
  };

  const handleFocus = (fieldKey: string) => {
    setFocusedField(fieldKey);
  };

  const handleBlur = () => {
    setFocusedField(null);
  };

  return (
    <View style={styles.container}>
      <CommonHeader />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.header}>IELTS Test Registration Form</Text>

        <Text style={styles.label}>Choose Test Date*</Text>
        <TouchableOpacity onPress={openTestDatesLink}>
          <Text style={styles.link}>Check Available Test Dates</Text>
        </TouchableOpacity>
        
        <Text style={styles.label}>Choosen Test Date*</Text>
        <TouchableOpacity
          style={[
            styles.dateInputWrapper,
            errors.test_date && styles.inputError
          ]}
          onPress={showDatePicker}
        >
          <Text style={styles.dateInputText}>
            {selectedDate ? selectedDate.toDateString() : "Select a test date"}
          </Text>
          <MaterialIcons name="calendar-today" size={24} color="#555" />
        </TouchableOpacity>
        {errors.test_date && <Text style={styles.errorText}>{errors.test_date}</Text>}

        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="date"
          onConfirm={handleConfirm}
          onCancel={hideDatePicker}
        />

        <InputField
          label="First Name*"
          value={formData.first_name}
          onChangeText={(text) => handleChange("first_name", text)}
          error={errors.first_name}
          fieldKey="first_name"
          focusedField={focusedField}
          onFocus={() => handleFocus("first_name")}
          onBlur={handleBlur}
          placeholder="First Name as passport"
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
          placeholder="Last Name as passport"
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
          label="Cell Phone No.*"
          value={formData.phone}
          onChangeText={(text) => handleChange("phone", text)}
          error={errors.phone}
          fieldKey="phone"
          focusedField={focusedField}
          onFocus={() => handleFocus("phone")}
          onBlur={handleBlur}
          placeholder="Write Cell Phone Number"
          keyboardType="phone-pad"
        />

        <InputField
          label="WhatsApp Number*"
          value={formData.whatsapp}
          onChangeText={(text) => handleChange("whatsapp", text)}
          error={errors.whatsapp}
          fieldKey="whatsapp"
          focusedField={focusedField}
          onFocus={() => handleFocus("whatsapp")}
          onBlur={handleBlur}
          placeholder="Write WhatsApp Number"
          keyboardType="phone-pad"
        />

        <InputField
          label="Permanent Address*"
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

        <Text style={styles.label}>Level of Education*</Text>
        <View style={[
          styles.pickerWrapper,
          errors.educationLevel && styles.inputError
        ]}>
          <Picker
            selectedValue={formData.educationLevel}
            onValueChange={(itemValue) =>
              handleChange("educationLevel", itemValue)
            }
            style={styles.picker}
            prompt="Select your education level"
          >
            <Picker.Item label="Select your education level" value="" />
            <Picker.Item
              label="Secondary (up to 16 years)"
              value="secondary_up_to_16"
            />
            <Picker.Item
              label="Secondary (16-19 years)"
              value="secondary_16_19"
            />
            <Picker.Item label="Degree (or equivalent)" value="degree" />
            <Picker.Item label="Post-graduate" value="post_graduate" />
          </Picker>
        </View>
        {errors.educationLevel && <Text style={styles.errorText}>{errors.educationLevel}</Text>}

        <InputField
          label="Occupation*"
          value={formData.occupation}
          onChangeText={(text) => handleChange("occupation", text)}
          error={errors.occupation}
          fieldKey="occupation"
          focusedField={focusedField}
          onFocus={() => handleFocus("occupation")}
          onBlur={handleBlur}
          placeholder="Write your profession"
          keyboardType="default"
        />

        <InputField
          label="Certificate Shipping Address*"
          value={formData.shippingAddress}
          onChangeText={(text) => handleChange("shippingAddress", text)}
          error={errors.shippingAddress}
          fieldKey="shippingAddress"
          focusedField={focusedField}
          onFocus={() => handleFocus("shippingAddress")}
          onBlur={handleBlur}
          placeholder="Write address"
          multiline
          numberOfLines={4}
        />

        <InputField
          label="Notes"
          value={formData.notes}
          onChangeText={(text) => handleChange("notes", text)}
          error={errors.notes}
          fieldKey="notes"
          focusedField={focusedField}
          onFocus={() => handleFocus("notes")}
          onBlur={handleBlur}
          placeholder="Any additional notes (optional)"
          multiline
          numberOfLines={3}
        />

        <Text style={styles.label}>Upload Passport Information Page*</Text>
        <Text style={styles.subLabel}>(JPG, JPEG, PNG) Required</Text>

        <TouchableOpacity
          style={styles.imagePickerButton}
          onPress={showImagePickerOptions}
          disabled={isUploadingImage}
        >
          <MaterialIcons name="camera-alt" size={24} color="#555" />
          <Text style={styles.imagePickerText}>
            {selectedImage
              ? "Change Photo"
              : "Take Photo or Choose from Gallery"}
          </Text>
        </TouchableOpacity>

        {selectedImage && (
          <View style={styles.imagePreviewContainer}>
            <Image
              source={{ uri: selectedImage }}
              style={styles.imagePreview}
            />
            <TouchableOpacity
              style={styles.removeImageButton}
              onPress={() => setSelectedImage(null)}
            >
              <MaterialIcons name="close" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        )}

        <Text style={styles.note}>
          Register for IELTS with us today, and our booking agent will contact
          you to schedule TWO FREE Video Call Speaking Mock Test.
        </Text>
      </ScrollView>
      <View style={styles.stickyButtonContainer}>
        <BaseButton title="Submit" onPress={handleSubmit} isLoading={isSubmitting || isUploadingImage} />
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
  dateInputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    marginBottom: 5,
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
  inputError: {
    borderColor: "#DC3545",
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    overflow: "hidden",
    marginBottom: 5,
  },
  picker: {
    height: 54,
    width: "100%",
  },
  errorText: {
    color: "#DC3545",
    fontSize: 14,
    marginTop: 8,
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
  imagePickerButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#ddd",
    borderStyle: "dashed",
    borderRadius: 8,
    padding: 20,
    marginBottom: 10,
    backgroundColor: "#f9f9f9",
  },
  imagePickerText: {
    marginLeft: 10,
    fontSize: 16,
    color: "#555",
  },
  imagePreviewContainer: {
    position: "relative",
    marginBottom: 15,
    alignSelf: "center",
  },
  imagePreview: {
    width: 200,
    height: 150,
    borderRadius: 8,
    resizeMode: "cover",
  },
  removeImageButton: {
    position: "absolute",
    top: -10,
    right: -10,
    backgroundColor: "#ff4444",
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default ExamRegistrationFrom;