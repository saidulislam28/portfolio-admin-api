// import * as Notifications from 'expo-notifications';
// import { router } from 'expo-router';

// // Set the notification handler
// Notifications.setNotificationHandler({
//   handleNotification: async () => ({
//     shouldShowAlert: true,
//     shouldPlaySound: true,
//     shouldSetBadge: true,
//   }),
// });

// // Configure how notifications are displayed when app is in foreground
// Notifications.setNotificationCategoryAsync('default', [
//   {
//     buttonTitle: 'Open',
//     identifier: 'open',
//     options: {
//       opensAppToForeground: true,
//     },
//   },
// ]);

// // Listen for notification responses (when user taps on notification)
// const handleNotificationResponse = (response: Notifications.NotificationResponse) => {
//   const data = response.notification.request.content.data;
  
//   if (data?.screen) {
//     router.push(data?.screen as string);    
//   }
// };

// // Subscribe to notification events
// const subscription = Notifications.addNotificationResponseReceivedListener(handleNotificationResponse);

// // Function to register for push notifications
// export const registerForPushNotifications = async () => {
//   const { status: existingStatus } = await Notifications.getPermissionsAsync();
//   let finalStatus = existingStatus;
  
//   if (existingStatus !== 'granted') {
//     const { status } = await Notifications.requestPermissionsAsync();
//     finalStatus = status;
//   }
  
//   if (finalStatus !== 'granted') {
//     console.log('Failed to get push token for push notification!');
//     return null;
//   }
  
//   try {
//     const token = (await Notifications.getExpoPushTokenAsync()).data;
//     console.log('Expo push token:', token);
//     return token;
//   } catch (error) {
//     console.log('Error getting push token:', error);
//     return null;
//   }
// };

// // Function to handle background/foreground notifications
// export const setupNotificationListeners = () => {
//   // Foreground notifications
//   Notifications.addNotificationReceivedListener(notification => {
//     console.log('Notification received in foreground:', notification);
//     // You can handle foreground notifications here if needed
//   });
  
//   // Background notifications are handled by the response listener above
// };

// // Cleanup subscription when needed
// export const cleanupNotifications = () => {
//   subscription.remove();
// };