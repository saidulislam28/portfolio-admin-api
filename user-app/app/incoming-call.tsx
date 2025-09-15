import { ROUTES } from "@/constants/app.routes";
import { callService } from "@/services/AgoraCallService";
import { stopRingtone } from "@/services/ringtoneService";
import { useCallStore } from "@/zustand/callStore";
import {
  NO_IMAGE_TEXT,
  replacePlaceholders,
  sendCallEndNotificationToConsultant,
} from "@sm/common";
import { router } from "expo-router";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const USER_AVATAR_PLACEHOLDER = require("@/assets/images/user.png");

const IncomingCallScreen = () => {
  const { showCallScreen, hideCallScreen, startCall, incomingCallInfo } =
    useCallStore();

  const ignoreCall = async () => {
    hideCallScreen();
    stopRingtone();
    // await notificationService.endCall(incomingCallInfo?.additionalInfo?.consultant_id, USER_ROLE.consultant);
    // TODO send end call push to consultant

    sendCallEndNotificationToConsultant(
      Number(incomingCallInfo?.appointment_id)
    );
    router.back();
  };

  const receiveCall = async () => {
    await callService.initialize();
    await startCall(
      incomingCallInfo?.appointment_token,
      Number(incomingCallInfo?.user_id),
      {
        id: incomingCallInfo?.consultant_id,
        name: incomingCallInfo?.consultant_name,
        avatar: incomingCallInfo?.consultant_image,
      }
    );
    // stopRingtone();
    hideCallScreen();
    router.replace(ROUTES.CALL_CONSULTANT);
  };

  console.log("IncomingCallScreen > incomingCallInfo", incomingCallInfo);
  //     {
  //     "event_type": "incoming_call",
  //     "title": "Incoming Call",
  //     "app": "Speaking Mate platform",
  //     "user_id": "3",
  //     "caller_name": "Saidul",
  //     "appointment_token": "f25884ea-5814-4306-896b-591d221be508",
  //     "caller_image": "test",
  //     "consultant_image": "test",
  //     "consultant_name": "Saidul",
  //     "consultant_id": "28"
  // }
  return (
    <View style={styles.container}>
      <View style={styles.callerInfoContainer}>
        <Image
          source={
            incomingCallInfo?.consultant_image === NO_IMAGE_TEXT
              ? USER_AVATAR_PLACEHOLDER
              : { uri: incomingCallInfo?.consultant_image }
          }
          style={styles.avatar}
        />
        <Text style={styles.callerName}>
          {incomingCallInfo?.consultant_name}
        </Text>
        <Text style={styles.callStatus}>Incoming Call</Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.declineButton]}
          onPress={ignoreCall}
        >
          <Text style={styles.buttonText}>Decline</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.answerButton]}
          onPress={receiveCall}
        >
          <Text style={styles.buttonText}>Answer</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a1a1a",
    justifyContent: "space-between",
    paddingVertical: 50,
  },
  callerInfoContainer: {
    alignItems: "center",
    marginTop: 80,
  },
  avatar: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 20,
    borderWidth: 3,
    borderColor: "#4a4a4a",
  },
  callerName: {
    color: "white",
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 10,
  },
  callStatus: {
    color: "#aaaaaa",
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: 40,
  },
  button: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  declineButton: {
    backgroundColor: "#ff3b30",
  },
  answerButton: {
    backgroundColor: "#34c759",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default IncomingCallScreen;
