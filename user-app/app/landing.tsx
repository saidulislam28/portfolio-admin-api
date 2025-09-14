import { PRIMARY_COLOR } from "@/lib/constants";
import { useRouter } from "expo-router";
import React from "react";
import { Image } from "react-native";
import smLogo from "@/assets/images/smlogo.png";
import landingSvg from "@/assets/images/landing.png";
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { ROUTES } from "@/constants/app.routes";
import { BaseButton } from "@/components/BaseButton";

const LandingPage = () => {
  const router = useRouter();

  const handleGetStarted = () => {
    router.push(ROUTES.TABS);
  };

  const handleLogin = () => {
    router.push(ROUTES.LOGIN);
  };

  const handleRegister = () => {
    router.push(ROUTES.REGISTRATION);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />

      {/* Background circles */}
      <View style={styles.backgroundCircleLeft} />
      <View style={styles.backgroundCircleRight} />

      {/* Top App Icon */}
      <View style={styles.topIconContainer}>
        <View style={styles.appIconWrapper}>
          <View style={styles.appIcon}>
            <Image source={smLogo} style={styles.logo} />
          </View>
        </View>
      </View>

      {/* Main Content */}
      <View style={styles.mainContent}>
        {/* Illustration Container */}
        <View style={styles.illustrationContainer}>
          <Image source={landingSvg} style={styles.landingImage} />
        </View>

        {/* Title and Description */}
        <View style={styles.textContent}>
          <Text style={styles.cardTitle}>
            The Best Video Calling Speaking App
          </Text>
          <Text style={styles.description}>
            Speaking Mate helps you boost your English fluency by connecting you
            with real speaking partners for live, face-to-face practice anytime,
            anywhere.
          </Text>
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
      

          <BaseButton
            title="Get Started"
            onPress={handleGetStarted}
            disabled={false}
            fullWidth={false}
          />

          <View style={styles.secondaryButtonsRow}>
            <View style={{ flex: 1 }}>
              <BaseButton
                testID={'btn-login'}
                title="Login"
                onPress={handleLogin}
                disabled={false}
                variant="outline"
                fullWidth={false}
              />
            </View>
            <View style={{ flex: 1 }}>
              <BaseButton
                title="Register"
                onPress={handleRegister}
                disabled={false}
                variant="primary"
                fullWidth={false}
              />
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    position: "relative",
  },
  backgroundCircleLeft: {
    position: "absolute",
    top: 20,
    left: -50,
    width: 120,
    height: 150,
    borderRadius: 70,
    backgroundColor: "#AFDDFF",
    opacity: 0.6,
  },
  backgroundCircleRight: {
    position: "absolute",
    top: 250,
    right: -40,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#8CC63E",
    opacity: 0.6,
  },
  topIconContainer: {
    alignItems: "center",
    marginTop: 40,
    marginBottom: 20,
  },
  appIconWrapper: {
    position: "relative",
  },
  logo: {
    height: 75,
    width: 75,
  },
  appIcon: {
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  iconText: {
    fontSize: 40,
  },
  mainContent: {
    flex: 1,
    paddingHorizontal: 16,
    justifyContent: "space-between",
  },
  illustrationContainer: {
    alignItems: "center",
    marginTop: 20,
  },
  landingImage: {
    height: 234,
    width: 234,
  },
  illustrationBox: {
    width: 280,
    height: 280,
    backgroundColor: "#ffffff",
    borderRadius: 15,
    borderWidth: 2,
    borderColor: "#4A90E2",
    borderStyle: "dashed",
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  bookContainer: {
    position: "absolute",
    top: "35%",
    left: "35%",
  },
  book: {
    width: 80,
    height: 60,
    backgroundColor: "#FFA500",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  ukFlag: {
    width: 50,
    height: 30,
    backgroundColor: "#ffffff",
    borderRadius: 4,
    position: "relative",
    overflow: "hidden",
  },
  flagRed: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#ffffff",
  },
  flagBlue: {
    position: "absolute",
    top: "40%",
    left: 0,
    right: 0,
    height: "20%",
    backgroundColor: "#012169",
  },
  flagWhite: {
    position: "absolute",
    top: 0,
    left: "45%",
    width: "10%",
    bottom: 0,
    backgroundColor: "#ffffff",
  },
  speechBubble1: {
    position: "absolute",
    top: 40,
    left: 30,
    backgroundColor: "#FF6B6B",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  speechBubble2: {
    position: "absolute",
    top: 50,
    right: 30,
    backgroundColor: "#8B5CF6",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  speechBubble3: {
    position: "absolute",
    bottom: 60,
    left: 40,
    backgroundColor: "#FFA500",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  bubbleText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "600",
  },
  heart: {
    position: "absolute",
    top: 80,
    left: 80,
  },
  heartText: {
    fontSize: 20,
  },
  star: {
    position: "absolute",
    top: 120,
    right: 60,
  },
  starText: {
    fontSize: 16,
  },
  diamond: {
    position: "absolute",
    bottom: 100,
    right: 80,
  },
  diamondText: {
    fontSize: 18,
  },
  character: {
    position: "absolute",
    bottom: 80,
    left: 120,
    width: 30,
    height: 40,
    backgroundColor: "#8B4513",
    borderRadius: 15,
  },
  clock: {
    position: "absolute",
    bottom: 40,
    right: 40,
  },
  clockText: {
    fontSize: 20,
  },
  sizeIndicator: {
    marginTop: 10,
    backgroundColor: "#4A90E2",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
  },
  sizeText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "600",
  },
  textContent: {
    // alignItems: 'center',
    // paddingHorizontal: 10,
    marginBottom: 30,
    // borderWidth: 2
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: 600,
    color: "black",
    textAlign: "left",
    marginBottom: 15,
    lineHeight: 30,
    // fontFamily: "roboto"
  },
  description: {
    fontSize: 15,
    color: "#7F8C8D",
    textAlign: "left",
    lineHeight: 22,
  },
  buttonContainer: {
    paddingBottom: 30,
  },
  primaryButton: {
    backgroundColor: "#FF6B35",
    paddingVertical: 16,
    borderRadius: 8,
    marginBottom: 15,
  },
  primaryButtonText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
  },
  secondaryButtonsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: "#ffffff",
    paddingVertical: 14,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: "#FF6B35",
  },
  registerButton: {
    flex: 1,
    backgroundColor: PRIMARY_COLOR,
    paddingVertical: 14,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: "#FF6B35",
  },
  secondaryButtonText: {
    color: "#FF6B35",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  registerButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
});

export default LandingPage;
