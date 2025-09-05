import 'dotenv/config';

export default ({
  config
}) => ({
  expo: {
    name: "SpeakingMate",
    slug: "sm-userapp",
    extra: {
      projectId: "speaking-mate-app",
      apiBaseUrl: process.env.API_BASE_URL,
    },
    facebookAppId: "YOUR_FACEBOOK_APP_ID",
    facebookClientToken: "YOUR_FACEBOOK_CLIENT_TOKEN",
    facebookDisplayName: "Your App Name",
    android: {
      facebookScheme: "fbYOUR_FACEBOOK_APP_ID"
    },
    jsEngine: "hermes",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/Logo512.png",
    scheme: "com.bitpixelbd.speakingmate",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.bitpixelbd.speakingmate",
      jsEngine: "jsc",
    },
    android: {
      package: "com.bitpixelbd.speakingmate",
      googleServicesFile: "./assets/google-services.json",
      useNextNotificationsApi: true,
      softwareKeyboardLayoutMode: "pan",
      permissions: [
        "android.permission.FOREGROUND_SERVICE",
        "android.permission.RECORD_AUDIO",
        "android.permission.CAMERA",
        "android.permission.MODIFY_AUDIO_SETTINGS",
        "android.permission.FOREGROUND_SERVICE_MEDIA_PROJECTION",
        "android.permission.WAKE_LOCK",
        "android.permission.READ_CALL_LOG",
        "android.permission.CALL_PHONE",
        "android.permission.READ_PHONE_STATE",
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
          image: "./assets/images/Logo1024.png",
          imageWidth: 200,
          resizeMode: "contain",
          backgroundColor: "#ffffff",
        },
      ],
      [
        "expo-image-picker",
        {
          photosPermission: "The app accesses your photos to let you set a profile picture.",
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
            extraMavenRepos: [
              "../../node_modules/@notifee/react-native/android/libs",
            ],
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
      "expo-localization",
    ],
    experiments: {
      typedRoutes: true,
    },
  },
});