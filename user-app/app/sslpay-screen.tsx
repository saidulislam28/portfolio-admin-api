import { ROUTES } from "@/constants/app.routes";
import { PAYMENT_REDIRECT_URI } from "@/lib/constants";
import { Ionicons } from "@expo/vector-icons";
import { replacePlaceholders } from "@sm/common";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Alert, StyleSheet, Text, View } from "react-native";
import { WebView } from "react-native-webview";

const SslcommerzPaymentScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const payment_url = params?.payment_url;
  const service_type = params?.service_type;
  const amount = params?.amount;
  const order_id = params?.order_id;

  // const webviewRef = useRef(null);
  const [webViewLoading, setWebViewLoading] = useState(true);
  // const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  // const [hasError, setHasError] = useState(false);
  // const [tranId, setTranId] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const handleNavigationStateChange = (navState: any) => {
    const { url } = navState;
    console.log("WebView URL changed:", url);

    // REMAIN ROUTES

    if (url.includes(`${PAYMENT_REDIRECT_URI}?paystate=success`)) {
      router.replace(replacePlaceholders(ROUTES.PAYMENT_SUCCESS, {
          order_id,
          service_type
        }));
    } else if (url.includes(`${PAYMENT_REDIRECT_URI}?paystate=fail`)) {
      Alert.alert(
        "Payment Failed",
        "Your payment was not completed. Please try again.",
        [
          {
            text: "Try Again",
            onPress: () => router.back(),
          },
          {
            text: "Cancel",
            onPress: () => router.replace(ROUTES.HOME as any),
            style: "cancel",
          },
        ]
      );
    } else if (url.includes(`${PAYMENT_REDIRECT_URI}?paystate=cancel`)) {
      Alert.alert(
        "Payment Canceled",
        "Your payment was cancelled. Please try again.",
        [
          // {
          //   text: 'Try Again',
          //   onPress: () => router.back()
          // },
          {
            text: "Go to home",
            onPress: () => {
              router.dismissAll();
              router.replace(ROUTES.HOME as any);
            },
            style: "cancel",
          },
        ]
      );
    }
  };

  const handleError = (syntheticEvent: any) => {
    const { nativeEvent } = syntheticEvent;
    console.error("WebView error:", nativeEvent);
    setError(true);
    setLoading(false);
  };

  const handleLoad = () => {
    setWebViewLoading(false);
    setError(false);
  };

  const handleLoadStart = () => {
    setWebViewLoading(true);
    setError(false);
  };

  const handleLoadEnd = () => {
    setWebViewLoading(false);
  };



  if (!payment_url) {
    Alert.alert("Error", "Payment URL is missing");
    router.back();
    return null;
  }
  if (!payment_url) {
    return (
      <View style={styles.errorContainer}>
        <Stack.Screen options={{ title: "Payment Error" }} />
        <Ionicons name="alert-circle" size={64} color="#F44336" />
        <Text style={styles.errorText}>Payment URL not found</Text>
        <Text style={styles.errorSubtext}>Please try again</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: "Secure Payment",
          headerBackVisible: false, // Prevent back navigation during payment
        }}
      />

      {/* Loading Indicator */}
      {webViewLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Loading secure payment...</Text>
        </View>
      )}

      {/* Error State */}
      {error && (
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={64} color="#F44336" />
          <Text style={styles.errorText}>Failed to load payment page</Text>
          <Text style={styles.errorSubtext}>
            Please check your internet connection
          </Text>
        </View>
      )}

      {/* Security Info Bar */}
      <View style={styles.securityBar}>
        <Ionicons name="shield-checkmark" size={16} color="#4CAF50" />
        <Text style={styles.securityText}>Secure Payment - SSL Encrypted</Text>
        <View style={styles.amountBadge}>
          <Text style={styles.amountText}>BDT {amount}</Text>
        </View>
      </View>

      {/* WebView */}
      <WebView
        source={{ uri: payment_url as string }}
        style={styles.webview}
        onNavigationStateChange={handleNavigationStateChange}
        onError={handleError}
        onLoad={handleLoad}
        onLoadStart={handleLoadStart}
        onLoadEnd={handleLoadEnd}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={false}
        scalesPageToFit={true}
        mixedContentMode="compatibility"
        // Security settings
        allowsBackForwardNavigationGestures={false}
        allowsLinkPreview={false}   
      />    

      {/* Payment Info Footer */}
      <View style={styles.footer}>
        <View style={styles.footerContent}>
          <Ionicons name="information-circle" size={16} color="#666" />
          <Text style={styles.footerText}>
            Complete your payment securely through SSLCommerz
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  loadingContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    zIndex: 1000,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#666",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#F44336",
    marginTop: 16,
    textAlign: "center",
  },
  errorSubtext: {
    fontSize: 14,
    color: "#666",
    marginTop: 8,
    textAlign: "center",
  },
  securityBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E8F5E8",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  securityText: {
    flex: 1,
    fontSize: 14,
    color: "#2E7D32",
    fontWeight: "500",
    marginLeft: 8,
  },
  amountBadge: {
    backgroundColor: "#2E7D32",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  amountText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
  webview: {
    flex: 1,
  },
  footer: {
    backgroundColor: "white",
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  footerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  footerText: {
    fontSize: 12,
    color: "#666",
    marginLeft: 6,
  },
  webviewLoadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    zIndex: 100,
  },
});

export default SslcommerzPaymentScreen;
