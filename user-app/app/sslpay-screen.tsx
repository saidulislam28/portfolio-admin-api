import { ROUTES } from "@/constants/app.routes";
import { PAYMENT_REDIRECT_URI } from "@/lib/constants";
import { Ionicons } from "@expo/vector-icons";
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
      router.replace(
        `/payment-success?orderId=order_id&paymentId=payment_id&service_type=${service_type}`
      );
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
            onPress: () => router.replace("/"),
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
              router.replace(ROUTES.HOME);
            },
            style: "cancel",
          },
        ]
      );
    }
  };

  // const extractTransactionId = (url: any) => {
  //   // Extract transaction ID from URL if available
  //   // This depends on your SSLCommerz configuration
  //   try {
  //     const urlParams = new URLSearchParams(url.split("?")[1]);
  //     return (
  //       urlParams.get("tran_id") || urlParams.get("transaction_id") || null
  //     );
  //   } catch (error) {
  //     return null;
  //   }
  // };

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

  // const editedServiceType = service_type?.toString();

  // useEffect(() => {
  //   if (tranId) {
  //     handleCheckPayment();
  //   }
  // }, [tranId]);

  // const handleCheckPayment = async () => {
  //   setIsProcessingPayment(true);
  //   try {
  //     const result = await Post(API_USER.check_payment, { tran_id: tranId });

  //     console.log("resalt", result);
  //     if (!result.success) {
  //       Alert.alert("Error", result.error);
  //       setIsProcessingPayment(false);
  //       return;
  //     }

  //     if (result.success) {
  //       // console.log("result", result?.data);
  //       // console.log("service type inside", service_type)
  //       router.push(
  //         `/payment-success?orderId=${result?.data?.order_id}&paymentId=${result?.data?.payment_id}&service_type=${service_type}`
  //       );
  //     }
  //   } catch (error: any) {
  //     Alert.alert("Error", error?.message ?? "Payment Failed");
  //     setIsProcessingPayment(false);
  //   }
  // };

  // const handleNavigationChange = async (navState: paymentSuccessType) => {
  //   const rawUrl = navState.url;
  //   const fixedUrl = rawUrl.replace("?tran_id=", "&tran_id=");
  //   const url = new URL(fixedUrl);
  //   const tranId = url.searchParams.get("tran_id") as string;

  //   if (tranId) {
  //     setTranId(tranId);
  //   }
  // };

  // const handleError = (syntheticEvent) => {
  //     const { nativeEvent } = syntheticEvent;
  //     console.warn('WebView error:', nativeEvent);
  //     setHasError(true);
  //     setWebViewLoading(false);
  //     setIsProcessingPayment(false);
  //     Alert.alert('Error', 'Failed to load payment page', [
  //         { text: 'OK', onPress: () => router.back() }
  //     ]);
  // };

  // const handleHttpError = (syntheticEvent: any) => {
  //   const { nativeEvent } = syntheticEvent;
  //   if (nativeEvent.statusCode >= 400) {
  //     setHasError(true);
  //     setIsProcessingPayment(false);
  //     Alert.alert("Error", "Payment server error occurred", [
  //       { text: "OK", onPress: () => router.back() },
  //     ]);
  //   }
  // };

  // const handleLoadStart = () => {
  //     setWebViewLoading(true);
  // };

  // const handleLoadEnd = () => {
  //   setWebViewLoading(false);
  // };

  if (!payment_url) {
    Alert.alert("Error", "Payment URL is missing");
    router.back();
    return null;
  }

  // if (hasError) {
  //   return (
  //     <View style={[styles.container]}>
  //       <Text>Failed to load payment page. Please try again.</Text>
  //     </View>
  //   );
  // }

  // const isLoading = webViewLoading || isProcessingPayment;

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
        // SSL/TLS settings
        // onShouldStartLoadWithRequest={(request) => {
        //   // Only allow HTTPS URLs for security
        //   if (request.url.startsWith('https://') || request.url.startsWith('about:')) {
        //     return true;
        //   }
        //   console.warn('Blocked non-HTTPS request:', request.url);
        //   return false;
        // }}
      />

      {/* {webViewLoading && (
        <View style={styles.webviewLoadingOverlay}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      )} */}

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
