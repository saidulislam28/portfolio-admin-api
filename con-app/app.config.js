import 'dotenv/config';

export default ({ config }) => ({
  expo: {
    name: "sm-consultantapp",
    slug: "sm-consultantapp",
    version: "1.0.0",
    extra: {
      projectId: "speaking-mate-app",
      apiBaseUrl: process.env.API_BASE_URL,
    },
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "speakingmate-consultantapp",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.bitpixelbd.speakingmateconsultant",
      infoPlist: {
        NSCameraUsageDescription:
          "This app needs access to camera for video calls.",
        NSMicrophoneUsageDescription:
          "This app needs access to microphone for video calls and screen recording.",
        NSPhotoLibraryUsageDescription:
          "This app needs access to photo library to share images during calls.",
      },
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/images/adaptive-icon.png",
        backgroundColor: "#ffffff",
      },
      package: "com.bitpixelbd.speakingmateconsultant",
      googleServicesFile: "./assets/google-services.json",
      softwareKeyboardLayoutMode: "pan",
      permissions: [
        "android.permission.FOREGROUND_SERVICE",
        "android.permission.RECORD_AUDIO",
        "android.permission.CAMERA",
        "android.permission.MODIFY_AUDIO_SETTINGS",
        "android.permission.CAMERA",
        "android.permission.INTERNET",
        "android.permission.ACCESS_NETWORK_STATE",
        "android.permission.BLUETOOTH",
        "android.permission.BLUETOOTH_ADMIN",
        "android.permission.SYSTEM_ALERT_WINDOW",
        "android.permission.WAKE_LOCK",
        "android.permission.READ_PHONE_STATE",
        "android.permission.CALL_PHONE",
        "android.permission.BIND_TELECOM_CONNECTION_SERVICE",
        "android.permission.WRITE_SETTINGS",
        "android.permission.WRITE_EXTERNAL_STORAGE",
      ],
      config: {
        pictureInPicture: {
          enable: true,
          aspectRatio: "1:1.5",
        },
      },
    },
    web: {
      bundler: "metro",
      output: "static",
      favicon: "./assets/images/favicon.png",
    },
    plugins: [
      "expo-router",
      "expo-notifications",
      [
        "expo-splash-screen",
        {
          image: "./assets/images/splash-icon.png",
          imageWidth: 200,
          resizeMode: "contain",
          backgroundColor: "#ffffff",
        },
      ],
      [
        "expo-image-picker",
        {
          photosPermission:
            "The app accesses your photos to let you set a profile picture.",
        },
      ],
      [
        "expo-build-properties",
        {
          android: {
            enableProguardInReleaseBuilds: false,
            usesCleartextTraffic: true,
            compileSdkVersion: 35,
            targetSdkVersion: 35,
            buildToolsVersion: "35.0.0",
            kotlinVersion: "1.9.25",
          },
          ios: {
            deploymentTarget: "15.1",
          },
        },
      ],
      "expo-pip",
      [
        "expo-build-properties",
        {
          android: {
            usesCleartextTraffic: true,
          },
        },
      ],
      [
        "./withAndroidReleaseKeystore",
        {
          keystorePath: "./my-upload-key.keystore",
          keystorePassword: "123456",
          keyAlias: "my-key-alias",
          keyPassword: "123456",
        },
      ],
    ],
    experiments: {
      typedRoutes: true,
    },
  },
});
