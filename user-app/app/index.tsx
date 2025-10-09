import { ROUTES } from "@/constants/app.routes";
import { useAuth } from "@/context/useAuth";
import { registerForPushNotificationsAsync } from "@/lib/notification";
import { getUserDeviceTimezone } from "@/utils/userTimezone";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_COMMON, Post } from "@sm/common";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "react-native-reanimated";

export default function Index() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [checkingLaunch, setCheckingLaunch] = useState(true);
  useEffect(() => {
    if (!user?.id) {
      console.warn("User ID is undefined. Skipping token registration.");
      return;
    }

    const postData = async () => {
      try {
        const userId = Number(user?.id);
        const token = await registerForPushNotificationsAsync();
        const timezone = getUserDeviceTimezone();

        const response = await Post(API_COMMON.post_device_tokens, {
          token,
          user_id: userId,
          timezone,
        });
      } catch (error: any) {
        console.log("error from posting data", error);
        console.log("error message", error?.message);
      }
    };
    postData();
  }, [user?.id]);

  useEffect(() => {
    const checkFirstLaunch = async () => {
      const hasLaunched = await AsyncStorage.getItem("hasLaunched");
      if (!hasLaunched) {
        await AsyncStorage.setItem("hasLaunched", "true");
        router.replace(ROUTES.LANDING as any);
      } else {
        if (!isLoading) {
          if (user) {
            router.replace(ROUTES.TABS as any); // homepage
          } else {
            router.replace(ROUTES.LANDING as any);
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
