import { RootState } from '@/store';
import { SocialLoginResponse } from '@/types/auth';

import { useCallback } from 'react';
import authService from './authService';
import { useAuth as userUseAuth } from '@/context/useAuth';

export const useAuth = () => {
  const { user, isLoading, token } = userUseAuth();

  const signInWithGoogle = useCallback(async () => {
    try {
      const result: SocialLoginResponse = await authService.signInWithGoogle();

      console.log("result from google auth", result);

      // dispatch(
      //   loginSuccess({
      //     user: result.userData,
      //     accessToken: result.tokens.accessToken,
      //     refreshToken: result.tokens.refreshToken,
      //   })
      // );

      return result;
    } catch (error:any) {
      console.log('Google sign-in error:', error);
      console.error("Error details:", error.response?.data || error.message);

      throw error;
    }
  }, []);

  // const signInWithApple = useCallback(async () => {
  //   try {
  //     dispatch(setLoading(true));

  //     const result = await authService.signInWithApple();

  //     if (result === null) {
  //       dispatch(setLoading(false));
  //       return null;
  //     }

  //     // backend returns uesrData as the prop
  //     const userData = result.userData;
  //     const tokens = result.tokens;

  //     if (userData && tokens?.accessToken && tokens?.refreshToken) {
  //       dispatch(
  //         loginSuccess({
  //           user: userData,
  //           accessToken: tokens.accessToken,
  //           refreshToken: tokens.refreshToken,
  //         })
  //       );
  //       dispatch(setLoading(false));
  //       return result;
  //     } else {
  //       dispatch(setLoading(false));
  //       throw new Error('Apple Sign-In completed but returned incomplete data');
  //     }
  //   } catch (error) {
  //     console.log('Apple sign-in error:', error);
  //     dispatch(setLoading(false));
  //     throw error;
  //   }
  // }, [dispatch]);



  return {
    user,
    isLoading,
    signInWithGoogle
  };
};
