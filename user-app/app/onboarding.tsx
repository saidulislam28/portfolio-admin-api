// app/onboarding.tsx
import { OnboardingSlide } from "@/components/onboarding/Onboarding-slide";
import { onboardingData } from "@/components/onboarding/onboarding-data";
import { ROUTES } from "@/constants/app.routes";
import { useOnboardingCheck } from "@/hooks/useOnboardingCheck";
import { BACKGROUND_COLOR, PRIMARY_COLOR } from "@/lib/constants";
import { router } from "expo-router";
import React from "react";
import { StatusBar, StyleSheet, View } from "react-native";
import Onboarding from "react-native-onboarding-swiper";

export default function OnboardingScreen() {
  const { markOnboardingComplete } = useOnboardingCheck();

  const handleOnboardingComplete = async () => {
    try {
      // Mark onboarding as completed
      await markOnboardingComplete();
      // Navigate back to let the layout handle auth flow
      router.replace(ROUTES.HOME);
    } catch (error) {
      console.error("Error saving onboarding completion:", error);
      router.replace(ROUTES.HOME); // Navigate anyway
    }
  };

  const handleSkip = async () => {
    await handleOnboardingComplete();
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={BACKGROUND_COLOR} />
      <Onboarding
        pages={onboardingData?.map((item) => ({
          backgroundColor: BACKGROUND_COLOR,
          image: <OnboardingSlide item={item} />,
        }))}
        onDone={handleOnboardingComplete}
        onSkip={handleSkip}
        containerStyles={styles.onboardingContainer}
        imageContainerStyles={styles.slideContainer}
        allowFontScaling={false}
        pageIndexCallback={(index: any) => {
          // Optional: track which page user is on
          console.log("Current page:", index);
        }}
        controlStatusBar={false}
        flatlistProps={{
          showsHorizontalScrollIndicator: false,
        }}
        bottomBarHeight={80}
        bottomBarColor={BACKGROUND_COLOR}
        controlBtnColor={PRIMARY_COLOR}
        skipBtnLabel="Skip"
        nextBtnLabel="Next"
        doneBtnLabel="Get Started"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BACKGROUND_COLOR,
  },
  onboardingContainer: {
    flex: 1,
  },
  slideContainer: {
    flex: 1,
    paddingHorizontal: 0,
  },
});
