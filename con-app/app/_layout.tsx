import { CallOverlay } from "@/components/CallOverlay";
import IncomingCallScreen from "@/components/IncomingCallScreen";
import LoadingOverlay from "@/components/LoadingOverlay";
import { useNotifications } from "@/hooks/useNotifications";
import { getAuthTokenMobile } from "@/lib/authtokens";
import { PRIMARY_COLOR } from "@/lib/constants";
import { initApiClients, SmPackageConfig } from "@sm/common";
import { Slot } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { QueryProvider } from "@/providers/QueryProvider";
import React from "react";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { AuthProvider } from "@/context/useAuth";
import Constants from "expo-constants";

const config: SmPackageConfig = {
  baseUrl: Constants.expoConfig?.extra?.apiBaseUrl || "",
  tokenProvider: getAuthTokenMobile,
};
initApiClients(config);

export default function HomeLayout() {
  useNotifications();

  console.log(
    "base url consultant>>>",
    Constants.expoConfig?.extra?.apiBaseUrl
  );

  return (
    <>
      <SafeAreaProvider>
        <SafeAreaView style={{ flex: 1 }}>
          <QueryProvider>
            <StatusBar
              style="dark"
              backgroundColor={PRIMARY_COLOR}
              translucent={false}
            />
            <CallOverlay />
            <LoadingOverlay />
            <AuthProvider>
              <Slot />
              <IncomingCallScreen></IncomingCallScreen>
            </AuthProvider>
          </QueryProvider>
        </SafeAreaView>
      </SafeAreaProvider>
    </>
  );
}
