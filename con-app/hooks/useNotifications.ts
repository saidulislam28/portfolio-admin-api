import { useCallService } from '@/services/AgoraCallService';
import { stopAudioService } from '@/services/AudioService';
import { displayOngoingCallNotification, removeChannelNotification } from '@/services/CallNotification';
import { useCallStore } from '@/zustand/callStore';
import notifee from '@notifee/react-native';
import messaging from '@react-native-firebase/messaging';
import { NotificationChannel, NotificationEventName } from '@sm/common';
import * as Notifications from 'expo-notifications';
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useRef } from 'react';
import { AppState } from 'react-native';

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
    }),
});

const event = NotificationEventName;
export const useNotifications = () => {
    const appState = useRef(AppState.currentState);
    const router = useRouter();
    const { visibleCallScreen, isInCall, callStartTime, otherParticipant } = useCallStore();
    const {
        endCall,
    } = useCallStore();

    const {
        leaveChannel,
        getCallId,
        getEngine
    } = useCallService();

    const handleEndCall = async () => {
        try {
            if (isInCall === false) return;
            await leaveChannel();
            endCall();
            stopAudioService();
            router.back();
        } catch (error) {
            console.error('Error ending call:', error);
            endCall();
            router.back();
        }
    };


    const eventActions = async (type: string, payload: any = {}) => {
        switch (type) {
            case event.incoming_call:
                visibleCallScreen(payload);
                // playRingtone();
                break;
            case event.end_call:
                await handleEndCall();
                break
            default:
                console.log("Unhandle event found: ", type);
                break;
        }
    }

    useEffect(() => {
        // Foreground Handler
        const subscription = Notifications.addNotificationResponseReceivedListener(response => {
            const data = response.notification.request.content.data;
            if (data.screen) {
                router.push(data.screen);
            }
        })

        return () => subscription.remove();
    }, []);

    useEffect(() => {
        // Foreground FCM
        const unsubscribe = messaging().onMessage(async (remoteMessage: any) => {
            const { event_type } = remoteMessage.data;
            await eventActions(event_type, remoteMessage?.data)
        });

        //Background FCM
        messaging().setBackgroundMessageHandler(async remoteMessage => {
            const { event_type } = remoteMessage.data || {};
            await eventActions(event_type as string, remoteMessage.data);
        });
        return () => {
            unsubscribe();
        };
    }, [isInCall]);

    const handleBackgroundState = useCallback(async () => {
        const currentCallId = await getCallId();
        // console.log("Background call", currentCallId && isInCall)

        if (currentCallId && isInCall) {
            try {
                await removeChannelNotification(NotificationChannel.call);
                await displayOngoingCallNotification(
                    callStartTime,
                    otherParticipant?.name,
                    otherParticipant?.avatar
                );
                // await enterPip()
            } catch (err) {
                console.warn("Background handling failed:", err);
            }
        }

    }, [isInCall])

    useEffect(() => {
        const subscription = AppState.addEventListener('change', async (nextState) => {
            // console.log({ nextState })
            if (nextState === 'background') {
                await handleBackgroundState()
            }
            appState.current = nextState;
        });

        return () => {
            subscription.remove();
        };
    }, [isInCall]);


    useEffect(() => {
        if (!isInCall) {
            notifee.cancelAllNotifications();
        }
    }, [isInCall])


};