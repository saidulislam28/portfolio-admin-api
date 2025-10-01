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
import { LogBox } from 'react-native';
// import { Provider } from 'react-redux';
// import { PersistGate } from 'redux-persist/integration/react';
// import { store, persistor } from '@/store';
import Toast from 'react-native-toast-message';
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";

import { initApiClients, SmPackageConfig } from "@sm/common";
import { getAuthTokenMobile } from "@/lib/authToken";
import { QueryProvider } from "@/providers/QueryProvider";

import Constants from "expo-constants";

const config: SmPackageConfig = {
  baseUrl: Constants.expoConfig?.extra?.apiBaseUrl || "",
  tokenProvider: getAuthTokenMobile,
};
initApiClients(config);

LogBox.ignoreLogs([
  'Warning: Some specific warning message',
  'Open debugger to view',
]);

export default function HomeLayout() {
  useNotifications();

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1 }}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <BottomSheetModalProvider>
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
            <Toast />
          </BottomSheetModalProvider>
        </GestureHandlerRootView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
