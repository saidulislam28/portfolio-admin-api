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
