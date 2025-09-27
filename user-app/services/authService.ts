import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import { socialLogin } from '@sm/common';

class AuthService {
  constructor() {
    this.initializeGoogleSignIn();
  }

  // Initialize Google Sign-In
  initializeGoogleSignIn() {
    GoogleSignin.configure({
      webClientId:
        '447938351048-8nnq6optf12q3qh4ou3792v1v0usg0dd.apps.googleusercontent.com', // From Google Console, take the Client ID
      // iosClientId:
      //   '169494258933-8pulsl2th2ot5jrkn8f0b56f7cgiuheh.apps.googleusercontent.com', // Optional, auto-detected from GoogleService-Info.plist
      scopes: ['profile', 'email'],
      offlineAccess: true,
    });
  }

  async signInWithGoogle() {
    try {
      await GoogleSignin.hasPlayServices();
      let userInfo: any = await GoogleSignin.signIn();
      userInfo = userInfo.data;

      console.log('AuthService, SignInWithGoogle, got data from google', userInfo);

      const tokens = await GoogleSignin.getTokens();

      const authResult = await this.authenticateWithBackend({
        provider: 'google',
        accessToken: tokens.accessToken,
        idToken: tokens.idToken,
        user: {
          id: userInfo.user.id,
          email: userInfo.user.email,
          name: userInfo.user.name,
          photo: userInfo.user.photo,
          givenName: userInfo.user.givenName,
          familyName: userInfo.user.familyName,
        },
      });

      return authResult;

    } catch (error: any) {
      console.log('AuthService, signInWithGoogle, Detailed error:', error.code, error.message);
      throw error;
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

  async authenticateWithBackend(socialData: any) {
    const payload = {
      token: socialData.idToken,
      provider: socialData.provider,
      full_name: socialData?.user?.name,
      email: socialData?.user?.email,
      profile_image: socialData?.user?.photo,
    };

    const response = await socialLogin(payload);

    return response;
    // try {
    //   const payload = {
    //     token: socialData.idToken,
    //     provider: socialData.provider,
    //     full_name: socialData?.user?.name,
    //     email: socialData?.user?.email,
    //     profile_image: socialData?.user?.photo,
    //   };

    //   const response = await socialLogin(payload);

    //   return response;

    // } catch (error: any) {
    //   console.error('Backend authentication error:', error);

    //   // Handle Axios error structure
    //   if (error.response) {
    //     // Server responded with error status (4xx, 5xx)
    //     const status = error.response.status;
    //     const message = error.response.data?.message || `HTTP error! status: ${status}`;

    //     if (status === 400) {
    //       throw new Error(message);
    //     } else {
    //       throw new Error(message);
    //     }
    //   } else if (error.request) {
    //     // Request was made but no response received
    //     throw new Error('No response received from server');
    //   } else {
    //     // Something else happened
    //     throw new Error(error.message || 'Unknown error occurred');
    //   }
    // }
  }
}

export default new AuthService();
