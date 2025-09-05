package com.bitpixelbd.speakingmateconsultant

import android.content.Intent
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

class ForegroundServiceModule(reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    override fun getName() = "ForegroundServiceModule"

    @ReactMethod
    fun startService() {
        val context = reactApplicationContext
        val intent = Intent(context, AudioCallService::class.java)
        context.startForegroundService(intent)
    }

    @ReactMethod
    fun stopService() {
        val context = reactApplicationContext
        val intent = Intent(context, AudioCallService::class.java)
        context.stopService(intent)
    }
}
