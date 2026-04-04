import { useState, useEffect } from 'react';

const DEFAULT_POSITION = { lat: 34.0522, lng: -118.2437 }; // LA fallback

export function useGeolocation() {
  const [position, setPosition] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError('Geolocation not supported');
      setPosition(DEFAULT_POSITION);
      setLoading(false);
      return;
    }

    const onSuccess = (pos) => {
      setPosition({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      setLoading(false);
    };

    const onError = () => {
      setPosition(DEFAULT_POSITION);
      setLoading(false);
    };

    navigator.geolocation.getCurrentPosition(onSuccess, onError, {
      enableHighAccuracy: true,
      timeout: 8000,
      maximumAge: 60000,
    });

    const watchId = navigator.geolocation.watchPosition(onSuccess, onError, {
      enableHighAccuracy: true,
      maximumAge: 30000,
    });

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  return { position, error, loading };
}
