'use client';

import { useState } from 'react';
import { useAppState } from '@/context/AppStateContext';

export const usePermissions = () => {
  const { permissions, updatePermission } = useAppState();
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const requestCameraPermission = async (): Promise<boolean> => {
    setLoading(true);
    setErrorMsg(null);
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        updatePermission('camera', 'denied');
        setErrorMsg('Camera API is not supported in your browser.');
        setLoading(false);
        return false;
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: 'environment' } }
      });

      // Stop stream immediately after permission check
      stream.getTracks().forEach(track => track.stop());
      updatePermission('camera', 'granted');
      setLoading(false);
      return true;
    } catch (err) {
      console.warn('Camera permission request denied/failed:', err);
      updatePermission('camera', 'denied');
      setErrorMsg('Camera access was denied or unavailable.');
      setLoading(false);
      return false;
    }
  };

  const requestLocationPermission = async (): Promise<boolean> => {
    setLoading(true);
    setErrorMsg(null);
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        updatePermission('location', 'denied');
        setErrorMsg('Geolocation is not supported in your browser.');
        setLoading(false);
        resolve(false);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        () => {
          updatePermission('location', 'granted');
          setLoading(false);
          resolve(true);
        },
        (err) => {
          console.warn('Geolocation denied:', err);
          updatePermission('location', 'denied');
          setErrorMsg('Location access skipped or denied.');
          setLoading(false);
          resolve(false);
        },
        { timeout: 8000 }
      );
    });
  };

  const requestMicrophonePermission = async (): Promise<boolean> => {
    setLoading(true);
    setErrorMsg(null);
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        updatePermission('microphone', 'denied');
        setLoading(false);
        return false;
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop());
      updatePermission('microphone', 'granted');
      setLoading(false);
      return true;
    } catch (err) {
      console.warn('Microphone permission denied:', err);
      updatePermission('microphone', 'denied');
      setLoading(false);
      return false;
    }
  };

  const requestNotificationPermission = async (): Promise<boolean> => {
    setLoading(true);
    try {
      if (typeof window !== 'undefined' && 'Notification' in window) {
        const res = await Notification.requestPermission();
        if (res === 'granted') {
          updatePermission('notifications', 'granted');
          setLoading(false);
          return true;
        }
      }
      updatePermission('notifications', 'denied');
      setLoading(false);
      return false;
    } catch (e) {
      updatePermission('notifications', 'denied');
      setLoading(false);
      return false;
    }
  };

  return {
    permissions,
    loading,
    errorMsg,
    requestCameraPermission,
    requestLocationPermission,
    requestMicrophonePermission,
    requestNotificationPermission
  };
};
