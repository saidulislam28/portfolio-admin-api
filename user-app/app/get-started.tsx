// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   StyleSheet,
//   Image,
//   KeyboardAvoidingView,
//   Platform,
//   Alert,
//   SafeAreaView,
// } from 'react-native';
// import { useRouter } from 'expo-router';
// // import { useLanguage } from '@/hooks/useLanguage';
// import {
//   GoogleSigninButton,
//   AppleSigninButton,
//   EmailSigninButton,
// } from '@/components/LoginButtons';
// import { useAuth } from '@/hooks/useAuth';
// import { ROUTES } from '@/constants/app.routes';
// import { COLORS } from '@sm/common';

// export default function GetStartedScreen() {
//   const [showEmailOption, setShowEmailOption] = useState(false);
//   const [isGoogleLoading, setIsGoogleLoading] = useState(false);
//   const [isAppleLoading, setIsAppleLoading] = useState(false);

//   const { signInWithApple, signInWithGoogle } = useAuth();
//   const router = useRouter();
//   // const { t } = useLanguage();

//   const handleGoogleSignIn = async () => {
//     try {
//       setIsGoogleLoading(true);
//       await signInWithGoogle();
//       router.replace(ROUTES.HOME as any);
//     } finally {
//       setIsGoogleLoading(false);
//     }
//   };

//   const handleAppleSignIn = async () => {
//     try {
//       setIsAppleLoading(true);
//       const result = await signInWithApple();

//       if (result === null) {
//         return;
//       }

//       router.replace(ROUTES.HOME as any);
//     } catch (error: any) {
//       console.error('Apple Sign-In failed:', error.message);
//       Alert.alert(`Apple Sign-In failed: ${error.message}`);
//     } finally {
//       setIsAppleLoading(false);
//     }
//   };

//   return (
//     <SafeAreaView backgroundColor={COLORS.WHITE}>
//       <KeyboardAvoidingView
//         style={styles.container}
//         behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//       >
//         <View style={styles.content}>
//           <Image
//             source={require('@/assets/images/get-started/welcome-hero.png')}
//             style={styles.heroImage}
//             resizeMode="cover"
//           />

//           <Text style={styles.title}>{t('get-started.title')}</Text>
//           <Text style={styles.subtitle}>{t('get-started.subtitle')}</Text>

//           <GoogleSigninButton
//             onPress={handleGoogleSignIn}
//             isLoading={isGoogleLoading}
//           />

//           {Platform.OS === 'ios' && (
//             <AppleSigninButton
//               onPress={handleAppleSignIn}
//               isLoading={isAppleLoading}
//             />
//           )}

//           {!showEmailOption && (
//             <TouchableOpacity
//               style={styles.viewMoreButton}
//               onPress={() => setShowEmailOption(true)}
//               testID="view-more-button"
//             >
//               <Text style={styles.viewMoreText}>
//                 {t('get-started.viewMore')}
//               </Text>
//             </TouchableOpacity>
//           )}

//           {showEmailOption && (
//             <EmailSigninButton
//               onPress={() => router.push(ROUTES.LOGIN as any)}
//             />
//           )}

//           <Text style={styles.termsText}>
//             {t('get-started.termsAndConditions')}
//             <Text
//               style={{ color: COLORS.PRIMARY_COLOR }}
//               // onPress={() => router.push(ROUTES.termsOfService as any)}
//             >
//               {t('get-started.termsText')}
//             </Text>
//             {t('get-started.middle')}
//             <Text
//               style={{ color: COLORS.PRIMARY_COLOR }}
//               // onPress={() => router.push(ROUTES.privacyPolicy as any)}
//             >
//               {t('get-started.privacyPolicy')}
//             </Text>
//           </Text>
//         </View>
//       </KeyboardAvoidingView>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     backgroundColor: '#FFFFFF',
//     flex: 1,
//   },
//   content: {
//     flex: 1,
//     justifyContent: 'center',
//     padding: 24,
//   },
//   heroImage: {
//     borderRadius: 12,
//     height: 280,
//     marginBottom: 32,
//     width: '100%',
//   },
//   subtitle: {
//     color: '#677171',
//     fontSize: 14,
//     lineHeight: 24,
//     marginBottom: 32,
//     paddingHorizontal: 24,
//     textAlign: 'center',
//   },
//   termsText: {
//     color: '#4A5568',
//     fontSize: 14,
//     lineHeight: 18,
//     marginTop: 24,
//     paddingHorizontal: 24,
//     textAlign: 'center',
//   },
//   title: {
//     color: '#1A202C',
//     fontSize: 28,
//     fontWeight: 'bold',
//     marginBottom: 16,
//     textAlign: 'center',
//   },
//   viewMoreButton: {
//     alignItems: 'center',
//     height: 50,
//     justifyContent: 'center',
//     marginBottom: 16,
//   },
//   viewMoreText: {
//     borderBottomWidth: 1,
//     color: '#030712',
//     fontSize: 18,
//     fontWeight: '600',
//     paddingBottom: 2,
//   },
// });
