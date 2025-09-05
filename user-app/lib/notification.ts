import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';

export async function registerForPushNotificationsAsync() {

  // console.log("step....>>>")

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    // console.log("step  >>> 1")

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    // console.log("step >>> 2")

    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
      return;
    }

    try {
      const token = (await Notifications.getDevicePushTokenAsync()).data;
      console.log('📲 Expo Push Token user app:', token);
      return token;
    } catch (error) {
      console.log("error add token ", error)
    }

  } else {
    alert('Must use physical device for Push Notifications');
  }
}
