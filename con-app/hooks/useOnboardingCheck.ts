// hooks/useOnboardingCheck.ts
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useOnboardingCheck = () => {
  const [isCheckingOnboarding, setIsCheckingOnboarding] = useState(true);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);

  useEffect(() => {
    checkOnboardingStatus();
  }, []);

  const checkOnboardingStatus = async () => {
    try {
      const onboardingCompleted = await AsyncStorage.getItem(
        'onboarding_completed'
      );
      setHasCompletedOnboarding(onboardingCompleted === 'true');
    } catch (error) {
      console.error('Error checking onboarding status:', error);
      // Default to showing onboarding if there's an error
      setHasCompletedOnboarding(false);
    } finally {
      setIsCheckingOnboarding(false);
    }
  };

  const markOnboardingComplete = async () => {
    try {
      await AsyncStorage.setItem('onboarding_completed', 'true');
      setHasCompletedOnboarding(true);
    } catch (error) {
      console.error('Error marking onboarding as complete:', error);
    }
  };

  return {
    isCheckingOnboarding,
    hasCompletedOnboarding,
    markOnboardingComplete,
  };
};
