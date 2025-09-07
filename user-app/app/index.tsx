import { RECIPIENT_TYPE } from "@/lib/constants";
import { registerForPushNotificationsAsync } from "@/lib/notification";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_COMMON, API_USER, Post } from "@sm/common";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, ToastAndroid, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useAuth } from "@/context/useAuth";
import "react-native-reanimated";
import { ROUTES } from "@/constants/app.routes";

export default function Index() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [checkingLaunch, setCheckingLaunch] = useState(true);

  // if (!user) return null;

  // console.log(user);
  useEffect(() => {
    if (!user?.id) {
      console.warn("User ID is undefined. Skipping token registration.");
      return;
    }

    const postData = async () => {
      try {
        const userId = Number(user?.id);
        const token = await registerForPushNotificationsAsync();
        const response = await Post(API_COMMON.post_device_tokens, {
          token,
          user_id: userId,
          recipient_type: RECIPIENT_TYPE.User,
        });
        if (response?.success) {
          // ToastAndroid.show("Device token sent successfully", response.success);
        }
      } catch (error) {
        console.log("error from posting data", error);
      }
    };
    postData();
  }, [user?.id]);

  useEffect(() => {
    const checkFirstLaunch = async () => {
      const hasLaunched = await AsyncStorage.getItem("hasLaunched");
      console.log("hasss", hasLaunched);
      if (!hasLaunched) {
        await AsyncStorage.setItem("hasLaunched", "true");
        router.replace(ROUTES.LANDING);
      } else {
        if (!isLoading) {
          if (user) {
            router.replace(ROUTES.TABS); // homepage
          } else {
            router.replace(ROUTES.LANDING);
          }
        }
      }
      setCheckingLaunch(false);
    };
    checkFirstLaunch();
  }, [user, isLoading]);

  if (checkingLaunch || isLoading) {
    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size="large" />
        </View>
      </GestureHandlerRootView>
    );
  }

  return null;
}
