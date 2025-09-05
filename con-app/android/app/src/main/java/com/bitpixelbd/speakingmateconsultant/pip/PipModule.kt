package com.bitpixelbd.speakingmateconsultant.pip

import android.app.Activity
import android.app.AppOpsManager
import android.app.PictureInPictureParams
import android.content.Context
import android.content.Intent
import android.content.pm.PackageManager
import android.net.Uri
import android.os.Build
import android.provider.Settings
import android.util.Rational
import com.facebook.react.bridge.*

class PipModule(private val reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String {
        return "PipModule"
    }

    @ReactMethod
    fun enterPipMode(width: Int, height: Int, promise: Promise) {
        val activity: Activity? = currentActivity
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O && activity != null) {
            val aspectRatio = Rational(width, height)
            val pipBuilder = PictureInPictureParams.Builder()
            pipBuilder.setAspectRatio(aspectRatio)
            activity.enterPictureInPictureMode(pipBuilder.build())
            promise.resolve(true)
        } else {
            promise.reject("ERR_PIP_NOT_SUPPORTED", "PiP not supported or activity is null")
        }
    }

    @ReactMethod
    fun isPipSupported(promise: Promise) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val isSupported = reactContext.packageManager.hasSystemFeature(PackageManager.FEATURE_PICTURE_IN_PICTURE)
            promise.resolve(isSupported)
        } else {
            promise.resolve(false)
        }
    }

    @ReactMethod
    fun isPipPermissionGranted(promise: Promise) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val appOps = reactContext.getSystemService(Context.APP_OPS_SERVICE) as AppOpsManager
            val mode = appOps.unsafeCheckOpNoThrow(
                "android:picture_in_picture",
                android.os.Process.myUid(),
                reactContext.packageName
            )
            promise.resolve(mode == AppOpsManager.MODE_ALLOWED)
        } else {
            promise.resolve(false)
        }
    }

    @ReactMethod
    fun openPipSettings() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val intent = Intent(Settings.ACTION_APPLICATION_DETAILS_SETTINGS,
                Uri.parse("package:" + reactContext.packageName))
            intent.flags = Intent.FLAG_ACTIVITY_NEW_TASK
            reactContext.startActivity(intent)
        }
    }
}
