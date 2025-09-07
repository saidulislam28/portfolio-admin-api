// app/onboarding.tsx
import React from "react";
import { View, StyleSheet, StatusBar } from "react-native";
import { router } from "expo-router";
import { useOnboardingCheck } from "@/hooks/useOnboardingCheck";
import { BACKGROUND_COLOR, PRIMARY_COLOR } from "@/lib/constants";
import { Platform } from "react-native";
import { ROUTES } from "@/constants/app.routes";
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
      {/* <Onboarding
        pages={onboardingData.map((item) => ({
          backgroundColor: BACKGROUND_COLOR,
          image: <OnboardingSlide item={item} />,
        }))}
        onDone={handleOnboardingComplete}
        onSkip={handleSkip}
        containerStyles={styles.onboardingContainer}
        imageContainerStyles={styles.slideContainer}
        allowFontScaling={false}
        pageIndexCallback={(index) => {
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
      /> */}
    </View>
  );
}

const styles = StyleSheet.create({
  // container: {
  //   flex: 1,
  // },
  container: {
    flex: 1,
    // backgroundColor: '#fff',
    backgroundColor: BACKGROUND_COLOR,
    position: "relative",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    paddingHorizontal: 16,
  },
  onboardingContainer: {
    flex: 1,
  },
  slideContainer: {
    flex: 1,
    paddingHorizontal: 0,
  },
});
