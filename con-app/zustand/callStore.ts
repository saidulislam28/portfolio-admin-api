// stores/callStore.ts
import { callService } from '@/services/AgoraCallService';
import { stopAudioService } from '@/services/AudioService';
import { callApi } from '@/utils/callApi';
import { ADMIN_CALL_USER_ID } from '@sm/common';
import { router } from 'expo-router';
import { create } from 'zustand';
import { useShallow } from 'zustand/shallow';

export interface CallParticipant {
  uid: string;
  username?: string;
  avatar?: string;
  isAudioMuted?: boolean;
  isVideoMuted?: boolean;
}

export interface otherParticipant {
  id: string;
  name: string;
  avatar?: string;
}

export interface CallState {
  isInCall: boolean;
  isConnecting: boolean;
  channelName: string | null;
  token: string | null;
  uid: number | null;

  appointmentId: string | null;
  appointmentTitle: string | null;
  otherParticipant: otherParticipant | null;

  isAudioMuted: boolean;
  isVideoMuted: boolean;
  isSpeakerOn: boolean;

  participants: CallParticipant[];

  callStartTime: Date | null;
  callDuration: number;

  isCallScreenActive: boolean;
  showCallOverlay: boolean;
  showCallScreen: boolean;
  isScreenSharing: boolean;
  incomingCallInfo: any
}

export interface CallActions {
  startCall: (appointmentToken: string, userId: number, otherParticipant: otherParticipant | null) => Promise<void>;
  joinChannel: (channelName: string, token: string, uid: number) => void;
  endCall: () => void;
  leaveChannel: () => void;

  toggleAudio: () => void;
  toggleVideo: () => void;
  toggleSpeaker: () => void;

  addParticipant: (participant: CallParticipant) => void;
  removeParticipant: (uid: number) => void;
  updateParticipant: (uid: number, updates: Partial<CallParticipant>) => void;

  setCallScreenActive: (active: boolean) => void;
  setShowCallOverlay: (show: boolean) => void;

  startTimer: () => void;
  stopTimer: () => void;
  startScreenSharing: () => void;
  stopScreenSharing: () => void;
  resetCallState: () => void;
  visibleCallScreen: (callInfo: any) => void;
  hideCallScreen: () => void;
  onRemoteUserLeft: (remoteId: string | number) => void
}

export type CallStore = CallState & CallActions;

const initialState: CallState = {
  isInCall: false,
  isConnecting: false,
  channelName: null,
  token: null,
  uid: null,
  appointmentId: null,
  appointmentTitle: null,
  otherParticipant: null,
  isAudioMuted: false,
  isVideoMuted: false,
  isSpeakerOn: false,
  participants: [],
  callStartTime: null,
  callDuration: 0,
  isCallScreenActive: false,
  showCallOverlay: false,
  isScreenSharing: false,
  showCallScreen: false,
  incomingCallInfo: null
};

// Timer reference outside the store
let timerRef: NodeJS.Timeout | null = null;

export const useCallStore = create<CallStore>()((set, get) => ({
  ...initialState,
  startCall: async (appointmentToken, userId, otherParticipant) => {
    try {
      set({ isConnecting: true });

      const response = await callApi.getAgoraToken({
        channelName: appointmentToken,
        userId,
      });

      const { token, channelName } = response;

      set({
        otherParticipant: otherParticipant ?? {
          id: '1',
          avatar: '11',
          name: 'Other',
        },
        token,
        channelName,
        uid: Number(userId),
        isConnecting: false,
        showCallOverlay: false,
        callStartTime: new Date(),
      });
    } catch (error) {
      console.error('Failed to start call:', error);
      set({ isConnecting: false });
      throw error;
    }
  },

  joinChannel: (channelName, token, uid) => {
    set({
      isInCall: true,
      channelName,
      token,
      uid,
      callStartTime: new Date(),
      showCallOverlay: false,
    });
    get().startTimer();
  },

  endCall: () => {
    get().stopTimer();
    get().resetCallState();
    get().leaveChannel();
  },

  leaveChannel: () => {
    set({
      isInCall: false,
      showCallOverlay: false,
      isScreenSharing: false,
      incomingCallInfo: null
    });
  },

  toggleAudio: () => {
    set((state) => ({ isAudioMuted: !state.isAudioMuted }));
  },

  toggleVideo: () => {
    set((state) => ({ isVideoMuted: !state.isVideoMuted }));
  },

  toggleSpeaker: () => {
    set((state) => ({ isSpeakerOn: !state.isSpeakerOn }));
  },

  addParticipant: (participant) => {
    set((state) => ({
      participants: [...state.participants, participant],
    }));
  },

  removeParticipant: (uid) => {
    set((state) => ({
      //@ts-ignore
      participants: state.participants.filter((p) => p.uid !== uid),
    }));
  },

  updateParticipant: (uid, updates) => {
    set((state) => ({
      participants: state.participants.map((p) =>
        //@ts-ignore
        p.uid === uid ? { ...p, ...updates } : p
      ),
    }));
  },

  setCallScreenActive: (active) => {
    const { isInCall } = get();
    set({
      isCallScreenActive: active,
      showCallOverlay: !active && isInCall,
    });
  },

  setShowCallOverlay: (show) => {
    set({ showCallOverlay: show });
  },

  startTimer: () => {
    if (timerRef) clearInterval(timerRef);
    timerRef = setInterval(() => {
      set((state) => ({
        callDuration: state.callDuration + 1,
      }));
    }, 1000);
  },

  stopTimer: () => {
    if (timerRef) {
      clearInterval(timerRef);
      timerRef = null;
    }
    set({ callDuration: 0 });
  },

  resetCallState: () => {
    if (timerRef) {
      clearInterval(timerRef);
      timerRef = null;
    }
    set(initialState);
  },

  startScreenSharing: () => {
    set({
      isScreenSharing: true
    })
  },

  stopScreenSharing: () => {
    set({
      isScreenSharing: false
    })
  },
  hideCallScreen: () => {
    set({
      showCallScreen: false,
      incomingCallInfo: null
    })
  },
  visibleCallScreen: (callInfo) => {
    if (callInfo?.additionalInfo) {
      callInfo.additionalInfo = JSON.parse(callInfo?.additionalInfo);
    }
    set({
      showCallScreen: true,
      incomingCallInfo: callInfo
    })
  },
  onRemoteUserLeft: async (remoteId) => {
    if (!remoteId) return;
    if (get().isInCall && remoteId != ADMIN_CALL_USER_ID) {
      try {
        await callService.leaveChannel();
        stopAudioService();
        await get().endCall();
      } catch (error) {
        console.error('Error ending call:', error);
      } finally {
        router.back();
      }
    }
  }
}));

// Call status selector
export const useCallStatus = () =>
  useCallStore(
    useShallow((state) => ({
      isInCall: state.isInCall,
      isConnecting: state.isConnecting,
      showCallOverlay: state.showCallOverlay,
    }))
  );

// Call controls selector
export const useCallControls = () =>
  useCallStore(
    useShallow((state) => ({
      isAudioMuted: state.isAudioMuted,
      isVideoMuted: state.isVideoMuted,
      isSpeakerOn: state.isSpeakerOn,
      toggleAudio: state.toggleAudio,
      toggleVideo: state.toggleVideo,
      toggleSpeaker: state.toggleSpeaker,
    }))
  );

// Call info selector (your requested refactor)
export const useCallInfo = () =>
  useCallStore(
    useShallow((state) => ({
      appointmentTitle: state.appointmentTitle,
      otherParticipant: state.otherParticipant,
      callDuration: state.callDuration,
      participants: state.participants,
    }))
  );

// Individual selectors (don't need shallow)
export const useIsInCall = () => useCallStore(state => state.isInCall);
export const useIsConnecting = () => useCallStore(state => state.isConnecting);
export const useShowCallOverlay = () => useCallStore(state => state.showCallOverlay);
export const useCallDuration = () => useCallStore(state => state.callDuration);
export const useParticipants = () => useCallStore(state => state.participants);