import { API_BASE_URL } from '@/constants/api-url';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import * as AppleAuthentication from 'expo-apple-authentication';

class AuthService {
  constructor() {
    this.initializeGoogleSignIn();
  }

  // Initialize Google Sign-In
  initializeGoogleSignIn() {
    GoogleSignin.configure({
      webClientId:
        '447938351048-8nnq6optf12q3qh4ou3792v1v0usg0dd.apps.googleusercontent.com', // From Google Console, take the Client ID
      iosClientId:
        '169494258933-8pulsl2th2ot5jrkn8f0b56f7cgiuheh.apps.googleusercontent.com', // Optional, auto-detected from GoogleService-Info.plist
      scopes: ['profile', 'email'],
      offlineAccess: true,
    });
  }

  async signInWithGoogle() {
    try {
      await GoogleSignin.hasPlayServices();
      let userInfo: any = await GoogleSignin.signIn();
      userInfo = userInfo.data;

      const tokens = await GoogleSignin.getTokens();

      const authResult = await this.authenticateWithBackend({
        provider: 'google',
        accessToken: tokens.accessToken,
        idToken: tokens.idToken,
        user: {
          id: userInfo.user.id,
          email: userInfo.user.email,
          name: userInfo.user.name,
          picture: userInfo.user.photo,
          givenName: userInfo.user.givenName,
          familyName: userInfo.user.familyName,
        },
      });

      return authResult;

    } catch (error: any) {
      console.log('Detailed error:', error.code, error.message);
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // operation (e.g. sign in) is in progress already
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // play services not available or outdated
      } else {
        // some other error happened
      }
    }
  }

  async signOutGoogle() {
    try {
      await GoogleSignin.signOut();
    } catch (error) {
      console.error('Google Sign-Out Error:', error);
    }
  }

  async isGoogleSignedIn() {
    try {
      return await GoogleSignin.isSignedIn();
    } catch (error) {
      console.error('Error checking Google sign-in status:', error);
      return false;
    }
  }

  async getCurrentGoogleUser() {
    try {
      const userInfo = await GoogleSignin.signInSilently();
      return userInfo;
    } catch (error) {
      console.error('Error getting current Google user:', error);
      return null;
    }
  }

  async signInWithApple() {
    try {
      const isAvailable = await AppleAuthentication.isAvailableAsync();
      if (!isAvailable) {
        throw new Error('Apple Sign-In is not available on this device');
      }

      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });

      if (!credential.identityToken) {
        throw new Error('Apple Sign-In failed: No identity token received');
      }

      const authResult = await this.authenticateWithBackend({
        provider: 'apple',
        idToken: credential.identityToken,
        user: {
          id: credential.user,
          email: credential.email,
          givenName: credential?.fullName?.givenName,
          familyName: credential?.fullName?.familyName,
        },
      });

      return authResult;
    } catch (error: any) {
      if (error.code === 'ERR_CANCELED') {
        console.log('User cancelled Apple sign-in');
        return null;
      } else {
        throw error;
      }
    }
  }

  async authenticateWithBackend(socialData: any) {
    try {
      const payload = {
        idToken: socialData.idToken || socialData.identityToken,
        provider: socialData.provider,
        firstName:
          socialData.user.givenName ||
          socialData.user.fullName?.givenName ||
          '',
        lastName:
          socialData.user.familyName ||
          socialData.user.fullName?.familyName ||
          '',
      };

      const url = `${API_BASE_URL}auth/social-login`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        if (response.status === 400) {
          const result = await response.json();
          throw new Error(result.message);
        } else {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Backend authentication error:', error);
      throw error;
    }
  }
}

export default new AuthService();
