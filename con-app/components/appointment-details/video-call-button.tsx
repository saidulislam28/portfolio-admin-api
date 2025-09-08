import React from "react";
import { Dimensions } from "react-native";
import { BaseButton } from "../BaseButton";

const { width } = Dimensions.get("window");
const isTablet = width >= 600;

interface VideoCallButtonProps {
  status: string;
  startVideoCall: () => void; // function with no arguments, returns nothing
}

export const VideoCallButton = ({
  status,
  startVideoCall,
}: VideoCallButtonProps) => {
  return (
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

