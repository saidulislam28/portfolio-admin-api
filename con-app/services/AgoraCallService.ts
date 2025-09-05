import { APP_ID } from '@/lib/constants';
import { useCallStore } from '@/zustand/callStore';
import { Dimensions, Platform } from 'react-native';
import {
  ChannelProfileType,
  ClientRoleType,
  ConnectionChangedReasonType,
  ConnectionStateType,
  createAgoraRtcEngine,
  ErrorCodeType,
  IRtcEngine,
  LocalVideoStats,
  RemoteVideoStats,
  RtcStats,
  ScreenCaptureParameters,
  ScreenScenarioType,
  UserOfflineReasonType,
  VideoContentHint,
  VideoSourceType
} from 'react-native-agora';
const { width, height } = Dimensions.get('window');


class CallService {
  private engine: IRtcEngine | null = null;
  private isInitialized = false;
  private isScreenSharing: boolean = false;
  private screenShareStartTime: number = 0;
  private screenShareEngine: IRtcEngine | null = null;
  private screenShareUid: number | null = null;

  /**
   * Initializes the Agora RTC engine.
   * It's crucial to register event handlers *before* initializing the engine.
   */
  async initialize() {
    // Prevent re-initialization
    if (this.isInitialized) {
      console.log("CallService already initialized.");
      return;
    }

    try {
      // 1. Create the engine instance first.
      this.engine = createAgoraRtcEngine();

      // 2. Set up event handlers BEFORE initializing using the registerEventHandler syntax.
      this.setupEventHandlers();

      // 3. Now, initialize the engine.
      await this.engine.initialize({ appId: APP_ID });
      await this.engine.enableVideo();
      console.log('Agora engine initialized successfully!');
      this.isInitialized = true;
    } catch (error) {
      console.error('Failed to initialize Agora engine:', error);
      throw error;
    }
  }

  /**
   * Sets up all the necessary event listeners for the Agora engine using registerEventHandler.
   */
  private setupEventHandlers() {
    if (!this.engine) {
      console.error("Engine not available for setting up handlers.");
      return;
    }

    console.log('Setting up Agora event listeners using registerEventHandler...');

    // Use registerEventHandler to set up all event listeners in one object
    this.engine.registerEventHandler({
      // --- Core Connection Events ---
      onJoinChannelSuccess: (connection, elapsed) => {
        console.log(`✅ [Agora] onJoinChannelSuccess: Successfully joined channel "${connection.channelId}" as user ${connection.localUid}. Elapsed: ${elapsed}ms`);
        const { channelId, localUid } = connection;
        const state = useCallStore.getState();
        state.joinChannel(channelId as string, state.token as string, Number(localUid));
      },
      onLeaveChannel: (connection, stats) => {
        console.log(`🚪 [Agora] onLeaveChannel: Successfully left channel. Stats:`, stats);
        useCallStore.getState().leaveChannel();
      },
      onConnectionStateChanged: (connection, state, reason) => {
        console.log(`🔄 [Agora] onConnectionStateChanged: State -> ${ConnectionStateType[state]}, Reason -> ${ConnectionChangedReasonType[reason]}`);
        if (state === ConnectionStateType.ConnectionStateFailed) {
          console.error(`[Agora] Connection failed. Please check network and token/appId.`);
        }
      },
      onConnectionLost: (connection) => {
        console.warn(`[Agora] onConnectionLost: Connection to channel ${connection.channelId} has been lost.`);
      },

      // --- Remote User Events ---
      onUserJoined: (connection, remoteUid, elapsed) => {
        console.log(`➕ [Agora] onUserJoined: Remote user ${remoteUid} has joined. Elapsed: ${elapsed}ms`);
        useCallStore.getState().addParticipant({
          //@ts-ignore
          uid: remoteUid,
          isAudioMuted: false,
          isVideoMuted: false,
        });
      },
      onUserOffline: (connection, remoteUid, reason) => {
        console.log(`➖ [Agora] onUserOffline: Remote user ${remoteUid} has left. Reason: ${UserOfflineReasonType[reason]}`);
        if (reason == 0) {// remote user end call
          useCallStore.getState().onRemoteUserLeft(remoteUid);
        } else {
          useCallStore.getState().removeParticipant(remoteUid);
        }
      },

      // --- Token and Security Events ---
      onTokenPrivilegeWillExpire: (connection, token) => {
        console.warn(`[Agora] onTokenPrivilegeWillExpire: Token for connection ${connection.channelId} is about to expire. Token: ${token}`);
        // Here you would typically fetch a new token from your server and call renewToken.
      },
      onRequestToken: (connection) => {
        console.log(`[Agora] onRequestToken: SDK requires a new token for connection ${connection.channelId}.`);
        // This is triggered when the token expires and you haven't renewed it.
      },

      // --- Error Handling ---
      onError: (err, msg) => {
        console.error(`❌ [Agora] onError: Code -> ${err} (${ErrorCodeType[err]}), Message -> ${msg}`);
      },

      // --- Media State Events ---
      onUserMuteAudio: (connection, uid, muted) => {
        console.log(`🔇 [Agora] onUserMuteAudio: User ${uid} has ${muted ? 'muted' : 'unmuted'} their audio.`);
        useCallStore.getState().updateParticipant(uid, { isAudioMuted: muted });
      },
      onUserMuteVideo: (connection, uid, muted) => {
        console.log(`🎥 [Agora] onUserMuteVideo: User ${uid} has ${muted ? 'disabled' : 'enabled'} their video.`);
        useCallStore.getState().updateParticipant(uid, { isVideoMuted: muted });
      },

      // --- Statistics and Quality ---
      onRtcStats: (connection, stats: RtcStats) => {
        // This can be verbose, so it's often commented out in production
        // console.log(`[Agora] onRtcStats: Duration: ${stats.duration}s, TX bitrate: ${stats.txKBitRate}kbps, RX bitrate: ${stats.rxKBitRate}kbps`);
      },
      onLocalVideoStats: (connection, stats: LocalVideoStats) => {
        // console.log(`[Agora] onLocalVideoStats: Sent bitrate: ${stats.sentBitrate}kbps, Frame rate: ${stats.sentFrameRate}fps`);
      },
      onRemoteVideoStats: (connection, stats: RemoteVideoStats) => {
        // console.log(`[Agora] onRemoteVideoStats (from ${stats.uid}): Received bitrate: ${stats.receivedBitrate}kbps, Frame rate: ${stats.decoderOutputFrameRate}fps`);
      }
    });
  }

  /**
   * Joins a channel with the provided details.
   */
  async joinChannel(token: string, channelName: string, uid: number) {
    console.log(`[CallService] Attempting to join channel: "${channelName}" with UID: ${uid}`);

    if (!this.engine || !this.isInitialized) {
      console.error('[CallService] Agora engine is not initialized. Please call initialize() first.');
      throw new Error('Agora engine not initialized');
    }

    try {
      try {
        await this.engine.leaveChannel();
        console.log('[CallService] Left previous channel safely.');
      } catch (e) {
        console.warn('[CallService] No previous channel to leave or error during leave (safe to ignore):', e);
      }

      // Channel and client configuration
      await this.engine.setChannelProfile(ChannelProfileType.ChannelProfileLiveBroadcasting);
      await this.engine.setClientRole(ClientRoleType.ClientRoleBroadcaster);

      // Optional: for screen share
      await this.engine.setScreenCaptureScenario(ScreenScenarioType.ScreenScenarioDocument);

      // Permissions must be granted before this point
      await this.engine.enableAudio();
      await this.engine.enableVideo();

      // IMPORTANT: Enable local video and unmute it
      await this.engine.enableLocalVideo(true);
      await this.engine.muteLocalVideoStream(false);

      // Start local preview
      await this.engine.startPreview();
      console.log('[CallService] Local video preview started.');

      // Actually join the channel
      const joinResult = await this.engine.joinChannel(token, channelName, uid, {
        clientRoleType: ClientRoleType.ClientRoleBroadcaster,
      });

      if (joinResult === 0) {
        console.log('[CallService] joinChannel request sent. Waiting for onJoinChannelSuccess...');
      } else {
        console.error(`[CallService] joinChannel failed. Error code: ${joinResult}`);
      }

    } catch (err) {
      console.error('[CallService] Failed to join channel:', err);
      throw err;
    }
  }

  /**
   * Leaves the current channel.
   */
  async leaveChannel() {
    if (!this.engine) return;

    try {
      console.log("[CallService] Attempting to leave channel.");
      await this.engine.stopScreenCapture();
      await this.engine.stopPreview();
      await this.engine.leaveChannel();
      // The onLeaveChannel callback will handle the store update.
    } catch (error) {
      console.error('[CallService] Failed to leave channel:', error);
    }
  }

  /**
   * Releases all resources used by the Agora engine.
   */
  async destroy() {
    if (this.engine) {
      console.log('[CallService] Destroying Agora engine instance.');
      // Leave channel before releasing resources.
      await this.engine.leaveChannel();
      this.engine.release(); // release() also removes event handlers.
      this.engine = null;
      this.isInitialized = false;
    }
  }

  /**
   * Start screen capture
   */
  async startScreenCapture() {
    try {
      if (!this.engine) {
        throw new Error('Engine not initialized');
      }

      // Configure screen capture parameters
      const captureParams: ScreenCaptureParameters = {
        dimensions: {
          width: 1280,
          height: 720,
        },
        frameRate: 15,
        bitrate: 2000,
        captureMouseCursor: true,
        windowFocus: false,
        excludeWindowList: [],
        excludeWindowCount: 0,
      };

      // For mobile platforms, we use different methods
      if (Platform.OS === 'android') {
        // Android screen capture
        await this.engine.startScreenCapture({
          captureAudio: true,
          audioParams: {
            sampleRate: 16000,
            channels: 2,
            captureSignalVolume: 100,
          },
          captureVideo: true,
          videoParams: {
            // dimensions: { width: 1280, height: 720,  },
            frameRate: 15,
            bitrate: 0,
            contentHint: VideoContentHint.ContentHintDetails,
          },
        });
      } else if (Platform.OS === 'ios') {
        // iOS screen capture (requires iOS 12+)
        await this.engine.startScreenCaptureByDisplayId(
          0, // Display ID
          {
            x: 0,
            y: 0,
            width: captureParams?.dimensions?.width,
            height: captureParams?.dimensions?.height,
          }, // regionRect
          {
            dimensions: captureParams.dimensions,
            frameRate: captureParams.frameRate,
            bitrate: captureParams.bitrate,
          }
        );
      }
      await this.engine.updateChannelMediaOptions({
        publishCameraTrack: false,
        publishMicrophoneTrack: true,
        publishScreenCaptureVideo: true,
        publishScreenCaptureAudio: true,
      })
      // Update video source to screen share
      await this.engine.startPreview(VideoSourceType.VideoSourceScreen);

      console.log('Screen capture started successfully');
    } catch (error) {
      console.error('Error starting screen capture:', error);
      throw error;
    }
  };

  /**
   * Stop screen capture
   */
  async stopScreenCapture() {
    try {
      if (!this.engine) {
        throw new Error('Engine not initialized');
      }

      // Stop screen capture
      await this.engine.stopScreenCapture();

      await this.engine.updateChannelMediaOptions({
        publishCameraTrack: true,
        publishMicrophoneTrack: true,
        publishScreenCaptureVideo: false,
        publishScreenCaptureAudio: false,
      });
      // Switch back to camera preview
      await this.engine.startPreview(VideoSourceType.VideoSourceCamera);

      console.log('Screen capture stopped successfully');
    } catch (error) {
      console.error('Error stopping screen capture:', error);
      throw error;
    }
  };

  /**
   * Update screen capture parameters
   */
  async updateScreenCaptureParameters(
    params: Partial<ScreenCaptureParameters>
  ) {
    try {
      const engine = this.engine;
      if (!engine) {
        throw new Error('Engine not initialized');
      }

      const captureParams: ScreenCaptureParameters = {
        dimensions: params.dimensions || { width: 1280, height: 720 },
        frameRate: params.frameRate || 15,
        bitrate: params.bitrate || 2000,
        captureMouseCursor: params.captureMouseCursor ?? true,
        windowFocus: params.windowFocus ?? false,
        excludeWindowList: params.excludeWindowList || [],
        excludeWindowCount: params.excludeWindowCount || 0,
      };

      await engine.updateScreenCaptureParameters(captureParams);

      console.log('Screen capture parameters updated');
    } catch (error) {
      console.error('Error updating screen capture parameters:', error);
      throw error;
    }
  };

  // --- Media Control Methods ---

  async toggleMicrophone(muted: boolean) {
    if (!this.engine) return;
    await this.engine.muteLocalAudioStream(muted);
  }

  async toggleCamera(muted: boolean) {
    if (!this.engine) return;
    await this.engine.muteLocalVideoStream(muted);
  }

  async switchCamera() {
    if (!this.engine) return;
    await this.engine.switchCamera();
  }

  async enableSpeakerphone(enabled: boolean) {
    if (!this.engine) return;
    await this.engine.setEnableSpeakerphone(enabled);
  }

  getEngine(): IRtcEngine | null {
    return this.engine;
  }

  async getCallId() {
    return this.engine?.getCallId();
  }

  async startScreenShareVirtualUser(token: string, channelName: string, userId: number) {
    console.log("I am from virtual user")
    if (this.isScreenSharing) return;
    if (this.screenShareEngine) await this.stopScreenShareVirtualUser();

    const screenShareUid = userId; // offset for virtual user
    this.screenShareUid = screenShareUid;
    this.screenShareEngine = createAgoraRtcEngine();
    this.setupEventHandlers();

    await this.screenShareEngine.initialize({ appId: APP_ID });
    await this.screenShareEngine.enableVideo();
    await this.screenShareEngine.setChannelProfile(ChannelProfileType.ChannelProfileLiveBroadcasting);
    await this.screenShareEngine.setClientRole(ClientRoleType.ClientRoleBroadcaster);

    // Join as virtual user
    const result = await this.screenShareEngine.joinChannel(token, channelName, screenShareUid, {
      clientRoleType: ClientRoleType.ClientRoleBroadcaster,
      publishCameraTrack: false,
      publishScreenCaptureVideo: true,
      publishScreenCaptureAudio: true,
    });

    // Start screen capture
    const captureParams: ScreenCaptureParameters = {
      dimensions: { width: 1280, height: 720 },
      frameRate: 15,
      bitrate: 2000,
      captureMouseCursor: true,
      windowFocus: false,
      excludeWindowList: [],
      excludeWindowCount: 0,
    };
    if (Platform.OS === 'android') {
      await this.screenShareEngine.startScreenCapture({
        captureAudio: true,
        audioParams: {
          sampleRate: 16000,
          channels: 2,
          captureSignalVolume: 100,
        },
        captureVideo: true,
        videoParams: {
          frameRate: 15,
          bitrate: 0,
          contentHint: VideoContentHint.ContentHintDetails,
        },
      });
    } else if (Platform.OS === 'ios') {
      // await this.screenShareEngine.startScreenCaptureByDisplayId(
      //   0,
      //   { x: 0, y: 0, width: captureParams.dimensions.width, height: captureParams.dimensions.height },
      //   {
      //     dimensions: captureParams.dimensions,
      //     frameRate: captureParams.frameRate,
      //     bitrate: captureParams.bitrate,
      //   }
      // );
    }
    console.log({ result })
    await this.screenShareEngine.updateChannelMediaOptions({
      publishCameraTrack: false,
      publishScreenCaptureVideo: true,
      publishScreenCaptureAudio: true,
    });
    await this.screenShareEngine.startPreview(VideoSourceType.VideoSourceScreen);

    this.isScreenSharing = true;
  }

  /**
   * Stop the screen sharing virtual user.
   */
  async stopScreenShareVirtualUser() {
    if (!this.screenShareEngine) return;
    try {
      await this.screenShareEngine.stopScreenCapture();
      await this.screenShareEngine.stopPreview();
      await this.screenShareEngine.leaveChannel();
      await this.screenShareEngine.release();
      this.screenShareEngine = null;
      this.isScreenSharing = false;
      this.screenShareUid = null;
    } catch (err) {
      console.error('Failed to stop screen sharing virtual user:', err);
    }
  }
}

// Singleton instance
export const callService = new CallService();

// Hook for easy access to the service methods
export const useCallService = () => {
  return {
    initializeCall: callService.initialize.bind(callService),
    joinChannel: callService.joinChannel.bind(callService),
    leaveChannel: callService.leaveChannel.bind(callService),
    toggleMicrophone: callService.toggleMicrophone.bind(callService),
    toggleCamera: callService.toggleCamera.bind(callService),
    switchCamera: callService.switchCamera.bind(callService),
    enableSpeakerphone: callService.enableSpeakerphone.bind(callService),
    getEngine: callService.getEngine.bind(callService),
    destroy: callService.destroy.bind(callService),
    startScreenCapture: callService.startScreenCapture.bind(callService),
    stopScreenCapture: callService.stopScreenCapture.bind(callService),
    getCallId: callService.getCallId.bind(callService),
    stopScreenShareVirtualUser: callService.stopScreenShareVirtualUser.bind(callService),
    startScreenShareVirtualUser: callService.startScreenShareVirtualUser.bind(callService),
  };
};
