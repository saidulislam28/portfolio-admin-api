import React from 'react';
import { Animated, StyleSheet } from 'react-native';
import { RtcSurfaceView, VideoViewSetupMode } from 'react-native-agora';

interface VideoViewsProps {
    screenSharingUid: number | null;
    participants: any[];
    isVideoMuted: boolean;
    panHandlers: any;
    panStyle: any;
}

export const VideoViews: React.FC<VideoViewsProps> = ({
    screenSharingUid,
    participants,
    isVideoMuted,
    panHandlers,
    panStyle,
}) => {
    return (
        <>
            {/* Screen sharing video (if active) */}
            {screenSharingUid ? (
                <RtcSurfaceView
                    style={styles.remoteVideo}
                    canvas={{
                        uid: screenSharingUid,
                        setupMode: VideoViewSetupMode.VideoViewSetupReplace,
                    }}
                />
            ) : null}

            {/* Remote video (if no screen sharing or as PIP) */}
            {participants.length > 0 && (
                <RtcSurfaceView
                    style={[
                        styles.remoteVideo,
                        screenSharingUid ? styles.pipVideo : null
                    ]}
                    canvas={{
                        uid: participants[0].uid,
                        setupMode: VideoViewSetupMode.VideoViewSetupReplace,
                    }}
                />
            )}

            {/* Local video */}
            {!isVideoMuted && (
                <Animated.View
                    {...panHandlers}
                    style={[
                        styles.localVideoContainer,
                        panStyle,
                        screenSharingUid ? styles.localVideoScreenSharing : null,
                    ]}
                >
                    <RtcSurfaceView
                        style={styles.localVideo}
                        canvas={{
                            uid: 0,
                            setupMode: VideoViewSetupMode.VideoViewSetupReplace,
                        }}
                        zOrderMediaOverlay
                    />
                </Animated.View>
            )}
        </>
    );
};

const styles = StyleSheet.create({
    remoteVideo: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
    pipVideo: {
        position: 'absolute',
        top: 20,
        right: 20,
        width: 120,
        height: 160,
        borderRadius: 12,
        overflow: 'hidden',
        borderWidth: 2,
        borderColor: '#FFFFFF',
        zIndex: 10,
    },
    localVideoContainer: {
        width: 120,
        height: 160,
        position: 'absolute',
        borderRadius: 12,
        overflow: 'hidden',
        borderWidth: 2,
        borderColor: '#FFFFFF',
        zIndex: 100,
    },
    localVideoScreenSharing: {
        top: 20,
        right: 160,
    },
    localVideo: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
});