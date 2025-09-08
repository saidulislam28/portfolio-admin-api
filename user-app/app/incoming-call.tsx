import { ROUTES } from '@/constants/app.routes';
import { callService } from '@/services/AgoraCallService';
import { notificationService } from '@/services/NotificationService';
import { stopRingtone } from '@/services/ringtoneService';
import { useCallStore } from '@/zustand/callStore';
import { replacePlaceholders, USER_ROLE } from '@sm/common';
import { router } from 'expo-router';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const IncomingCallScreen = () => {
    const { showCallScreen, hideCallScreen, startCall, incomingCallInfo } = useCallStore();

    const ignoreCall = async () => {
        hideCallScreen();
        stopRingtone();
        await notificationService.endCall(incomingCallInfo?.additionalInfo?.consultant_id, USER_ROLE.consultant);
        router.back();
    }

    const receiveCall = async () => {
        await callService.initialize();
        await startCall(
            incomingCallInfo?.additionalInfo?.token,
            incomingCallInfo?.additionalInfo?.user_id
        );
        // stopRingtone();
        hideCallScreen();
        router.push(replacePlaceholders(ROUTES.CALL_CONSULTANT, { consultant_id: incomingCallInfo?.additionalInfo?.Consultant?.id }) as any);
    }

    return (
        <View style={styles.container}>
            <View style={styles.callerInfoContainer}>
                <Image
                    source={require('@/assets/images/user.png')}
                    style={styles.avatar}
                />
                <Text style={styles.callerName}>{incomingCallInfo?.caller_name}</Text>
                <Text style={styles.callStatus}>Incoming Call</Text>
            </View>

            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={[styles.button, styles.declineButton]}
                    onPress={ignoreCall}
                >
                    <Text style={styles.buttonText}>Decline</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.button, styles.answerButton]}
                    onPress={receiveCall}
                >
                    <Text style={styles.buttonText}>Answer</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1a1a1a',
        justifyContent: 'space-between',
        paddingVertical: 50,
    },
    callerInfoContainer: {
        alignItems: 'center',
        marginTop: 80,
    },
    avatar: {
        width: 150,
        height: 150,
        borderRadius: 75,
        marginBottom: 20,
        borderWidth: 3,
        borderColor: '#4a4a4a',
    },
    callerName: {
        color: 'white',
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    callStatus: {
        color: '#aaaaaa',
        fontSize: 16,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingHorizontal: 40,
    },
    button: {
        width: 80,
        height: 80,
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    declineButton: {
        backgroundColor: '#ff3b30',
    },
    answerButton: {
        backgroundColor: '#34c759',
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default IncomingCallScreen;