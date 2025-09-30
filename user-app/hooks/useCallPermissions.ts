import { useEffect, useState } from 'react';
import { PermissionsAndroid, Platform } from 'react-native';

export const useCallPermissions = () => {
  const [permissionsGranted, setPermissionsGranted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    requestPermissions();
  }, []);

  const requestPermissions = async () => {
    try {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
          PermissionsAndroid.PERMISSIONS.CAMERA,
        ]);

        const audioGranted = granted[PermissionsAndroid.PERMISSIONS.RECORD_AUDIO] === 'granted';
        const cameraGranted = granted[PermissionsAndroid.PERMISSIONS.CAMERA] === 'granted';

        setPermissionsGranted(audioGranted && cameraGranted);
      } else {
        // iOS permissions are handled automatically by Agora SDK
        setPermissionsGranted(true);
      }
    } catch (error) {
      console.error('Error requesting permissions:', error);
      setPermissionsGranted(false);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    permissionsGranted,
    isLoading,
    requestPermissions,
  };
};

// utils/callApi.ts
interface TokenResponse {
  token: string;
  channelName: string;
  uid: number;
}

interface TokenRequest {
  appointmentId: string;
  userId?: string;
}

export class CallApi {
  private baseUrl: string;

  constructor(baseUrl: string = 'https://your-api-domain.com') {
    this.baseUrl = baseUrl;
  }

  async getAgoraToken(request: TokenRequest): Promise<TokenResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/api/agora/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Add your auth headers here
          // 'Authorization': `Bearer ${await getAuthToken()}`,
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Failed to fetch Agora token:', error);
      throw error;
    }
  }

  async endCall(appointmentId: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/api/calls/${appointmentId}/end`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Add your auth headers here
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('Failed to end call:', error);
      // Don't throw here, as the call should end locally even if API fails
    }
  }

  async updateCallStatus(appointmentId: string, status: 'started' | 'ended'): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/api/calls/${appointmentId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('Failed to update call status:', error);
    }
  }
}

// Singleton instance
export const callApi = new CallApi();

// hooks/useCallTimer.ts
import { useEffect, useRef } from 'react';
import { useCallStore } from '../stores/callStore';

export const useCallTimer = () => {
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const { isInCall, callDuration } = useCallStore();

  useEffect(() => {
    if (isInCall) {
      startTimer();
    } else {
      stopTimer();
    }

    return () => {
      stopTimer();
    };
  }, [isInCall]);

  const startTimer = () => {
    if (timerRef.current) return; // Timer already running

    timerRef.current = setInterval(() => {
      useCallStore.setState((state) => ({
        callDuration: state.callDuration + 1,
      }));
    }, 1000);
  };

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  return {
    callDuration,
    startTimer,
    stopTimer,
  };
};

// utils/callHelpers.ts
export const formatCallDuration = (seconds: number): string => {
  if (seconds < 60) {
    return `${seconds}s`;
  } else if (seconds < 3600) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  } else {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }
};

export const generateCallId = (): string => {
  return `call_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

export const isCallActive = (callState: any): boolean => {
  return callState.isInCall && callState.channelName && callState.token;
};

// types/call.ts
export interface CallEvent {
  type: 'user_joined' | 'user_left' | 'connection_lost' | 'call_ended';
  userId?: string;
  data?: any;
  timestamp: Date;
}

export interface CallQuality {
  networkQuality: 'excellent' | 'good' | 'poor' | 'bad' | 'very_bad' | 'unknown';
  audioQuality: 'excellent' | 'good' | 'poor' | 'bad' | 'very_bad' | 'unknown';
  videoQuality: 'excellent' | 'good' | 'poor' | 'bad' | 'very_bad' | 'unknown';
  packetLossRate: number;
  rtt: number; // Round trip time in ms
}

export interface CallMetrics {
  duration: number;
  startTime: Date;
  endTime?: Date;
  quality: CallQuality;
  participants: number;
  events: CallEvent[];
}