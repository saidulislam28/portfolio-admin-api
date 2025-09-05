package com.bitpixelbd.speakingmateconsultant

import android.content.Intent
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

class AudioServiceModule(reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String = "AudioService"

    @ReactMethod
    fun startService() {
        val context = reactApplicationContext
        val intent = Intent(context, AudioForegroundService::class.java).apply {
            action = "START_AUDIO_SERVICE"
        }
        context.startForegroundService(intent)
    }

    @ReactMethod
    fun stopService() {
        val context = reactApplicationContext
        val intent = Intent(context, AudioForegroundService::class.java).apply {
            action = "STOP_AUDIO_SERVICE"
        }
        context.startService(intent)
    }
}
