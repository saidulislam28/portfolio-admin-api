import { PRIMARY_COLOR, SECONDARY_COLOR } from "@/lib/constants";
import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { Dimensions } from "react-native";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { BaseButton } from "../BaseButton";
const customConstants = {
  primaryColor: PRIMARY_COLOR,
  secondaryColor: SECONDARY_COLOR,
};

const { width, height } = Dimensions.get("window");
const isTablet = width >= 600;
// Constants that depend on tablet status
const BUTTON_HEIGHT = isTablet ? 64 : 52;
const FONT_SIZE_MEDIUM = isTablet ? 18 : 16;
const FONT_SIZE_SMALL = isTablet ? 16 : 14;

interface VideoCallButtonProps {
  status: string;
  startVideoCall: () => void; // function with no arguments, returns nothing
}

export const VideoCallButton = ({
  status,
  startVideoCall,
}: VideoCallButtonProps) => {
  // if (!appointment || ((!isStarted || isExpired) && !(isTestUser && isTestConsultant))) {
  //   return null;
  // }

  // console.log("appointment status", status)

  return (
    // <TouchableOpacity
    //     style={[
    //         styles.primaryButton,
    //         {
    //             height: BUTTON_HEIGHT,
    //             backgroundColor: customConstants.secondaryColor,
    //         },
    //         (status === "CANCELLED" || status === "COMPLETED")
    //         && styles.disabledButton
    //     ]}
    //     activeOpacity={
    //         (status === "CANCELLED" || status === "COMPLETED")
    //             ? 0.5 // no press animation if disabled
    //             : 0.7
    //     }
    //     onPress={() => {
    //         console.log("hitting")
    //         if (status === "CANCELLED" || status === "COMPLETED") {
    //             return console.log("clicked now from unde") // prevent action
    //         }
    //         startVideoCall();
    //     }}
    // // onPress={startVideoCall}
    // >
    //     <MaterialIcons
    //         name="video-call"
    //         size={isTablet ? 28 : 20}
    //         color="white"
    //     />
    //     <Text style={styles.primaryButtonText}>Start Video Call</Text>
    // </TouchableOpacity>

    <BaseButton
      title="Start Video Call"
      onPress={() => {
        console.log("hitting");
        if (status === "CANCELLED" || status === "COMPLETED") {
          return console.log("clicked now from unde");
        }
        startVideoCall();
      }}
      
    />
  );
};

const styles = StyleSheet.create({
  actionButtons: {
    marginTop: isTablet ? 32 : 24,
    marginBottom: isTablet ? 40 : 32,
    gap: isTablet ? 20 : 12,
  },
  primaryButton: {
    backgroundColor: SECONDARY_COLOR,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: isTablet ? 18 : 14,
    borderRadius: 12,
    gap: 12,
    height: BUTTON_HEIGHT,
  },
  primaryButtonText: {
    color: "white",
    fontSize: isTablet ? FONT_SIZE_MEDIUM : 16,
    fontWeight: "600",
  },
  secondaryButtons: {
    flexDirection: "row",
    gap: isTablet ? 20 : 12,
  },
  secondaryButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: isTablet ? 16 : 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#fff",
    gap: 8,
    height: BUTTON_HEIGHT,
  },
  secondaryButtonText: {
    color: PRIMARY_COLOR,
    fontSize: isTablet ? FONT_SIZE_SMALL : 14,
    fontWeight: "500",
  },

  disableText: {
    color: "white",
    fontSize: isTablet ? FONT_SIZE_SMALL : 14,
    fontWeight: "500",
  },
  // Modal Styles

  disabledButton: {
    borderColor: "#ccc",
    backgroundColor: "#f2f2f2",
  },
  disabledButtonText: {
    color: "#999",
  },
  confirmButtonText: {
    fontSize: isTablet ? FONT_SIZE_MEDIUM : 16,
    color: "#fff",
    fontWeight: "600",
  },
});
