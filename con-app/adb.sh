#!/bin/bash

IP="192.168.0.100:41311"
APK_PATH="android/app/build/outputs/apk/debug/app-debug.apk"

adb connect $IP
adb -s $IP install -r $APK_PATH
npx expo start --dev-client --host lan
