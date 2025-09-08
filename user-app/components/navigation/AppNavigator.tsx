// components/navigation/AppNavigator.tsx
import React, { useEffect } from 'react';
import { Stack, router } from 'expo-router';
import { useAuth } from '@/context/useAuth'; // Adjust import path as needed
import { useOnboardingCheck } from '@/hooks/useOnboardingCheck';
import { LoadingScreen } from '@/app/_layout';
import { ROUTES } from '@/constants/app.routes';

export const AppNavigator = () => {
  const { isCheckingOnboarding, hasCompletedOnboarding } = useOnboardingCheck();
  const { user, isLoading: isAuthLoading } = useAuth(); // Adjust based on your auth context structure

  useEffect(() => {
    // Only handle navigation after onboarding check is complete
    if (!isCheckingOnboarding) {
      handleNavigation();
    }
  }, [isCheckingOnboarding, hasCompletedOnboarding, isAuthLoading, user]);

  const handleNavigation = () => {
    // First check: Has user completed onboarding?
    if (!hasCompletedOnboarding) {
      return;
    }

    // Skip auth loading navigation if we're still checking auth
    if (isAuthLoading) {
      return;
    }

    // Second check: Is user authenticated?
    if (user) {
      // User is authenticated, go to main app
      router.replace(ROUTES.TABS);
    } else {
      // User is not authenticated, go to auth screens
      router.replace(ROUTES.LOGIN); // Adjust this route based on your auth screen
    }
  };

  // Show loading while checking onboarding or auth
  if (isCheckingOnboarding || (hasCompletedOnboarding && isAuthLoading)) {
    return <LoadingScreen />;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false
      }}
    >
      <Stack.Screen
        name='onboarding'
        options={{
          headerShown: false
        }}
      />
      <Stack.Screen
        name='(tabs)'
        options={{
          headerShown: false
        }}
      />
      <Stack.Screen
        name='auth'
        options={{
          headerShown: false
        }}
      />
    </Stack>
  );
};