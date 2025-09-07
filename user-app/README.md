# Speakingmate - user app

### Build apk

inside android folder run `./gradlew assembleRelease`
apk will be generated inside `android/app/build/outputs/apk/release`

npx expo prebuild --clean --platform android

Error Handling

`
console.error("Profile update error:", err);
console.error("Error details:", err.response?.data || err.message);
Alert.alert("Error", err.message || "Could not update profile");
`
