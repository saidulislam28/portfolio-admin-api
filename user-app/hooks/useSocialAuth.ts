// hooks/useSocialAuth.ts
import { useState, useEffect } from 'react';
import * as Google from "expo-auth-session/providers/google";
import * as Facebook from "expo-auth-session/providers/facebook";
import * as WebBrowser from "expo-web-browser";
import { Alert } from 'react-native';
import { useRouter } from "expo-router";
import { useAuth } from "@/context/useAuth";
import { ROUTES } from '@/constants/app.routes';

// Complete the auth session for web browsers
WebBrowser.maybeCompleteAuthSession();

export const useSocialAuth = () => {
    const router = useRouter();
    const { login } = useAuth();
    const [socialLoading, setSocialLoading] = useState<'google' | 'facebook' | null>(null);

    // Google Auth Configuration
    const [googleRequest, googleResponse, googlePromptAsync] = Google.useAuthRequest({
        iosClientId: "YOUR_IOS_CLIENT_ID.apps.googleusercontent.com",
        androidClientId: "447938351048-0qp70mkt8h8nfkuvoiu85g76drcfh19d.apps.googleusercontent.com",
        webClientId: "YOUR_WEB_CLIENT_ID.apps.googleusercontent.com",
    });

    // Facebook Auth Configuration
    const [facebookRequest, facebookResponse, facebookPromptAsync] = Facebook.useAuthRequest({
        clientId: "YOUR_FACEBOOK_APP_ID",
    });


    console.log("google response ", googleResponse?.type)

    // Handle Google Authentication Response
    useEffect(() => {
        if (googleResponse?.type === "success") {
            handleGoogleSignIn(googleResponse.authentication?.accessToken);
        } else if (googleResponse?.type === "error") {
            setSocialLoading(null);
            Alert.alert("Error", "Google sign-in failed");
        } else if (googleResponse?.type === "cancel") {
            setSocialLoading(null);
        }
    }, [googleResponse]);

    // Handle Facebook Authentication Response
    useEffect(() => {
        if (facebookResponse?.type === "success") {
            handleFacebookSignIn(facebookResponse.authentication?.accessToken);
        } else if (facebookResponse?.type === "error") {
            setSocialLoading(null);
            Alert.alert("Error", "Facebook sign-in failed");
        } else if (facebookResponse?.type === "cancel") {
            setSocialLoading(null);
        }
    }, [facebookResponse]);

    // Function to handle social login API call
    const socialLogin = async (socialData: {
        email: string;
        name: string;
        profilePicture?: string;
        provider: 'google' | 'facebook';
        providerId: string;
        accessToken: string;
    }) => {
        try {
            // Replace this with your actual social login API endpoint
            const response = await fetch('https://f33595f4d7bf.ngrok-free.app/auth/social-login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(socialData),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || 'Social login failed');
            }

            return { success: true, data: result.data };
        } catch (error: any) {
            return { success: false, error: error.message };
        }
    };

    const handleGoogleSignIn = async (accessToken: string | undefined) => {
        if (!accessToken) {
            setSocialLoading(null);
            Alert.alert("Error", "Failed to get Google access token");
            return;
        }

        try {
            // Fetch user info from Google
            const userInfoResponse = await fetch(
                `https://www.googleapis.com/oauth2/v2/userinfo?access_token=${accessToken}`
            );
            const userInfo = await userInfoResponse.json();

            if (!userInfo.email) {
                throw new Error("Failed to get user email from Google");
            }

            // Send Google auth data to your backend
            const result = await socialLogin({
                email: userInfo.email,
                name: userInfo.name,
                profilePicture: userInfo.picture,
                provider: 'google',
                providerId: userInfo.id,
                accessToken: accessToken,
            });

            if (result.success) {
                login(result.data, result.data.token);
                router.push(ROUTES.HOME as any);
            } else {
                Alert.alert("Error", result.error || "Google sign-in failed");
            }
        } catch (error: any) {
            console.error("Google sign-in error:", error);
            Alert.alert("Error", error.message || "Google sign-in failed");
        } finally {
            setSocialLoading(null);
        }
    };

    const handleFacebookSignIn = async (accessToken: string | undefined) => {
        if (!accessToken) {
            setSocialLoading(null);
            Alert.alert("Error", "Failed to get Facebook access token");
            return;
        }

        try {
            // Fetch user info from Facebook
            const userInfoResponse = await fetch(
                `https://graph.facebook.com/me?access_token=${accessToken}&fields=id,name,email,picture.type(large)`
            );
            const userInfo = await userInfoResponse.json();

            if (!userInfo.email) {
                throw new Error("Failed to get user email from Facebook");
            }

            // Send Facebook auth data to your backend
            const result = await socialLogin({
                email: userInfo.email,
                name: userInfo.name,
                profilePicture: userInfo.picture?.data?.url,
                provider: 'facebook',
                providerId: userInfo.id,
                accessToken: accessToken,
            });

            if (result.success) {
                login(result.data, result.data.token);
                router.push(ROUTES.HOME as any);
            } else {
                Alert.alert("Error", result.error || "Facebook sign-in failed");
            }
        } catch (error: any) {
            console.error("Facebook sign-in error:", error);
            Alert.alert("Error", error.message || "Facebook sign-in failed");
        } finally {
            setSocialLoading(null);
        }
    };

    const signInWithGoogle = async () => {
        setSocialLoading('google');
        try {
            await googlePromptAsync();
        } catch (error) {
            setSocialLoading(null);
            console.error("Google sign-in error:", error);
            Alert.alert("Error", "Failed to initiate Google sign-in");
        }
    };

    const signInWithFacebook = async () => {
        setSocialLoading('facebook');
        try {
            await facebookPromptAsync();
        } catch (error) {
            setSocialLoading(null);
            console.error("Facebook sign-in error:", error);
            Alert.alert("Error", "Failed to initiate Facebook sign-in");
        }
    };

    return {
        // Loading states
        socialLoading,
        isGoogleLoading: socialLoading === 'google',
        isFacebookLoading: socialLoading === 'facebook',

        // Functions
        signInWithGoogle,
        signInWithFacebook,

        // Raw responses (if needed)
        googleResponse,
        facebookResponse,
    };
};