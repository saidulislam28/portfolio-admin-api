import { useAuth } from '@/app/context/useAuth';
import smLogo from '@/assets/images/smlogo.png';
import { PRIMARY_COLOR } from '@/lib/constants';
import { Feather, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function PreHeader() {
  const { user, isLoading }: any = useAuth();
  const router = useRouter();

  if (isLoading) {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  }
  // console.log("user", user)
  return (
    <View style={styles.header}>
      <View style={styles.profileContainer}>
        <View style={styles.profileImageContainer}>
          {/* <Feather name="user" size={18} color={'black'} /> */}
          <Image source={smLogo} style={styles.logo} />
        </View>
        < >
          {
            user ?
              <View style={styles.loginButton}>
                <Text style={styles.loginButtonText}>
                  {user?.full_name}
                </Text>
              </View>
              :
              <TouchableOpacity onPress={() => router.replace('/login')}>
                <View style={styles.loginButton}>
                  <Text style={styles.loginButtonText}>
                    Login
                  </Text>
                </View>
              </TouchableOpacity>
          }
        </>
      </View>

      <View style={styles.rightContainer}>
        {/* <Ionicons name="notifications" size={24} color={PRIMARY_COLOR} /> */}
        {/* <TouchableOpacity onPress={()=> router.push('/cart')} style={styles.CartContainer}>
          <Ionicons name="cart-outline" size={24} style={styles.cartIcon} color={PRIMARY_COLOR} />
          <Text style={styles.CartCount}>{totalItems ?? 0}</Text>
        </TouchableOpacity> */}


        {
          user ? <>
            {
              user?.profile_image ?
                (<Image source={{ uri: user?.profile_image }} style={styles.logo} />) : (
                  <View style={styles.profileImageContainer}>
                    <Feather name="user" size={18} color={'black'} />
                  </View>
                )
            }
          </> : (null)
        }




      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20
  },
  rightContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    flexDirection: "row",

  },
  profileContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8

  },
  profileImageContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileImageText: {
    color: 'black',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loginButton: {
    borderRadius: 8,
    backgroundColor: PRIMARY_COLOR,
    paddingVertical: 8,
    paddingHorizontal: 16

  },
  loginButtonText: {
    fontSize: 14,
    fontWeight: 400,
    textAlign: 'center',
    color: 'white',
    alignSelf: 'center',
  },
  logo: {
    height: 48,
    width: 48,
    borderRadius: 24,
  },
  CartContainer: {
    position: 'relative',
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartIcon: {

  },
  CartCount: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: PRIMARY_COLOR,
    color: 'white',
    borderRadius: 10,
    paddingHorizontal: 5,
    fontSize: 14,
    minWidth: 18,
    textAlign: 'center',
    overflow: 'hidden',
  },


})
