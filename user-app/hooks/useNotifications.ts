import { ROUTES } from '@/constants/app.routes';
import { callService, useCallService } from '@/services/AgoraCallService';
import { displayIncomingCallNotification, displayOngoingCallNotification, removeChannelNotification } from '@/services/CallNotification';
import { notificationService } from '@/services/NotificationService';
import { useCallStore } from '@/zustand/callStore';
import notifee, { Event, EventType } from '@notifee/react-native';
import messaging from '@react-native-firebase/messaging';
import { NotificationChannel, NotificationEventName, replacePlaceholders, USER_ROLE } from '@sm/common';
import * as Notifications from 'expo-notifications';
import ExpoPip from 'expo-pip';
import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
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
    const [info, setInfo] = useState<any>(null)
    const { visibleCallScreen, hideCallScreen, isInCall, callStartTime, otherParticipant } = useCallStore();
    const {
        endCall,
        startCall
    } = useCallStore();

    const {
        leaveChannel,
        getCallId
    } = useCallService();
    const handleEndCall = async () => {
        try {
            if (isInCall === false) return;
            await leaveChannel();
            endCall();
            router.replace(ROUTES.HOME as any);
        } catch (error) {
            console.error('Error ending call:', error);
            endCall();
            router.replace(ROUTES.HOME as any);
        }
    };

    const eventActions = async (type: string, payload: any = {}) => {
        switch (type) {
            case event.incoming_call:
                if (isInCall === true) return;
                await visibleCallScreen(payload);
                setInfo(payload);
                if (payload.additionalInfo) {
                    payload.additionalInfo = typeof payload?.additionalInfo === "string" ? JSON.parse(payload?.additionalInfo) : payload?.additionalInfo;
                }
                displayIncomingCallNotification(payload?.caller_name, payload, payload?.caller_image);
                // playRingtone();
                break;
            case event.end_call:
                await handleEndCall();
                break
            default:
                console.log("Unused event found: ", type);
                break;
        }
    }

    const notifeeEventHandler = async ({ type, detail }: Event) => {
        const data = detail?.notification?.data;
        if (detail.notification?.android?.channelId === NotificationChannel.call) {
            if (type === EventType.PRESS) {
                isInCall && router.replace(ROUTES.CALL as any)
            }
            return;
        }
        if (type === EventType.ACTION_PRESS) {
            if (detail?.pressAction?.id === 'answer') {
                await receiveCall(detail?.notification?.data)
            } else if (detail?.pressAction?.id === 'decline') {
                // Alert.alert('Call Declined');
                await declineCall(data);
            } else {
                console.log("Unhandled Event Press Action")
            }
        } else if (type == EventType.DISMISSED) {
            await declineCall(data);
        } else if (type == EventType.PRESS) {
            router.push(ROUTES.INCOMING_SCREEN as any);
        }
        else {
            console.log("Unhandled Event Action ", type)
        }
    }

    const declineCall = async (data: any) => {
        console.log('declineCall', data)
        hideCallScreen();
        await notificationService.endCall(data?.additionalInfo?.consultant_id, USER_ROLE.consultant);
    }

    const receiveCall = async (callInfo: any) => {
        console.log('receiveCall', callInfo)
        await callService.initialize();
        await startCall(
            callInfo?.additionalInfo?.token,
            callInfo?.additionalInfo?.user_id,
            {
                id: callInfo?.additionalInfo?.Consultant?.id,
                name: callInfo?.caller_name ?? callInfo?.additionalInfo?.Consultant?.full_name,
                avatar: callInfo?.caller_image ?? callInfo?.additionalInfo?.Consultant?.profile_image,
            }
        );
        router.push(replacePlaceholders(ROUTES.CALL_CONSULTANT, { consultant_id: callInfo?.additionalInfo?.Consultant?.id }) as any)
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
            console.log('FCM got foreground', remoteMessage.data)
            const { event_type } = remoteMessage.data;
            await eventActions(event_type, remoteMessage?.data)
        });

        //Background FCM
        messaging().setBackgroundMessageHandler(async remoteMessage => {
            console.log('FCM got background', remoteMessage.data)
            const { event_type } = remoteMessage.data || {};
            await eventActions(event_type as string, remoteMessage.data);
        });

        return () => {
            unsubscribe();
        };
    }, [isInCall]);

    useEffect(() => {
        const forground = notifee.onForegroundEvent(notifeeEventHandler);

        notifee.onBackgroundEvent(notifeeEventHandler);

        return () => {
            forground();
        }
    }, []);

    useEffect(() => {
        const subscription = AppState.addEventListener('change', async (currentState) => {
            const isBackground = currentState === "background";
            const isNowActive = currentState === 'active';
            const currentCallId = await getCallId();
            if (isBackground && currentCallId && isInCall) {
                await removeChannelNotification(NotificationChannel.call)
                await displayOngoingCallNotification(callStartTime, otherParticipant?.name, otherParticipant?.avatar);
                await ExpoPip.enterPipMode({
                    width: 200,
                    height: 300,
                })
            }
            appState.current = currentState;
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