import { CallOverlay } from "@/components/CallOverlay";
import { useNotifications } from "@/hooks/useNotifications";
import { PRIMARY_COLOR } from "@/lib/constants";
import { Slot } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { AuthProvider } from "@/context/useAuth";
import IncomingCallScreen from "@/components/IncomingCallScreen";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { Platform } from "react-native";
// import { Provider } from 'react-redux';
// import { PersistGate } from 'redux-persist/integration/react';
// import { store, persistor } from '@/store';

import { initApiClients, SmPackageConfig } from "@sm/common";
import { getAuthTokenMobile } from "@/lib/authToken";
import { QueryProvider } from "@/providers/QueryProvider";

import Constants from "expo-constants";

const config: SmPackageConfig = {
  baseUrl: Constants.expoConfig?.extra?.apiBaseUrl || "",
  tokenProvider: getAuthTokenMobile,
};
initApiClients(config);

export default function HomeLayout() {
  useNotifications();

  console.log(
    "url base api??????>>>>>",
    Constants.expoConfig?.extra?.apiBaseUrl
  );


  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1 }}>
        <StatusBar
          style={Platform.OS === "ios" ? "auto" : "dark"}
          backgroundColor={
            Platform.OS === "android" ? PRIMARY_COLOR : undefined
          }
          translucent={true}
        />
        <CallOverlay />
        <QueryProvider>
          {/* <Provider store={store}> */}
          {/* <PersistGate loading={null} persistor={persistor}> */}
          <AuthProvider>
            <Slot />
            <IncomingCallScreen />
          </AuthProvider>
          {/* </PersistGate> */}
          {/* </Provider> */}
        </QueryProvider>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
