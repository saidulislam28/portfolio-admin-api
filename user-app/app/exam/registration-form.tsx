import CommonHeader from "@/components/CommonHeader";
import { PACKAGE_SERVICE_TYPE, PRIMARY_COLOR } from "@/lib/constants";
import { MaterialIcons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
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
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { useAuth } from "@/context/useAuth";
import { API_USER, Post, uploadImageFromApp } from "@sm/common";
import { BaseButton } from "@/components/BaseButton";

// Add this API endpoint constant at the top with your other endpoints
// Replace with your actual endpoint

const ExamRegistrationFrom = () => {
  const { packageId, center } = useLocalSearchParams();
  const router = useRouter();
  const { user, token, isLoading } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [loading, setLoading] = useState(false);

  // Image picker states
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  useEffect(() => {
    // loadPackages();
    requestPermissions();
  }, []);

  if (isLoading || user === null) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  const requestPermissions = async () => {
    // Request camera permissions
    const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();
    if (cameraPermission.status !== "granted") {
      Alert.alert(
        "Permission Required",
        "Camera permission is required to take photos."
      );
    }

    // Request media library permissions
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
        // aspect: [4, 3],
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
        // aspect: [4, 3],
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

    if (!selectedDate) {
      Alert.alert("Validation Error", "Please select a test date");
      return false;
    }

    // if (!selectedImage) {
    //   Alert.alert(
    //     "Validation Error",
    //     "Please upload your passport information page"
    //   );
    //   return false;
    // }
    // if (!selectedImage) {
    //   Alert.alert(
    //     "Validation Error",
    //     "Please upload your passport information page"
    //   );
    //   return false;
    // }

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
      // First upload the image
      // setIsUploadingImage(true);
      // const imageUrl = await uploadImage(selectedImage!);
      // setIsUploadingImage(false);

      const userInfo = {
        education_level: formData?.educationLevel,
        occupation: formData?.occupation,
        shipping_address: formData?.shippingAddress,
        // passport_file: imageUrl ?? null, // Use the uploaded image URL
        passport_file: null, // Use the uploaded image URL
        exam_date: selectedDate?.toISOString(),
        exam_canter: +center,
        whatsapp: formData?.whatsapp,
        notes: formData?.notes || "", // Optional field
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
      // console.log("response from api exam registration>", response?.data)
      const responseData = response?.data?.data;

      if (response?.data?.success) {
        //routes remain
        router.push(
          `/sslpay-screen?payment_url=${responseData?.payment_url}&service_type=${PACKAGE_SERVICE_TYPE.exam_registration}&amount=${responseData?.total_amount}`
        );
      } else {
        Alert.alert("Error", "Registration failed. Please try again.");
      }
    } catch (error) {
      console.error("Registration failed:", error);
      console.error("Registration failed:>>", error.message);
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
          style={styles.dateInputWrapper}
          onPress={showDatePicker}
        >
          <Text style={styles.dateInputText}>
            {selectedDate ? selectedDate.toDateString() : "Select a test date"}
          </Text>
          <MaterialIcons name="calendar-today" size={24} color="#555" />
        </TouchableOpacity>

        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="date"
          onConfirm={handleConfirm}
          onCancel={hideDatePicker}
        />

        <Text style={styles.label}>First Name*</Text>
        <TextInput
          style={styles.input}
          placeholder="First Name as passport"
          keyboardType="default"
          value={formData.first_name}
          onChangeText={(text) => handleChange("first_name", text)}
        />

        <Text style={styles.label}>Last Name*</Text>
        <TextInput
          style={styles.input}
          placeholder="Last Name as passport"
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

        <Text style={styles.label}>WhatsApp Number*</Text>
        <TextInput
          style={styles.input}
          placeholder="Write WhatsApp Number"
          keyboardType="phone-pad"
          value={formData.whatsapp}
          onChangeText={(text) => handleChange("whatsapp", text)}
        />

        <Text style={styles.label}>Permanent Address*</Text>
        <TextInput
          style={styles.input}
          placeholder="Write permanent address"
          keyboardType="default"
          value={formData.address}
          onChangeText={(text) => handleChange("address", text)}
        />

        <Text style={styles.label}>Level of Education*</Text>
        <View style={styles.pickerWrapper}>
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

        <Text style={styles.label}>Occupation*</Text>
        <TextInput
          style={styles.input}
          placeholder="Write your profession"
          value={formData.occupation}
          onChangeText={(text) => handleChange("occupation", text)}
        />

        <Text style={styles.label}>Certificate Shipping Address*</Text>
        <TextInput
          style={styles.input}
          placeholder="Write address"
          multiline
          numberOfLines={4}
          value={formData.shippingAddress}
          onChangeText={(text) => handleChange("shippingAddress", text)}
        />

        <Text style={styles.label}>Notes</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Any additional notes (optional)"
          multiline
          numberOfLines={3}
          value={formData.notes}
          onChangeText={(text) => handleChange("notes", text)}
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
  textArea: {
    height: 80,
    textAlignVertical: "top",
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
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
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
