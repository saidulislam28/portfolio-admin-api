import notifee, { AndroidImportance, AndroidColor, AndroidCategory, AndroidStyle } from '@notifee/react-native';
import { NO_IMAGE_TEXT, NotificationChannel } from '@sm/common';

export async function displayIncomingCallNotification(name: string, data: any = null, profileIcon: string) {
    const channelId = await notifee.createChannel({
        id: NotificationChannel.calls,
        name: 'Incoming Calls',
        importance: AndroidImportance.HIGH,
        sound: 'ringtone',
    });

    await notifee.displayNotification({
        title: `${name} · SM`,
        body: 'Incoming call',
        data,
        android: {
            channelId,
            importance: AndroidImportance.HIGH,
            category: AndroidCategory.CALL,
            fullScreenAction: {
                id: 'default',
            },
            ongoing: true,
            timeoutAfter: 15000,
            color: AndroidColor.RED,
            actions: [
                {
                    title: 'Decline',
                    pressAction: {
                        id: 'decline',
                    },
                    icon: 'ic_launcher',
                },
                {
                    title: 'Answer',
                    pressAction: {
                        id: 'answer',
                        launchActivity: 'default',
                        launchActivityFlags: []
                    },
                    icon: 'ic_launcher',
                },
            ],
            style: {
                type: AndroidStyle.BIGTEXT,
                text: 'Incoming call',
            },
            pressAction: {
                id: 'default',
            },
            loopSound: true,
            largeIcon: profileIcon === NO_IMAGE_TEXT ? "https://avatar.iran.liara.run/public" : profileIcon,
            sound: 'ringtone',
        },
    });
}

export async function testNotification() {
    console.log("Test notificaion called")
    const channelId = await notifee.createChannel({
        id: 'enw',
        name: 'Incoming Calls',
        importance: AndroidImportance.HIGH,
        sound: 'ringtone',
    });
    // Android < 8.0 (API level 26)
    await notifee.displayNotification({
        body: 'Custom sound',
        android: {
            channelId,
            importance: AndroidImportance.HIGH,
            category: AndroidCategory.CALL,
            sound: "ringtone"
        },
    });
}


export const displayOngoingCallNotification = async (startTime: any, name = "N/A", profileIcon = "https://avatar.iran.liara.run/public") => {
    const channelId = await notifee.createChannel({
        id: NotificationChannel.call,
        name: 'Show Calls',
        vibration: false
    });
    await notifee.displayNotification({
        title: name,
        body: 'Tap to got call screen',
        android: {
            channelId,
            largeIcon: profileIcon,
            ongoing: true,
            timestamp: new Date(startTime).getTime(),
            showTimestamp: true,
            showChronometer: true,
            pressAction: {
                id: "default",
            },
            autoCancel: false,
        },
    });
}

export async function removeChannelNotification(channelId: string) {
    try {
        await notifee.deleteChannel(channelId);
    } catch (error) { }
}