import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { View, ActivityIndicator, ToastAndroid } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '@/context/useAuth';
import { registerForPushNotificationsAsync } from '@/lib/notification';
import { ROUTES } from '@/constants/app.routes';
import { API_COMMON, Post } from '@sm/common';
import { getUserDeviceTimezone } from '@/utils/userTimezone';

export default function Index() {
  const [checkingLaunch, setCheckingLaunch] = useState(true);
  const router = useRouter();
  const { user, isLoading } = useAuth();

  console.log('user', user);

  useEffect(() => {
    if (!user?.id) {
      console.warn('User ID is undefined. Skipping token registration.');
      return;
    }
    const postData = async () => {
      try {
        const userId = Number(user?.id);
        const token = await registerForPushNotificationsAsync();
        const timezone = getUserDeviceTimezone();
        const response = await Post(API_COMMON.post_device_tokens, {
          token,
          consultant_id: userId,
          timezone
        });
      } catch (error) {
        console.log('error from posting device token', error);
      }
    };
    postData();
  }, [user?.id]);

  useEffect(() => {
    const checkFirstLaunch = async () => {
      const hasLaunched = await AsyncStorage.getItem('hasLaunched');
      if (!hasLaunched) {
        await AsyncStorage.setItem('hasLaunched', 'true');
        router.replace(ROUTES.ONBOARDING);
      } else {
        if (!isLoading) {
          if (user) {
            router.replace(ROUTES.HOME); // homepage
          } else {
            router.replace(ROUTES.LOGIN);
          }
        }
      }
      setCheckingLaunch(false);
    };
    checkFirstLaunch();
  }, [user, isLoading]);

  if (checkingLaunch || isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return null;
}
