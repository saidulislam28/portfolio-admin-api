package com.bitpixelbd.speakingmateconsultant

import android.app.*
import android.content.Intent
import android.os.Build
import android.os.IBinder
import androidx.core.app.NotificationCompat
import com.bitpixelbd.speakingmateconsultant.R

class AudioCallService : Service() {

    override fun onCreate() {
        super.onCreate()

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channelId = "audio_call_channel"
            val channelName = "Audio Call"
            val channel = NotificationChannel(
                channelId, channelName, NotificationManager.IMPORTANCE_LOW
            )
            val manager = getSystemService(NotificationManager::class.java)
            manager?.createNotificationChannel(channel)

            val notification = NotificationCompat.Builder(this, channelId)
                .setContentTitle("SpeakingMate")
                .setContentText("Call is active")
                .setSmallIcon(R.drawable.ic_notification) // <-- Add your icon
                .setOngoing(true)
                .build()

            startForeground(101, notification)
        }
    }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        return START_STICKY
    }

    override fun onBind(intent: Intent?): IBinder? = null
}
