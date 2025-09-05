import { ROUTES } from "@/constants/app.routes";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React from "react";
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");
const PRIMARY_COLOR = "#007AFF";

const IELTSLandingScreen = () => {
  const router = useRouter();

  return (
    <LinearGradient
      colors={["#f0f4ff", "#dce6ff"]}
      style={styles.gradientBackground}
    >
      <View style={styles.card}>
        <Image
          source={{
            uri: "https://media.istockphoto.com/id/2210651432/photo/puzzle-with-speaking-listening-writing-and-reading-icons-what-are-the-four-domains-of.webp",
          }}
          style={styles.image}
          resizeMode="cover"
        />

        <Text style={styles.title}>Ace Your IELTS Exam</Text>
        <Text style={styles.subtitle}>
          Get ready with the best prep resources provided by British Council.
        </Text>

        <TouchableOpacity
          activeOpacity={0.85}
          style={styles.button}
          onPress={() => router.push(ROUTES.EXAM_REGISTRATION)}
        >
          <Text style={styles.buttonText}>Register for IELTS</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

export default IELTSLandingScreen;

const styles = StyleSheet.create({
  gradientBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  card: {
    width: "100%",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    alignItems: "center",
  },
  image: {
    width: width * 0.8,
    height: 200,
    borderRadius: 15,
    marginBottom: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#1A1A1A",
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#555",
    textAlign: "center",
    marginBottom: 30,
  },
  button: {
    backgroundColor: PRIMARY_COLOR,
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 12,
    width: "100%",
    alignItems: "center",
    shadowColor: "#007AFF",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
});
