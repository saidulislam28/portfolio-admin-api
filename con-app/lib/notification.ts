import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';

export async function registerForPushNotificationsAsync() {


    if (Device.isDevice) {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;

        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }

        if (finalStatus !== 'granted') {
            alert('Failed to get push token for push notification!');
            return;
        }

        try {
            const token = (await Notifications.getDevicePushTokenAsync()).data;
            console.log('📲 Expo Push Token:', token);
            return token;
        } catch (error) {
            console.log("error from token ", error)
        }

    } else {
        console.log('Must use physical device for Push Notifications');
    }
}
