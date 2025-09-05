// import { AntDesign, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
// import { Link, useRouter } from 'expo-router';
// import React, { useState } from 'react';
// // import Toast from 'react-native-toast-message';

// import { PRIMARY_COLOR } from '@/lib/constants';
// import { Post } from '@/services/api/api';
// import { API_USER_REGISTRATION } from '@/services/api/endpoints';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import {
//   SafeAreaView,
//   ScrollView,
//   StyleSheet,
//   Text,
//   TextInput,
//   ToastAndroid,
//   TouchableOpacity,
//   View
// } from 'react-native';
// import { useAuth } from '../context/useAuth';

// export default function RegisterScreen() {
//   const [name, setName] = useState('');
//   const [email, setEmail] = useState('');
//   const [phone, setPhone] = useState('');
//   const [password, setPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');
//   const [passwordVisible, setPasswordVisible] = useState(false);
//   const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');

//   const router = useRouter();

//   const { register } = useAuth();

//   const handleRegister = async () => {

//     setLoading(true)
//     if (password !== confirmPassword) {
//       ToastAndroid.show('Passwords and do not match', ToastAndroid.TOP);
//       // Toast.show({
//       //   type: 'error',
//       //   text1: 'Error',
//       //   text2: 'Passwords do not match',
//       // });
//       setLoading(false);
//       return
//     }

//     const registerData = { full_name: name, email, password, phone };

//     if (!name || !email || !password || !confirmPassword) {
//       setLoading(false);
//       return;
//     }

//     try {
//       const response = await Post(`${API_USER_REGISTRATION}`, registerData);

//       if (response.success) {
//         await AsyncStorage.setItem('email', response?.data?.email);
//         router.push('/verify-otp')
//       }

//     } catch (error) {
//       ToastAndroid.show('Something went wrong! Try again.', ToastAndroid.SHORT)
//       setLoading(false);
//       console.log(error)
//     }
//   };

//   return (
//     <SafeAreaView style={styles.safeArea}>
//       <ScrollView contentContainerStyle={styles.container}>
//         <Text style={styles.title}>Hi, Welcome <Text style={styles.wave}>👋</Text></Text>
//         <Text style={styles.subtitle}>
//           You can search course, apply course and find{"\n"}
//           scholarship for abroad studies
//         </Text>

//         {/* Name */}
//         <View style={styles.inputContainer}>
//           <Feather name="user" size={20} style={styles.icon} />
//           <TextInput
//             placeholder="Enter your name"
//             style={styles.input}
//             value={name}
//             onChangeText={setName}
//           />
//         </View>

//         {/* Email */}
//         <View style={styles.inputContainer}>
//           <MaterialCommunityIcons name="email-outline" size={20} style={styles.icon} />
//           <TextInput
//             placeholder="Enter your email"
//             style={styles.input}
//             keyboardType="email-address"
//             value={email}
//             onChangeText={setEmail}
//           />
//         </View>
//         <View style={styles.inputContainer}>
//           <MaterialCommunityIcons name="phone-outline" size={20} style={styles.icon} />
//           <TextInput
//             placeholder="Enter your phone"
//             style={styles.input}
//             keyboardType="phone-pad"
//             value={phone}
//             onChangeText={setPhone}
//           />
//         </View>

//         {/* Password */}
//         <View style={styles.inputContainer}>
//           <Feather name="lock" size={20} style={styles.icon} />
//           <TextInput
//             placeholder="Enter your password"
//             secureTextEntry={!passwordVisible}
//             style={styles.input}
//             value={password}
//             onChangeText={setPassword}
//           />
//           <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)}>
//             <Feather name={passwordVisible ? 'eye' : 'eye-off'} size={20} style={styles.iconRight} />
//           </TouchableOpacity>
//         </View>
//         <Text style={styles.helperText}>must be 8 characters</Text>

//         {/* Confirm Password */}
//         <View style={styles.inputContainer}>
//           <Feather name="lock" size={20} style={styles.icon} />
//           <TextInput
//             placeholder="Confirm your password"
//             secureTextEntry={!confirmPasswordVisible}
//             style={styles.input}
//             value={confirmPassword}
//             onChangeText={setConfirmPassword}
//           />
//           <TouchableOpacity onPress={() => setConfirmPasswordVisible(!confirmPasswordVisible)}>
//             <Feather name={confirmPasswordVisible ? 'eye' : 'eye-off'} size={20} style={styles.iconRight} />
//           </TouchableOpacity>
//         </View>
//         <Text style={styles.helperText}>must be 8 characters</Text>

//         {/* Register Button */}
//         <TouchableOpacity
//           //  disabled={loading}
//           onPress={handleRegister} style={styles.registerButton}>
//           <Text style={styles.registerButtonText}>{loading ? "Loading..." : "Register"}</Text>
//         </TouchableOpacity>

//         {/* Divider */}
//         <View style={styles.dividerContainer}>
//           <View style={styles.divider} />
//           <Text style={styles.registerWithText}>Register with</Text>
//           <View style={styles.divider} />
//         </View>

//         {/* Social Buttons */}
//         <View style={styles.socialContainer}>
//           <TouchableOpacity style={styles.socialButton}>
//             <Feather name="phone" size={18} color={PRIMARY_COLOR} />
//             <Text style={styles.socialButtonText}>Phone Number</Text>
//           </TouchableOpacity>
//           <TouchableOpacity style={styles.socialButton}>
//             <AntDesign name="google" size={18} color={PRIMARY_COLOR} />
//             <Text style={styles.socialButtonText}>Google</Text>
//           </TouchableOpacity>
//         </View>

//         {/* Login Link */}
//         <Link style={{marginTop:20}} href={'/login'}>
//           <Text style={styles.loginText}>
//             Have an account? <Text style={styles.loginLink}>Login</Text>
//           </Text>
//         </Link>
//       </ScrollView>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   safeArea: {
//     flex: 1,
//     backgroundColor: '#fff',
//   },
//   container: {
//     padding: 24,
//     alignItems: 'center',
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginTop: 20,
//     color: '#000',
//   },
//   wave: {
//     fontSize: 24,
//   },
//   subtitle: {
//     textAlign: 'center',
//     fontSize: 13,
//     color: '#666',
//     marginVertical: 16,
//   },
//   inputContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     borderColor: '#ddd',
//     borderWidth: 1,
//     borderRadius: 8,
//     marginBottom: 10,
//     paddingHorizontal: 12,
//     paddingVertical: 10,
//     width: '100%',
//     backgroundColor: '#f9f9f9',
//   },
//   icon: {
//     marginRight: 8,
//     color: '#888',
//   },
//   iconRight: {
//     marginLeft: 8,
//     color: '#888',
//   },
//   input: {
//     flex: 1,
//     fontSize: 14,
//   },
//   helperText: {
//     fontSize: 12,
//     color: '#888',
//     alignSelf: 'flex-start',
//     marginBottom: 10,
//     marginLeft: 4,
//   },
//   registerButton: {
//     backgroundColor: PRIMARY_COLOR,
//     borderRadius: 8,
//     paddingVertical: 14,
//     alignItems: 'center',
//     width: '100%',
//     marginTop: 10,
//   },
//   registerButtonText: {
//     color: '#fff',
//     fontWeight: 'bold',
//     fontSize: 16,
//   },
//   dividerContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginVertical: 20,
//   },
//   divider: {
//     flex: 1,
//     height: 1,
//     backgroundColor: '#ddd',
//   },
//   registerWithText: {
//     marginHorizontal: 10,
//     color: '#888',
//     fontSize: 13,
//   },
//   socialContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     width: '100%',
//     gap: 10,
//   },
//   socialButton: {
//     flex: 1,
//     flexDirection: 'row',
//     borderWidth: 1,
//     borderColor: PRIMARY_COLOR,
//     borderRadius: 8,
//     alignItems: 'center',
//     justifyContent: 'center',
//     padding: 12,
//     backgroundColor: '#fff',
//     gap: 6,
//   },
//   socialButtonText: {
//     fontSize: 13,
//     color: PRIMARY_COLOR
//   },
//   loginText: {
//     marginTop: 30,
//     fontSize: 13,
//     color: '#333',
//   },
//   loginLink: {
//     color: PRIMARY_COLOR,
//     fontWeight: '600',
//   },
// });
