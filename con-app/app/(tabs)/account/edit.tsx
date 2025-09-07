import { BaseButton } from "@/components/BaseButton";
import { useAuth } from "@/context/useAuth";
import { useImageUpload } from "@/hooks/useUploadImage";
import { PRIMARY_COLOR } from "@/lib/constants";
import { Ionicons } from "@expo/vector-icons";
import { API_CONSULTANT, Patch } from "@sm/common";
import { updateCurrentUserProfile } from "@sm/common/src/api/userProfile";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { Button, Card, Text, TextInput } from "react-native-paper";

interface IFormData {
  name: string;
  email: string;
  phone: string;
  profile_image: string;
}

const EditProfileScreen = () => {
  const { user, updateUser, token } = useAuth();
  const router = useRouter();
  const { uploadImage, isLoading: isUploadingImage, error: uploadError } = useImageUpload();

  const [formData, setFormData] = useState<IFormData>({
    name: user?.full_name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    profile_image: user?.profile_image || null,
  });
  const [errors, setErrors] = useState<any>({});
  const [saving, setSaving] = useState(false);
  const [imageChanged, setImageChanged] = useState(false);

  const pickAvatar = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission required", "Camera‑roll permission is needed.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
      base64: false,
    });

    if (!result.canceled) {
      setFormData({ ...formData, profile_image: result.assets[0].uri });
      setImageChanged(true);
    }
  };

  const handleInputChange = (name: any, value: any) => {
    setFormData({
      ...formData,
      [name]: value,
    });
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null,
      });
    }
  };

  const validateForm = () => {
    const newErrors: any = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const saveProfile = async () => {
    if (!validateForm()) return;

    setSaving(true);
    try {
      console.log("form data", formData);

      let imageUrl = formData.profile_image;

      // Upload image if it's changed and is a local file
      if (imageChanged && formData.profile_image && formData.profile_image.startsWith('file://')) {
        try {
          imageUrl = await uploadImage(formData.profile_image);
          console.log("Uploaded image URL:", imageUrl);
        } catch (uploadErr) {
          Alert.alert("Upload Error", "Failed to upload profile image. Please try again.");
          setSaving(false);
          return;
        }
      }

      // Prepare update data
      const updateProfileData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        ...(imageUrl ? { profile_image: imageUrl } : {}),
      };

      console.log("Sending update data:", updateProfileData);

      // Make API call
      const response = await Patch(`${API_CONSULTANT.auth}/${user?.id}`, updateProfileData);

      // const responseData = await response.json();

      console.log("Response from update user profile:", response?.data);

      if (response && response?.data?.success) {
        // Update user data in context and AsyncStorage
        await updateUser({
          full_name: formData.name,
          email: formData.email,
          phone: formData.phone,
          profile_image: imageUrl
        });

        Alert.alert("Success", "Profile updated successfully");
        router.back();
      } else {
        throw new Error(response?.message || "Failed to update profile");
      }

    } catch (err: any) {
      console.error("Profile update error:", err);
      console.error("Error details:", err.response?.data || err.message);
      Alert.alert("Error", err.message || "Could not update profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* <CommonHeader /> */}
      <Card style={styles.section}>
        <Card.Content>
          <Text variant="titleLarge" style={styles.title}>
            Edit Profile
          </Text>

          {/* Show upload error if any */}
          {uploadError && (
            <Text style={styles.errorText}>Image upload error: {uploadError}</Text>
          )}

          {/* Avatar Section */}
          <View style={styles.avatarSection}>
            <TouchableOpacity onPress={pickAvatar} disabled={isUploadingImage}>
              <View style={styles.avatarContainer}>
                {formData.profile_image ? (
                  <Image
                    source={{ uri: formData.profile_image }}
                    style={styles.avatar}
                  />
                ) : (
                  <View style={[styles.avatar, styles.avatarPlaceholder]}>
                    <Text style={styles.avatarText}>
                      {formData.name.charAt(0).toUpperCase()}
                    </Text>
                  </View>
                )}
                <View style={styles.cameraButton}>
                  {isUploadingImage ? (
                    <ActivityIndicator size="small" color="white" />
                  ) : (
                    <Ionicons name="camera" size={16} color="white" />
                  )}
                </View>
              </View>
            </TouchableOpacity>
            <Text style={styles.avatarLabel}>
              {isUploadingImage ? "Uploading..." : "Profile photo"}
            </Text>
          </View>

          <TextInput
            label="Full Name"
            value={formData.name}
            onChangeText={(text) => handleInputChange("name", text)}
            error={!!errors.name}
            style={styles.input}
            mode="outlined"
            left={<TextInput.Icon icon="account" />}
          />
          {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}

          <TextInput
            label="Email Address"
            value={formData.email}
            onChangeText={(text) => handleInputChange("email", text)}
            error={!!errors.email}
            style={styles.input}
            mode="outlined"
            keyboardType="email-address"
            autoCapitalize="none"
            left={<TextInput.Icon icon="email" />}
          />
          {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

          <TextInput
            label="Phone Number"
            value={formData.phone}
            onChangeText={(text) => handleInputChange("phone", text)}
            style={styles.input}
            mode="outlined"
            keyboardType="phone-pad"
            left={<TextInput.Icon icon="phone" />}
          />

          {/* <Button
            mode="contained"
            onPress={saveProfile}
            style={styles.saveButton}
            labelStyle={styles.buttonLabel}
            disabled={saving || isUploadingImage}
          >
            {saving ? <ActivityIndicator color="white" /> : "Save Changes"}
          </Button> */}
          <BaseButton title="Save Changes" onPress={saveProfile} disabled={saving || isUploadingImage} />
        </Card.Content>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    position: "relative",
  },
  section: {
    borderRadius: 12,
    elevation: 2,
  },
  title: {
    marginBottom: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
  input: {
    marginBottom: 8,
    backgroundColor: "white",
  },
  errorText: {
    color: "red",
    marginBottom: 12,
    marginLeft: 8,
    fontSize: 12,
  },
  saveButton: {
    marginTop: 16,
    borderRadius: 8,
    backgroundColor: PRIMARY_COLOR,
  },
  buttonLabel: {
    color: "white",
    fontWeight: "bold",
  },
  avatarSection: {
    alignItems: "center",
    marginBottom: 24,
  },
  avatarContainer: {
    position: "relative",
    marginBottom: 8,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  avatarPlaceholder: {
    backgroundColor: PRIMARY_COLOR,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    fontSize: 40,
    fontWeight: "600",
    color: "white",
  },
  cameraButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: PRIMARY_COLOR,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "white",
  },
  avatarLabel: {
    fontSize: 14,
    color: "#666",
  },
});

export default EditProfileScreen;