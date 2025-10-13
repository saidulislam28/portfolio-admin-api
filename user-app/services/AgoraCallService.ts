import {
  createAgoraRtcEngine,
  IRtcEngine,
  ChannelProfileType,
  ClientRoleType,
  RtcStats,
  ConnectionStateType,
  UserOfflineReasonType,
  ErrorCodeType,
  ConnectionChangedReasonType,
  LocalVideoStats,
  RemoteVideoStats,
  ScreenCaptureParameters2,
  ChannelMediaOptions,
  VideoSourceType,
} from 'react-native-agora';
import { useCallStore } from '@/zustand/callStore';
import { getAgoraAppID } from '@/utils/agoraAppID';

class CallService {
  private engine: IRtcEngine | null = null;
  private isInitialized = false;

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

    const agoraAppId = await getAgoraAppID();

    try {
      // 1. Create the engine instance first.
      this.engine = createAgoraRtcEngine();

      // 2. Set up event handlers BEFORE initializing using the registerEventHandler syntax.
      this.setupEventHandlers();

      // 3. Now, initialize the engine.
      await this.engine.initialize({ appId: agoraAppId });
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
        //@ts-ignore
        state.joinChannel(channelId, state.token, localUid);
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
      },
      onRemoteVideoStateChanged(connection, remoteUid, state, reason, elapsed) {
        console.log(`🎥 [Agora] onRemoteVideoStateChanged: User ${remoteUid}`, connection, state, reason);
      },
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
      // ** FIX: Defensively leave any current channel to prevent error -17 (ErrJoinChannelRejected) **
      // This ensures that the engine is in a valid state before attempting to join.
      try {
        await this.engine.leaveChannel();
        console.log('[CallService] Defensively left the previous channel.');
      } catch (e) {
        console.warn('[CallService] Defensive leaveChannel failed, likely because we were not in a channel. This is safe to ignore.', e);
      }

      // Set the channel profile to live broadcasting.
      await this.engine.setChannelProfile(ChannelProfileType.ChannelProfileLiveBroadcasting);

      // Set the client role to broadcaster.
      await this.engine.setClientRole(ClientRoleType.ClientRoleBroadcaster);

      // Enable audio and video modules.
      await this.engine.enableAudio();
      await this.engine.enableVideo();

      // Start the local video preview.
      await this.engine.startPreview();

      // const tempChannel = 'test-channel'
      // const tempToken = '007eJxTYPj4d9n+BdbaTmYbi90a5qutzHxnxbPPNvDxK0aWf39W7z2nwGCWlGZkkJZqnJaalmRilmJkaZBilmyUaGBhkZqcYmJmMXm2X0ZDICODcskUVkYGCATxeRhKUotLdJMzEvPyUnMYGAD0hiQ7'

      // The joinChannel method is asynchronous and signals the intent to join.
      // The actual success/failure is reported via the onJoinChannelSuccess or onError callbacks.
      // The method itself returns 0 on success (meaning the request was sent).
      // const joinResult = await this.engine.joinChannel(tempToken, tempChannel, 200, {
      //   clientRoleType: ClientRoleType.ClientRoleBroadcaster,
      // });
      const joinResult = await this.engine.joinChannel(token, channelName, uid, {
        clientRoleType: ClientRoleType.ClientRoleBroadcaster,
      });

      // Log the synchronous result of the API call
      if (joinResult === 0) {
        console.log('[CallService] joinChannel request sent successfully. Waiting for onJoinChannelSuccess callback...');
        // Set token in the store immediately for reference
        // useCallStore.getState().setToken(token);
      } else {
        console.error(`[CallService] Failed to send joinChannel request. Synchronous error code: ${joinResult}`);
      }

    } catch (error) {
      console.error('[CallService] An exception occurred while trying to join the channel:', error);
      throw error;
    }
  }

  /**
   * Leaves the current channel.
   */
  async leaveChannel() {
    if (!this.engine) return;

    try {
      console.log("[CallService] Attempting to leave channel.");
      await this.engine.leaveChannel();
      await this.stopScreenCapture();
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

  async startScreenCapture(params: ScreenCaptureParameters2) {
    if (!this.engine) throw new Error('Engine not initialized');
    await this.engine.startScreenCapture(params);
    await this.engine.updateChannelMediaOptions({
      publishCameraTrack: false,
      publishMicrophoneTrack: false,
      publishScreenCaptureVideo: true,
      publishScreenCaptureAudio: true,
    })
  }

  async stopScreenCapture() {
    if (!this.engine) throw new Error('Engine not initialized');
    await this.engine.stopScreenCapture();
    await this.engine.updateChannelMediaOptions({
      publishCameraTrack: true,
      publishMicrophoneTrack: true,
      publishScreenCaptureVideo: false,
      publishScreenCaptureAudio: false,
    });
  }

  async updateChannelMediaOptions(options: ChannelMediaOptions) {
    await this.engine?.updateChannelMediaOptions(options)
  }

  async startPreview() {
    this.engine?.startPreview(VideoSourceType.VideoSourceScreen)
  }

  async getCallId() {
    return this.engine?.getCallId();
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
    updateChannelMediaOptions: callService.updateChannelMediaOptions.bind(callService),
    stopScreenCapture: callService.stopScreenCapture.bind(callService),
    startPreview: callService.startPreview.bind(callService),
    getCallId: callService.getCallId.bind(callService),
  };
};
